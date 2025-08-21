'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshToken } from '../app/[locale]/register/refresh';
import { useTranslations } from 'next-intl';
import BASE_URL from '../app/[locale]/config';

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
  const t = useTranslations("sinolife");

  const handleAddToCart = async (productId: number) => {
    try {
      const url = `${BASE_URL}/api/cart/`;
      const access = localStorage.getItem('access');
      const payload = { cart_items: [{ product: productId, quantity: 1 }] };
      let response;
      try {
        response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' } });
      } catch (err: any) {
        if (err.response?.status === 401) {
          const newAccess = await refreshToken();
          if (!newAccess) { toast.error("Sessiya tugadi. Iltimos, qaytadan tizimga kiring."); return; }
          response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${newAccess}`, 'Content-Type': 'application/json' } });
        } else { toast.error(err.response?.data?.detail || 'Serverda xatolik'); return; }
      }
      if (response.data.status) { toast.success('✅ Mahsulot savatchaga qo‘shildi'); }
      else { toast.error('❌ Mahsulot qo‘shishda xatolik'); }
    } catch (error) { toast.error('Serverda xatolik'); console.error(error); }
  };

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

  // Skeleton card
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col h-full">
      <div className="w-full h-40 sm:h-48 md:h-40 lg:h-48 bg-gray-200"></div>
      <div className="p-3 flex flex-col flex-grow gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mt-auto"></div>
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-gray-50 relative">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("featured_product")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("featured_products_description")}</p>
        </div>

        {/* Kartalar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {loading
            ? Array.from({ length: 10 }).map((_, idx) => <SkeletonCard key={idx} />)
            : products.map((product) => {
                const hasDiscount = product.discounted_price && product.discounted_price !== product.price;
                const words = product.description.split(" ");
                const shortDesc = words.slice(0, 10).join(" ") + (words.length > 10 ? "..." : "");

                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer flex flex-col h-full hover:shadow-lg transition">
                      
                      <div className="relative w-full h-40 sm:h-48 md:h-40 lg:h-48 overflow-hidden">
                        <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                      </div>

                      <div className="p-3 flex flex-col flex-grow">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 line-clamp-2">{product.title}</h3>
                        <div className="mb-1 flex flex-col">
                          <span className="text-sm font-bold text-green-600">{product.price.toLocaleString('uz-UZ')} UZS</span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-500 line-through">{product.discounted_price.toLocaleString('uz-UZ')} UZS</span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm mt-1 text-gray-500">{shortDesc}</p>
                        <div className="flex flex-col sm:flex-row gap-1 mt-auto">
                          <button
                            onClick={(e) => { e.preventDefault(); handleAddToCart(product.id); }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 text-xs sm:text-sm rounded-lg font-semibold transition-colors"
                          >
                            {t("add_to_cart")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        <div className="text-center mt-8">
          <Link href="/products">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer">
              {t("view_all_product")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
