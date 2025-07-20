
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 89.97,
      items: [
        {
          id: '1',
          name: 'Turmeric Curcumin Complex',
          quantity: 2,
          price: 29.99,
          image: 'https://readdy.ai/api/search-image?query=premium%20turmeric%20curcumin%20supplement%20bottle%20with%20golden%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20health%20and%20wellness%20product%20photography&width=100&height=100&seq=order1&orientation=squarish'
        },
        {
          id: '2',
          name: 'Organic Ashwagandha Root',
          quantity: 1,
          price: 24.99,
          image: 'https://readdy.ai/api/search-image?query=organic%20ashwagandha%20root%20supplement%20bottle%20with%20natural%20brown%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20herbal%20wellness%20product&width=100&height=100&seq=order2&orientation=squarish'
        }
      ],
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-18'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 64.98,
      items: [
        {
          id: '3',
          name: 'Elderberry Immune Support',
          quantity: 2,
          price: 19.99,
          image: 'https://readdy.ai/api/search-image?query=elderberry%20immune%20support%20supplement%20bottle%20with%20dark%20purple%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20health%20product&width=100&height=100&seq=order3&orientation=squarish'
        },
        {
          id: '4',
          name: 'Magnesium Glycinate',
          quantity: 1,
          price: 22.99,
          image: 'https://readdy.ai/api/search-image?query=magnesium%20glycinate%20supplement%20bottle%20with%20white%20capsules%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20wellness%20product&width=100&height=100&seq=order4&orientation=squarish'
        }
      ],
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-25'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-22',
      status: 'processing',
      total: 45.99,
      items: [
        {
          id: '5',
          name: 'Omega-3 Fish Oil',
          quantity: 1,
          price: 32.99,
          image: 'https://readdy.ai/api/search-image?query=omega%203%20fish%20oil%20supplement%20bottle%20with%20golden%20softgels%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20and%20minimal%20modern%20design%20for%20health%20product&width=100&height=100&seq=order5&orientation=squarish'
        }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'ri-time-line';
      case 'processing':
        return 'ri-settings-3-line';
      case 'shipped':
        return 'ri-truck-line';
      case 'delivered':
        return 'ri-check-double-line';
      case 'cancelled':
        return 'ri-close-circle-line';
      default:
        return 'ri-information-line';
    }
  };

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your HerbaStore orders</p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'shipped', label: 'Shipped' },
              { key: 'delivered', label: 'Delivered' }
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

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
            <Link href="/products" className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-shopping-bag-line mr-2"></i>
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <i className={`${getStatusIcon(order.status)} mr-1`}></i>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Estimated Delivery</p>
                          <p className="font-medium text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {order.status === 'delivered' && (
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                          <i className="ri-repeat-line mr-1"></i>
                          Reorder
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                        <i className="ri-download-line mr-1"></i>
                        Download Receipt
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {order.trackingNumber && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                          <i className="ri-truck-line mr-1"></i>
                          Track Package
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                        <i className="ri-customer-service-line mr-1"></i>
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-truck-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Track Your Order</h3>
              <p className="text-sm text-gray-600">Get real-time updates on your package delivery</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-refresh-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy for your peace of mind</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-customer-service-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Customer Support</h3>
              <p className="text-sm text-gray-600">Get help from our friendly support team</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
