'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { IMaskInput } from 'react-imask';
import { useLanguage } from '@/lib/LanguageContext';
import BASE_URL from '../config';
import { useEffect } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartCount, setCartCount] = useState(0);


  useEffect(() => {
    const access = localStorage.getItem('access');
    if (access) {
      axios
        .get(`${BASE_URL}/api/cart/`, {
          headers: { Authorization: `Bearer ${access}` },
        })
        .then((res) => {
          const results = res.data.data.results;
          if (results.length > 0) {
            const cart = results[0];
            setCartCount(cart.cart_items_count);
          }
        })
        .catch((err) => console.error('Cart olishda xatolik:', err));
    }
  }, []);

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };



  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const onlyNumbers = formData.phone.replace(/[^0-9]/g, '');

    if (onlyNumbers.length !== 12)
      newErrors.phone = 'Telefon raqam to‘liq bo‘lishi kerak: +998 XX XXX XX XX';

    if (!formData.password) {
      newErrors.password = 'Parol kiritish shart';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Parol kamida 4 ta belgidan iborat bo‘lishi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validateForm()) return;

    const onlyNumbers = formData.phone.replace(/[^0-9]/g, '');
    setIsSubmitting(true);
    const cleanedPhone = formData.phone.replace(/\D/g, '');


    try {
      const res = await fetch(`${BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: String(cleanedPhone),        // 👉 string ko‘rinishda
          password: String(formData.password), // 👉 string ko‘rinishda
        }),
      });

      const data = await res.json();
      console.log('TOKEN RESPONSE:', data);

      if (res.ok) {
        localStorage.setItem('phone', cleanedPhone);

        router.push('/sms');
      } else {                                  
        setServerError(data.detail || 'Telefon raqam yoki parol noto‘g‘ri');
      }
    } catch (err) {
      setServerError('Serverga ulanib bo‘lmadi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='px-0 sm:px-4 max-w-full sm:max-w-7xl mx-auto'>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("welcome_back")}</h1>
              <p className="text-gray-600">{t("sign_in_to_account")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {serverError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">
                  {serverError}
                </div>
              )}

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("phone_number")}
                </label>
                <IMaskInput
                  mask="+998 00 000 00 00"
                  definitions={{ "0": /[0-9]/ }}
                  lazy={false}
                  overwrite
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onAccept={handlePhoneChange}
                  placeholder="+998 __ ___ __ __"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("password")}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t("password")}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
              >
                {isSubmitting ? t("loading") : t("sign_in")}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {t("no_account")}{' '}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                  {t("sign_up_here")}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
        
      </div>
    </div>
  );
}
