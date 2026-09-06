import React from 'react';

type IllustrationKind = 'empty' | 'not-found' | 'error' | 'onboarding' | 'fabric';

interface StateIllustrationProps {
  kind: IllustrationKind;
  className?: string;
  testId?: string;
}

const palette = {
  bg: 'var(--color-slate-100)',
  bgDark: 'var(--color-slate-800)',
  accent: 'var(--color-primary-500)',
  accentSoft: 'var(--color-primary-200)',
  success: 'var(--color-finance-500)',
  danger: '#f43f5e',
};

export const StateIllustration: React.FC<StateIllustrationProps> = ({ kind, className = 'w-32 h-24', testId }) => {
  const common = { viewBox: '0 0 160 120', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', className, 'data-testid': testId };

  if (kind === 'not-found') {
    return (
      <svg {...common}>
        <rect x="18" y="24" width="124" height="72" rx="16" fill={palette.bg} />
        <circle cx="62" cy="60" r="16" stroke={palette.accent} strokeWidth="6" />
        <line x1="74" y1="72" x2="90" y2="88" stroke={palette.accent} strokeWidth="6" strokeLinecap="round" />
        <line x1="102" y1="48" x2="126" y2="48" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
        <line x1="102" y1="64" x2="118" y2="64" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'error') {
    return (
      <svg {...common}>
        <rect x="22" y="20" width="116" height="80" rx="16" fill={palette.bg} />
        <circle cx="80" cy="60" r="22" fill="#fff" />
        <circle cx="80" cy="60" r="20" stroke={palette.danger} strokeWidth="5" />
        <line x1="80" y1="48" x2="80" y2="64" stroke={palette.danger} strokeWidth="6" strokeLinecap="round" />
        <circle cx="80" cy="74" r="3.5" fill={palette.danger} />
      </svg>
    );
  }

  if (kind === 'onboarding') {
    return (
      <svg {...common}>
        <rect x="16" y="22" width="128" height="76" rx="18" fill={palette.bg} />
        <rect x="34" y="44" width="26" height="26" rx="8" fill={palette.accentSoft} />
        <rect x="67" y="44" width="26" height="26" rx="8" fill={palette.accent} />
        <rect x="100" y="44" width="26" height="26" rx="8" fill={palette.success} />
      </svg>
    );
  }

  if (kind === 'fabric') {
    return (
      <svg {...common}>
        <rect x="14" y="18" width="132" height="84" rx="18" fill={palette.bg} />
        <path d="M30 78C48 52 66 52 80 68C92 82 108 82 130 56" stroke={palette.accent} strokeWidth="6" strokeLinecap="round" />
        <circle cx="44" cy="54" r="6" fill={palette.accentSoft} />
        <circle cx="80" cy="44" r="6" fill={palette.success} />
        <circle cx="120" cy="36" r="6" fill={palette.accent} />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="18" y="24" width="124" height="72" rx="18" fill={palette.bg} />
      <rect x="38" y="46" width="84" height="8" rx="4" fill="#cbd5e1" />
      <rect x="38" y="62" width="56" height="8" rx="4" fill="#e2e8f0" />
    </svg>
  );
};
