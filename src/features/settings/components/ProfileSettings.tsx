// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Globe, Camera, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { useAuth } from '../../../context/AuthContext';
import { uploadAvatar, deleteAvatar } from '../../../services/AvatarService';

interface ProfileSettingsProps {
    name: string;
    uid: string;
    onUpdateName: (name: string) => void;
}

const DEBOUNCE_MS = 500;

function SignInMethodBadge({ providerId }: { providerId: string }) {
    if (providerId === 'google.com') {
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full"><Globe className="w-3 h-3" />Signed in with Google</span>;
    }
    if (providerId === 'apple.com') {
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>Signed in with Apple</span>;
    }
    return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full"><Mail className="w-3 h-3" />Email &amp; Password</span>;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ name, uid, onUpdateName }) => {
    const { user, profile, updateProfile } = useAuth();
    const providerId = user?.providerData?.[0]?.providerId ?? 'password';
    const [localName, setLocalName] = useState(name);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isFirstMount = useRef(true);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        if (localName === name) return;
        const timer = setTimeout(() => onUpdateName(localName), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [localName, name, onUpdateName]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uid) return;
        setAvatarError(null); setAvatarUploading(true);
        try {
            const url = await uploadAvatar(uid, file);
            updateProfile({ photoURL: url });
        } catch (err: unknown) {
            setAvatarError((err as Error).message);
        } finally {
            setAvatarUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleAvatarDelete = async () => {
        if (!uid) return;
        setAvatarError(null); setAvatarUploading(true);
        try {
            await deleteAvatar(uid);
            updateProfile({ photoURL: undefined });
        } catch (err: unknown) {
            setAvatarError((err as Error).message);
        } finally { setAvatarUploading(false); }
    };

    const initials = (profile?.name || name || 'U').slice(0, 2).toUpperCase();

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3"><div className="p-2 bg-blue-500/10 rounded-lg"><User className="w-5 h-5 text-blue-500" /></div>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        {profile?.photoURL ? <img src={profile.photoURL} alt="Profile photo" className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700" /> : <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300 ring-2 ring-slate-200 dark:ring-slate-700">{initials}</div>}
                        {avatarUploading && <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button type="button" disabled={avatarUploading} onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 min-h-[36px]"><Camera className="w-3.5 h-3.5" />{profile?.photoURL ? 'Change photo' : 'Upload photo'}</button>
                            {profile?.photoURL && <button type="button" disabled={avatarUploading} onClick={handleAvatarDelete} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-full hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors disabled:opacity-50 min-h-[36px]"><Trash2 className="w-3.5 h-3.5" />Remove</button>}
                        </div>
                        <p className="text-[10px] text-slate-400">JPG or PNG only · max 2 MB</p>
                        {avatarError && <p className="text-[10px] text-rose-500">{avatarError}</p>}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleAvatarChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Display Name</label>
                        <input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                    </div>
                    <div className="flex flex-col justify-end"><label className="text-[10px] uppercase font-bold text-slate-400">User Identifier</label><div className="text-xs text-slate-400 font-mono mt-1 select-all">{uid}</div></div>
                </div>
                <div className="pt-2"><label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Sign-in Method</label><SignInMethodBadge providerId={providerId} /></div>
            </CardContent>
        </Card>
    );
};
