'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshToken } from '@/app/register/refresh';
import { useLanguage } from '@/lib/LanguageContext';


import BASE_URL from '@/app/config';


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

function getRandomItems<T>(arr: T[], n: number): T[] {
  const result: T[] = [];
  const taken = new Set<number>();
  while (result.length < n && result.length < arr.length) {
    const index = Math.floor(Math.random() * arr.length);
    if (!taken.has(index)) {
      taken.add(index);
      result.push(arr[index]);
    }
  }
  return result;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, setLanguage, t } = useLanguage();


  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${BASE_URL}/api/product/`);
        if (response.data.status) {
          const allProducts = response.data.data.results as ProductType[];
          const randomProducts = getRandomItems(allProducts, 10);
          setProducts(randomProducts);
        }
      } catch (error) {
        console.error('Mahsulotlarni olishda xatolik:', error);
        toast.error('Mahsulotlarni olishda xatolik');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      const url = `${BASE_URL}/api/cart/`;
      let access = localStorage.getItem('access');

      const payload = {
        cart_items: [
          {
            product: productId,
            quantity: 1
          }
        ]
      };

      let response;
      try {
        response = await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          // Token yangilash
          const newAccess = await refreshToken();
          if (!newAccess) {
            toast.error("Sessiya tugadi. Iltimos, qaytadan tizimga kiring.");
            return;
          }

          response = await axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${newAccess}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          console.error('Savatchaga qo‘shishda xatolik:', err);
          toast.error(err.response?.data?.detail || 'Serverda xatolik');
          return;
        }
      }

      if (response.data.status) {
        toast.success('✅ Mahsulot savatchaga qo‘shildi');
      } else {
        toast.error('❌ Mahsulot qo‘shishda xatolik');
      }

    } catch (error) {
      console.error('Savatchaga qo‘shishda xatolik:', error);
      toast.error('Serverda xatolik');
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          Yuklanmoqda...
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          Mahsulotlar topilmadi.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("featured_product")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("featured_products_description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <div className="w-full aspect-[4/3] bg-white">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain object-center"
                  />
                </div>

                <div className="absolute top-4 left-4 flex flex-col items-start gap-1">
                  {product.is_populer && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                      style={{ backgroundColor: '#0ef' }}>
                      {t("best_seller")}
                    </span>
                  )}
                  {product.is_new && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                      {t("new")}
                    </span>
                  )}
                  {product.is_discounted && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">
                      {t("sale")}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price
                        ? `${product.price.toLocaleString('uz-UZ')} UZS`
                        : `${product.price.toLocaleString('uz-UZ')} UZS`}
                    </span>
                    {product.discounted_price && product.discounted_price !== product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {product.discounted_price.toLocaleString('uz-UZ')} UZS
                      </span>
                    )}
                  </div>
                </div>


                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 text-xs sm:text-sm rounded-lg font-semibold transition-colors"
                  >
                    {t("add_to_cart")}
                  </button>
                  <button
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 text-xs sm:text-sm rounded-lg font-semibold transition-colors"
                  >
                    {t("order_now")}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
              {t("view_all_product")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
