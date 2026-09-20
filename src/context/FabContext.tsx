import React, { useMemo, useState } from 'react';
import { FabContext, type FabAction } from './FabContextDefinition';

/** UX-GL-04: provider for the single contextual FAB slot. */
export const FabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [action, setAction] = useState<FabAction | null>(null);
    const value = useMemo(() => ({ action, setAction }), [action]);
    return <FabContext.Provider value={value}>{children}</FabContext.Provider>;
};

export { useFab, useRegisterFab } from './FabContextDefinition';
