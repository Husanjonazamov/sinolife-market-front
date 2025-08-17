'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BASE_URL from '../config';
import axios from 'axios';
import { refreshToken } from '../register/refresh';

import { useLanguage } from '@/lib/LanguageContext';

interface OrderItem {
  id: number;
  product: {
    id: number;
    title: string;
    image: string;
    price: number;
    discounted_price: number;
  };
  quantity: number;
}

interface Order {
  id: number;
  status: string; // pending, accepted, rejected, completed va hokazo
  total: string;  // API string sifatida kelyapti
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'completed'>('all');

  // Narxni so'm formatida, minglik ajratgich bilan chiqaruvchi funksiya
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + " UZS";
  };

  const fetchOrders = async () => {
    setLoading(true);
    let access = localStorage.getItem('access');
    const url = `${BASE_URL}/api/order/me/`;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setOrders(res.data?.data || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        access = await refreshToken();
        if (access) {
          const retryRes = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });
          setOrders(retryRes.data?.data || []);
        }
      } else {
        console.error('Buyurtmalarni olishda xatolik:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Frontendda status bo‘yicha filtr qilish va kamayuvchi tartibda saralash
  const filteredOrders =
    activeTab === 'all' 
      ? [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      : orders
          .filter(order => order.status === activeTab)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Statusga mos rang klasslarini beruvchi funksiya
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Statusga mos ikonani beruvchi funksiya
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'ri-time-line';
      case 'accepted':
        return 'ri-checkbox-circle-line';
      case 'rejected':
        return 'ri-close-circle-line';
      case 'completed':
        return 'ri-check-line';
      default:
        return 'ri-information-line';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto'>

        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("my_orders_title")}</h1>
            <p className="text-gray-600">{t("my_orders_subtitle")}</p>
          </div>

          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {[
                { key: 'all', label: t("filter_all") },
                { key: 'pending', label: t("filter_pending") },
                { key: 'accepted', label: t("filter_accepted") },
                { key: 'rejected', label: t("filter_rejected") },
                // { key: 'completed', label: 'Tugatildi' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-600">Yuklanmoqda...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t("no_orders")}</h2>
              <p className="text-gray-500 mb-8">{t("start_shopping")}</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-shopping-bag-line mr-2"></i>
                {t("shop_now")}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t("checkout_title")} #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {t("order_date_label")}: {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <i className={`${getStatusIcon(order.status)} mr-1`}></i>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(parseFloat(order.total))}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.product.title}</h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
        </div>
    </div>
  );
}
