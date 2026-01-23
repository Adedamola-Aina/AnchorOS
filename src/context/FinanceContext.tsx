import React, { useContext } from 'react';
import { useFinanceService } from '../hooks/useFinanceService';
import { useAuth } from './AuthContext';
import { useFamilySharing } from '../hooks/useFamilySharing';
import { FinanceContext } from './FinanceContextDefinition';

// Re-export from definition
export { FinanceContext };

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, profile } = useAuth();
    const { familyMemberUid } = useFamilySharing(user?.uid);
    const financeService = useFinanceService(user, familyMemberUid, profile?.name);

    return (
        <FinanceContext.Provider value={financeService}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};
