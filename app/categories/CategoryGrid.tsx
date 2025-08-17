'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BASE_URL from '../config';
import { useLanguage } from '@/lib/LanguageContext';

type Category = {
  id: number;
  title: string;
  image: string;
  product_count: number;
};

const colorMap: Record<string, string> = {
  green: 'bg-green-600',
  orange: 'bg-orange-600',
  yellow: 'bg-yellow-600',
  purple: 'bg-purple-600',
  blue: 'bg-blue-600',
  pink: 'bg-pink-600',
  indigo: 'bg-indigo-600',
  red: 'bg-red-600',
  rose: 'bg-rose-600',
};

const icons = [
  'ri-leaf-line',
  'ri-heart-pulse-line',
  'ri-capsule-line',
  'ri-plant-line',
  'ri-sparkling-line',
  'ri-bubble-chart-line',
  'ri-dna-line',
  'ri-user-heart-line',
  'ri-flower-line',
];

const defaultColors = [
  'green', 'orange', 'yellow', 'purple', 'blue', 'pink', 'indigo', 'red', 'rose'
];

function getRandomItems<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<(Category & { color: string; icon: string })[]>([]);
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/category/`);
        const json = await res.json();

        if (json.status && json.data && Array.isArray(json.data.results)) {
          let results: Category[] = json.data.results;

          const randomCats = getRandomItems(results, 6);

          const catsWithExtras = randomCats.map((cat, i) => ({
            ...cat,
            color: defaultColors[i % defaultColors.length],
            icon: icons[i % icons.length],
          }));

          setCategories(catsWithExtras);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Category fetch error:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-600 text-xl">
        Yuklanmoqda...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-16 text-center text-gray-600 text-xl">
        Kategoriya topilmadi.
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("categories_title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("categories_description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category_ids=${category.id}`}>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 left-4 w-12 h-12 ${colorMap[category.color]} rounded-full flex items-center justify-center`}>
                    <i className={`${category.icon} text-white text-xl`}></i>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {category.product_count} {t("products")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {t("explore_products_in_this_category")}
                  </p>
                  <div className="flex items-center text-green-600">
                    <span className="font-medium">{t("shop_now")}</span>
                    <i className="ri-arrow-right-line ml-2"></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
