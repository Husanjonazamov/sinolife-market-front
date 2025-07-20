'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '@/app/config';

type ProductType = {
  id: number;
  title: string;
  description: string;
  discounted_price: number;
  price: number;
  image: string;
  quantity: number;
  is_populer: boolean;
  is_new: boolean;
  is_discounted: boolean;
};

function getRandomItems<T>(arr: T[], n: number): T[] {
  const result: T[] = [];
  const taken = new Set<number>();
  while (result.length < n && result.length < arr.length) {
    const index = Math.floor(Math.random() * arr.length);
    if (!taken.has(index)) {
      taken.add(index);
      result.push(arr[index]);
    }
  }
  return result;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${BASE_URL}/api/product/`);
        if (response.data.status) {
          const allProducts = response.data.data.results as ProductType[];
          const randomProducts = getRandomItems(allProducts, 4);
          setProducts(randomProducts);
        }
      } catch (error) {
        console.error('Mahsulotlarni olishda xatolik:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          Yuklanmoqda...
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          Mahsulotlar topilmadi.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular herbal supplements, carefully selected for their quality and effectiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover object-top"
                />
                {/* Badge lar faqat true bo‘lsa ko‘rsatiladi */}
                <div className="absolute top-4 left-4 flex flex-col gap-1">
                  {product.is_populer && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                     style={{ backgroundColor: '#0ef' }}>
                      Best Seller
                    </span>
                  )}
                  {product.is_new && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                      New
                    </span>
                  )}
                  {product.is_discounted && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">
                      Sale
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">${product.discounted_price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
