'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '@/app/config';
import { useLanguage } from '@/lib/LanguageContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { refreshToken } from '@/app/register/refresh';

type ProductType = {
  id: number;
  title: string;
  description: string;
  discounted_price: number;
  price: number;
  image: string;
  quantity: number;
  is_populer: boolean;
  is_new: boolean;
  is_discounted: boolean;
};

export default function SearchDropdown() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ProductType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const { t } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      axios
        .get(`${BASE_URL}/api/products/?search=${encodeURIComponent(searchQuery)}`)
        .then(res => {
          const products = res.data.results || res.data;
          setResults(products);
          setIsOpen(true);
        })
        .catch(err => console.error(err));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddToCart = async (productId: number) => {
    try {
      const url = `${BASE_URL}/api/cart/`;
      let access = localStorage.getItem('access');
      const payload = { cart_items: [{ product: productId, quantity: 1 }] };
      let response;
      try {
        response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' } });
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          const newAccess = await refreshToken();
          if (!newAccess) { toast.error("Sessiya tugadi. Qayta kiring."); return; }
          response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${newAccess}`, 'Content-Type': 'application/json' } });
        } else { toast.error(err.response?.data?.detail || 'Server xatoligi'); return; }
      }
      if (response.data.status) { toast.success('✅ Savatchaga qo‘shildi'); }
      else { toast.error('❌ Qo‘shishda xatolik'); }
    } catch (error) { toast.error('Server xatoligi'); }
  };

  const handleOrderNow = (product: ProductType) => {
    localStorage.setItem('checkoutProduct', JSON.stringify({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
    }));
    const params = new URLSearchParams({ product_id: product.id.toString() });
    router.push(`/order_now?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder={t('product_search')}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
      />
      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-md max-h-80 overflow-y-auto z-50">
          {results.length > 0 ? (
            results.map(product => (
              <div
                key={product.id}
                className="flex items-center space-x-2 p-2 hover:bg-green-50 transition cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{product.title}</span>
                  <span className="text-xs text-green-600 font-bold">{product.price.toLocaleString('uz-UZ')} UZS</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">{t('no_products_found') || 'Yo‘q'}</div>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 overflow-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
            {/* Close */}
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>

            {/* Chap: rasm */}
            <div className="md:w-1/2 flex justify-center items-center p-4">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-64 object-contain" />
            </div>

            {/* O‘ng: ma’lumotlar */}
            <div className="md:w-1/2 flex flex-col p-4 justify-between overflow-hidden">
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                <h3 className="text-2xl font-bold mb-2">{selectedProduct.title}</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedProduct.description}</p>
                <p className="text-green-600 font-bold mt-4">{selectedProduct.price.toLocaleString('uz-UZ')} UZS</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sticky bottom-0 bg-white pt-4">
                <button onClick={() => handleAddToCart(selectedProduct.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold">{t("add_to_cart")}</button>
                <button onClick={() => handleOrderNow(selectedProduct)} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold">{t("order_now")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
