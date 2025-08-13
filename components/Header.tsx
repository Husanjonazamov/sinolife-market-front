'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import axios from 'axios';
import BASE_URL from '@/app/config';
import { useRouter } from 'next/navigation';
import SearchDropdown from './searchDropDown';

export default function Header() {  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('first_name');
    setIsLoggedIn(false);
    setUserName(null);
    setIsUserMenuOpen(false);
    router.push('/login');
  };

  const getInitials = (name: string): string => {
    const lower = name.toLowerCase().trim();
    if (lower.startsWith('sh')) return 'Sh';
    if (lower.startsWith('ch')) return 'Ch';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const access = localStorage.getItem('access');
    const firstName = localStorage.getItem('first_name');

    if (access && firstName) {
      setIsLoggedIn(true);
      setUserName(firstName);

      axios.get(`${BASE_URL}/api/cart/`, {
        headers: { Authorization: `Bearer ${access}` }
      })
      .then(res => {
        const results = res.data.data.results;
        if (results.length > 0) {
          const cart = results[0];
          setCartCount(cart.cart_items_count);
        }
      })
      .catch(err => {
        console.error("Cart olishda xatolik:", err);
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-toggle')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const languages = [
    // { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <i className="ri-leaf-line text-white text-xl"></i>
          </div>
          <span className="text-2xl font-pacifico text-green-700">SinoLife</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchDropdown />
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-green-600">{t('home')}</Link>
          <Link href="/products" className="text-gray-700 hover:text-green-600">{t('product')}</Link>
          <Link href="/categories" className="text-gray-700 hover:text-green-600">{t('categories')}</Link>
          <Link href="/contact" className="text-gray-700 hover:text-green-600">{t('contact')}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">

          {/* Language */}
          <div className="hidden md:block relative">
            <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="flex items-center space-x-1 text-gray-700 hover:text-green-600">
              <span>{language.toUpperCase()}</span>
              <i className="ri-arrow-down-s-line text-sm"></i>
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">{t("lang")}</div>
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code as any); setIsLanguageOpen(false); }}
                      className={`w-full flex items-center px-2 py-2 text-sm rounded ${language === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} hover:bg-gray-100`}>
                      <span>{lang.flag}</span><span className="ml-2">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User */}
        <div className="relative">
              {isLoggedIn && userName ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold select-none user-menu-toggle shadow-md hover:brightness-110 transition"
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                  aria-label="User menu"
                >
                  {getInitials(userName)}
                </button>
              ) : (
                <Link href="/login" className="p-2 text-gray-700 hover:text-green-600 transition-colors">
                  <i className="ri-user-line text-xl"></i>
                </Link>
              )}

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push('/orders');
                    }}
                    className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors focus:outline-none focus:bg-green-100 focus:text-green-800 border-t border-gray-200"
                  >
                    <span>{t("my_orders")}</span>
                    <i className="ri-shopping-bag-line text-lg"></i>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:outline-none focus:bg-red-100 focus:text-red-800"
                  >
                    <span>{t("logout")}</span>
                    <i className="ri-logout-box-r-line text-lg"></i>
                  </button>
                </div>
              )}
            </div>

          {/* Cart */}
          <Link href="/cart" className="p-2 text-gray-700 hover:text-green-600 relative">
            <i className="ri-shopping-cart-line text-xl"></i>
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
          </Link>

          {/* Mobile menu icon */}
          <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 border-t border-gray-100 bg-white">
         <div className='mb-6'>
         <SearchDropdown/>
         </div>
          <div className="mb-4 space-y-2">
            <div className="text-xs text-gray-500 uppercase">{t("lang")}</div>
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => setLanguage(lang.code as any)}
                className={`w-full flex items-center px-2 py-2 text-sm rounded ${language === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} hover:bg-gray-100`}>
                <span>{lang.flag}</span><span className="ml-2">{lang.name}</span>
              </button>
            ))}
          </div>

          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-gray-700 hover:text-green-600">{t('home')}</Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600">{t('products')}</Link>
            <Link href="/categories" className="text-gray-700 hover:text-green-600">{t('categories')}</Link>
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
