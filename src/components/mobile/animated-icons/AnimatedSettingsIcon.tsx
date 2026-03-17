import React from 'react';

interface AnimatedSettingsIconProps {
  className?: string;
  isAnimating?: boolean;
  isDarkMode?: boolean;
}

const SETTINGS_COLOR_LIGHT = '#6366f1';
const SETTINGS_COLOR_DARK = '#94a3b8';
const GEAR_PATH = 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z';

export const AnimatedSettingsIcon: React.FC<AnimatedSettingsIconProps> = ({
  className = '',
  isAnimating = false,
  isDarkMode = false,
}) => {
  const accentColor = isDarkMode ? SETTINGS_COLOR_DARK : SETTINGS_COLOR_LIGHT;

  if (!isAnimating) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={GEAR_PATH} />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg className={`${className} drop-shadow-md`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={GEAR_PATH} stroke={accentColor} />
      <circle cx="12" cy="12" r="3" fill={accentColor} fillOpacity="0.3" stroke={accentColor} />
    </svg>
  );
};
