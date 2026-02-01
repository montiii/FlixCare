import React, { createContext, useContext } from 'react';
import { de, Translations } from './de';

const TranslationContext = createContext<Translations>(de);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TranslationContext.Provider value={de}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};
