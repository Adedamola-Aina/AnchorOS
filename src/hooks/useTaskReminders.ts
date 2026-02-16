// @ts-nocheck
import { useEffect, useRef } from 'react';
import type { AnchorTask } from '../types';
import { useNotifications } from '../context/NotificationContext';

export const useTaskReminders = (tasks: AnchorTask[]) => {
    const { showToast } = useNotifications();
    const lastNotifiedRef = useRef<Record<string, string>>({});

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentHours = now.getHours().toString().padStart(2, '0');
            const currentMinutes = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${currentHours}:${currentMinutes}`;
            const todayDate = now.toDateString();

            tasks.forEach(task => {
                if (!task.reminderTime || task.completed) return;

                // Check if already notified today
                const lastNotified = lastNotifiedRef.current[task.id];
                if (lastNotified === todayDate) return;

                // Check time match (simple exact match)
                if (task.reminderTime === currentTime) {
                    showToast(`Reminder: Time for "${task.title}"`, 'info');

                    // Browser Notification (if supported/granted)
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification(`Anchor: ${task.title}`, {
                            body: `It's time for your commitment: ${task.title}`,
                            icon: '/icon-192.png'
                        });
                    }

                    // Mark notified
                    lastNotifiedRef.current[task.id] = todayDate;
                }
            });
        };

        // Request permission on mount
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const intervalId = setInterval(checkReminders, 60000); // Check every minute
        checkReminders(); // Initial check

        return () => clearInterval(intervalId);
    }, [tasks, showToast]);
};
