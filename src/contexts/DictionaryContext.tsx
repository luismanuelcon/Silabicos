import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { DictionaryService } from '../types/dictionary';
import type { SyllableData } from '../types/dictionary';
import { createDictionaryService } from '../services/dictionaryService';
import dictionaryData from '../data/dictionary.json';

const DictionaryContext = createContext<DictionaryService | null>(null);

function useDictionary(): DictionaryService {
  const context = useContext(DictionaryContext);
  if (context === null) {
    throw new Error(
      'useDictionary must be used within a DictionaryProvider',
    );
  }
  return context;
}

function DictionaryProvider({ children }: { children: ReactNode }) {
  const service = useMemo(
    () => createDictionaryService(dictionaryData as SyllableData[]),
    [],
  );

  return (
    <DictionaryContext.Provider value={service}>
      {children}
    </DictionaryContext.Provider>
  );
}

export { DictionaryProvider, useDictionary };
