/**
 * ContactModal Form Components
 * Extracted from ContactModal.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { Check, X, MessageSquare, Send } from 'lucide-react';

type SubjectType = 'question' | 'problem' | 'feature' | 'testimonial' | 'feedback' | 'other';
export const SUBJECTS: { value: SubjectType; label: string }[] = [
    { value: 'feedback', label: 'General Feedback' }, { value: 'question', label: 'Question' },
    { value: 'problem', label: 'Problem / Bug' }, { value: 'feature', label: 'Feature Request' },
    { value: 'testimonial', label: 'Testimonial' }, { value: 'other', label: 'Other' },
];

export const ContactSuccessMessage: React.FC = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Received</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Thank you for reaching out. I'll get back to you soon.</p>
        </div>
    </div>
);

interface ContactHeaderProps { onClose: () => void; }
export const ContactHeader: React.FC<ContactHeaderProps> = ({ onClose }) => (
    <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between rounded-t-3xl">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-xl"><MessageSquare className="w-5 h-5 text-primary-500" /></div>
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Get in Touch</h3>
                <p className="text-xs text-slate-500">Share feedback, report bugs, or request features</p>
            </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
        </button>
    </div>
);

interface SubjectSelectProps { value: SubjectType; onChange: (val: SubjectType) => void; }
export const SubjectSelect: React.FC<SubjectSelectProps> = ({ value, onChange }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">What's this about?</label>
        <select value={value} onChange={e => onChange(e.target.value as SubjectType)}
            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer">
            {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
    </div>
);

interface MessageInputProps { value: string; onChange: (val: string) => void; }
export const MessageInput: React.FC<MessageInputProps> = ({ value, onChange }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder="What's on your mind? Be as specific as you like..." rows={5} required
            className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none" />
    </div>
);

interface IdentityFieldsProps { name: string; email: string; onNameChange: (v: string) => void; onEmailChange: (v: string) => void; }
export const IdentityFields: React.FC<IdentityFieldsProps> = ({ name, email, onNameChange, onEmailChange }) => (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                <input type="text" value={name} onChange={e => onNameChange(e.target.value)} placeholder="How should I address you?" required
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
            </div>
            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email for Reply</label>
                <input type="email" value={email} onChange={e => onEmailChange(e.target.value)} placeholder="you@example.com" required
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
            </div>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">Your email is only used to respond. It's never shared publicly.</p>
    </>
);

interface SubmitButtonProps { isSubmitting: boolean; disabled: boolean; }
export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, disabled }) => (
    <button type="submit" disabled={disabled}
        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]">
        <Send className="w-5 h-5" />
        <span className="uppercase tracking-widest text-[10px] font-black">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
    </button>
);
