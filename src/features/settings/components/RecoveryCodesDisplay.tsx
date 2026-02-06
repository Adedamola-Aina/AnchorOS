/**
 * RecoveryCodesDisplay - Shows one-time MFA backup codes
 * 
 * FEAT-002: Displayed after MFA enrollment, codes cannot be retrieved later.
 */

import React, { useState } from 'react';
import { Copy, Check, Download, ShieldAlert } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface RecoveryCodesDisplayProps {
    codes: string[];
    onDone: () => void;
}

export const RecoveryCodesDisplay: React.FC<RecoveryCodesDisplayProps> = ({ codes, onDone }) => {
    const [copied, setCopied] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(codes.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const text = `Anchor OS Recovery Codes\nGenerated: ${new Date().toISOString()}\n\n${codes.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nEach code can only be used once.\nStore these in a safe place.`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'anchor-recovery-codes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                    <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save Your Recovery Codes</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    These codes let you access your account if you lose your authenticator device. Each code can only be used once.
                </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                    {codes.map((code, i) => (
                        <div key={i} className="font-mono text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg text-center tracking-wider">
                            {code}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleCopy} className="flex-1 gap-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy All'}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleDownload} className="flex-1 gap-2">
                    <Download className="w-4 h-4" /> Download
                </Button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
                        className="mt-1 rounded border-amber-300 text-amber-600 focus:ring-amber-500" />
                    <span className="text-sm text-amber-900 dark:text-amber-200">
                        I have saved these recovery codes in a safe place. I understand they cannot be shown again.
                    </span>
                </label>
            </div>

            <Button onClick={onDone} disabled={!confirmed} className="w-full font-bold">
                Done
            </Button>
        </div>
    );
};
