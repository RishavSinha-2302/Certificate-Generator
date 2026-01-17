"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { CsvData, Mapping, Template } from '@/lib/types';

interface CertiFireContextType {
  csvData: CsvData | null;
  setCsvData: (data: CsvData | null) => void;
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template | null) => void;
  mappings: Mapping[];
  setMappings: (mappings: Mapping[]) => void;
}

const CertiFireContext = createContext<CertiFireContextType | undefined>(undefined);

export function CertiFireProvider({ children }: { children: ReactNode }) {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const value = {
    csvData,
    setCsvData,
    selectedTemplate,
    setSelectedTemplate,
    mappings,
    setMappings,
  };

  return (
    <CertiFireContext.Provider value={value}>
      {children}
    </CertiFireContext.Provider>
  );
}

export function useCertiFire() {
  const context = useContext(CertiFireContext);
  if (context === undefined) {
    throw new Error('useCertiFire must be used within a CertiFireProvider');
  }
  return context;
}
