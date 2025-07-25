'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import axios from 'axios';
import BASE_URL from '@/app/config';

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

const LOCAL_STORAGE_KEY = 'bannerDataProducts';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 soat

const DEFAULT_BANNER: BannerType = {
  title: 'Our Products',
  subtitle: 'Premium Herbal Supplements',
  desc: 'Discover our complete collection of premium herbal supplements and natural wellness products',
  image: 'https://readdy.ai/api/search-image?query=Premium%20herbal%20supplements&width=1920&height=600',
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterType>({
    category_ids: [],
    min_price: 0,
    max_price: 0,
    q: '',
  });

  const [banner, setBanner] = useState<BannerType>(DEFAULT_BANNER);

  useEffect(() => {
    const cachedBanner = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedBanner) {
      try {
        const { data, timestamp } = JSON.parse(cachedBanner);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          setBanner(data);
          return;
        }
      } catch {
        // Kesh xato bo‘lsa, API dan olamiz
      }
    }

    async function fetchBanner() {
      try {
        const response = await axios.get(`${BASE_URL}/api/banner/`);
        if (response.data.status && response.data.data.results.length > 0) {
          const banners = response.data.data.results;

          const productBanner = banners.find((b: any) => b.type === 'products');

          if (productBanner) {
            const bannerObj: BannerType = {
              title: productBanner.title,
              subtitle: productBanner.subtitle,
              desc: productBanner.description || '',
              image: productBanner.image,
            };
            setBanner(bannerObj);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data: bannerObj, timestamp: Date.now() }));
            return;
          }
        }

        setBanner(DEFAULT_BANNER);
      } catch (error) {
        console.error('Banner fetch error:', error);
        setBanner(DEFAULT_BANNER);
      }
    }

    fetchBanner();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section
          className="relative py-24 bg-cover bg-center"
          style={{
            backgroundImage: `url(${banner.image})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{banner.title}</h1>
            <h2 className="text-2xl text-green-400 mb-4">{banner.subtitle}</h2>
            <p className="text-xl max-w-2xl mx-auto">{banner.desc}</p>
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
