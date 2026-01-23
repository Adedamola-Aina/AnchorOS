import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    multiFactor,
    type User,
    type MultiFactorResolver,
    type TotpSecret
} from 'firebase/auth';
import { doc, onSnapshot, updateDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db, APP_ID } from '../config/firebase';
import type { UserProfile } from '../types';

interface PendingMfaSecret extends TotpSecret {
    codeInterval?: number;
}

interface SerializedMfaSecret {
    secretKey: string;
    hashingAlgorithm: string;
    codeLength: number;
    codeInterval: number;
    timestamp: number;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile;
    loading: boolean;
    profileLoaded: boolean;  // True when real profile data has been fetched
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
    accountNotifications: string[];
    // MFA
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
    // MFA secret stored in ref to persist across renders without module-level state
    const pendingMfaSecretRef = useRef<PendingMfaSecret | null>(null);

    // Initialize theme from localStorage for guest users
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('anchor_theme') as 'light' | 'dark' | null : null;

    const [profile, setProfile] = useState<UserProfile>({
        name: 'User', theme: savedTheme || 'light', familyMode: false, onboardingComplete: false
    });
    const [loading, setLoading] = useState(true);
    const [profileLoaded, setProfileLoaded] = useState(false);  // Track if real profile loaded
    const [accountNotifications, setAccountNotifications] = useState<string[]>([]);

