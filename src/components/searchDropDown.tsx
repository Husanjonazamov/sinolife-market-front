'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../app/[locale]/config';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { refreshToken } from '../app/[locale]/register/refresh';


import Image from 'next/image';
import { useTranslations } from 'next-intl';

type ProductType = {
  id: number;
  title: string;
  description: string;
  discounted_price: number;
  price: number;
  image: string;
  quantity: number;
  is_populer: boolean;
  is_new: boolean;
  is_discounted: boolean;
};

export default function SearchDropdown() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ProductType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("sinolife");
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Click outside uchun
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Search
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
          const products = res.data.results || res.data;
          setResults(products);
          setIsOpen(true);
        })
        .catch(err => {
          console.error("Search error:", err);
        });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Savatchaga qo‘shish
  const handleAddToCart = async (productId: number) => {
    try {
      const url = `${BASE_URL}/api/cart/`;
      const access = localStorage.getItem('access');
      const payload = { cart_items: [{ product: productId, quantity: 1 }] };
      let response;

      try {
        response = await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          const newAccess = await refreshToken();
          if (!newAccess) {
            toast.error("Sessiya tugadi. Qayta kiring.");
            return;
          }
          response = await axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${newAccess}`,
              'Content-Type': 'application/json',
            },
          });
        } else {
          toast.error(err.response?.data?.detail || 'Server xatoligi');
          return;
        }
      }

      if (response?.data?.status) {
        toast.success('✅ Savatchaga qo‘shildi');
      } else {
        toast.error('❌ Qo‘shishda xatolik');
      }
    } catch {
      toast.error('Server xatoligi');
    }
  };

  // Mahsulot ustiga bosilganda detail page ga o‘tish
  const handleGoToDetail = (product: ProductType) => {
    router.push(`/products/${product.id}`);
  };

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
              <div
                key={product.id}
                className="flex items-center space-x-2 p-2 hover:bg-green-50 transition cursor-pointer"
              >
                <Image
                  src={product.image || '/placeholder.png'}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="object-cover rounded cursor-pointer"
                  onClick={() => handleGoToDetail(product)}
                />
                <div className="flex flex-col flex-1">
                  <span
                    className="text-sm font-medium text-gray-800 cursor-pointer"
                    onClick={() => handleGoToDetail(product)}
                  >
                    {product.title}
                  </span>
                  <span className="text-xs text-green-600 font-bold">
                    {product.price.toLocaleString('uz-UZ')} UZS
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
                >
                  {t("add_to_cart")}
                </button>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">
              {t('no_products_found') || 'Yo‘q'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
