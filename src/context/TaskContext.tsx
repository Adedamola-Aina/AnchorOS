// @ts-nocheck
import React, { useContext, useCallback } from 'react';
import { useCommitmentService } from '../hooks/useCommitmentService';
import { useAuth } from './AuthContext';
import { useApp } from './AnchorContext';
import { useHaptic } from '../hooks/useHaptic';
import { TaskContext } from './TaskContextDefinition';
export { TaskContext };

import { useTaskReminders } from '../hooks/useTaskReminders';
import { useFabricSuggestions } from '../hooks/useFabricSuggestions';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // We need the user from the AuthContext
    const { user } = useAuth();
    const { navigateTo } = useApp();
    const haptic = useHaptic();

    // Use the existing hook
    const commitmentService = useCommitmentService(user);

    // Enable system-wide reminders
    useTaskReminders(commitmentService.tasks);

    // Fabric v1.5: Smart suggestions
    const { suggestions, onCommitmentCompleted, dismissSuggestion } = useFabricSuggestions();

    // Wrap toggleTask to trigger suggestions when completing tasks
    const toggleTaskWithSuggestion = useCallback(async (id: string, currentStatus: boolean) => {
        // IMPORTANT: Capture task data BEFORE toggle to avoid stale closure
        const task = commitmentService.tasks.find(t => t.id === id);

        // Execute the toggle
        await commitmentService.toggleTask(id, currentStatus);

        // Haptic feedback: heavy for completion, light for uncomplete
        haptic.trigger(currentStatus ? 'light' : 'heavy');

        // If completing a task (currentStatus was false, now true)
        // Trigger suggestion with pre-toggle task data
        if (!currentStatus && task) {
            try {
                onCommitmentCompleted(task, navigateTo);
            } catch (err) {
                // Non-critical: suggestion failure shouldn't break task completion
                console.warn('[Fabric] Suggestion trigger failed:', err);
            }
        }
    }, [commitmentService, onCommitmentCompleted, navigateTo, haptic]);

    return (
        <TaskContext.Provider value={{
            ...commitmentService,
            toggleTask: toggleTaskWithSuggestion,
            loadingTasks: false,
            // Fabric v1.5
            fabricSuggestions: suggestions,
            dismissFabricSuggestion: dismissSuggestion,
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
