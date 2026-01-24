/**
 * FabricSuggestionManager
 * 
 * Renders FabricSuggestion toasts from the TaskContext.
 * Should be placed inside TaskProvider to access suggestions.
 */

import React from 'react';
import { FabricSuggestionContainer } from '../../components/shared';
import { useTasks } from '../../context/TaskContext';

export const FabricSuggestionManager: React.FC = () => {
    const { fabricSuggestions } = useTasks();

    return <FabricSuggestionContainer suggestions={fabricSuggestions} />;
};
