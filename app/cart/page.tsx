'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFooterNav from '@/components/FooterNav';
import axios from 'axios';
import BASE_URL from '@/app/config';
import { refreshToken } from '../register/refresh';
import { updateCartItemQuantity, removeCartItem } from './cartServices';
import { useLanguage } from '@/lib/LanguageContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const { t } = useLanguage();
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Cart count olish
  useEffect(() => {
    const access = localStorage.getItem('access');
    if (access) {
      axios
        .get(`${BASE_URL}/api/cart/`, {
          headers: { Authorization: `Bearer ${access}` },
        })
        .then((res) => {
          const results = res.data.data.results;
          if (results.length > 0) {
            const cart = results[0];
            setCartCount(cart.cart_items_count);
          }
        })
        .catch((err) => console.error('Cart olishda xatolik:', err));
    }
  }, []);

  const fetchCart = async () => {
    let access = localStorage.getItem('access');

    // Agar foydalanuvchi login qilmagan bo‘lsa
    if (!access) {
      router.push('/login');
      return;
    }

    try {
      let response;
      try {
        response = await axios.get(`${BASE_URL}/api/cart/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          const newAccess = await refreshToken();
          if (!newAccess) {
            router.push('/login');
            return;
          }
          response = await axios.get(`${BASE_URL}/api/cart/`, {
            headers: { Authorization: `Bearer ${newAccess}` },
          });
        } else {
          throw err;
        }
      }

      const apiCartItems = response.data.data.results[0]?.cart_items || [];

      const formattedItems: CartItem[] = apiCartItems.map((item: any) => ({
        id: item.id,
        name: item.product.title,
        price: item.product.discounted_price,
        originalPrice:
          item.product.price !== item.product.discounted_price
            ? item.product.price
            : undefined,
        image: item.product.image,
        quantity: item.quantity,
        category: item.product.category?.title || "Noma'lum",
      }));

      setCartItems(formattedItems);
    } catch (err) {
      console.error("Savatni olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItemQuantity(id, newQuantity);
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert('Miqdorni yangilashda xatolik yuz berdi');
    }
  };

  const removeItem = async (id: string) => {
    try {
      await removeCartItem(id);
      setCartItems(items => items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Mahsulotni o‘chirishda xatolik yuz berdi');
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(0.1);
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(0.2);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.originalPrice ?? item.price;
    return total + price * item.quantity;
  }, 0);

  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto'>
        <Header />

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-16 text-gray-500">Yuklanmoqda...</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t("empty_cart_title")}</h2>
              <p className="text-gray-500 mb-8">{t("empty_cart_subtitle")}</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="ri-shopping-bag-line mr-2"></i>
                {t("continue_shopping")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Savat mahsulotlari */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {t("cart_items_title")} ({cartItems.length})
                  </h2>

                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row md:items-center md:space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center space-x-4 w-full">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="mt-2">
                            <div className="text-base font-bold text-teal-700">
                              {item.name}
                            </div>
                            <div className="flex items-center">
                              {item.originalPrice && (
                                <span className="text-lg font-semibold text-green-600">
                                  {item.originalPrice.toLocaleString('uz-UZ')} UZS
                                </span>
                              )}
                              {item.price && (
                                <span className="ml-2 text-sm text-gray-400 line-through">
                                  {item.price.toLocaleString('uz-UZ')} UZS
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 md:mt-0 md:justify-end w-full md:w-auto space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <i className="ri-subtract-line text-gray-600"></i>
                            </button>
                            <span className="min-w-[30px] text-center font-medium text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <i className="ri-add-line text-gray-600"></i>
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <i className="ri-delete-bin-line text-xl"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Jami narx */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("subtotal")}</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("subtotal")}</span>
                      <span className="font-medium">{subtotal.toLocaleString('uz-UZ')} UZS</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Chegirma ({(discount * 100).toFixed(0)}%)</span>
                        <span>-{discountAmount.toLocaleString('uz-UZ')} UZS</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>{t("total")}</span>
                        <span>{total.toLocaleString('uz-UZ')} UZS</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-center block"
                  >
                    {t("proceed_to_checkout")}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
        <MobileFooterNav cartCount={cartCount} />
      </div>
    </div>
  );
}
