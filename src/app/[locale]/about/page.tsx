'use client';

import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import AboutHero from './AboutHero';
import TeamSection from './TeamSection';
import CompanyHistory from './CompanyHistory';
import Values from './Values';
import MobileFooterNav from '@/src/components/FooterNav';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

export default function AboutPage() {

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
    <div className="min-h-screen">
      <Header />
      <main>
        <AboutHero />
        <Values />
        <CompanyHistory />
        <TeamSection />
        
        {/* CTA Section */}
        <section className="py-16 bg-green-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Wellness Journey?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of customers who trust HerbaStore for their natural health needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors whitespace-nowrap cursor-pointer">
                Shop Products
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full font-semibold transition-colors whitespace-nowrap cursor-pointer">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileFooterNav cartCount={cartCount} />
      
    </div>
  );
}