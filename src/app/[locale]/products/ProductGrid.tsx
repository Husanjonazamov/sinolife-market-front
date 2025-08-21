'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshToken } from '../register/refresh';
import BASE_URL from '../config';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type ProductType = {
  id: number;
  title: string;
  description: string;
  discounted_price: number;
  price: number;
  image: string;
  quantity: number;
  category?: { id: number; title: string };
  brand?: { id: number; title: string };
};

interface ProductGridProps {
  filters: {
    category_ids: number[];
    min_price: number;
    max_price: number;
    q: string;
    brand?: string;
  };
}

// Skeleton card
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow animate-pulse overflow-hidden p-2 flex flex-col">
    <div className="w-full aspect-square bg-gray-200 rounded-md mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="flex gap-1 mt-auto">
      <div className="flex-1 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function ProductGrid({ filters }: ProductGridProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("sinolife");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAddToCart = async (productId: number) => {
    try {
      const url = `${BASE_URL}/api/cart/`;
      const access = localStorage.getItem('access');
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
      setLoading(true);
      try {
        const url = `${BASE_URL}/api/product/`;
        const params: any = {};

        if (filters.category_ids.length > 0) params.category_ids = filters.category_ids.join(',');
        if (filters.min_price > 0) params.min_price = filters.min_price;
        if (filters.max_price > 0) params.max_price = filters.max_price;
        if (filters.q) params.q = filters.q;
        if (filters.brand) params.brand = filters.brand;

        const response = await axios.get(url, { params });
        if (response.data.status) setProducts(response.data.data.results);
      } catch {
        toast.error('Mahsulotlarni olishda xatolik');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters]);

  // Brand yoki product-ga bosilganda page ga o'tish
  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, idx) => <SkeletonCard key={idx} />)
          : products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-2 flex flex-col cursor-pointer"
                onClick={() => handleProductClick(product.id)}
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
    </div>
  );
}
