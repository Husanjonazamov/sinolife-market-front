'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryGrid from './CategoryGrid';
import BASE_URL from '@/app/config';
import { useLanguage } from '@/lib/LanguageContext';
import MobileFooterNav from '@/components/FooterNav';

type BannerType = {
  title: string;
  desc: string;
  image: string;
};

const LOCAL_STORAGE_KEY = 'bannerDataCategory';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 soat

const DEFAULT_BANNER: BannerType = {
  title: 'Product Categories',
  desc: 'Explore our comprehensive range of herbal solutions organized by health needs.',
  image: 'https://readdy.ai/api/search-image?query=Various%20herbal%20categories&width=1920&height=600',
};

export default function CategoriesPage() {
  const [banner, setBanner] = useState<BannerType>(DEFAULT_BANNER);
  const { t } = useLanguage();
  const [cartCount, setCartCount] = useState(0);

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
          const banners = response.data.data.results;
          const categoryBanner = banners.find((b: any) => b.type === 'category');

          if (categoryBanner) {
            const bannerObj: BannerType = {
              title: categoryBanner.title,
              desc: categoryBanner.description || '',
              image: categoryBanner.image,
            };
            setBanner(bannerObj);
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify({ data: bannerObj, timestamp: Date.now() })
            );
            return;
          }
        }
        setBanner(DEFAULT_BANNER);
      } catch (error) {
        console.error('Category Banner olishda xatolik:', error);
        setBanner(DEFAULT_BANNER);
      }
    }

    fetchBanner();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="px-2 sm:px-4 max-w-full sm:max-w-7xl mx-auto">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative h-[180px] sm:h-[300px] md:h-[350px] mt-8 rounded-xl overflow-hidden">
            {banner.image && (
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25"></div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 z-10">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-snug">
                {banner.title}
              </h1>
              {banner.desc && (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-xl md:max-w-2xl">
                  {banner.desc}
                </p>
              )}
            </div>
          </section>

          <CategoryGrid />

          {/* Benefits Section */}
          <section className="py-16 bg-green-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('why_choose_us_title')}</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {t('why_choose_us_description')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-verified-badge-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('quality_tested_title')}</h3>
                  <p className="text-gray-600">{t('quality_tested_description')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-plant-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('natural_sourcing_title')}</h3>
                  <p className="text-gray-600">{t('natural_sourcing_description')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-heart-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('expert_curated_title')}</h3>
                  <p className="text-gray-600">{t('expert_curated_description')}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <MobileFooterNav cartCount={cartCount} />
      </div>
    </div>
  );
}
