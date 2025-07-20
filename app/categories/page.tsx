'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryGrid from './CategoryGrid';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section 
          className="relative py-24 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Various%20herbal%20categories&width=1920&height=600')`
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Product Categories</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Explore our comprehensive range of herbal solutions organized by health needs.
            </p>
          </div>
        </section>

        <CategoryGrid />

        {/* Benefits Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each category is carefully curated with premium quality products.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-verified-badge-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Tested</h3>
                <p className="text-gray-600">Third-party tested for purity and potency.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-plant-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Natural Sourcing</h3>
                <p className="text-gray-600">Sourced from sustainable and ethical farms.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-heart-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Curated</h3>
                <p className="text-gray-600">Selected by professional herbalists.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
