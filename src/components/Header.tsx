'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../app/[locale]/config';
import { useRouter, usePathname } from 'next/navigation';
import SearchDropdown from './searchDropDown';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("sinolife");
  const locale = useLocale();

  const languages = [
    { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('first_name');
    setIsLoggedIn(false);
    setUserName(null);
    setIsUserMenuOpen(false);
    router.push(`/${locale}/login`);
  };

  const getInitials = (name: string): string => {
    const lower = name.toLowerCase().trim();
    if (lower.startsWith('sh')) return 'Sh';
    if (lower.startsWith('ch')) return 'Ch';
    return name.charAt(0).toUpperCase();
  };

  const changeLanguage = (lang: string) => {
    const segments = pathname.split('/');
    segments[1] = lang; // birinchi segmentni almashtiramiz
    router.push(segments.join('/'));
  };

  useEffect(() => {
    const access = localStorage.getItem('access');
    const firstName = localStorage.getItem('first_name');

    if (access && firstName) {
      setIsLoggedIn(true);
      setUserName(firstName);

      axios
        .get(`${BASE_URL}/api/cart/`, { headers: { Authorization: `Bearer ${access}` } })
        .then(res => {
          const results = res.data.data.results;
          if (results.length > 0) {
            const cart = results[0];
            setCartCount(cart.cart_items_count);
          }
        })
        .catch(err => console.error('Cart olishda xatolik:', err));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-toggle')) setIsUserMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="top-0 z-50">
      {/* Top bar (desktop) */}
      <div className="hidden md:flex bg-zinc-100 rounded-sm text-zinc-700 text-sm py-1">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs sm:text-sm">
          <div className="flex space-x-2 md:space-x-4">
            <span>📞 +998 55 500 77 27</span>
          </div>
          <div className="flex space-x-2 md:space-x-4">
            <a href="mailto:sinolifeuz@gmail.com" className="hover:underline">✉ sinolifeuz@gmail.com</a>
            <Link href={`/${locale}/contact`} className="hover:underline">{t('contact')}</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2 pl-2">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-semibold text-green-700">SINOLIFE</span>
          </div>
          <div className="w-14 h-14 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="SinoLife Logo"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
          </div>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-[180px] md:max-w-md mx-4">
          <SearchDropdown />
        </div>

        {/* Navigation (desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href={`/${locale}`} className="text-gray-700 hover:text-green-600">{t('home')}</Link>
          <Link href={`/${locale}/products`} className="text-gray-700 hover:text-green-600">{t('products')}</Link>
          <Link href={`/${locale}/categories`} className="text-gray-700 hover:text-green-600">{t('categories')}</Link>
          <Link href={`/${locale}/contact`} className="text-gray-700 hover:text-green-600">{t('contact')}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3 md:space-x-4 ml-8">
          {/* Language switcher */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600"
            >
              <span>{locale.toUpperCase()}</span>
              <i className="ri-arrow-down-s-line text-sm"></i>
            </button>
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">{t("lang")}</div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { changeLanguage(lang.code); setIsLanguageOpen(false); }}
                      className={`w-full flex items-center px-2 py-2 text-sm rounded ${locale === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} hover:bg-gray-100`}
                    >
                      <span>{lang.flag}</span>
                      <span className="ml-2">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            {isLoggedIn && userName ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold select-none user-menu-toggle shadow-md hover:brightness-110 transition"
              >
                {getInitials(userName)}
              </button>
            ) : (
              <Link href={`/${locale}/login`} className="p-2 text-gray-700 hover:text-green-600 transition-colors">
                <i className="ri-user-line text-xl"></i>
              </Link>
            )}

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => { setIsUserMenuOpen(false); router.push(`/${locale}/orders`); }}
                  className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <span>{t("my_orders")}</span>
                  <i className="ri-shopping-bag-line text-lg"></i>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <span>{t("logout")}</span>
                  <i className="ri-logout-box-r-line text-lg"></i>
                </button>
              </div>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={() => router.push(`/${locale}/cart`)}
            className="hidden md:flex p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition relative items-center"
          >
            <i className="ri-shopping-cart-line text-xl"></i>
            <span className="ml-2 font-medium">{t("cart")}</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            )}
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 border-t border-gray-100 bg-white space-y-4">
          <div>
            <SearchDropdown />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500 uppercase">{t("lang")}</div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { changeLanguage(lang.code); setIsMenuOpen(false); }}
                className={`w-full flex items-center px-2 py-2 text-sm rounded ${locale === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} hover:bg-gray-100`}
              >
                <span>{lang.flag}</span>
                <span className="ml-2">{lang.name}</span>
              </button>
            ))}
          </div>
          <nav className="flex flex-col space-y-4">
            <Link href={`/${locale}`} className="text-gray-700 hover:text-green-600">{t('home')}</Link>
            <Link href={`/${locale}/products`} className="text-gray-700 hover:text-green-600">{t('products')}</Link>
            <Link href={`/${locale}/categories`} className="text-gray-700 hover:text-green-600">{t('categories')}</Link>
            <Link href={`/${locale}/contact`} className="text-gray-700 hover:text-green-600">{t('contact')}</Link>
            {isLoggedIn ? (
              <Link href={`/${locale}/orders`} className="text-gray-700 hover:text-green-600">{t('orders')}</Link>
            ) : (
              <Link href={`/${locale}/login`} className="text-gray-700 hover:text-green-600">{t('login')}</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
