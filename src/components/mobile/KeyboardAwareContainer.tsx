/**
 * KeyboardAwareContainer - Wrapper that handles iOS keyboard avoidance
 * 
 * BUG-002 Fix: Scrolls focused inputs into view when virtual keyboard appears.
 * Uses visualViewport API for accurate keyboard detection on iOS Safari.
 * 
 * @example
 * <KeyboardAwareContainer>
 *   <TransactionForm />
 * </KeyboardAwareContainer>
 */

import React from 'react';
import { useKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance';

interface KeyboardAwareContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const KeyboardAwareContainer: React.FC<KeyboardAwareContainerProps> = ({
    children,
    className = '',
}) => {
    // Hook handles all keyboard detection and scrolling automatically
    useKeyboardAvoidance();

    return (
        <div className={`keyboard-aware ${className}`}>
            {children}
        </div>
    );
};

export default KeyboardAwareContainer;
