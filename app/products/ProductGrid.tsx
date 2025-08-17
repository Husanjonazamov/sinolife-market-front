'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshToken } from '../register/refresh';
import BASE_URL from '@/app/config';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter } from 'next/navigation';

type ProductType = {
  id: number;
  title: string;
  description: string;
  discounted_price: number;
  price: number;
  image: string;
  quantity: number;
  category?: { id: number; title: string };
};

interface ProductGridProps {
  filters: {
    category_ids: number[];
    min_price: number;
    max_price: number;
    q: string;
  };
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const { t } = useLanguage();
  const router = useRouter();

  const handleAddToCart = async (productId: number) => {
    try {
      const url = `${BASE_URL}/api/cart/`;
      let access = localStorage.getItem('access');
      const payload = { cart_items: [{ product: productId, quantity: 1 }] };
      let response;

      try {
        response = await axios.post(url, payload, {
          headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        if (err.response?.status === 401) {
          const newAccess = await refreshToken();
          if (!newAccess) {
            toast.error('Sessiya tugadi. Iltimos, qaytadan tizimga kiring.');
            return;
          }
          response = await axios.post(url, payload, {
            headers: { Authorization: `Bearer ${newAccess}`, 'Content-Type': 'application/json' },
          });
        } else {
          toast.error(err.response?.data?.detail || 'Serverda xatolik');
          return;
        }
      }

      if (response.data.status) toast.success('✅ Mahsulot savatchaga qo‘shildi');
      else toast.error('❌ Mahsulot qo‘shishda xatolik');
    } catch {
      toast.error('Serverda xatolik');
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url = `${BASE_URL}/api/product/`;
        const params: any = {};
        if (filters.category_ids.length > 0) params.category_ids = filters.category_ids.join(',');
        if (filters.min_price > 0) params.min_price = filters.min_price;
        if (filters.max_price > 0) params.max_price = filters.max_price;
        if (filters.q) params.q = filters.q;

        const response = await axios.get(url, { params });
        if (response.data.status) setProducts(response.data.data.results);
      } catch {
        toast.error('Mahsulotlarni olishda xatolik');
      }
    }

    fetchProducts();
  }, [filters]);

  return (
    <div className="px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />

      {products.length === 0 ? (
        <div className="relative h-[300px] flex justify-center items-center">
          {/* Shaffof pulsatsiya animatsiyasi */}
          <div className="absolute inset-0 bg-black/20 animate-pulse-slow rounded-xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-2 flex flex-col cursor-pointer"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden rounded-md">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <h3 className="mt-2 text-sm font-medium line-clamp-2 min-h-[36px]">{product.title}</h3>

              <div className="mt-1">
                <span className="text-base font-bold text-green-600">
                  {product.price.toLocaleString('uz-UZ')} UZS
                </span>
                {product.discounted_price && product.price !== product.discounted_price && (
                  <span className="block text-xs text-gray-400 line-through">
                    {product.discounted_price.toLocaleString('uz-UZ')} UZS
                  </span>
                )}
              </div>

              <div className="mt-auto flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product.id);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-xs"
                >
                  {t('add_to_cart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s infinite;
        }
      `}</style>
    </div>
  );
}
