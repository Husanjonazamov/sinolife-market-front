
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <Categories />
        
        {/* Trust Indicators */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">100% Natural</h3>
                <p className="text-gray-600">All our products are made from pure, organic ingredients sourced from trusted suppliers.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-truck-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Free Shipping</h3>
                <p className="text-gray-600">Enjoy free shipping on all orders over $50. Fast and secure delivery to your door.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-customer-service-2-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Support</h3>
                <p className="text-gray-600">Our wellness experts are here to help you choose the right products for your needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-green-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated on Wellness</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Get the latest health tips, product updates, and exclusive offers delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-r-full font-semibold transition-colors whitespace-nowrap cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
