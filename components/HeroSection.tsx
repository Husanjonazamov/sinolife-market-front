'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '@/lib/LanguageContext';
import BASE_URL from '@/app/config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type BannerType = {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
};

const DEFAULT_IMAGE =
  'https://readdy.ai/api/search-image?query=Natural%20herbal%20garden%20with%20green%20herbs%20and%20plants%20growing%20in%20sunlight&width=1920&height=1080';

const DEFAULT_BANNERS: BannerType[] = [
  {
    title: 'Sinolife – sog‘lom hayot tarzini yetkazamiz',
    subtitle: '',
    desc: 'Sinolife bu – Har bir oilaga tabiiy yechimlar orqali sog‘lik va yaxshi hayot tarzini yetkazamiz.',
    image: DEFAULT_IMAGE,
  },
  {
    title: 'Tabiiy vitaminlar va o‘simliklar',
    subtitle: '',
    desc: 'Sifatli va foydali mahsulotlar bilan immunitetingizni mustahkamlang.',
    image: DEFAULT_IMAGE,
  },
];

// Static kategoriyalar
const STATIC_CATEGORIES = [
  'Ichimliklar',
  'Tabiiy yog‘lar',
  'Vitaminlar',
  'Choylar',
  'Shifobaxsh o‘simliklar',
  'Asal mahsulotlari',
  'Organik kosmetika',
];

export default function HeroSection() {
  const [banners, setBanners] = useState<BannerType[]>(DEFAULT_BANNERS);
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await axios.get(`${BASE_URL}/api/banner/?lang=${language}`);
        if (response.data.status && response.data.data.results.length > 0) {
          const homeBanners = response.data.data.results.filter((b: any) => b.type === 'home');
          if (homeBanners.length > 0) {
            setBanners(
              homeBanners.map((b: any) => ({
                title: b.title,
                subtitle: b.subtitle,
                desc: b.description || '',
                image: b.image,
              }))
            );
            return;
          }
        }
        setBanners(DEFAULT_BANNERS);
      } catch (error) {
        console.error('Banner olishda xatolik:', error);
        setBanners(DEFAULT_BANNERS);
      }
    }
    fetchBanners();
  }, [language]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500, // Silliq harakat uchun
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    cssEase: 'ease-in-out', // Sekinroq va silliq o‘tish
  };

  // Desc qisqartirish funksiyasi
  const shortDesc = (text: string, wordLimit = 10) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-4">
      {/* Static kategoriyalar — faqat desktop */}
      <div className="hidden sm:flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {STATIC_CATEGORIES.map((cat, idx) => (
          <button
            key={idx}
            className="relative flex-shrink-0 px-4 py-2 text-gray-700 font-medium transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hero banner — carousel */}
      <section className="mt-4">
        <Slider {...sliderSettings}>
          {banners.map((banner, i) => (
            <div key={i} className="px-1"> {/* Oraliq qo'shildi */}
              <div
                className="relative h-[160px] sm:h-[450px] overflow-hidden rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                {/* Kuchliroq qora overlay */}
                <div className="absolute inset-0 bg-black/60 rounded-xl"></div>

                {/* Matn joylashuvi */}
                <div className="absolute inset-0 flex flex-col justify-end items-start p-4 z-10 text-white 
                                sm:translate-y-[-10%]">
                  <h1 className="text-sm sm:text-4xl font-bold leading-snug text-left w-full">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <span className="block text-green-400 text-xs sm:text-lg w-full text-left">
                      {banner.subtitle}
                    </span>
                  )}
                  <p className="text-xs sm:text-base mt-1 text-gray-200 w-full text-left">
                    {shortDesc(banner.desc, 10)}
                  </p>
                </div>


              </div>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}
