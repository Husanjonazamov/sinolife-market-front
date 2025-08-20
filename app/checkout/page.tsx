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

const CustomSearchMap = dynamic(() => import('./location'), {
  ssr: false,
});

interface Cart {
  id: string;
  total_price: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('payme');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    phone: '',
    lat: '',
    lon: '',
    address: '',
    region: '',
    district: '',
  });
  const [cartCount, setCartCount] = useState(0);

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

  const fetchCartItems = async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data.data.results[0];
      const cartData: Cart = {
        id: result.id,
        total_price: result.total_price,
      };

      setCart(cartData);

      const items: CartItem[] = result.cart_items.map((item: any) => ({
        id: item.product.id.toString(),
        name: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      setCartItems(items);
      setLoading(false);
    } catch (err: any) {
      if (err.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          fetchCartItems(newToken);
        } else {
          setError('Failed to authenticate. Please log in again.');
          setLoading(false);
        }
      } else {
        setError('Failed to fetch cart items.');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      fetchCartItems(accessToken);
    } else {
      refreshToken().then((newToken) => {
        if (newToken) {
          fetchCartItems(newToken);
        } else {
          setError('Please log in to view your cart.');
          setLoading(false);
          router.push('/login');
        }
      });
    }
  }, [router]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const access = await refreshToken();
      if (!access) {
        throw new Error('Authentication failed');
      }

      const orderData = {
        first_name: shippingInfo.firstName,
        phone: shippingInfo.phone,
        payment_type: paymentMethod,
        region: shippingInfo.region,
        district: shippingInfo.district,
        lat: parseFloat(shippingInfo.lat) || 0,
        lon: parseFloat(shippingInfo.lon) || 0,
        order_item: cartItems.map((item) => ({
          product: parseInt(item.id),
          quantity: item.quantity,
        })),
        address: shippingInfo.address,
      };

      console.log('Order Payload:', JSON.stringify(orderData, null, 2));

      const response = await axios.post(`${BASE_URL}/api/order/`, orderData, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const { id, created_at, status, payment_status, pay_link } = response.data.data;

      if (paymentMethod === 'cash') {
        router.push(
          `/order-success?id=${id}&created_at=${encodeURIComponent(created_at)}&status=${status}&payment_status=${payment_status}`
        );
      } else if (pay_link && pay_link !== 'https://') {
        window.location.href = pay_link;
      } else {
        throw new Error('Invalid payment link');
      }
    } catch (error: any) {
      console.error('Order Error:', error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        Object.values(error.response?.data || {}).join(', ') ||
        'Buyurtma yuborishda xatolik yuz berdi.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto'>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("checkout_title")}</h1>
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
                  cartItems={cartItems}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 3 && (
                <ReviewOrder
                  shippingInfo={shippingInfo}
                  cartItems={cartItems}
                  paymentMethod={paymentMethod}
                  onBack={() => setCurrentStep(2)}
                  onPlaceOrder={handlePlaceOrder}
                  isProcessing={isProcessing}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <OrderSummary cartItems={cartItems} total={cart?.total_price || "0.00"} />
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
      {[t("shipping"), t("payment"), t("review")].map((label, index) => (
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
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("shipping_info_title")}</h2>
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

        {/* CustomSearchMap integration (assuming it sets lat, lon, address) */}
        {/* <div>
          <label className="block text-sm text-gray-800 font-medium mb-2">
            {t("location_label") || "Joylashuvni tanlang"}
          </label>
          <CustomSearchMap 
            onLocationSelect={(lat: string, lon: string, address: string) => 
              setShippingInfo({ ...shippingInfo, lat, lon, address })
            } 
          />
        </div> */}

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

  const paymentLabels = {
    payme: "Payme",
    click: "Click",
    cash: t("cash"),
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("payment_method")}</h2>
      
      <div className="space-y-4">
        {["payme", "click", "cash"].map((method) => (
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
                {method !== "cash" ? (
                  <Image
                    src={`/images/${method}.png`}
                    alt={method}
                    width={48}
                    height={32}
                    className="object-contain"
                  />
                ) : (
                  <span className="w-12 h-8 flex items-center justify-center bg-yellow-100 text-yellow-700 font-semibold rounded">
                    💵
                  </span>
                )}
                <span className="ml-3 font-medium text-teal-700">
                  {paymentLabels[method]}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
        >
          {t("back_button")}
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
        >
          {t("continue_to_review")}
        </button>
      </div>
    </div>
  );
};

const ReviewOrder = ({ shippingInfo, cartItems, paymentMethod, onBack, onPlaceOrder, isProcessing }: any) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("order_review_title")}</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-500 mb-2">{t("recipient_label")}</h3>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p><i className="ri-user-line text-teal-600"></i> {shippingInfo.firstName}</p>
            <p><i className="ri-phone-line text-green-500"></i> {shippingInfo.phone}</p>
            <p><i className="ri-map-pin-line text-red-500"></i> {shippingInfo.address}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            <i className="ri-wallet-3-line text-blue-500"></i> {t("payment_method")}
          </h3>
          <p className="text-gray-600 pl-6 capitalize">{paymentMethod}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            <i className="ri-shopping-cart-2-line text-purple-500"></i> {t("order_items")}
          </h3>

          <div className="divide-y divide-gray-200 rounded-lg border overflow-hidden">
            {cartItems.map((item: CartItem) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">{t("quantity")}: {item.quantity}</p>
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
          {t("back_button")}
        </button>
        <button
          onClick={onPlaceOrder}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
          disabled={isProcessing}
        >
          {isProcessing ? t("processing") : t("place_order_button")}
        </button>
      </div>
    </div>
  );
};

const OrderSummary = ({ cartItems, total }: any) => {
  const { t } = useLanguage();

  const calculatedTotal = cartItems.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("order_summary_title")}</h2>
      <div className="space-y-3 mb-6">
        {cartItems.map((item: CartItem) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-500 text-sm">{t("quantity")}: {item.quantity}</p>
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
          <span className="text-gray-600">{t("total")}</span>
          <span className="font-medium">
            {calculatedTotal.toLocaleString('uz-UZ')} UZS
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>{t("total_label")}</span>
            <span>
              {calculatedTotal.toLocaleString('uz-UZ')} UZS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};