/**
 * AuthContext - Unified authentication state management
 * 
 * Refactored.
 * MFA operations extracted to auth/useMfaOperations.ts
 * Email templates extracted to auth/emailTemplates.ts
 */
// @ts-nocheck


import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { captureError } from '../utils/error';
import { useNavigate } from 'react-router-dom';
import {
    onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signOut, sendEmailVerification, multiFactor,
    type User, type MultiFactorResolver, type UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { doSocialSignIn, makeGoogleProvider, makeAppleProvider } from './auth/socialAuth';
import type { UserProfile } from '../types';
import { subscribeToProfile, updateUserProfile, createUserProfile, queueWelcomeEmail } from '../api/AuthProfileApi';
import { useMfaOperations, getWelcomeEmailHtml } from './auth';
import { createTracer } from '../services/telemetry';
import { getEffectiveTheme } from '../utils/systemTheme';
import { auditAuth } from '../services/AuditService';
import { recordAuthEvent } from '../services/authEventService';
import { clearClientCache } from '../config/queryCache';
import { deregisterDevicePushToken } from '../services/pushTokenLifecycle';

const authTracer = createTracer('Auth');

interface AuthContextType {
    user: User | null;
    profile: UserProfile;
    loading: boolean;
    profileLoaded: boolean;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    signInWithGoogle: () => Promise<UserCredential | null>;
    signInWithApple: () => Promise<UserCredential | null>;
    logout: () => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
    accountNotifications: string[];
    verifyMfa: (resolver: MultiFactorResolver, code: string) => Promise<void>;
    generateMfaSecret: () => Promise<{ qrCodeUrl: string; manualKey: string }>;
    enrollMfa: (code: string) => Promise<void>;
    unenrollMfa: () => Promise<void>;
    reauthenticate: (password: string) => Promise<void>;
    reauthenticateWithProvider: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const initialTheme = typeof window !== 'undefined' ? getEffectiveTheme() : 'light';
    // UX-OB-07 / UX-DB-01: no placeholder identity. An empty name means "not yet
    // known", and the UI must not invent one (or emit a dangling "Good evening, ").
    const [profile, setProfile] = useState<UserProfile>({ name: '', theme: initialTheme, familyMode: false, onboardingComplete: false });
    const [loading, setLoading] = useState(true);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [accountNotifications, setAccountNotifications] = useState<string[]>([]);
    const unsubProfRef = useRef<(() => void) | null>(null);

    const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
        if (!user) {
            setProfile(prev => ({ ...prev, ...updates }));
            if (updates.theme) localStorage.setItem('anchor_theme', updates.theme);
            return;
        }
        await updateUserProfile(user.uid, updates);
    }, [user]);

    const mfaOps = useMfaOperations(user, updateProfile);
    const clearPendingSecretRef = useRef(mfaOps.clearPendingSecret);

    useEffect(() => {
        clearPendingSecretRef.current = mfaOps.clearPendingSecret;
    }, [mfaOps.clearPendingSecret]);

    useEffect(() => {
        const authTimeout = setTimeout(() => {
            setLoading(prev => {
                if (prev) console.warn('[AuthContext] Auth state timeout — forcing login screen');
                return prev ? false : prev;
            });
        }, 5000);

        const unsubAuth = onAuthStateChanged(auth, async (u) => {
            clearTimeout(authTimeout);
            if (unsubProfRef.current) { unsubProfRef.current(); unsubProfRef.current = null; }
            if (u) { sessionStorage.setItem('anchor_session_active', 'true'); }
            else {
                const wasActive = sessionStorage.getItem('anchor_session_active') === 'true';
                if (wasActive) { sessionStorage.removeItem('anchor_session_active'); window.dispatchEvent(new CustomEvent('anchor:session_expired')); }
            }
            setUser(u);
            if (!u) { setLoading(false); setProfileLoaded(false); clearPendingSecretRef.current(); return; }

            unsubProfRef.current = subscribeToProfile(u.uid, async (snap) => {
                if (snap.exists()) {
                    const data = snap.data() as UserProfile;
                    const actualMfaEnrolled = multiFactor(u).enrolledFactors.length > 0;
                    if (actualMfaEnrolled && !data.mfaEnabled) { await updateUserProfile(u.uid, { mfaEnabled: true }); return; }
                    if (!actualMfaEnrolled && data.mfaEnabled) { await updateUserProfile(u.uid, { mfaEnabled: false }); return; }
                    setProfile(data);
                    const alerts: string[] = [];
                    // Staging and production share email-verification semantics;
                    // only local emulator development omits the nudge.
                    if (!u.emailVerified && import.meta.env.VITE_APP_ENV !== 'development') alerts.push('verify_email');
                    if (!actualMfaEnrolled) alerts.push('enable_2fa');
                    const securitySeen = data.onboardingProgress?.securityStepSeen === true;
                    setAccountNotifications(securitySeen ? [] : alerts);
                    setProfileLoaded(true); setLoading(false);
                } else {
                    if (snap.metadata.fromCache) { console.warn('[AuthContext] Profile not found but data is from cache'); return; }
                    if (import.meta.env.DEV) console.debug('[AuthContext] Creating new profile');
                    // UX-OB-07: never invent a display name from the email local-part
                    // (john.doe@… would become "john.doe"). Onboarding asks for it.
                    createUserProfile(u.uid, { name: '', theme: 'light', familyMode: false, onboardingComplete: false });
                    setProfileLoaded(true); setLoading(false);
                }
            });
        });
        return () => { clearTimeout(authTimeout); unsubAuth(); if (unsubProfRef.current) unsubProfRef.current(); };
    }, []);

    /**
     * SN-01: before a session transition (logout or account switch), remove the
     * departing account's authoritative push-token association while it is
     * still authenticated. Failure is non-fatal — a logout must never be
     * blocked by push cleanup.
     */
    const deregisterPreviousAccountPushToken = async () => {
        const previousUid = auth.currentUser?.uid;
        if (!previousUid) return;
        try {
            await deregisterDevicePushToken(previousUid);
        } catch (err) {
            captureError(err, 'Auth.deregisterPushToken');
        }
    };

    const signIn = async (e: string, p: string) => {
        return authTracer.trace('signIn', async () => {
            await deregisterPreviousAccountPushToken();
            await signInWithEmailAndPassword(auth, e, p);
            // RA-05 (#149): drop cached data belonging to any previous account.
            await clearClientCache();
            auditAuth.loginSuccess('password');
            void recordAuthEvent(navigator.userAgent, 'password');
        });
    };

    const signUp = async (e: string, p: string) => {
        return authTracer.trace('signUp', async () => {
            await deregisterPreviousAccountPushToken();
            await clearClientCache(); // RA-05 (#149)
            const cred = await createUserWithEmailAndPassword(auth, e, p);
            // UX-OB-07: onboarding collects the real name; the email local-part is
            // used only as friendly copy in the welcome email, never as identity.
            const emailName = e.split('@')[0];
            await createUserProfile(cred.user.uid, { name: '', theme: 'light', familyMode: false, onboardingComplete: false });
            void recordAuthEvent(navigator.userAgent, 'password');
            try { await queueWelcomeEmail(e, getWelcomeEmailHtml(emailName)); }
            catch (err) { captureError(err, 'Auth.welcomeEmail'); }
        });
    };

    const signInWithGoogle = async (): Promise<UserCredential | null> => {
        await deregisterPreviousAccountPushToken();
        const credential = await doSocialSignIn(makeGoogleProvider(), 'google');
        await clearClientCache(); // RA-05 (#149)
        return credential;
    };

    const signInWithApple = async (): Promise<UserCredential | null> => {
        await deregisterPreviousAccountPushToken();
        const credential = await doSocialSignIn(makeAppleProvider(), 'apple');
        await clearClientCache(); // RA-05 (#149)
        return credential;
    };

    const logout = async () => {
        authTracer.logEvent('logout');
        auditAuth.logout();
        sessionStorage.removeItem('anchor_session_active');
        // SN-01: revoke this device's push authority BEFORE sign-out, while the
        // account can still write its own token documents.
        await deregisterPreviousAccountPushToken();
        await signOut(auth);
        // RA-05 (#149): remove the persisted client cache so a shared device
        // cannot hydrate this account's data after sign-out.
        await clearClientCache();
        navigate('/', { replace: true });
    };
    const sendVerificationEmail = async () => { if (auth.currentUser) await sendEmailVerification(auth.currentUser); };
    const sendPasswordReset = async (email: string) => { const { sendPasswordResetEmail } = await import('firebase/auth'); await sendPasswordResetEmail(auth, email); };

    return (
        <AuthContext.Provider value={{
            user, profile, loading, profileLoaded, updateProfile, signIn, signUp, signInWithGoogle, signInWithApple, logout, sendVerificationEmail, accountNotifications,
            verifyMfa: mfaOps.verifyMfa, generateMfaSecret: mfaOps.generateMfaSecret, enrollMfa: mfaOps.enrollMfa,
            unenrollMfa: mfaOps.unenrollMfa, reauthenticate: mfaOps.reauthenticate,
            reauthenticateWithProvider: mfaOps.reauthenticateWithProvider, sendPasswordReset
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