    const unsubProfRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, async (u) => {
            // Cleanup previous listener immediately
            if (unsubProfRef.current) {
                unsubProfRef.current();
                unsubProfRef.current = null;
            }

            if (u) {
                sessionStorage.setItem('anchor_session_active', 'true');
            } else {
                // If user becomes null and we didn't initiate logout (flag is still true), 
                // it might be expiry. But here we can't easily tell 'why' it became null 
                // without racing with logout(). 
                // Easier to assume if we are here and u is null, we are logged out.
                // We leave the flag ALONE here if it exists? 
                // No, onAuthStateChanged fires on logout too.
                // We should handle the clearing in logout() explicitly.
            }

            setUser(u);

            if (!u) {
                setLoading(false);
                setProfileLoaded(false);
                pendingMfaSecretRef.current = null;
                return;
            }

            const profRef = doc(db, 'artifacts', APP_ID, 'users', u.uid);
            // Store new unsub function in ref
            unsubProfRef.current = onSnapshot(profRef, async (snap) => {
                if (snap.exists()) {
                    const data = snap.data() as UserProfile;

                    // Check actual MFA enrollment from Firebase Auth
                    const actualMfaEnrolled = multiFactor(u).enrolledFactors.length > 0;

                    // Sync profile if MFA status is out of sync
                    if (actualMfaEnrolled && !data.mfaEnabled) {
                        console.log('[AuthContext] Syncing mfaEnabled flag with actual enrollment (ON)');
                        await updateDoc(profRef, { mfaEnabled: true });
                        return;
                    } else if (!actualMfaEnrolled && data.mfaEnabled) {
                        console.log('[AuthContext] Syncing mfaEnabled flag with actual enrollment (OFF)');
                        await updateDoc(profRef, { mfaEnabled: false });
                        return;
                    }

                    setProfile(data);

                    const alerts = [];
                    // Skip email verification requirement in dev and staging
                    const isProductionEnv = import.meta.env.VITE_APP_ENV === 'production';
                    if (!u.emailVerified && isProductionEnv) alerts.push('verify_email');
                    // Use actual MFA status, not just profile
                    if (!actualMfaEnrolled) alerts.push('enable_2fa');
                    setAccountNotifications(alerts);
                    setProfileLoaded(true);
                    setLoading(false);
                } else {
                    // IMPORTANT: Only create profile if we got a definitive server response
                    if (snap.metadata.fromCache) {
                        console.warn('[AuthContext] Profile not found but data is from cache - waiting for server');
                        return;
                    }

                    // Server confirmed profile doesn't exist - create it
                    console.log('[AuthContext] Profile not found on server - creating new profile');
                    setDoc(profRef, {
                        name: u.email?.split('@')[0] || 'User',
                        theme: 'light',
                        familyMode: false,
                        onboardingComplete: false
                    });
                    setProfileLoaded(true);
                    setLoading(false);
                }
            });
        });

        // Cleanup on unmount
        return () => {
            unsubAuth();
            if (unsubProfRef.current) unsubProfRef.current();
        };
    }, []);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        // For guest users, update local state and localStorage for theme
        if (!user) {
            setProfile(prev => ({ ...prev, ...updates }));
            if (updates.theme) {
                localStorage.setItem('anchor_theme', updates.theme);
            }
            return;
        }
        await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid), updates);
    };

    const signIn = async (e: string, p: string) => {
        await signInWithEmailAndPassword(auth, e, p);
    };

    const signUp = async (e: string, p: string) => {
        const cred = await createUserWithEmailAndPassword(auth, e, p);
        const name = e.split('@')[0];

        // 1. Create User Profile
        await setDoc(doc(db, 'artifacts', APP_ID, 'users', cred.user.uid), {
            name,
            theme: 'light',
            familyMode: false,
            onboardingComplete: false
        });

        // 2. Queue Welcome Email (Trigger Email Extension)
        try {
            await addDoc(collection(db, 'mail'), {
                to: [e],
                message: {
                    subject: 'Welcome to Anchor OS!',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #2563eb;">Welcome to Anchor OS!</h2>
                            <p>Hello <strong>${name}</strong>,</p>
                            <p>We’re thrilled to have you on board! Anchor OS is designed to help you organize your financial and family life with intentionality.</p>
                            <p><strong>Get started by:</strong></p>
                            <ul>
                                <li>Connecting your spouse (via Settings)</li>
                                <li>Adding your first financial account</li>
                                <li>Setting up your commitment tracking</li>
                            </ul>
                            <p>If you have any questions, just reply to this email.</p>
                            <p>Welcome home,<br/>The Anchor OS Team</p>
                        </div>
                    `
                }
            });
        } catch (err) {
            console.error('Failed to queue welcome email:', err);
            // Non-blocking: don't fail sign-up if email fails
        }
    };

    const logout = async () => {
        sessionStorage.removeItem('anchor_session_active');
        await signOut(auth);
        navigate('/', { replace: true });
    };

    const sendVerificationEmail = async () => {
        if (auth.currentUser) await sendEmailVerification(auth.currentUser);
    };

    const verifyMfa = async (resolver: MultiFactorResolver, code: string) => {
        const { TotpMultiFactorGenerator } = await import('firebase/auth');
        const assertion = TotpMultiFactorGenerator.assertionForSignIn(resolver.hints[0].uid, code);
        await resolver.resolveSignIn(assertion);
    };

    const generateMfaSecret = async () => {
        if (!user) throw new Error('Not logged in');
        const { TotpMultiFactorGenerator } = await import('firebase/auth');
        const session = await multiFactor(user).getSession();
        const result = await TotpMultiFactorGenerator.generateSecret(session);
        pendingMfaSecretRef.current = result;

        // Backup to sessionStorage to survive refresh/tab suspension
        try {
            sessionStorage.setItem('anchor_mfa_pending', JSON.stringify({
                secretKey: result.secretKey,
                hashingAlgorithm: result.hashingAlgorithm,
                codeLength: result.codeLength,
                codeInterval: (result as PendingMfaSecret).codeInterval || 30,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save MFA secret to storage', e);
        }

        return {
            qrCodeUrl: result.generateQrCodeUrl('Anchor OS', user.email || 'user'),
            manualKey: result.secretKey
        };
    };

    const enrollMfa = async (code: string) => {
        if (!user) throw new Error('Not logged in');

        // Check if MFA is already enrolled
        const mfaUser = multiFactor(user);
        if (mfaUser.enrolledFactors.length > 0) {
            console.log('[AuthContext] MFA already enrolled, skipping enrollment');
            await updateProfile({ mfaEnabled: true });
            return; // Already enrolled, just ensure profile is updated
        }

        const { TotpMultiFactorGenerator } = await import('firebase/auth');

        // Try memory first, then storage
        if (!pendingMfaSecretRef.current) {
            const stored = sessionStorage.getItem('anchor_mfa_pending');
            if (stored) {
                try {
                    const data = JSON.parse(stored) as SerializedMfaSecret;
                    // Check if stale > 15 mins
                    if (Date.now() - data.timestamp < 15 * 60 * 1000) {
                        // Reconstruct TotpSecret-like object for enrollment
                        pendingMfaSecretRef.current = {
                            ...data,
                            generateQrCodeUrl: () => '', // Stub
                        } as unknown as TotpSecret;
                    }
                } catch {
                    // Failed to restore - will throw below
                }
            }
        }

        if (!pendingMfaSecretRef.current) {
            throw new Error('MFA verification expired. Please regenerate the QR code.');
        }

        const assertion = TotpMultiFactorGenerator.assertionForEnrollment(pendingMfaSecretRef.current, code);
        await multiFactor(user).enroll(assertion, 'Authenticator App');
        await updateProfile({ mfaEnabled: true });

        pendingMfaSecretRef.current = null;
        sessionStorage.removeItem('anchor_mfa_pending');
    };

    const reauthenticate = async (password: string) => {
        if (!user || !user.email) throw new Error('Not logged in');
        const { EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
    };

    const unenrollMfa = async () => {
        if (!user) return;
        const mfaUser = multiFactor(user);
        if (mfaUser.enrolledFactors.length > 0) {
            await mfaUser.unenroll(mfaUser.enrolledFactors[0]);
        }
        await updateProfile({ mfaEnabled: false });
    };

    const sendPasswordReset = async (email: string) => {
        const { sendPasswordResetEmail } = await import('firebase/auth');
        await sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider value={{
            user, profile, loading, profileLoaded, updateProfile, signIn, signUp, logout,
            sendVerificationEmail, accountNotifications,
            verifyMfa, generateMfaSecret, enrollMfa, unenrollMfa,
            reauthenticate, sendPasswordReset
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
