/**
 * InstallPrompt - PWA Install Banner
 * 
 * Shows a prompt to install the app on mobile devices.
 * Uses the beforeinstallprompt event on Android/Chrome.
 * Shows manual instructions on iOS Safari.
 */

import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS] = useState(() => {
        if (typeof navigator === 'undefined') return false;
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: unknown }).MSStream;
    });
    const { isMobile } = useResponsive();

    useEffect(() => {
        // Check if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) return;

        // Check if dismissed this session
        const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
        if (dismissed) return;

        // On iOS, show after a delay
        if (isIOS && isMobile) {
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }

        // On Android/Chrome, listen for the install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setTimeout(() => setShowPrompt(true), 2000);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, [isMobile, isIOS]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!showPrompt || !isMobile) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Download className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                            Install Anchor
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {isIOS
                                ? <>Tap <Share className="w-4 h-4 inline mx-0.5" /> then "Add to Home Screen"</>
                                : 'Add to your home screen for quick access'
                            }
                        </p>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        aria-label="Dismiss"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!isIOS && (
                    <button
                        onClick={handleInstall}
                        className="mt-3 w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        Install App
                    </button>
                )}
            </div>
        </div>
    );
};

export default InstallPrompt;
