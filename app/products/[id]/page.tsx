'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/app/config';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFooterNav from '@/components/FooterNav';
import { Minus, Plus, ShoppingCart, Zap } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshToken } from '@/app/register/refresh';
import { useLanguage } from '@/lib/LanguageContext';
import CommentSection from '../CommentSection';

interface Category {
  id: number;
  title: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

interface Comment {
  id: number;
  user: User;
  product: number;
  message: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  discounted_price: number;
  price: number;
  image: string;
  quantity: number;
  category: Category;
  images: string[];
  comments: Comment[]; // 🔑 qo‘shildi
}

interface ProductDetailProps {
  params: { id: string };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const { id } = params;
  const { t } = useLanguage();

  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);

  // Mahsulotni olish
  useEffect(() => {
    axios.get(`${BASE_URL}/api/product/${id}/`)
      .then(res => {
        if (res.data.status) {
          setProduct(res.data.data);
          setMainImage(res.data.data.image);
        }
      })
      .catch(err => console.error(t('fetch_product_error'), err))
      .finally(() => setLoading(false));
  }, [id]);

  // Savatdagi itemlarni olish
  useEffect(() => {
    const access = localStorage.getItem('access');
    if (access) {
      axios.get(`${BASE_URL}/api/cart/`, { headers: { Authorization: `Bearer ${access}` } })
        .then(res => {
          const results = res.data.data.results;
          if (results.length > 0) {
            setCartCount(results[0].cart_items_count);
          }
        })
        .catch(err => console.error(t('fetch_cart_error'), err));
    }
  }, []);

  // Savatga qo‘shish
  const handleAddToCart = async () => {
    const access = localStorage.getItem('access');
    if (!access) {
      toast.error(t('login_required'));
      return;
    }

    const payload = { cart_items: [{ product: product?.id, quantity: count }] };
    let response;

    try {
      response = await axios.post(`${BASE_URL}/api/cart/`, payload, {
        headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        const newAccess = await refreshToken();
        if (!newAccess) {
          toast.error(t('session_expired'));
          return;
        }
        response = await axios.post(`${BASE_URL}/api/cart/`, payload, {
          headers: { Authorization: `Bearer ${newAccess}`, 'Content-Type': 'application/json' },
        });
      } else {
        toast.error(err.response?.data?.detail || t('add_error'));
        return;
      }
    }

    if (response.data.status) {
      toast.success(t('added_to_cart'));
      setCartCount(prev => prev + count);
    } else {
      toast.error(t('add_error'));
    }
  };

  // Hozirroq buyurtma
  const handleOrderNow = () => {
    if (!product) return;

    const orderData = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      discounted_price: product.discounted_price,
      image: product.image,
      images: product.images,
      category: product.category,
      quantity: count,
    };

    localStorage.setItem('order_now', JSON.stringify(orderData));
    router.push('/order_now');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-600">
        {t('not_found')}
      </div>
    );
  }

  const discountPercent =
    product.discounted_price && product.discounted_price !== product.price
      ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="px-3 sm:px-4 max-w-full sm:max-w-7xl mx-auto w-full">
        <Header />
        <ToastContainer position="top-right" autoClose={2000} />

        <main className="flex-1">
          <div className="px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Rasm qismi */}
              <div>
                <Image
                  src={mainImage || product.image}
                  alt={product.title}
                  width={400}
                  height={400}
                  className="w-full h-[320px] sm:h-[400px] object-contain rounded-2xl shadow-md bg-white"
                />
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {[product.image, ...product.images].map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`product-${index}`}
                      width={96}
                      height={96}
                      className={`object-cover rounded-lg cursor-pointer border-2 transition ${mainImage === img ? 'border-green-600' : 'border-transparent'}`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              </div>

              {/* Mahsulot ma'lumotlari */}
              <div>
                <h1 className="text-xl sm:text-3xl font-bold mb-4">{product.title}</h1>
                <p className="text-sm text-gray-500 mb-2">
                  {t('category')}: <span className="font-semibold">{product.category.title}</span>
                </p>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 flex-wrap">
                  {product.discounted_price && product.discounted_price !== product.price ? (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-green-600">
                        {product.discounted_price.toLocaleString('uz-UZ')} UZS
                      </span>
                      <span className="text-base sm:text-lg line-through text-gray-400">
                        {product.price.toLocaleString('uz-UZ')} UZS
                      </span>
                      {discountPercent > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 text-xs sm:text-sm rounded-lg">
                          -{discountPercent}%
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-green-600">
                      {product.price.toLocaleString('uz-UZ')} UZS
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setCount(c => (c > 1 ? c - 1 : 1))} className="p-2 border rounded-lg">
                    <Minus />
                  </button>
                  <span className="text-lg sm:text-xl font-semibold">{count}</span>
                  <button onClick={() => setCount(c => (c < product.quantity ? c + 1 : c))} className="p-2 border rounded-lg">
                    <Plus />
                  </button>
                  <span className="text-xs sm:text-sm text-gray-500">({count} {t('available')})</span>
                </div>

                {/* Tavsif (45 ta so‘z) */}
                <div className='mb-4'>
                  {product.description.split(' ').slice(0, 45).join(' ') + '...'}
                </div>

                {/* Desktop tugmalar */}
                <div className="hidden sm:flex flex-row gap-3 sm:gap-4 mb-6">
                  <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 sm:px-6 rounded-2xl shadow hover:bg-blue-700 transition w-full">
                    <ShoppingCart /> {t('add_to_cart')}
                  </button>
                  <button onClick={handleOrderNow} className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 sm:px-6 rounded-2xl shadow hover:bg-green-700 transition w-full">
                    <Zap /> {t('order_now')}
                  </button>
                </div>
              </div>
            </div>

            {/* Mahsulot haqida */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 text-justify">
              <h2 className="text-xl font-bold mb-3 text-green-700">{t('about_product')}</h2>
              <p className="text-gray-800 text-base leading-relaxed">
                {product.description}
              </p>
            </div>




            {/* Commentlar */}
          </div>
        </main>

            <CommentSection productId={product.id} initialComments={product.comments || []} />

        {/* Mobile fixed tugmalar */}
        <div className="sm:hidden fixed bottom-16 left-0 w-full p-3 bg-white z-50 shadow flex gap-2">
          <button 
            onClick={handleAddToCart} 
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-2 py-2 rounded-2xl shadow hover:bg-blue-700 transition text-lg font-bold"
          >
            <ShoppingCart size={18}/> {t('cart')}
          </button>
          <button 
            onClick={handleOrderNow} 
            className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white px-2 py-2 rounded-2xl shadow hover:bg-green-700 transition text-lg font-bold"
          >
            <Zap size={18}/> {t('order')}
          </button>
        </div>

        <Footer />
        <MobileFooterNav cartCount={cartCount} />
      </div>
    </div>
  );
}
