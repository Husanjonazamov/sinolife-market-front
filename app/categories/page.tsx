'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryGrid from './CategoryGrid';
import BASE_URL from '@/app/config';
import { useLanguage } from '@/lib/LanguageContext';


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
        // kesh xato bo‘lsa, API dan olamiz
      }
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
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data: bannerObj, timestamp: Date.now() }));
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
      <Header />
      <main>
        {/* Hero Section */}
        <section 
          className="relative py-24 bg-cover bg-center"
          style={{
            backgroundImage: `url(${banner.image})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{banner.title}</h1>
            <p className="text-xl max-w-2xl mx-auto">
              {banner.desc}
            </p>
          </div>
        </section>

        <CategoryGrid />

        {/* Benefits Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("why_choose_us_title")}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t("why_choose_us_description")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-verified-badge-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("quality_tested_title")}</h3>
                <p className="text-gray-600">{t("quality_tested_description")}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-plant-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("natural_sourcing_title")}</h3>
                <p className="text-gray-600">{t("natural_sourcing_description")}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-heart-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("expert_curated_title")}</h3>
                <p className="text-gray-600">{t("expert_curated_description")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
