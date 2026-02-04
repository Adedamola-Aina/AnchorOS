/**
 * OfflineIndicator - Shows online/offline network status
 * DES-002: Migrated to semantic tokens
 */

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Text, HStack } from '../primitives';

export const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShow(true);
            // Hide the "Back Online" message after 3 seconds
            setTimeout(() => setShow(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShow(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!show && isOnline) return null;

    return (
        <HStack
            gap="sm"
            align="center"
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl font-bold text-sm shadow-2xl transition-all duration-500 animate-in slide-in-from-bottom-4 ${isOnline
                ? 'bg-finance-500 text-white'
                : 'bg-surface-1 dark:bg-surface-2-dark text-white'
                }`}
        >
            {isOnline ? (
                <>
                    <Wifi className="w-4 h-4" />
                    <Text weight="bold" className="text-white">Back Online</Text>
                </>
            ) : (
                <>
                    <WifiOff className="w-4 h-4 animate-pulse" />
                    <Text weight="bold" className="text-white">Offline Mode</Text>
                </>
            )}
        </HStack>
    );
};

