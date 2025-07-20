
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

const translations = {
  en: {
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    about: 'About',
    contact: 'Contact',
    search: 'Search products...',
    login: 'Login',
    orders: 'My Orders',
    cart: 'Cart',
    register: 'Register'
  },
  uz: {
    home: 'Bosh sahifa',
    products: 'Mahsulotlar',
    categories: 'Kategoriyalar',
    about: 'Biz haqimizda',
    contact: 'Aloqa',
    search: 'Mahsulotlarni qidiring...',
    login: 'Kirish',
    orders: 'Mening buyurtmalarim',
    cart: 'Savatcha',
    register: "Ro'yxatdan o'tish"
  },
  ru: {
    home: 'Главная',
    products: 'Продукты',
    categories: 'Категории',
    about: 'О нас',
    contact: 'Контакты',
    search: 'Поиск товаров...',
    login: 'Войти',
    orders: 'Мои заказы',
    cart: 'Корзина',
    register: 'Регистрация'
  }
};

const currencyMap: { [key in Language]: Currency } = {
  en: 'USD',
  uz: 'UZS',
  ru: 'RUB'
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    const savedCurrency = localStorage.getItem('currency') as Currency;
    
    if (savedLang && ['en', 'uz', 'ru'].includes(savedLang)) {
      setLanguage(savedLang);
    }
    
    if (savedCurrency && ['USD', 'UZS', 'RUB'].includes(savedCurrency)) {
      setCurrency(savedCurrency);
    } else if (savedLang) {
      setCurrency(currencyMap[savedLang]);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setCurrency(currencyMap[lang]);
    localStorage.setItem('language', lang);
    localStorage.setItem('currency', currencyMap[lang]);
  };

  const handleSetCurrency = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('currency', curr);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currency,
        setLanguage: handleSetLanguage,
        setCurrency: handleSetCurrency,
        t
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
