'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';


type BannerType = {
  title: string;
  desc: string;
  image: string;
};

const LOCAL_STORAGE_KEY = 'bannerDataAbout';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 soat

const DEFAULT_BANNER: BannerType = {
  title: 'Our Story',
  desc: 'For over two decades, HerbaStore has been committed to providing the highest quality herbal products and natural wellness solutions to help people live healthier, more vibrant lives.',
  image: "https://readdy.ai/api/search-image?query=Professional%20herbal%20company%20headquarters%20with%20modern%20glass%20building%20surrounded%20by%20beautiful%20botanical%20gardens%2C%20corporate%20wellness%20environment%20with%20natural%20elements%2C%20elegant%20architecture%20blended%20with%20organic%20herb%20gardens%2C%20professional%20business%20photography%20with%20natural%20lighting%20and%20green%20landscape%20design&width=1920&height=800&seq=abouthero001&orientation=landscape",
};

export default function AboutHero() {
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
        // Kesh xato bo'lsa API dan oladi
      }
    }

    async function fetchBanner() {
      try {
        const response = await axios.get(`${BASE_URL}/api/banner/`);
        if (response.data.status && response.data.data.results.length > 0) {
          const banners = response.data.data.results;

          const aboutBanner = banners.find((b: any) => b.type === 'about');

          if (aboutBanner) {
            const bannerObj: BannerType = {
              title: aboutBanner.title,
              desc: aboutBanner.description || '',
              image: aboutBanner.image,
            };
            setBanner(bannerObj);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data: bannerObj, timestamp: Date.now() }));
            return;
          }
        }

        setBanner(DEFAULT_BANNER);
      } catch (error) {
        console.error('About Banner olishda xatolik:', error);
        setBanner(DEFAULT_BANNER);
      }
    }

    fetchBanner();
  }, []);

  return (
    <section 
      className="relative py-24 bg-cover bg-center"
      style={{
        backgroundImage: `url(${banner.image})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {banner.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            {banner.desc}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">20+</div>
              <div className="text-lg">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-lg">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-lg">Premium Products</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
