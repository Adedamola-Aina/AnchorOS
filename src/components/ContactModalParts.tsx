/**
 * ContactModal Form Components
 * DES-002: Migrated to semantic tokens
 * Extracted from ContactModal.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { Check, X, MessageSquare, Send } from 'lucide-react';
import { Text, VStack, HStack } from './primitives';

type SubjectType = 'question' | 'problem' | 'feature' | 'testimonial' | 'feedback' | 'other';
export const SUBJECTS: { value: SubjectType; label: string }[] = [
    { value: 'feedback', label: 'General Feedback' }, { value: 'question', label: 'Question' },
    { value: 'problem', label: 'Problem / Bug' }, { value: 'feature', label: 'Feature Request' },
    { value: 'testimonial', label: 'Testimonial' }, { value: 'other', label: 'Other' },
];

export const ContactSuccessMessage: React.FC = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <VStack gap="md" align="center" className="w-full max-w-md bg-surface-1 dark:bg-surface-1-dark rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-finance-500/20 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-finance-500" />
            </div>
            <Text size="lg" weight="bold" className="text-foreground dark:text-foreground-dark">Message Received</Text>
            <Text variant="muted" size="sm">Thank you for reaching out. I'll get back to you soon.</Text>
        </VStack>
    </div>
);

interface ContactHeaderProps { onClose: () => void; }
export const ContactHeader: React.FC<ContactHeaderProps> = ({ onClose }) => (
    <HStack justify="between" align="center" className="sticky top-0 bg-surface-1 dark:bg-surface-1-dark p-6 border-b border-border-subtle rounded-t-3xl">
        <HStack gap="sm" align="center">
            <div className="p-2 bg-primary-500/10 rounded-xl"><MessageSquare className="w-5 h-5 text-primary-500" /></div>
            <VStack gap="none">
                <Text size="lg" weight="bold" className="text-foreground dark:text-foreground-dark">Get in Touch</Text>
                <Text size="xs" variant="muted">Share feedback, report bugs, or request features</Text>
            </VStack>
        </HStack>
        <button onClick={onClose} className="p-2 text-muted hover:text-foreground dark:hover:text-foreground-dark hover:bg-surface-3 dark:hover:bg-surface-3-dark rounded-xl transition-colors">
            <X className="w-5 h-5" />
        </button>
    </HStack>
);

interface SubjectSelectProps { value: SubjectType; onChange: (val: SubjectType) => void; }
export const SubjectSelect: React.FC<SubjectSelectProps> = ({ value, onChange }) => (
    <VStack gap="sm">
        <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1">What's this about?</label>
        <select value={value} onChange={e => onChange(e.target.value as SubjectType)}
            className="w-full p-3 border border-border-subtle rounded-xl bg-surface-1 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none cursor-pointer">
            {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
    </VStack>
);

interface MessageInputProps { value: string; onChange: (val: string) => void; }
export const MessageInput: React.FC<MessageInputProps> = ({ value, onChange }) => (
    <VStack gap="sm">
        <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Your Message</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder="What's on your mind? Be as specific as you like..." rows={5} required
            className="w-full p-4 border border-border-subtle rounded-xl bg-surface-1 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark placeholder-muted focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none" />
    </VStack>
);

interface IdentityFieldsProps { name: string; email: string; onNameChange: (v: string) => void; onEmailChange: (v: string) => void; }
export const IdentityFields: React.FC<IdentityFieldsProps> = ({ name, email, onNameChange, onEmailChange }) => (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <VStack gap="sm">
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Your Name</label>
                <input type="text" value={name} onChange={e => onNameChange(e.target.value)} placeholder="How should I address you?" required
                    className="w-full p-3 border border-border-subtle rounded-xl bg-surface-1 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark placeholder-muted focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
            </VStack>
            <VStack gap="sm">
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Email for Reply</label>
                <input type="email" value={email} onChange={e => onEmailChange(e.target.value)} placeholder="you@example.com" required
                    className="w-full p-3 border border-border-subtle rounded-xl bg-surface-1 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark placeholder-muted focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
            </VStack>
        </div>
        <Text size="xs" variant="muted" className="text-center">Your email is only used to respond. It's never shared publicly.</Text>
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

