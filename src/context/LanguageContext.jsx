import React, { createContext, useContext, useState, useCallback } from 'react';
import { getTranslation } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('aa_lang') || 'en');

  const changeLang = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('aa_lang', newLang);
  }, []);

  const t = useCallback((key) => getTranslation(lang, key), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
}
