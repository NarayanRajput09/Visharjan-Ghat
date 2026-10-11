import React, { createContext, useContext, useState } from 'react';
import type { components } from '../../api/schema';
import { MOCK_READINGS_BY_ID } from '../../api/mockData';
import { api } from '../../api/client';

type Reading = components['schemas']['Reading'];

interface SourceContextType {
  selectedReading: Reading | null;
  isOpen: boolean;
  openSource: (readingOrId: Reading | number) => Promise<void>;
  closeSource: () => void;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export function SourceProvider({ children }: { children: React.ReactNode }) {
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSource = async (readingOrId: Reading | number) => {
    if (typeof readingOrId === 'number') {
      // Check local cache
      const cached = MOCK_READINGS_BY_ID[readingOrId];
      if (cached) {
        setSelectedReading(cached);
        setIsOpen(true);
        return;
      }

      try {
        const fetched = await api.get<Reading>(`/api/readings/${readingOrId}`);
        setSelectedReading(fetched);
        setIsOpen(true);
      } catch (err) {
        console.error('Failed to load reading details:', err);
      }
    } else {
      setSelectedReading(readingOrId);
      setIsOpen(true);
    }
  };

  const closeSource = () => {
    setIsOpen(false);
    setSelectedReading(null);
  };

  return (
    <SourceContext.Provider value={{ selectedReading, isOpen, openSource, closeSource }}>
      {children}
    </SourceContext.Provider>
  );
}

export function useSourcePanel() {
  const ctx = useContext(SourceContext);
  if (!ctx) {
    throw new Error('useSourcePanel must be used within a SourceProvider');
  }
  return ctx;
}
