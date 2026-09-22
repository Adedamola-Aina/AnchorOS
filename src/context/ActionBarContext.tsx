import React, { useMemo, useState } from 'react';
import { ActionBarContext } from './ActionBarContextDefinition';

/**
 * CM-28: provider for the single page-level action-bar height slot.
 *
 * One height, published by whichever page is mounted, consumed by the shell when it
 * sets the scrollport's `scroll-padding-bottom` — so a focused field can never end up
 * underneath the bar.
 */
export const ActionBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [height, setHeight] = useState(0);
    const value = useMemo(() => ({ height, setHeight }), [height]);
    return <ActionBarContext.Provider value={value}>{children}</ActionBarContext.Provider>;
};

export { useActionBarHeight, useRegisterActionBarHeight } from './ActionBarContextDefinition';