'use client';

import { useState, useEffect } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ProductGrid from './ProductGrid';
import axios from 'axios';
import BASE_URL from '../config';

type BannerType = {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
};

type FilterType = {
  category_ids: number[];
  min_price: number;
  max_price: number;
  q: string;
};

const LOCAL_STORAGE_KEY = 'heroBanner';
const CACHE_EXPIRY_MS = 1000 * 60 * 60;

export default function ProductsPageClient() {
  const [filters, setFilters] = useState<FilterType>({
    category_ids: [],
    min_price: 0,
    max_price: 0,
    q: '',
  });

  const [banner, setBanner] = useState<BannerType | null>(null);

  useEffect(() => {
    const cachedBanner = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedBanner) {
      try {
        const { data, timestamp } = JSON.parse(cachedBanner);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          setBanner(data);
          return;
        }
      } catch {}
    }

    async function fetchBanner() {
      try {
        const response = await axios.get(`${BASE_URL}/api/banner/`);
        if (response.data.status && response.data.data.results.length > 0) {
          const homeBanner = response.data.data.results.find((b: any) => b.type === 'home');
          if (homeBanner) {
            const bannerObj: BannerType = {
              title: homeBanner.title,
              subtitle: homeBanner.subtitle || '',
              desc: homeBanner.description || '',
              image: homeBanner.image,
            };
            setBanner(bannerObj);
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify({ data: bannerObj, timestamp: Date.now() })
            );
          }
        }
      } catch (error) {
        console.error('Hero banner fetch error:', error);
      }
    }

    fetchBanner();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="px-2 sm:px-4 max-w-full sm:max-w-7xl mx-auto">
        <Header />
        <main>
          {/* Hero Banner */}
          <section className="relative h-[180px] sm:h-[300px] mt-4 rounded-xl overflow-hidden">
            {banner && (
              <>
                {/* Banner rasm */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter brightness-90 transition-opacity duration-1000"
                  style={{ backgroundImage: `url(${banner.image})` }}
                ></div>

                {/* Shaffof overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Matn */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 z-10">
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 leading-snug">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <h2 className="text-sm sm:text-xl md:text-2xl text-green-400 mb-2 leading-snug">
                      {banner.subtitle}
                    </h2>
                  )}
                  {banner.desc && (
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-xl md:max-w-2xl">
                      {banner.desc}
                    </p>
                  )}
                </div>
              </>
            )}
          </section>

          {/* Products Grid */}
          <section className="py-16">
            <div className="container mx-auto px-2 sm:px-4">
              <div className="flex flex-col lg:flex-row gap-8">
                <ProductGrid filters={filters} />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
