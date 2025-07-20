'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import CustomSearchMap from './location';

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

  const [cartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Turmeric Curcumin Complex',
      price: 29.99,
      quantity: 2,
      image: 'https://readdy.ai/api/search-image?query=premium%20turmeric%20curcumin%20supplement%20bottle%20with%20golden%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20health%20and%20wellness%20product%20photography&width=100&height=100&seq=checkout1&orientation=squarish'
    },
    {
      id: '2',
      name: 'Organic Ashwagandha Root',
      price: 24.99,
      quantity: 1,
      image: 'https://readdy.ai/api/search-image?query=organic%20ashwagandha%20root%20supplement%20bottle%20with%20natural%20brown%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20herbal%20wellness%20product&width=100&height=100&seq=checkout2&orientation=squarish'
    }
  ]);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Uzbekistan'
  });

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/order-success');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2">Shipping</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2">Payment</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-800 font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
                        placeholder="Your first name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-800 font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
                        placeholder="+998 90 123 45 67"
                        required
                      />
                    </div>
                  </div>
                  <CustomSearchMap 
                      onSelect={(address) => setShippingInfo({...shippingInfo, address})}
                    />

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold shadow-md transition-all text-base"
                  >
                    Continue to Payment
                  </button>
                </form>

              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
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
                          <Image
                            src={`/images/${method}.png`}
                            alt={method}
                            width={48}
                            height={32}
                            className="object-contain"
                          />
                          <span className="ml-3 font-medium capitalize">{method}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Review</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                    <div className="text-gray-600">
                      <p>{shippingInfo.firstName} </p>
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
                      {cartItems.map((item) => (
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
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
