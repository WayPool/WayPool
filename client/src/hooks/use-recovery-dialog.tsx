import { createContext, useContext, useState, ReactNode } from 'react';

interface RecoveryDialogContextType {
  isOpen: boolean;
  openRecoveryDialog: () => void;
  closeRecoveryDialog: () => void;
}

const RecoveryDialogContext = createContext<RecoveryDialogContextType | undefined>(undefined);

export function RecoveryDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openRecoveryDialog = () => {
    setIsOpen(true);
  };

  const closeRecoveryDialog = () => {
    setIsOpen(false);
  };

  return (
    <RecoveryDialogContext.Provider
      value={{
        isOpen,
        openRecoveryDialog,
        closeRecoveryDialog,
      }}
    >
      {children}
    </RecoveryDialogContext.Provider>
  );
}

export function useRecoveryDialog() {
  const context = useContext(RecoveryDialogContext);
  if (context === undefined) {
    throw new Error('useRecoveryDialog must be used within a RecoveryDialogProvider');
  }
  return context;
}