'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/app/config';

type BannerType = {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
};

const LOCAL_STORAGE_KEY = 'bannerData';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 soat

// Default background rasmi URL (siz o'zingiz xohlagan rasm URL sini qo'yishingiz mumkin)
const DEFAULT_IMAGE = "https://readdy.ai/api/search-image?query=Natural%20herbal%20garden%20with%20green%20herbs%20and%20plants%20growing%20in%20sunlight%2C%20peaceful%20wellness%20atmosphere%20with%20soft%20morning%20light%20filtering%20through%20leaves%2C%20organic%20botanical%20background%20with%20various%20medicinal%20herbs%20like%20lavender%20chamomile%20and%20mint%20in%20wooden%20planters%2C%20serene%20spa-like%20environment%20with%20natural%20textures%20and%20earth%20tones%2C%20professional%20photography%20style%20with%20shallow%20depth%20of%20field&width=1920&height=1080&seq=hero001&orientation=landscape";

const DEFAULT_BANNER: BannerType = {
  title: '',
  subtitle: '',
  desc: '',
  image: DEFAULT_IMAGE,
};

export default function HeroSection() {
  const [banner, setBanner] = useState<BannerType | null>(null);

  useEffect(() => {
    const cachedBanner = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedBanner) {
      try {
        const { data, timestamp } = JSON.parse(cachedBanner);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          setBanner(data);
          return; // Kesh mavjud va hali amal qiladi, API ga bormaymiz
        }
      } catch {
        // Kesh noto‘g‘ri bo‘lsa davom etamiz API chaqiruvga
      }
    }

    async function fetchBanner() {
      try {
        const response = await axios.get(`${BASE_URL}/api/banner/`);
        if (response.data.status && response.data.data.results.length > 0) {
          const bannerData = response.data.data.results[0];
          const bannerObj: BannerType = {
            title: bannerData.title,
            subtitle: bannerData.subtitle,
            desc: bannerData.description || '',
            image: bannerData.image,
          };
          setBanner(bannerObj);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data: bannerObj, timestamp: Date.now() }));
        } else {
          // Agar banner topilmasa, defaultni qo‘yamiz
          setBanner(DEFAULT_BANNER);
        }
      } catch (error) {
        console.error('Banner olishda xatolik:', error);
        setBanner(DEFAULT_BANNER); // Xatolikda ham default banner ko‘rsatamiz
      }
    }

    fetchBanner();
  }, []);

  // Loading yoki banner bo‘lmasa default bannerni ko‘rsatamiz
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
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer">
                Shop Now
              </button>
            </a>
            <a href="/about">
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer">
                Learn More
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
