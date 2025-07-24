'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { useLanguage } from '@/lib/LanguageContext';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const [orderData, setOrderData] = useState<{
    id: string;
    created_at: string;
    status: string;
    payment_status: string;
  } | null>(null);

  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const id = searchParams.get('id');
    const created_at = searchParams.get('created_at');
    const status = searchParams.get('status');
    const payment_status = searchParams.get('payment_status');

    if (id && created_at && status && payment_status) {
      setOrderData({ id, created_at, status, payment_status });

      const date = new Date();
      date.setDate(date.getDate() + 5);
      setEstimatedDelivery(
        date.toLocaleDateString('uz-UZ', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    }
  }, [searchParams]);

  if (!orderData) return <div className="text-center py-20">Yuklanmoqda...</div>;

  const formattedCreatedAt = new Date(orderData.created_at).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const paymentStatusText = orderData.payment_status === 'paid' ? t("paid") : t("payment_status_value");
  const paymentStatusColor =
    orderData.payment_status === 'paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';

  const statusMap: { [key: string]: string } = {
    pending: t("pending"),
    processing: t("processing"),
    shipped: t("shipped"),
    delivered: t("delivered"),
    cancelled: t("cancelled"),
  };

  const orderStatusText = statusMap[orderData.status] || orderData.status;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-double-line text-green-600 text-4xl"></i>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("order_success_title")}</h1>
            <p className="text-xl text-gray-600 mb-6">
              {t("order_success_message")}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("order_number_label")}</h3>
                <p className="text-green-600 font-bold text-xl">{orderData.id}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("created_date_label")}</h3>
                <p className="text-gray-700">{formattedCreatedAt}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("delivery_date_label")}</h3>
                <p className="text-gray-700">{estimatedDelivery}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("payment_status_label")}</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColor}`}>
                  <i className="ri-check-line mr-1"></i>
                  {paymentStatusText}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("order_status_label")}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <i className="ri-settings-3-line mr-1"></i>
                  {orderStatusText}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/orders" 
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-file-list-3-line mr-2"></i>
              {t("my_orders_button")}
            </Link>

            <Link 
              href="/products" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              {t("continue_shopping_button")}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
