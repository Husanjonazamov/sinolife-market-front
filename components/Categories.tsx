'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BASE_URL from '@/app/config';


import { useLanguage } from '@/lib/LanguageContext';

type Category = {
  id: number;
  title: string;
  image: string;
  product_count: number;
};

const colorMap: Record<string, string> = {
  green: 'bg-green-600 hover:bg-green-700',
  orange: 'bg-orange-600 hover:bg-orange-700',
  yellow: 'bg-yellow-600 hover:bg-yellow-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  pink: 'bg-pink-600 hover:bg-pink-700',
  indigo: 'bg-indigo-600 hover:bg-indigo-700',
  red: 'bg-red-600 hover:bg-red-700',
  rose: 'bg-rose-600 hover:bg-rose-700',
};

const defaultColors = [
  'green', 'orange', 'yellow', 'purple', 'blue', 'pink', 'indigo', 'red', 'rose'
];

function getRandomItems<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<(Category & { color: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/category/`);
        const json = await res.json();

        if (json.status && json.data && Array.isArray(json.data.results)) {
          const results: Category[] = json.data.results;

          const randomCats = getRandomItems(results, 6);

          const catsWithColors = randomCats.map((cat, i) => ({
            ...cat,
            color: defaultColors[i % defaultColors.length],
          }));

          setCategories(catsWithColors);
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
    return <div className="py-16 text-center text-gray-600 text-xl">Yuklanmoqda...</div>;
  }

  if (categories.length === 0) {
    return <div className="py-16 text-center text-gray-600 text-xl">Kategoriya topilmadi.</div>;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("categories_title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("categories_description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category_ids=${category.id}`}
            >
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer">
                <div className="relative h-48 overflow-hidden bg-white">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {category.product_count} {t("products")}
                      </span>
                    </div>
                  </div>
                </div>


                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {t("explore_products_in_this_category")}
                  </p>
                  <div className="flex items-center text-green-600 group-hover:text-green-700 transition-colors">
                    <span className="font-medium">{t("shop_now")}</span>
                    <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
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
