'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'uz' | 'ru';
type Currency = 'USD' | 'UZS' | 'RUB';

interface LanguageContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const currencyMap: { [key in Language]: Currency } = {
  en: 'USD',
  uz: 'UZS',
  ru: 'RUB',
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('uz');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    const savedCurrency = localStorage.getItem('currency') as Currency;

    const lang = savedLang && ['en', 'uz', 'ru'].includes(savedLang) ? savedLang : 'uz';
    const curr = savedCurrency && ['USD', 'UZS', 'RUB'].includes(savedCurrency)
      ? savedCurrency
      : currencyMap[lang];

    setLanguage(lang);
    setCurrency(curr);
    loadTranslations(lang);
  }, []);

  const loadTranslations = async (lang: Language) => {
    try {
      const res = await fetch(`/locales/${lang}/translation.json`);
      const data = await res.json();
      setTranslations(data);
    } catch (error) {
      console.error('Tarjimalarni yuklashda xatolik:', error);
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setCurrency(currencyMap[lang]);
    localStorage.setItem('language', lang);
    localStorage.setItem('currency', currencyMap[lang]);
    loadTranslations(lang);
  };

  const handleSetCurrency = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('currency', curr);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currency,
        setLanguage: handleSetLanguage,
        setCurrency: handleSetCurrency,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
