'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import MobileFooterNav from '@/components/FooterNav';
import { useLanguage } from '@/lib/LanguageContext';
import axios from 'axios';
import BASE_URL from '@/app/config';
import ProductDetail from './products/[id]/page';


export default function Home() {
  const { t } = useLanguage();

  // Cart state
  const [cartCount, setCartCount] = useState(0);

  // Cartni olish
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto">
          <Header />
          <HeroSection />
          <FeaturedProducts />
          <Categories />

          {/* Trust Indicators */}
          <section className="py-16 bg-green-50 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('natural_title')}</h3>
                <p className="text-gray-600">{t('natural_description')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-truck-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('shipping_title')}</h3>
                <p className="text-gray-600">{t('shipping_description')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-customer-service-2-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('support_title')}</h3>
                <p className="text-gray-600">{t('support_description')}</p>
              </div>
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-16 bg-green-600 rounded-2xl mt-12 mb-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">{t('newsletter_title')}</h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                {t('newsletter_description')}
              </p>
            </div>
          </section>
        <Footer />

        </div>
      </main>

      <MobileFooterNav cartCount={cartCount} />
    </div>
  );
}
