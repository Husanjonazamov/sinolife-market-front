'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category_ids: [],
    min_price: 0,
    max_price: 0,
    q: '', // 🔥 q qo‘shildi
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="relative py-24 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Premium%20herbal%20supplements&width=1920&height=600')`
          }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-xl max-w-2xl mx-auto">Discover our complete collection of premium herbal supplements and natural wellness products</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <ProductFilters onFilterChange={setFilters} />
              <ProductGrid filters={filters} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
