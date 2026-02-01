/**
 * AuthContext - Unified authentication state management
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * MFA operations extracted to auth/useMfaOperations.ts
 * Email templates extracted to auth/emailTemplates.ts
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signOut, sendEmailVerification, multiFactor, type User, type MultiFactorResolver
} from 'firebase/auth';
import { doc, onSnapshot, updateDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db, APP_ID } from '../config/firebase';
import type { UserProfile } from '../types';
import { useMfaOperations, getWelcomeEmailHtml } from './auth';
import { createTracer } from '../services/telemetry';
import { getEffectiveTheme } from '../utils/systemTheme';

const authTracer = createTracer('Auth');

interface AuthContextType {
    user: User | null;
    profile: UserProfile;
    loading: boolean;
    profileLoaded: boolean;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
    accountNotifications: string[];
    verifyMfa: (resolver: MultiFactorResolver, code: string) => Promise<void>;
    generateMfaSecret: () => Promise<{ qrCodeUrl: string; manualKey: string }>;
    enrollMfa: (code: string) => Promise<void>;
    unenrollMfa: () => Promise<void>;
    reauthenticate: (password: string) => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    // PWA-006: Use system theme detection for initial value
    const initialTheme = typeof window !== 'undefined' ? getEffectiveTheme() : 'light';
    const [profile, setProfile] = useState<UserProfile>({ name: 'User', theme: initialTheme, familyMode: false, onboardingComplete: false });
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
        await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid), updates);
    }, [user]);

    // Use extracted MFA hook
    const mfaOps = useMfaOperations(user, updateProfile);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, async (u) => {
            if (unsubProfRef.current) { unsubProfRef.current(); unsubProfRef.current = null; }
            if (u) { sessionStorage.setItem('anchor_session_active', 'true'); }
            else {
                const wasActive = sessionStorage.getItem('anchor_session_active') === 'true';
                if (wasActive) { sessionStorage.removeItem('anchor_session_active'); window.dispatchEvent(new CustomEvent('anchor:session_expired')); }
            }
            setUser(u);
            if (!u) { setLoading(false); setProfileLoaded(false); mfaOps.clearPendingSecret(); return; }

            const profRef = doc(db, 'artifacts', APP_ID, 'users', u.uid);
            unsubProfRef.current = onSnapshot(profRef, async (snap) => {
                if (snap.exists()) {
                    const data = snap.data() as UserProfile;
                    const actualMfaEnrolled = multiFactor(u).enrolledFactors.length > 0;
                    if (actualMfaEnrolled && !data.mfaEnabled) { await updateDoc(profRef, { mfaEnabled: true }); return; }
                    if (!actualMfaEnrolled && data.mfaEnabled) { await updateDoc(profRef, { mfaEnabled: false }); return; }
                    setProfile(data);
                    const alerts = [];
                    if (!u.emailVerified && import.meta.env.VITE_APP_ENV === 'production') alerts.push('verify_email');
                    if (!actualMfaEnrolled) alerts.push('enable_2fa');
                    setAccountNotifications(alerts);
                    setProfileLoaded(true); setLoading(false);
                } else {
                    if (snap.metadata.fromCache) { console.warn('[AuthContext] Profile not found but data is from cache'); return; }
                    if (import.meta.env.DEV) console.debug('[AuthContext] Creating new profile');
                    setDoc(profRef, { name: u.email?.split('@')[0] || 'User', theme: 'light', familyMode: false, onboardingComplete: false });
                    setProfileLoaded(true); setLoading(false);
                }
            });
        });
        return () => { unsubAuth(); if (unsubProfRef.current) unsubProfRef.current(); };
    }, [mfaOps]);

    const signIn = async (e: string, p: string) => {
        return authTracer.trace('signIn', async () => {
            await signInWithEmailAndPassword(auth, e, p);
        });
    };

    const signUp = async (e: string, p: string) => {
        return authTracer.trace('signUp', async () => {
            const cred = await createUserWithEmailAndPassword(auth, e, p);
            const name = e.split('@')[0];
            await setDoc(doc(db, 'artifacts', APP_ID, 'users', cred.user.uid), { name, theme: 'light', familyMode: false, onboardingComplete: false });
            try { await addDoc(collection(db, 'mail'), { to: [e], message: { subject: 'Welcome to Anchor OS!', html: getWelcomeEmailHtml(name) } }); }
            catch (err) { console.error('Failed to queue welcome email:', err); }
        });
    };

    const logout = async () => {
        authTracer.logEvent('logout');
        sessionStorage.removeItem('anchor_session_active');
        await signOut(auth);
        navigate('/', { replace: true });
    };
    const sendVerificationEmail = async () => { if (auth.currentUser) await sendEmailVerification(auth.currentUser); };
    const sendPasswordReset = async (email: string) => { const { sendPasswordResetEmail } = await import('firebase/auth'); await sendPasswordResetEmail(auth, email); };

    return (
        <AuthContext.Provider value={{
            user, profile, loading, profileLoaded, updateProfile, signIn, signUp, logout, sendVerificationEmail, accountNotifications,
            verifyMfa: mfaOps.verifyMfa, generateMfaSecret: mfaOps.generateMfaSecret, enrollMfa: mfaOps.enrollMfa,
            unenrollMfa: mfaOps.unenrollMfa, reauthenticate: mfaOps.reauthenticate, sendPasswordReset
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
