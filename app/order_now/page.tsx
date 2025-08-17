'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import axios from 'axios';
import BASE_URL from '@/app/config';
import { refreshToken } from '../register/refresh';
import { IMaskInput } from 'react-imask';
import { useLanguage } from '@/lib/LanguageContext';
import dynamic from 'next/dynamic';
import MobileFooterNav from '@/components/FooterNav';

const CustomSearchMap = dynamic(() => import('../checkout/location'), {
  ssr: false,
});

interface OrderItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  quantity: number;
}

interface ShippingInfo {
  firstName: string;
  phone: string;
  region: string;
  district: string;
  address: string;
}

export default function OrderNowPage() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('payme');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    phone: '',
    region: '',
    district: '',
    address: '',
  });
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from API
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

  // Fetch order item from localStorage
  const fetchOrderItemFromLocal = () => {
    setLoading(true);
    try {
      const savedOrder = localStorage.getItem('order_now');
      if (savedOrder) {
        const orderData: OrderItem = JSON.parse(savedOrder);
        setOrderItem(orderData);
      } else {
        setError('No order data found in localStorage.');
      }
    } catch (err) {
      setError('Failed to load order from localStorage.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderItemFromLocal();
  }, []);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const access = await refreshToken();
      if (!access) throw new Error('Authentication failed');

      const orderData = {
        first_name: shippingInfo.firstName,
        phone: shippingInfo.phone,
        payment_type: paymentMethod,
        region: shippingInfo.region,    
        district: shippingInfo.district,
        order_item: [
          {
            product: orderItem?.id,
            quantity: orderItem?.quantity,
          },
        ],
        address: shippingInfo.address,
      };


      console.log('Order Payload:', JSON.stringify(orderData, null, 2));

      const response = await axios.post(`${BASE_URL}/api/order/`, orderData, {
        headers: { Authorization: `Bearer ${access}` },
      });

      const { pay_link } = response.data.data;

      if (pay_link) {
        window.location.href = pay_link;
      } else {
        alert('Toʻlov havolasi topilmadi.');
      }
    } catch (error: any) {
      console.error('Order Error:', error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        Object.values(error.response?.data || {}).join(', ') ||
        'Buyurtma yuborishda xatolik yuz berdi.';
      alert(`Xatolik: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">{error}</div>
    );
  }

  if (!orderItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No order data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='px-3 sm:px-4 max-w-full sm:max-w-7xl mx-auto w-full'>
        
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('order_now_title')}</h1>
          <div className="flex items-center space-x-4">
            <StepIndicator step={currentStep} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingForm
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <PaymentForm
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                shippingInfo={shippingInfo}
                cartItems={[orderItem]} // Pass orderItem as cartItems for compatibility
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <ReviewOrder
                shippingInfo={shippingInfo}
                cartItems={[{
                  id: orderItem.id.toString(),
                  name: orderItem.title,
                  price: orderItem.price,
                  quantity: orderItem.quantity,
                  image: orderItem.image,
                }]}
                paymentMethod={paymentMethod}
                onBack={() => setCurrentStep(2)}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={[{
                id: orderItem.id.toString(),
                name: orderItem.title,
                price: orderItem.price,
                quantity: orderItem.quantity,
                image: orderItem.image,
              }]}
            />
          </div>
        </div>
      </div>
      <Footer />
      <MobileFooterNav cartCount={cartCount} />
      </div>
    </div>
  );
}

// --- Components ---

const StepIndicator = ({ step }: { step: number }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center">
      {[t('shipping'), t('payment'), t('review')].map((label, index) => (
        <div
          key={label}
          className={`flex items-center ${step >= index + 1 ? 'text-green-600' : 'text-gray-400'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= index + 1 ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </div>
          <span className="ml-2">{label}</span>
          {index < 2 && <div className="w-8 h-px bg-gray-300 mx-2"></div>}
        </div>
      ))}
    </div>
  );
};

