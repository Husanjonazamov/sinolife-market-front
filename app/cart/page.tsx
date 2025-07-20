
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Turmeric Curcumin Complex',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://readdy.ai/api/search-image?query=premium%20turmeric%20curcumin%20supplement%20bottle%20with%20golden%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20health%20and%20wellness%20product%20photography&width=300&height=300&seq=cart1&orientation=squarish',
      quantity: 2,
      category: 'Joint Support'
    },
    {
      id: '2',
      name: 'Organic Ashwagandha Root',
      price: 24.99,
      image: 'https://readdy.ai/api/search-image?query=organic%20ashwagandha%20root%20supplement%20bottle%20with%20natural%20brown%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20herbal%20wellness%20product&width=300&height=300&seq=cart2&orientation=squarish',
      quantity: 1,
      category: 'Energy & Focus'
    },
    {
      id: '3',
      name: 'Elderberry Immune Support',
      price: 19.99,
      image: 'https://readdy.ai/api/search-image?query=elderberry%20immune%20support%20supplement%20bottle%20with%20dark%20purple%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20health%20product&width=300&height=300&seq=cart3&orientation=squarish',
      quantity: 1,
      category: 'Immune Support'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
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

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some products to get started</p>
            <Link href="/products" className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-shopping-bag-line mr-2"></i>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cart Items ({cartItems.length})</h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-lg font-semibold text-green-600">${item.price}</span>
                          {item.originalPrice && (
                            <span className="ml-2 text-sm text-gray-400 line-through">${item.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          <i className="ri-subtract-line text-gray-600"></i>
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          <i className="ri-add-line text-gray-600"></i>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link href="/products" className="inline-flex items-center text-green-600 hover:text-green-700 cursor-pointer">
                    <i className="ri-arrow-left-line mr-2"></i>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({(discount * 100).toFixed(0)}% off)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-blue-800">
                      <i className="ri-information-line mr-1"></i>
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <Link href="/checkout" className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium transition-colors text-center block whitespace-nowrap cursor-pointer">
                  Proceed to Checkout
                </Link>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="ri-shield-check-line text-green-600 mr-2"></i>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="ri-truck-line text-green-600 mr-2"></i>
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="ri-refresh-line text-green-600 mr-2"></i>
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
