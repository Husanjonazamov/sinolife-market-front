'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '@/app/config';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';

export default function SearchDropdown() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      axios
        .get(`${BASE_URL}/api/products/?search=${encodeURIComponent(searchQuery)}`)
        .then(res => {
          // Agar API results ichida data bo'lsa
          const products = res.data.results || res.data;
          setResults(products);
          setIsOpen(true);
        })
        .catch(err => console.error(err));
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder={t('product_search')}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
      />
      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-md max-h-80 overflow-y-auto z-50">
          {results.length > 0 ? (
            results.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center space-x-2 p-2 hover:bg-green-50 transition"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{product.title}</span>
                  <span className="text-xs text-gray-500">{product.price} UZS</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">{t('no_products_found') || 'Yo‘q'}</div>
          )}
        </div>
      )}
    </div>
  );
}
