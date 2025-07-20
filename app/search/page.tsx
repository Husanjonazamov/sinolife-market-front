'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const allProducts = [
    {
      id: 1,
      name: "Organic Turmeric Capsules",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.8,
      reviews: 247,
      category: "Anti-Inflammatory",
      image: "https://readdy.ai/api/search-image?query=Premium%20turmeric%20capsules%20in%20elegant%20amber%20glass%20bottle%20with%20golden%20turmeric%20powder%20scattered%20around%20on%20clean%20white%20marble%20surface%2C%20professional%20product%20photography%20with%20soft%20natural%20lighting%2C%20minimalist%20composition%20with%20fresh%20turmeric%20root%20pieces&width=400&height=400&seq=search101&orientation=squarish"
    },
    {
      id: 2,
      name: "Ashwagandha Root Extract",
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.9,
      reviews: 189,
      category: "Stress Relief",
      image: "https://readdy.ai/api/search-image?query=Ashwagandha%20root%20extract%20in%20modern%20glass%20dropper%20bottle%20on%20wooden%20surface%20with%20dried%20ashwagandha%20roots%20and%20green%20leaves%20around%2C%20professional%20supplement%20photography%20with%20warm%20natural%20lighting&width=400&height=400&seq=search102&orientation=squarish"
    },
    {
      id: 3,
      name: "Green Tea Extract",
      price: 24.99,
      originalPrice: 32.99,
      rating: 4.7,
      reviews: 356,
      category: "Antioxidants",
      image: "https://readdy.ai/api/search-image?query=Green%20tea%20extract%20capsules%20in%20sleek%20white%20bottle%20with%20fresh%20green%20tea%20leaves%20and%20powder%20on%20light%20wooden%20background%2C%20professional%20product%20photography%20with%20bright%20natural%20lighting&width=400&height=400&seq=search103&orientation=squarish"
    },
    {
      id: 4,
      name: "Ginseng Energy Blend",
      price: 42.99,
      originalPrice: 52.99,
      rating: 4.6,
      reviews: 128,
      category: "Energy",
      image: "https://readdy.ai/api/search-image?query=Ginseng%20supplement%20in%20premium%20dark%20bottle%20with%20fresh%20ginseng%20roots%20and%20green%20leaves%20on%20marble%20surface%2C%20professional%20health%20product%20photography%20with%20elegant%20lighting&width=400&height=400&seq=search104&orientation=squarish"
    },
    {
      id: 5,
      name: "Echinacea Immune Support",
      price: 27.99,
      originalPrice: 35.99,
      rating: 4.5,
      reviews: 203,
      category: "Immune Support",
      image: "https://readdy.ai/api/search-image?query=Echinacea%20supplement%20bottle%20with%20purple%20echinacea%20flowers%20and%20fresh%20herbs%20on%20natural%20wooden%20background%2C%20professional%20wellness%20photography%20with%20organic%20botanical%20elements&width=400&height=400&seq=search105&orientation=squarish"
    },
    {
      id: 6,
      name: "Milk Thistle Liver Support",
      price: 31.99,
      originalPrice: 41.99,
      rating: 4.4,
      reviews: 167,
      category: "Liver Health",
      image: "https://readdy.ai/api/search-image?query=Milk%20thistle%20supplement%20in%20glass%20bottle%20with%20purple%20milk%20thistle%20flowers%20and%20seeds%20on%20clean%20white%20surface%2C%20professional%20health%20product%20photography%20with%20natural%20lighting&width=400&height=400&seq=search106&orientation=squarish"
    }
  ];

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {query ? `Search Results for "${query}"` : 'Search Products'}
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, categories, or ingredients..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {searchTerm && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Found {filteredProducts.length} products for "{searchTerm}"
            </p>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        )}

        {currentProducts.length === 0 ? (
          <div className="text-center py-16">
            <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-500 mb-8">Try searching with different keywords</p>
            <Link href="/products" className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover object-top"
                    />
                    <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer">
                      <i className="ri-heart-line text-gray-600"></i>
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-green-600 mb-2">{product.category}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'} text-sm`}></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg cursor-pointer ${
                      currentPage === i + 1 
                        ? 'bg-green-600 text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Search Terms</h2>
          <div className="flex flex-wrap gap-2">
            {['Turmeric', 'Ashwagandha', 'Immune Support', 'Energy', 'Sleep', 'Antioxidants', 'Joint Health', 'Stress Relief'].map((term) => (
              <button
                key={term}
                onClick={() => {setSearchTerm(term); setCurrentPage(1);}}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="h-64 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}