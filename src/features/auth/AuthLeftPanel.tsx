/**
 * AuthLeftPanel - Decorative left panel for auth page
 * 
 * Displays branding, illustration, and tagline.
 */

import { AnchorLogo } from '../../components/shared';

export function AuthLeftPanel() {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-surface-2-dark via-surface-1-dark to-surface-base-dark dark:from-surface-1-dark dark:via-surface-base-dark dark:to-black">
            <div className="absolute inset-0 z-0">
                <svg className="absolute bottom-0 left-0 w-full opacity-20 dark:opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '50%' }}>
                    <path fill="#22d3ee" d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,229.3C672,213,768,203,864,213.3C960,224,1056,256,1152,261.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L0,320Z" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-full opacity-30 dark:opacity-15" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '35%' }}>
                    <path fill="#06b6d4" d="M0,288L48,282.7C96,277,192,267,288,266.7C384,267,480,277,576,282.7C672,288,768,288,864,282.7C960,277,1056,267,1152,266.7C1248,267,1344,277,1392,282.7L1440,288L1440,320L0,320Z" />
                </svg>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="relative w-64 h-64 flex items-center justify-center animate-in fade-in zoom-in duration-1000">
                    <AnchorLogo className="w-48 h-48 text-white/10 dark:text-cyan-400/10" strokeWidth={4} />
                </div>
            </div>

            <div className="absolute top-12 left-12 right-12 z-20">
                <div className="flex items-center gap-3 mb-8">
                    <AnchorLogo className="w-10 h-10 text-white" />
                    <span className="text-xl font-bold tracking-tight text-white transition-colors">Anchor</span>
                </div>
                <h2 className="text-h1 lg:text-h1-lg text-white leading-tight font-light">
                    Stay grounded.
                    <br />
                    <span className="text-cyan-400 font-medium">Track what matters.</span>
                </h2>
                <p className="mt-6 text-lg text-white/40 max-w-sm font-light">
                    Your personal operating system for habits, finances, and intentional living.
                </p>
            </div>

            <div className="absolute bottom-12 left-12 z-20">
                <p className="text-white/20 text-xs tracking-widest uppercase font-bold">Built for Intentionality</p>
            </div>
        </div>
    );
}
