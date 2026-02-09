import React from 'react';

/**
 * Shows a banner in non-production environments.
 * Blue banner for development, yellow for staging.
 */
export const EnvironmentBanner: React.FC = () => {
  const env = import.meta.env.VITE_APP_ENV;
  if (!env || env === 'production') return null;

  const colors = env === 'development'
    ? 'bg-blue-600 text-white'
    : 'bg-yellow-500 text-black';

  return (
    <div className={`fixed top-0 left-0 right-0 h-6 ${colors} flex items-center justify-center text-xs font-bold tracking-widest uppercase z-50`}>
      {env === 'development' ? 'DEVELOPMENT ENVIRONMENT' : 'STAGING ENVIRONMENT'}
    </div>
  );
};
