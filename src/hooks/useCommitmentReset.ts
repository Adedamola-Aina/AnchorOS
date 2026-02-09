/**
 * Lazy reset effect for commitment streak tracking.
 *
 * Resets completed status when a new cycle begins (daily/weekly/monthly)
 * and breaks streaks when commitments are missed.
 */

import { useEffect } from 'react';
import type { User } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorTask } from '../types';

export function useCommitmentResetEffect(user: User | null, rawTasks: AnchorTask[]) {
    useEffect(() => {
        if (!user || rawTasks.length === 0) return;

        const now = new Date();
        const today = now.toLocaleDateString('en-CA');

        rawTasks.forEach(t => {
            // Reset 'completed' status if distinct period
            if (t.completed && t.lastCompletedAt) {
                const lastDate = new Date(t.lastCompletedAt);
                const lastDateLocal = lastDate.toLocaleDateString('en-CA');
                let shouldReset = false;

                if (lastDateLocal !== today) {
                    if (t.type === 'daily') {
                        shouldReset = true;
                    } else if (t.type === 'weekly') {
                        const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
                        if (t.daysOfWeek?.includes(dayName)) {
                            shouldReset = true;
                        } else {
                            const diffTime = Math.abs(now.getTime() - lastDate.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays >= 7) shouldReset = true;
                        }
                    } else if (t.type === 'monthly') {
                        const todayDay = now.getDate();
                        const isCommitmentDay = t.daysOfMonth?.includes(todayDay) || t.dayOfMonth === todayDay;
                        if (isCommitmentDay || now.getMonth() !== lastDate.getMonth()) {
                            shouldReset = true;
                        }
                    }
                }

                if (shouldReset) {
                    updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'commitments', t.id), {
                        completed: false
                    });
                }
            }

            // Break streaks if missed
            if (!t.completed && (t.currentStreak || 0) > 0 && t.lastCompletedAt) {
                const lastDate = new Date(t.lastCompletedAt);
                const diffTime = now.getTime() - lastDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                let broken = false;
                if (t.type === 'daily' && diffDays > 1.5) broken = true;
                if (t.type === 'weekly' && diffDays > 8) broken = true;
                if (t.type === 'monthly' && diffDays > 32) broken = true;

                if (broken) {
                    updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'commitments', t.id), {
                        currentStreak: 0
                    });
                }
            }
        });
    }, [user, rawTasks]);
}
