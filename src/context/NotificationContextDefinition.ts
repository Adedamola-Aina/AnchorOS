import { createContext } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info';
}

export interface NotificationContextType {
    showToast: (message: string, type?: NotificationType) => void;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
