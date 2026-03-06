// @ts-nocheck
import React, { useCallback } from 'react';
import { Link2, Shield } from 'lucide-react';
import { useBankConnection } from '../../../hooks/useBankConnection';
import { useNotifications } from '../../../context/NotificationContext';

interface LinkBankAccountProps {
  onSuccess: () => void;
  onClose: () => void;
}

declare global {
  interface Window {
    MonoConnect?: new (config: MonoConnectConfig) => MonoConnectInstance;
  }
}

interface MonoConnectConfig {
  key: string;
  onSuccess: (response: { code: string }) => void;
  onClose: () => void;
}

interface MonoConnectInstance {
  setup: () => void;
  open: () => void;
}

export const LinkBankAccount: React.FC<LinkBankAccountProps> = ({ onSuccess, onClose }) => {
  const { linkBank, isLinking, error, clearError } = useBankConnection();
  const { showToast } = useNotifications();
  const monoKey = import.meta.env.VITE_MONO_PUBLIC_KEY;

  const handleConnect = useCallback(() => {
    if (!monoKey) return;
    clearError();

    const loadAndOpen = () => {
      const mono = new window.MonoConnect!({
        key: monoKey,
        onSuccess: async ({ code }) => {
          try {
            const result = await linkBank(code);
            showToast(`${result.institutionName} linked successfully`, 'success');
            onSuccess();
          } catch {
            showToast('Failed to link bank account', 'error');
          }
        },
        onClose: () => {},
      });
      mono.setup();
      mono.open();
    };

    if (window.MonoConnect) {
      loadAndOpen();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://connect.mono.co/connect.js';
    script.async = true;
    script.onload = loadAndOpen;
    script.onerror = () => showToast('Failed to load bank connection widget', 'error');
    document.body.appendChild(script);
  }, [monoKey, linkBank, showToast, onSuccess, clearError]);

  if (!monoKey) {
    return (
      <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
        Bank linking is not configured. Contact support.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
        <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Securely connect your Nigerian bank account via Mono.</span>
      </div>

      {error && (
        <div className="text-rose-500 text-sm bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConnect}
          disabled={isLinking}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
        >
          <Link2 className="w-4 h-4" />
          {isLinking ? 'Linking...' : 'Link Bank Account'}
        </button>
      </div>
    </div>
  );
};
