import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';

interface ProfileSettingsProps {
    name: string;
    uid: string;
    onUpdateName: (name: string) => void;
}

const DEBOUNCE_MS = 500;

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ name, uid, onUpdateName }) => {
    const [localName, setLocalName] = useState(name);
    const isFirstMount = useRef(true);

    // Sync external prop changes
    useEffect(() => {
        setLocalName(name);
    }, [name]);

    // Debounced update to Firestore
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        if (localName === name) return;

        const timer = setTimeout(() => {
            onUpdateName(localName);
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [localName, name, onUpdateName]);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <User className="w-5 h-5 text-blue-500" />
                    </div>
                    User Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Display Name</label>
                        <input
                            type="text"
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col justify-end">
                        <label className="text-[10px] uppercase font-bold text-slate-400">User Identifier</label>
                        <div className="text-xs text-slate-400 font-mono mt-1 select-all">{uid}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
