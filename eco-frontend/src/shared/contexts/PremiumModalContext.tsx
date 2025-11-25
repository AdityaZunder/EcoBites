import React, { createContext, useContext, useState } from 'react';
import { PremiumUpgradeModal } from '@/apps/user/components/premium/PremiumUpgradeModal';

interface PremiumModalContextType {
    openModal: () => void;
    closeModal: () => void;
    isOpen: boolean;
}

const PremiumModalContext = createContext<PremiumModalContextType | undefined>(undefined);

export const PremiumModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <PremiumModalContext.Provider value={{ openModal, closeModal, isOpen }}>
            {children}
            <PremiumUpgradeModal open={isOpen} onClose={closeModal} />
        </PremiumModalContext.Provider>
    );
};

export const usePremiumModal = () => {
    const context = useContext(PremiumModalContext);
    if (context === undefined) {
        throw new Error('usePremiumModal must be used within a PremiumModalProvider');
    }
    return context;
};
