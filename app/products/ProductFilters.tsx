'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import BASE_URL from '@/app/config';

type CategoryType = {
  id: number;
  title: string;
  image: string;
};

interface ProductFiltersProps {
  onFilterChange: (filters: {
    category_ids: number[];
    min_price: number;
    max_price: number;
    q: string;
  }) => void;
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const searchParams = useSearchParams();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [minPriceInput, setMinPriceInput] = useState<string>('');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${BASE_URL}/api/category/`);
        if (response.data.status) {
          setCategories(response.data.data.results);
        }
      } catch (error) {
        console.error('Kategoriya olishda xatolik:', error);
      }
    }
    fetchCategories();
  }, []);

  // URL query dan category_ids olingan bo'lsa set qilish
  useEffect(() => {
    const categoryIdsParam = searchParams.get('category_ids');
    if (categoryIdsParam) {
      const ids = categoryIdsParam.split(',').map(id => parseInt(id)).filter(Boolean);
      setSelectedCategoryIds(ids);
    }
  }, [searchParams]);

  useEffect(() => {
    onFilterChange({
      category_ids: selectedCategoryIds,
      min_price: parseInt(minPriceInput) || 0,
      max_price: parseInt(maxPriceInput) || 0,
      q: searchQuery,
    });
  }, [selectedCategoryIds, minPriceInput, maxPriceInput, searchQuery]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="w-full lg:w-80 space-y-6">

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Search Products</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {categories.length === 0 && (
            <div className="text-sm text-gray-500">Kategoriyalar yuklanmoqda...</div>
          )}
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={selectedCategoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-700 cursor-pointer flex-1">
                {category.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value.replace(/^0+/, ''))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value.replace(/^0+/, ''))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedCategoryIds([]);
          setMinPriceInput('');
          setMaxPriceInput('');
          setSearchQuery('');
        }}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>
  );
}
