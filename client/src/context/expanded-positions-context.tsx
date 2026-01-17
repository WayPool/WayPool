import React, { createContext, useContext, useState, ReactNode } from 'react';

// Contexto para manejar qué posiciones están expandidas
interface ExpandedPositionsContextType {
  expandedPositions: Set<number>;
  togglePosition: (positionId: number) => void;
  isPositionExpanded: (positionId: number) => boolean;
  collapseAll: () => void;
}

const ExpandedPositionsContext = createContext<ExpandedPositionsContextType | undefined>(undefined);

// Proveedor del contexto
export const ExpandedPositionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedPositions, setExpandedPositions] = useState<Set<number>>(new Set());

  const togglePosition = (positionId: number) => {
    setExpandedPositions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(positionId)) {
        newSet.delete(positionId);
      } else {
        newSet.add(positionId);
      }
      return newSet;
    });
  };

  const isPositionExpanded = (positionId: number): boolean => {
    return expandedPositions.has(positionId);
  };

  const collapseAll = () => {
    setExpandedPositions(new Set());
  };

  return (
    <ExpandedPositionsContext.Provider 
      value={{ 
        expandedPositions, 
        togglePosition, 
        isPositionExpanded,
        collapseAll
      }}
    >
      {children}
    </ExpandedPositionsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useExpandedPositions = (): ExpandedPositionsContextType => {
  const context = useContext(ExpandedPositionsContext);
  if (context === undefined) {
    throw new Error('useExpandedPositions debe ser usado dentro de un ExpandedPositionsProvider');
  }
  return context;
};