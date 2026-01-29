/**
 * ContactModal Form Components
 * Extracted from ContactModal.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React from 'react';
import { Check, X, MessageSquare, Send } from 'lucide-react';
type SubjectType = 'question' | 'problem' | 'feature' | 'testimonial' | 'feedback' | 'other';
export const SUBJECTS: {
  value: SubjectType;
  label: string;
}[] = stryMutAct_9fa48("132") ? [] : (stryCov_9fa48("132"), [stryMutAct_9fa48("133") ? {} : (stryCov_9fa48("133"), {
  value: stryMutAct_9fa48("134") ? "" : (stryCov_9fa48("134"), 'feedback'),
  label: stryMutAct_9fa48("135") ? "" : (stryCov_9fa48("135"), 'General Feedback')
}), stryMutAct_9fa48("136") ? {} : (stryCov_9fa48("136"), {
  value: stryMutAct_9fa48("137") ? "" : (stryCov_9fa48("137"), 'question'),
  label: stryMutAct_9fa48("138") ? "" : (stryCov_9fa48("138"), 'Question')
}), stryMutAct_9fa48("139") ? {} : (stryCov_9fa48("139"), {
  value: stryMutAct_9fa48("140") ? "" : (stryCov_9fa48("140"), 'problem'),
  label: stryMutAct_9fa48("141") ? "" : (stryCov_9fa48("141"), 'Problem / Bug')
}), stryMutAct_9fa48("142") ? {} : (stryCov_9fa48("142"), {
  value: stryMutAct_9fa48("143") ? "" : (stryCov_9fa48("143"), 'feature'),
  label: stryMutAct_9fa48("144") ? "" : (stryCov_9fa48("144"), 'Feature Request')
}), stryMutAct_9fa48("145") ? {} : (stryCov_9fa48("145"), {
  value: stryMutAct_9fa48("146") ? "" : (stryCov_9fa48("146"), 'testimonial'),
  label: stryMutAct_9fa48("147") ? "" : (stryCov_9fa48("147"), 'Testimonial')
}), stryMutAct_9fa48("148") ? {} : (stryCov_9fa48("148"), {
  value: stryMutAct_9fa48("149") ? "" : (stryCov_9fa48("149"), 'other'),
  label: stryMutAct_9fa48("150") ? "" : (stryCov_9fa48("150"), 'Other')
})]);
export const ContactSuccessMessage: React.FC = stryMutAct_9fa48("151") ? () => undefined : (stryCov_9fa48("151"), (() => {
  const ContactSuccessMessage: React.FC = () => <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">Message Received</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Thank you for reaching out. I'll get back to you soon.</p>
        </div>
    </div>;
  return ContactSuccessMessage;
})());
interface ContactHeaderProps {
  onClose: () => void;
}
export const ContactHeader: React.FC<ContactHeaderProps> = stryMutAct_9fa48("152") ? () => undefined : (stryCov_9fa48("152"), (() => {
  const ContactHeader: React.FC<ContactHeaderProps> = ({
    onClose
  }) => <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between rounded-t-3xl">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-xl"><MessageSquare className="w-5 h-5 text-primary-500" /></div>
            <div>
                <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">Get in Touch</h3>
                <p className="text-xs text-slate-500">Share feedback, report bugs, or request features</p>
            </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
        </button>
    </div>;
  return ContactHeader;
})());
interface SubjectSelectProps {
  value: SubjectType;
  onChange: (val: SubjectType) => void;
}
export const SubjectSelect: React.FC<SubjectSelectProps> = stryMutAct_9fa48("153") ? () => undefined : (stryCov_9fa48("153"), (() => {
  const SubjectSelect: React.FC<SubjectSelectProps> = ({
    value,
    onChange
  }) => <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">What's this about?</label>
        <select value={value} onChange={stryMutAct_9fa48("154") ? () => undefined : (stryCov_9fa48("154"), e => onChange(e.target.value as SubjectType))} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer">
            {SUBJECTS.map(stryMutAct_9fa48("155") ? () => undefined : (stryCov_9fa48("155"), s => <option key={s.value} value={s.value}>{s.label}</option>))}
        </select>
    </div>;
  return SubjectSelect;
})());
interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
}
export const MessageInput: React.FC<MessageInputProps> = stryMutAct_9fa48("156") ? () => undefined : (stryCov_9fa48("156"), (() => {
  const MessageInput: React.FC<MessageInputProps> = ({
    value,
    onChange
  }) => <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
        <textarea value={value} onChange={stryMutAct_9fa48("157") ? () => undefined : (stryCov_9fa48("157"), e => onChange(e.target.value))} placeholder="What's on your mind? Be as specific as you like..." rows={5} required className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none" />
    </div>;
  return MessageInput;
})());
interface IdentityFieldsProps {
  name: string;
  email: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
}
export const IdentityFields: React.FC<IdentityFieldsProps> = stryMutAct_9fa48("158") ? () => undefined : (stryCov_9fa48("158"), (() => {
  const IdentityFields: React.FC<IdentityFieldsProps> = ({
    name,
    email,
    onNameChange,
    onEmailChange
  }) => <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                <input type="text" value={name} onChange={stryMutAct_9fa48("159") ? () => undefined : (stryCov_9fa48("159"), e => onNameChange(e.target.value))} placeholder="How should I address you?" required className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
            </div>
            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email for Reply</label>
                <input type="email" value={email} onChange={stryMutAct_9fa48("160") ? () => undefined : (stryCov_9fa48("160"), e => onEmailChange(e.target.value))} placeholder="you@example.com" required className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
            </div>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">Your email is only used to respond. It's never shared publicly.</p>
    </>;
  return IdentityFields;
})());
interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
}
export const SubmitButton: React.FC<SubmitButtonProps> = stryMutAct_9fa48("161") ? () => undefined : (stryCov_9fa48("161"), (() => {
  const SubmitButton: React.FC<SubmitButtonProps> = ({
    isSubmitting,
    disabled
  }) => <button type="submit" disabled={disabled} className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]">
        <Send className="w-5 h-5" />
        <span className="uppercase tracking-widest text-[10px] font-black">{isSubmitting ? stryMutAct_9fa48("162") ? "" : (stryCov_9fa48("162"), 'Sending...') : stryMutAct_9fa48("163") ? "" : (stryCov_9fa48("163"), 'Send Message')}</span>
    </button>;
  return SubmitButton;
})());