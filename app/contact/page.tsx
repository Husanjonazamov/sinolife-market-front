'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import BASE_URL from '@/app/config';
import MobileFooterNav from '@/components/FooterNav';

type BannerType = {
  title: string;
  desc: string;
  image: string;
};

const LOCAL_STORAGE_KEY = 'bannerDataContact';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 soat

const DEFAULT_BANNER: BannerType = {
  title: 'Contact Us',
  desc: "We're here to help you on your wellness journey. Get in touch with our expert team.",
  image: "https://readdy.ai/api/search-image?query=Modern%20customer%20service%20office%20with%20friendly%20representatives%20helping%20customers%2C%20professional%20business%20environment%20with%20natural%20elements%20and%20plants%2C%20welcoming%20reception%20area%20with%20warm%20lighting%20and%20comfortable%20seating%2C%20corporate%20wellness%20theme%20with%20herbal%20decorations&width=1920&height=600&seq=contacthero001&orientation=landscape",
};

export default function ContactPage() {
  const [banner, setBanner] = useState<BannerType>(DEFAULT_BANNER);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (access) {
      axios
        .get(`${BASE_URL}/api/cart/`, { headers: { Authorization: `Bearer ${access}` } })
        .then((res) => {
          const results = res.data.data.results;
          if (results.length > 0) setCartCount(results[0].cart_items_count);
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
          const contactBanner = response.data.data.results.find((b: any) => b.type === 'contact');
          if (contactBanner) {
            const bannerObj: BannerType = {
              title: contactBanner.title,
              desc: contactBanner.description || '',
              image: contactBanner.image,
            };
            setBanner(bannerObj);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data: bannerObj, timestamp: Date.now() }));
            return;
          }
        }
        setBanner(DEFAULT_BANNER);
      } catch (error) {
        console.error('Contact Banner olishda xatolik:', error);
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
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/25"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 z-10">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-snug">{banner.title}</h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-xl md:max-w-2xl">{banner.desc}</p>
            </div>
          </section>

          {/* Contact Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <ContactForm />
                <ContactInfo />
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
