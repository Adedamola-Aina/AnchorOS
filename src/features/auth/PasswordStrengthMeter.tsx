/**
 * PasswordStrengthMeter - Visual password strength indicator
 * 
 * Shows strength bar and requirement badges.
 */

import { Check, Circle } from 'lucide-react';
import { AnchorLogo } from '../../components/shared';

interface PasswordStrengthMeterProps {
    password: string;
}

const getStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    return score;
};

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Extra Secure', 'Vault Layer'];
const strengthColors = [
    { bar: 'bg-muted', text: 'text-muted' },
    { bar: 'bg-red-400', text: 'text-red-500' },
    { bar: 'bg-orange-400', text: 'text-orange-500' },
    { bar: 'bg-yellow-400', text: 'text-yellow-600' },
    { bar: 'bg-emerald-400', text: 'text-emerald-500' },
    { bar: 'bg-cyan-500', text: 'text-cyan-500' }
];

const requirements = [
    { label: '12+ chars', check: (p: string) => p.length >= 12 },
    { label: 'Uppercase', check: (p: string) => /[A-Z]/.test(p) },
    { label: 'Number', check: (p: string) => /[0-9]/.test(p) },
    { label: 'Symbol', check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
];

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    const strength = getStrength(password);

    return (
        <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted">Security Strength</span>
                <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${strengthColors[strength].text}`}>
                    {strength >= 5 && <AnchorLogo className="w-3 h-3 animate-in zoom-in duration-300" />}
                    {strengthLabels[strength]}
                </span>
            </div>
            <div className="h-2 w-full bg-surface-3 dark:bg-surface-3-dark rounded-full overflow-hidden flex gap-0.5 p-0.5">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-full flex-1 rounded-full transition-all duration-500 ${i < strength ? strengthColors[strength].bar : 'bg-transparent'}`}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
                {requirements.map((req, i) => {
                    const met = req.check(password);
                    return (
                        <span
                            key={i}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all duration-300 ${met
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-surface-3 dark:bg-surface-3-dark text-muted'
                                }`}
                        >
                            {met ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                            {req.label}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
