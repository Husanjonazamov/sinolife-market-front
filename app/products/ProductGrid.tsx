'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSadTear } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshToken } from '../register/refresh';
import BASE_URL from '@/app/config';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter } from 'next/navigation';

type ProductType = {
  id: number;
  title: string;
  description: string;
  discounted_price: number;
  price: number;
  image: string;
  quantity: number;
  category?: { id: number; title: string };
};

interface ProductGridProps {
  filters: {
    category_ids: number[];
    min_price: number;
    max_price: number;
    q: string;
  };
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState<ProductType | null>(null);
  const productsPerPage = 10;
  const { t } = useLanguage();
  const router = useRouter();

  const handleOrderNow = (product: ProductType) => {
    const params = new URLSearchParams({
      product_id: product.id.toString(),
      quantity: '1',
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const url = `${BASE_URL}/api/cart/`;
      let access = localStorage.getItem('access');
      const payload = { cart_items: [{ product: productId, quantity: 1 }] };
      let response;

      try {
        response = await axios.post(url, payload, {
          headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        if (err.response?.status === 401) {
          const newAccess = await refreshToken();
          if (!newAccess) {
            toast.error('Sessiya tugadi. Iltimos, qaytadan tizimga kiring.');
            return;
          }
          response = await axios.post(url, payload, {
            headers: { Authorization: `Bearer ${newAccess}`, 'Content-Type': 'application/json' },
          });
        } else {
          toast.error(err.response?.data?.detail || 'Serverda xatolik');
          return;
        }
      }

      if (response.data.status) toast.success('✅ Mahsulot savatchaga qo‘shildi');
      else toast.error('❌ Mahsulot qo‘shishda xatolik');
    } catch {
      toast.error('Serverda xatolik');
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const url = `${BASE_URL}/api/product/`;
        const params: any = {};
        if (filters.category_ids.length > 0) params.category_ids = filters.category_ids.join(',');
        if (filters.min_price > 0) params.min_price = filters.min_price;
        if (filters.max_price > 0) params.max_price = filters.max_price;
        if (filters.q) params.q = filters.q;

        const response = await axios.get(url, { params });
        if (response.data.status) setProducts(response.data.data.results);
      } catch (error) {
        toast.error('Mahsulotlarni olishda xatolik');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 px-4">
        <h2 className="text-xl font-semibold mb-1">Yuklanmoqda...</h2>
      </div>
    );

  if (products.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 px-4">
        <FaSadTear className="text-7xl text-gray-400 mb-4 animate-bounce" />
        <h2 className="text-xl font-semibold mb-1">Mahsulot topilmadi</h2>
        <p className="text-center text-sm text-gray-400 max-w-md">
          Qidiruv filterlarini tekshirib ko‘ring yoki boshqa kategoriya tanlang.
        </p>
      </div>
    );

  return (
    <div className="flex-1 px-4">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {t('all_products')} ({products.length})
        </h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            {/* Product Image */}
            <div
              className="w-full h-64 bg-white flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => setModalProduct(product)}
            >
              <img
                src={product.image}
                alt={product.title}
                className="max-w-full max-h-full object-contain object-center"
              />
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col h-full">
              {product.category && (
                <div className="text-sm text-green-600 mb-2">{product.category.title}</div>
              )}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h3>
              <div className="flex items-center mb-3">
                <span className="text-sm text-gray-500 ml-2">Mahsulot soni: ({product.quantity})</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">
                    {product.price.toLocaleString('uz-UZ')} UZS
                  </span>
                  {product.discounted_price && product.price !== product.discounted_price && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.discounted_price.toLocaleString('uz-UZ')} UZS
                    </span>
                  )}
                </div>
              </div>

              {/* Buttons ONLY for list */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 text-xs sm:text-sm rounded-lg font-semibold transition-colors"
                >
                  {t('add_to_cart')}
                </button>
                <button
                  onClick={() => handleOrderNow(product)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 text-xs sm:text-sm rounded-lg font-semibold transition-colors"
                >
                  {t('order_now')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-12 space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          &larr;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              currentPage === i + 1 ? 'bg-green-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          &rarr;
        </button>
      </div>

      {/* Modal */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <div className="w-full h-64 flex items-center justify-center overflow-hidden mb-4">
              <img
                src={modalProduct.image}
                alt={modalProduct.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">{modalProduct.title}</h3>
            {modalProduct.category && (
              <div className="text-sm text-green-600 mb-2">{modalProduct.category.title}</div>
            )}
            <p className="text-gray-700 mb-4 max-h-40 overflow-y-auto whitespace-pre-wrap">{modalProduct.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-green-600">
                {modalProduct.price.toLocaleString('uz-UZ')} UZS
              </span>
              {modalProduct.discounted_price && modalProduct.price !== modalProduct.discounted_price && (
                <span className="text-sm text-gray-500 line-through">
                  {modalProduct.discounted_price.toLocaleString('uz-UZ')} UZS
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCart(modalProduct.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                {t('add_to_cart')}
              </button>
              <button
                onClick={() => handleOrderNow(modalProduct)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold"
              >
                {t('order_now')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