const ShippingForm = ({ shippingInfo, setShippingInfo, onNext }: any) => {
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handlePhoneChange = (value: string) => {
    setShippingInfo({ ...shippingInfo, phone: value });
    const isComplete = /^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/.test(value);
    if (!isComplete) {
      setPhoneError("To'liq raqam kiriting: +998-XX-XXX-XX-XX");
    } else {
      setPhoneError(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('shipping_info_title')}</h2>
      <form className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm text-gray-800 font-medium mb-2">
        {t("first_name_label")}
      </label>
      <input
        type="text"
        value={shippingInfo.firstName}
        onChange={(e) =>
          setShippingInfo({ ...shippingInfo, firstName: e.target.value })
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder={t("first_name_placeholder")}
        required
      />
    </div>

    <div>
      <label className="block text-sm text-gray-800 font-medium mb-2">
        {t("phone_number_label")}
      </label>
      <IMaskInput
        mask="+998-00-000-00-00"
        definitions={{
          "0": /[0-9]/,
        }}
        lazy={false}
        overwrite
        value={shippingInfo.phone}
        onAccept={(value: string) => handlePhoneChange(value)}
        placeholder="+998-__-___-__-__"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {phoneError && (
        <p className="text-red-500 text-sm mt-1">{phoneError}</p>
      )}
    </div>
  </div>

  {/* Viloyat select */}
  <div>
    <label className="block text-sm text-gray-800 font-medium mb-2">
      {t("region_label") || "Viloyat"}
    </label>
    <select
      value={shippingInfo.region || ""}
      onChange={(e) =>
        setShippingInfo({ ...shippingInfo, region: e.target.value })
      }
      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      required
    >
      <option value="">{t("select_region") || "Viloyatni tanlang"}</option>
      <option value="Andijon">Andijon</option>
      <option value="Buxoro">Buxoro</option>
      <option value="Fargʻona">Fargʻona</option>
      <option value="Jizzax">Jizzax</option>
      <option value="Xorazm">Xorazm</option>
      <option value="Namangan">Namangan</option>
      <option value="Navoiy">Navoiy</option>
      <option value="Qashqadaryo">Qashqadaryo</option>
      <option value="Qoraqalpogʻiston">Qoraqalpogʻiston</option>
      <option value="Samarqand">Samarqand</option>
      <option value="Sirdaryo">Sirdaryo</option>
      <option value="Surxondaryo">Surxondaryo</option>
      <option value="Toshkent">Toshkent</option>
    </select>
  </div>

  {/* Tuman */}
  <div>
    <label className="block text-sm text-gray-800 font-medium mb-2">
      {t("district_label") || "Tuman"}
    </label>
    <input
      type="text"
      value={shippingInfo.district || ""}
      onChange={(e) =>
        setShippingInfo({ ...shippingInfo, district: e.target.value })
      }
      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      placeholder={t("district_placeholder") || "Tumanni kiriting"}
      required
    />
  </div>

  {/* Aniq manzil */}
  <div>
    <label className="block text-sm text-gray-800 font-medium mb-2">
      {t("address_label") || "Manzil"}
    </label>
    <input
      type="text"
      value={shippingInfo.address}
      onChange={(e) =>
        setShippingInfo({ ...shippingInfo, address: e.target.value })
      }
      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      placeholder={t("address_placeholder") || "Ko‘cha, uy raqami va h.k."}
      required
    />
  </div>

  <button
    type="button"
    onClick={onNext}
    className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold shadow-md transition-all text-base"
    disabled={
      !shippingInfo.firstName ||
      !shippingInfo.phone ||
      !shippingInfo.region ||
      !shippingInfo.district ||
      !shippingInfo.address ||
      phoneError !== null
    }
  >
    {t("continue_to_payment")}
  </button>
    </form>
    </div>
  );
};

const PaymentForm = ({ paymentMethod, setPaymentMethod, shippingInfo, cartItems, onNext, onBack }: any) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPayLink = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const access = await refreshToken();
      if (!access) {
        throw new Error('Authentication failed');
      }

      const orderData = {
        first_name: shippingInfo.firstName,
        phone: shippingInfo.phone,
        payment_type: paymentMethod,
        region: shippingInfo.region,    // ✅ qo‘shildi
        district: shippingInfo.district, // ✅ qo‘shildi
        address: shippingInfo.address,   // ✅ qo‘shildi
        order_item: cartItems.map((item: any) => ({
          product: parseInt(item.id),
          quantity: item.quantity,
        })),
        // lat/lon endi kerak emas
      };


      console.log('Order Payload for Pay Link:', JSON.stringify(orderData, null, 2));

      const response = await axios.post(`${BASE_URL}/api/order/`, orderData, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const { pay_link } = response.data.data;

      if (pay_link) {
        window.location.href = pay_link; // Redirect to payment provider
      } else {
        throw new Error('Payment link not provided in response');
      }
    } catch (error: any) {
      console.error('Payment Link Error:', error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        Object.values(error.response?.data || {}).join(', ') ||
        'Toʻlov havolasini olishda xatolik yuz berdi.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('payment_method')}</h2>
      
      <div className="space-y-4">
        {['payme', 'click'].map((method) => (
          <div key={method} className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div className="ml-3 flex items-center">
                <Image
                  src={`/images/${method}.png`}
                  alt={method}
                  width={48}
                  height={32}
                  className="object-contain"
                />
                <span className="ml-3 font-medium text-teal-700 capitalize">
                  {method}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      <div className="flex space-x-4 mt-6">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
          disabled={isProcessing}
        >
          {t('back_button')}
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
          disabled={isProcessing}
        >
          {t('continue_to_review')}
        </button>
      </div>
    </div>
  );
};

const ReviewOrder = ({ shippingInfo, cartItems, paymentMethod, onBack, onPlaceOrder, isProcessing }: any) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('order_review_title')}</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-500 mb-2">{t('recipient_label')}</h3>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p><i className="ri-user-line text-teal-600"></i> {shippingInfo.firstName}</p>
            <p><i className="ri-phone-line text-green-500"></i> {shippingInfo.phone}</p>
            <p><i className="ri-map-pin-line text-red-500"></i> {shippingInfo.address}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            <i className="ri-wallet-3-line text-blue-500"></i> {t('payment_method')}
          </h3>
          <p className="text-gray-600 pl-6 capitalize">{paymentMethod}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            <i className="ri-shopping-cart-2-line text-purple-500"></i> {t('order_items')}
          </h3>

          <div className="divide-y divide-gray-200 rounded-lg border overflow-hidden">
            {cartItems.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">{t('quantity')}: {item.quantity}</p>
                </div>
                <span className="font-semibold text-gray-700">
                  {(item.price * item.quantity).toLocaleString('uz-UZ')} UZS
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
          disabled={isProcessing}
        >
          {t('back_button')}
        </button>
        <button
          onClick={onPlaceOrder}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
          disabled={isProcessing}
        >
          {isProcessing ? t('processing') : t('place_order_button')}
        </button>
      </div>
    </div>
  );
};

const OrderSummary = ({ cartItems }: any) => {
  const { t } = useLanguage();

  const total = cartItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('order_summary_title')}</h2>
      <div className="space-y-3 mb-6">
        {cartItems.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-500 text-sm">{t('quantity')}: {item.quantity}</p>
              </div>
            </div>
            <span className="font-medium">
              {(item.price * item.quantity).toLocaleString('uz-UZ')} UZS
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('total')}</span>
          <span className="font-medium">
            {total.toLocaleString('uz-UZ')} UZS
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>{t('total_label')}</span>
            <span>
              {total.toLocaleString('uz-UZ')} UZS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};