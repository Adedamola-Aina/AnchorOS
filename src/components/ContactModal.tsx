/**
 * ContactModal - User feedback form with dual-delivery strategy
 * DES-002: Migrated to semantic tokens
 * WEB-003: Framer Motion slide-up animation
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Form components extracted to ContactModalParts.tsx
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db, APP_ID } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import pkg from '../../package.json';
import { ContactSuccessMessage, ContactHeader, SubjectSelect, MessageInput, IdentityFields, SubmitButton, SUBJECTS } from './ContactModalParts';

const APP_VERSION = (pkg as unknown as { version: string }).version;
type SubjectType = 'question' | 'problem' | 'feature' | 'testimonial' | 'feedback' | 'other';

interface ContactModalProps { onClose: () => void; currentPage?: string; initialSubject?: SubjectType; }

const ContactModal: React.FC<ContactModalProps> = ({ onClose, currentPage = 'unknown', initialSubject = 'feedback' }) => {
    const { user, profile } = useAuth();
    const [subject, setSubject] = useState<SubjectType>(initialSubject);
    const [message, setMessage] = useState('');
    const [name, setName] = useState(profile?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setIsSubmitting(true); setError('');

        const metadata = { userId: user?.uid || 'anonymous', appVersion: APP_VERSION, deviceType: navigator.userAgent, platform: navigator.platform, currentPage, timestamp: new Date().toISOString() };
        const payload = { subject: SUBJECTS.find(s => s.value === subject)?.label || subject, message, name, email, ...metadata };

        try {
            let firestoreSuccess = false, emailSuccess = false;
            try { await addDoc(collection(db, 'artifacts', APP_ID, 'feedback'), { ...payload, createdAt: serverTimestamp(), status: 'new' }); firestoreSuccess = true; }
            catch (fsErr) { console.error('[Contact] Firestore backup failed:', fsErr); }

            const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
            if (FORMSPREE_ID) {
                try {
                    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ _subject: `[Anchor OS] ${payload.subject}`, name: payload.name, email: payload.email, message: payload.message, userId: payload.userId, appVersion: payload.appVersion, page: payload.currentPage, platform: payload.platform, timestamp: payload.timestamp })
                    });
                    if (response.ok) emailSuccess = true;
                    else console.error('[Contact] Formspree error:', await response.json().catch(() => ({})));
                } catch (emailErr) { console.error('[Contact] Email delivery failed:', emailErr); }
            }

            if (firestoreSuccess || emailSuccess) { setIsSubmitted(true); setTimeout(() => onClose(), 3000); }
            else throw new Error('All delivery methods failed');
        } catch (err) { setError('Failed to send. Please try again later.'); console.error('[Contact] Submission error:', err); }
        finally { setIsSubmitting(false); }
    };

    if (isSubmitted) return createPortal(<ContactSuccessMessage />, document.body);

    return createPortal(
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                {/* Modal Content */}
                <motion.div
                    className="relative w-full sm:max-w-lg bg-surface-1 dark:bg-surface-1-dark rounded-t-3xl sm:rounded-3xl shadow-2xl sm:my-8"
                    onClick={e => e.stopPropagation()}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring' as const, damping: 25, stiffness: 300 }}
                >
                    <ContactHeader onClose={onClose} />
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <SubjectSelect value={subject} onChange={setSubject} />
                        <MessageInput value={message} onChange={setMessage} />
                        <IdentityFields name={name} email={email} onNameChange={setName} onEmailChange={setEmail} />
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl text-danger-600 dark:text-danger-400 text-xs text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                        <SubmitButton isSubmitting={isSubmitting} disabled={isSubmitting || !message.trim()} />
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default ContactModal;

