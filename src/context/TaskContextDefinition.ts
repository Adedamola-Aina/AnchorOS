import { createContext } from 'react';
import type { AnchorTask } from '../types';

export interface TaskContextType {
    tasks: AnchorTask[];
    addTask: (task: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>;
    toggleTask: (id: string, currentStatus: boolean) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    updateTask: (id: string, updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>) => Promise<void>;
    loadingTasks: boolean;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
