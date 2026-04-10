import React, { useContext, useCallback } from 'react';
import { useCommitmentService } from '../hooks/useCommitmentService';
import { useAuth } from './AuthContext';
import { useHaptic } from '../hooks/useHaptic';
import { TaskContext } from './TaskContextDefinition';
export { TaskContext };

import { useTaskReminders } from '../hooks/useTaskReminders';
import { useFabricContext } from './FabricContext';
import { useCommitmentBadge } from '../hooks/useCommitmentBadge';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const haptic = useHaptic();
    const { learnFrom } = useFabricContext();

    const commitmentService = useCommitmentService(user);
    useTaskReminders(commitmentService.tasks);
    useCommitmentBadge({ userId: user?.uid, tasks: commitmentService.tasks });

    const toggleTaskWithHaptic = useCallback(async (id: string, currentStatus: boolean) => {
        await commitmentService.toggleTask(id, currentStatus);
        haptic.trigger(currentStatus ? 'light' : 'heavy');
        if (!currentStatus) {
            const task = commitmentService.tasks.find(t => t.id === id);
            learnFrom(
                { type: 'commitment_completed', commitmentId: id, category: task?.category },
                { type: 'check_commitment', commitmentId: id }
            );
        }
    }, [commitmentService, haptic, learnFrom]);

    return (
        <TaskContext.Provider value={{
            ...commitmentService,
            toggleTask: toggleTaskWithHaptic,
            loadingTasks: false,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
