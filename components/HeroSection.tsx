'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '@/lib/LanguageContext';
import BASE_URL from '@/app/config';


type BannerType = {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
};

const LOCAL_STORAGE_KEY = 'bannerDataHome';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 soat

const DEFAULT_IMAGE = "https://readdy.ai/api/search-image?query=Natural%20herbal%20garden%20with%20green%20herbs%20and%20plants%20growing%20in%20sunlight&width=1920&height=1080";

const DEFAULT_BANNER: BannerType = {
  title: 'Welcome to Sinolife',
  subtitle: 'Natural Wellness',
  desc: 'Discover premium herbal products for your health and lifestyle.',
  image: DEFAULT_IMAGE,
};

export default function HeroSection() {
  const [banner, setBanner] = useState<BannerType | null>(null);
  const { language, setLanguage, t } = useLanguage();


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
        // Kesh noto‘g‘ri bo‘lsa, API chaqiramiz
      }
    }

    async function fetchBanner() {
      try {
        const response = await axios.get(`${BASE_URL}/api/banner/`);
        if (response.data.status && response.data.data.results.length > 0) {
          const banners = response.data.data.results;

          // Faqat type === 'home' bo'lganini olish
          const homeBanner = banners.find((b: any) => b.type === 'home');

          if (homeBanner) {
            const bannerObj: BannerType = {
              title: homeBanner.title,
              subtitle: homeBanner.subtitle,
              desc: homeBanner.description || '',
              image: homeBanner.image,
            };
            setBanner(bannerObj);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data: bannerObj, timestamp: Date.now() }));
            return;
          }
        }

        // Agar home type topilmasa
        setBanner(DEFAULT_BANNER);
      } catch (error) {
        console.error('Banner olishda xatolik:', error);
        setBanner(DEFAULT_BANNER);
      }
    }

    fetchBanner();
  }, []);

  const displayBanner = banner || DEFAULT_BANNER;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${displayBanner.image})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full container mx-auto px-4">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {displayBanner.title}
            <span className="block text-green-400">{displayBanner.subtitle}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            {displayBanner.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/products">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                {t("shop_show")}
              </button>
            </a>
            <a href="/contact">
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
                {t("contact")}
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
