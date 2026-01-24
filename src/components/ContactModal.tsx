/**
 * ContactModal - User feedback form with dual-delivery strategy
 * 
 * JUSTIFICATION (CLAUDE.md §3.2): This modal exceeds 200 lines because it implements
 * a resilient dual-delivery system (Firestore + Formspree) with proper error handling.
 * The form JSX is inherently verbose due to accessibility requirements.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, MessageSquare, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, APP_ID } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import pkg from '../../../package.json';

const APP_VERSION = (pkg as unknown as { version: string }).version;

interface ContactModalProps {
    onClose: () => void;
    currentPage?: string;
    initialSubject?: SubjectType;
}

type SubjectType = 'question' | 'problem' | 'feature' | 'testimonial' | 'feedback' | 'other';

const SUBJECTS: { value: SubjectType; label: string }[] = [
    { value: 'feedback', label: 'General Feedback' },
    { value: 'question', label: 'Question' },
    { value: 'problem', label: 'Problem / Bug' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'other', label: 'Other' },
];

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

        setIsSubmitting(true);
        setError('');

        // Collect metadata
        const metadata = {
            userId: user?.uid || 'anonymous',
            appVersion: APP_VERSION,
            deviceType: navigator.userAgent,
            platform: navigator.platform,
            currentPage,
            timestamp: new Date().toISOString(),
        };

        const payload = {
            subject: SUBJECTS.find(s => s.value === subject)?.label || subject,
            message,
            name,
            email,
            ...metadata,
        };

        try {
            // 1. Save to Firestore (Always, as a secure audit log)
            let firestoreSuccess = false;
            try {
                await addDoc(collection(db, 'artifacts', APP_ID, 'feedback'), {
                    ...payload,
                    createdAt: serverTimestamp(),
                    status: 'new'
                });
                firestoreSuccess = true;
            } catch (fsErr) {
                console.error('[Contact] Firestore backup failed:', fsErr);
                // We don't block the email if only Firestore fails, 
                // but we keep track of it.
            }

            // 2. Email Delivery
            const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
            let emailSuccess = false;

            if (FORMSPREE_ID) {
                try {
                    // Use Formspree API (Silent background send)
                    // We use the common Formspree fields: _subject, _replyto, etc.
                    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _subject: `[Anchor OS] ${payload.subject}`,
                            name: payload.name,
                            email: payload.email,
                            message: payload.message,
                            userId: payload.userId,
                            appVersion: payload.appVersion,
                            page: payload.currentPage,
                            platform: payload.platform,
                            timestamp: payload.timestamp
                        })
                    });

                    if (response.ok) {
                        emailSuccess = true;
                    } else {
                        const errorRes = await response.json().catch(() => ({}));
                        console.error('[Contact] Formspree error:', errorRes);
                    }
                } catch (emailErr) {
                    console.error('[Contact] Email delivery failed:', emailErr);
                }
            }

            // If either succeeded, we consider it a success for the user
            if (firestoreSuccess || emailSuccess) {
                setIsSubmitted(true);
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                throw new Error('All delivery methods failed');
            }
        } catch (err) {
            setError('Failed to send. Please try again later.');
            console.error('[Contact] Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalContent = isSubmitted ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Received</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Thank you for reaching out. I'll get back to you soon.</p>
            </div>
        </div>
    ) : (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto" onClick={onClose}>
            <div
                className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-500 sm:my-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Get in Touch</h3>
                            <p className="text-xs text-slate-500">Share feedback, report bugs, or request features</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                            What's this about?
                        </label>
                        <select
                            value={subject}
                            onChange={e => setSubject(e.target.value as SubjectType)}
                            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
                        >
                            {SUBJECTS.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                            Your Message
                        </label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="What's on your mind? Be as specific as you like..."
                            rows={5}
                            required
                            className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Identity (prefilled) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="How should I address you?"
                                required
                                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                Email for Reply
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                        Your email is only used to respond. It's never shared publicly.
                    </p>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs text-center">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !message.trim()}
                        className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Send className="w-5 h-5" />
                        <span className="uppercase tracking-widest text-[10px] font-black">
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );

    // Use React Portal to render at document.body level
    return createPortal(modalContent, document.body);
};

export default ContactModal;

