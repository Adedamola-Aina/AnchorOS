// @ts-nocheck
import React, { useContext, useCallback } from 'react';
import { useFinanceService } from '../hooks/useFinanceService';
import { useAuth } from './AuthContext';
import { useFamilySharing } from '../hooks/useFamilySharing';
import { useFabricContext } from './FabricContext';
import { FinanceContext } from './FinanceContextDefinition';

// Re-export from definition
export { FinanceContext };

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, profile } = useAuth();
    const { familyMemberUid } = useFamilySharing(user?.uid);
    const { learnFrom } = useFabricContext();
    const financeService = useFinanceService(user, familyMemberUid, profile?.name);

    const addTransactionWithLearn = useCallback(async (tx) => {
        await financeService.addTransaction(tx);
        if (tx.type === 'expense') {
            try {
                learnFrom(
                    { type: 'transaction_recorded', category: tx.category },
                    { type: 'review_budget', category: tx.category },
                );
            } catch { /* learnFrom is fire-and-forget */ }
        }
    }, [financeService, learnFrom]);

    const deleteTransactionWithLearn = useCallback(async (id, accountId) => {
        const tx = financeService.transactions.find(t => t.id === id);
        await financeService.deleteTransaction(id, accountId);
        if (tx && tx.type === 'expense') {
            try {
                learnFrom(
                    { type: 'transaction_recorded', category: tx.category },
                    { type: 'review_budget', category: tx.category },
                );
            } catch { /* learnFrom is fire-and-forget */ }
        }
    }, [financeService, learnFrom]);

    return (
        <FinanceContext.Provider value={{ ...financeService, addTransaction: addTransactionWithLearn, deleteTransaction: deleteTransactionWithLearn }}>
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
