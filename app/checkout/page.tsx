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


import dynamic from 'next/dynamic';

const CustomSearchMap = dynamic(() => import('./location'), {
  ssr: false,
});




interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('payme');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    phone: '',
    lat: '',
    long: '', 
    address: '',
  });

  const fetchCartItems = async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const items: CartItem[] = response.data.data.results[0].cart_items.map((item: any) => ({
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

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const access = await refreshToken();
      if (!access) {
        throw new Error('Authentication failed');
      }

      // Construct order data
      const orderData = {
        first_name: shippingInfo.firstName,
        phone: shippingInfo.phone,
        payment_type: paymentMethod,
        lat: parseFloat(shippingInfo.lat) || 0, // Fallback to 0 if invalid
        lon: parseFloat(shippingInfo.long) || 0, // Use 'lon' to match provided structure
        order_item: cartItems.map((item) => ({
          product: parseInt(item.id), // Use product ID
          quantity: item.quantity,
        })),
        // Include address if required by the API
        address: shippingInfo.address,
      };

      // Log the payload for debugging
      console.log('Order Payload:', JSON.stringify(orderData, null, 2));

      const response = await axios.post(`${BASE_URL}/api/order/`, orderData, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      console.log('Order Response:', response.data);
      router.push('/order-success');
    } catch (error: any) {
      console.error('Order Error:', error);
      // Extract server error message if available
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
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
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
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
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
            <OrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// --- Components ---

const StepIndicator = ({ step }: { step: number }) => (
  <>
    {['Shipping', 'Payment', 'Review'].map((label, index) => (
      <div key={label} className={`flex items-center ${step >= index + 1 ? 'text-green-600' : 'text-gray-400'}`}>
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
  </>
);

const ShippingForm = ({ shippingInfo, setShippingInfo, onNext }: any) => {
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handlePhoneChange = (value: string) => {
    setShippingInfo({ ...shippingInfo, phone: value });

    // Tekshiruv: faqat to'liq kiritilganda o'tkazish
    const isComplete = /^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/.test(value);
    if (!isComplete) {
      setPhoneError("To'liq raqam kiriting: +998-XX-XXX-XX-XX");
    } else {
      setPhoneError(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-800 font-medium mb-2">First Name</label>
            <input
              type="text"
              value={shippingInfo.firstName}
              onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your first name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-800 font-medium mb-2">Phone Number</label>

            < IMaskInput
              mask="+998-00-000-00-00"
              definitions={{
                "0": /[0-9]/,
              }}
              lazy={false}
              overwrite
              value={shippingInfo.phone}
              onAccept={(value: string) => {
                setShippingInfo({ ...shippingInfo, phone: value });
              }}
              placeholder="+998-__-___-__-__"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>
        </div>
          <CustomSearchMap
            onSelect={(address, lat, long) =>
              setShippingInfo({ ...shippingInfo, address, lat, long })
            }
          />

        <button
          type="button"
          onClick={onNext}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold shadow-md transition-all text-base"
          disabled={
            !shippingInfo.firstName ||
            !shippingInfo.phone ||
            !shippingInfo.address ||
            phoneError !== null
          }
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
};



const PaymentForm = ({ paymentMethod, setPaymentMethod, onNext, onBack }: any) => (
  <div className="bg-white rounded-l g shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
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
              <Image src={`/images/${method}.png`} alt={method} width={48} height={32} className="object-contain" />
              <span className="ml-3 font-medium capitalize">{method}</span>
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
        Back
      </button>
      <button
        onClick={onNext}
        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
      >
        Review Order
      </button>
    </div>
  </div>
);

const ReviewOrder = ({ shippingInfo, cartItems, paymentMethod, onBack, onPlaceOrder, isProcessing }: any) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Review</h2>
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
        <div className="text-gray-600">
          <p>{shippingInfo.firstName}</p>
          <p>{shippingInfo.address}</p>
          <p>{shippingInfo.phone}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
        <p className="text-gray-600 capitalize">{paymentMethod}</p>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
        <div className="space-y-3">
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="flex space-x-4 mt-6">
      <button
        onClick={onBack}
        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
      >
        Back
      </button>
      <button
        onClick={onPlaceOrder}
        disabled={isProcessing}
        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  </div>
);

const OrderSummary = ({ cartItems, subtotal, shipping, tax, total }: any) => (
  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
    <div className="space-y-3 mb-6">
      {cartItems.map((item: CartItem) => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
            <div>
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
            </div>
          </div>
          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>

    <div className="space-y-3 border-t border-gray-200 pt-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium">${shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium">${tax.toFixed(2)}</span>
      </div>
      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
);