'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Header() {  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, currency, setLanguage, setCurrency, t } = useLanguage();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Bosh harflarni olish funksiyasi (Sh, Ch maxsus holatlar bilan)
  const getInitials = (name: string): string => {
    const lower = name.toLowerCase().trim();

    if (lower.startsWith('sh')) return 'Sh';
    if (lower.startsWith('ch')) return 'Ch';

    // Oddiy bosh harf
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const access = localStorage.getItem('access');
    const firstName = localStorage.getItem('first_name');
    console.log(access)
    if (access && firstName) {
      setIsLoggedIn(true);
      setUserName(firstName);
    } else {
      setIsLoggedIn(false);
      setUserName(null);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'UZS', symbol: 'сўм' },
    { code: 'RUB', symbol: '₽' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <i className="ri-leaf-line text-white text-xl"></i>
          </div>
          <span className="text-2xl font-pacifico text-green-700">HerbaStore</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </form>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">{t('home')}</Link>
          <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">{t('products')}</Link>
          <Link href="/categories" className="text-gray-700 hover:text-green-600 transition-colors">{t('categories')}</Link>
          <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">{t('about')}</Link>
          <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">{t('contact')}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Lang & Currency */}
          <div className="hidden md:block relative">
            <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="flex items-center space-x-1 text-gray-700 hover:text-green-600">
              <span>{language.toUpperCase()}</span>
              <span className="text-xs text-gray-500">|</span>
              <span>{currency}</span>
              <i className="ri-arrow-down-s-line text-sm"></i>
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Language</div>
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code as any); setIsLanguageOpen(false); }}
                      className={`w-full flex items-center px-2 py-2 text-sm rounded ${language === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} hover:bg-gray-100`}>
                      <span>{lang.flag}</span><span className="ml-2">{lang.name}</span>
                    </button>
                  ))}

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Currency</div>
                    {currencies.map((curr) => (
                      <button key={curr.code} onClick={() => { setCurrency(curr.code as any); setIsLanguageOpen(false); }}
                        className={`w-full flex items-center justify-between px-2 py-2 text-sm rounded ${currency === curr.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} hover:bg-gray-100`}>
                        <span>{curr.code}</span><span>{curr.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Icon or Initials */}
          <Link href={isLoggedIn ? "/" : "/login"} className="p-2 text-gray-700 hover:text-green-600 transition-colors">
            {isLoggedIn && userName ? (
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold select-none">
                {getInitials(userName)}
              </div>
            ) : (
              <i className="ri-user-line text-xl"></i>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="p-2 text-gray-700 hover:text-green-600 relative">
            <i className="ri-shopping-cart-line text-xl"></i>
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </Link>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 border-t border-gray-100 bg-white">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </form>

          {/* Language & Currency (mobile) */}
          <div className="mb-4 space-y-2">
            <div className="text-xs text-gray-500 uppercase">Language</div>
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => { setLanguage(lang.code as any); }}
                className={`w-full flex items-center px-2 py-2 text-sm rounded ${language === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} hover:bg-gray-100`}>
                <span>{lang.flag}</span><span className="ml-2">{lang.name}</span>
              </button>
            ))}

            <div className="text-xs text-gray-500 uppercase mt-4">Currency</div>
            {currencies.map((curr) => (
              <button key={curr.code} onClick={() => { setCurrency(curr.code as any); }}
                className={`w-full flex items-center justify-between px-2 py-2 text-sm rounded ${currency === curr.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} hover:bg-gray-100`}>
                <span>{curr.code}</span><span>{curr.symbol}</span>
              </button>
            ))}
          </div>

          {/* Navigation Links (mobile) */}
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-gray-700 hover:text-green-600">{t('home')}</Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600">{t('products')}</Link>
            <Link href="/categories" className="text-gray-700 hover:text-green-600">{t('categories')}</Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600">{t('about')}</Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600">{t('contact')}</Link>
            {isLoggedIn ? (
              <Link href="/orders" className="text-gray-700 hover:text-green-600">{t('orders')}</Link>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-green-600">{t('login')}</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
