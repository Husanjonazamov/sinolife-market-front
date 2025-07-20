'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderSuccessPage() {
  const [orderNumber] = useState(`HS-${Date.now().toString().slice(-6)}`);
  const [estimatedDelivery] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  });

  useEffect(() => {
    // Clear cart or perform other cleanup actions
    console.log('Order placed successfully');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-double-line text-green-600 text-4xl"></i>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Number</h3>
                <p className="text-green-600 font-bold text-xl">{orderNumber}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                <p className="text-gray-700">{estimatedDelivery}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Status</h3>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <i className="ri-check-line mr-1"></i>
                    Confirmed
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <i className="ri-settings-3-line mr-1"></i>
                    Processing
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">What happens next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-mail-line text-green-600"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Order Confirmation Email</h3>
                  <p className="text-gray-600">You'll receive an email confirmation with your order details shortly.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-box-3-line text-green-600"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Order Processing</h3>
                  <p className="text-gray-600">Our team will carefully prepare and package your herbal supplements.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-truck-line text-green-600"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Shipping & Tracking</h3>
                  <p className="text-gray-600">Once shipped, you'll receive tracking information to monitor your delivery.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/orders" 
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-file-list-3-line mr-2"></i>
              View My Orders
            </Link>
            
            <Link 
              href="/products" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Continue Shopping
            </Link>
          </div>

          <div className="mt-12 p-6 bg-green-50 rounded-2xl">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Need Help?</h3>
            <p className="text-green-700 mb-4">
              If you have any questions about your order, our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-customer-service-line mr-2"></i>
                Contact Support
              </Link>
              <a 
                href="mailto:support@herbastore.com" 
                className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-mail-line mr-2"></i>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}