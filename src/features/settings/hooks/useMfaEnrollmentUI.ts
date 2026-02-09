/**
 * useMfaEnrollmentUI - Encapsulates MFA enrollment UI state
 * 
 * ARCH-001: Extracted from SettingsView to reduce prop drilling
 * and keep MFA state co-located.
 */

import { useState, useRef, useCallback } from 'react';
import { generateRecoveryCodes } from '../../../services/mfaRecoveryService';
import { doc, setDoc } from 'firebase/firestore';
import { db, APP_ID } from '../../../config/firebase';

interface UseMfaEnrollmentUIOptions {
    generateMfaSecret: () => Promise<{ qrCodeUrl: string; manualKey: string }>;
    enrollMfa: (code: string) => Promise<void>;
    showToast: (message: string, type: 'success' | 'error') => void;
    onRequiresReauth: () => void;
    userId?: string;
}

export function useMfaEnrollmentUI({
    generateMfaSecret,
    enrollMfa,
    showToast,
    onRequiresReauth,
    userId,
}: UseMfaEnrollmentUIOptions) {
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [mfaQrUrl, setMfaQrUrl] = useState('');
    const [mfaManualKey, setMfaManualKey] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [mfaError, setMfaError] = useState('');
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
    const mfaCompletedRef = useRef(false);

    const handleGenerateSecret = useCallback(async () => {
        mfaCompletedRef.current = false;
        setIsEnrolling(true);
        setShow2FASetup(true);
        setMfaQrUrl('');
        setMfaManualKey('');
        setMfaError('');

        const timeout = setTimeout(() => {
            if (!mfaCompletedRef.current) {
                setMfaError('Initialization taking too long.');
                setIsEnrolling(false);
            }
        }, 10000);

        try {
            const result = await generateMfaSecret();
            clearTimeout(timeout);
            mfaCompletedRef.current = true;
            setMfaQrUrl(result.qrCodeUrl);
            setMfaManualKey(result.manualKey);
        } catch (err) {
            clearTimeout(timeout);
            mfaCompletedRef.current = true;
            setMfaError((err as Error).message);
        } finally {
            setIsEnrolling(false);
        }
    }, [generateMfaSecret]);

    const handleEnroll = useCallback(async (code: string) => {
        setIsEnrolling(true);
        setMfaError('');
        try {
            await enrollMfa(code);
            // FEAT-002: Generate recovery codes after successful MFA enrollment
            try {
                const { plainCodes, hashedCodes } = await generateRecoveryCodes();
                if (userId) {
                    await setDoc(doc(db, 'artifacts', APP_ID, 'users', userId, 'security', 'mfaRecovery'), {
                        hashedCodes,
                        generatedAt: new Date().toISOString(),
                        codesRemaining: hashedCodes.length,
                    });
                }
                setRecoveryCodes(plainCodes);
            } catch (rcErr) {
                console.warn('[MFA] Recovery codes generation failed:', rcErr);
            }
            setShow2FASetup(false);
            setMfaCode('');
            showToast('2FA enabled successfully!', 'success');
        } catch (err) {
            const msg = (err as Error).message;
            if (msg.includes('requires-recent-login') || ('code' in (err as object) && (err as { code: string }).code === 'auth/requires-recent-login')) {
                onRequiresReauth();
            } else {
                setMfaError(msg.includes('invalid-verification-code')
                    ? 'Invalid code. Check device Date & Time settings.'
                    : msg);
            }
        } finally {
            setIsEnrolling(false);
        }
    }, [enrollMfa, showToast, onRequiresReauth, userId]);

    const clearRecoveryCodes = useCallback(() => {
        setRecoveryCodes(null);
    }, []);

    return {
        show2FASetup,
        setShow2FASetup,
        mfaQrUrl,
        mfaManualKey,
        mfaCode,
        setMfaCode,
        mfaError,
        isEnrolling,
        recoveryCodes,
        clearRecoveryCodes,
        handleGenerateSecret,
        handleEnroll,
    };
}
