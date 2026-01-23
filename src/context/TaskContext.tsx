import React, { useContext } from 'react';
import { useCommitmentService } from '../hooks/useCommitmentService';
import { useAuth } from './AuthContext';
import { TaskContext } from './TaskContextDefinition';
export { TaskContext };

import { useTaskReminders } from '../hooks/useTaskReminders';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // We need the user from the AuthContext
    const { user } = useAuth();

    // Use the existing hook
    const commitmentService = useCommitmentService(user);

    // Enable system-wide reminders
    useTaskReminders(commitmentService.tasks);

    return (
        <TaskContext.Provider value={{
            ...commitmentService,
            loadingTasks: false
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

