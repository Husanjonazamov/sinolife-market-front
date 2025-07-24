'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IMaskInput } from 'react-imask';
import axios from 'axios';
import BASE_URL from '@/app/config';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';


export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: '',
    phone: '+998 ',
    password: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value: string) => {
    if (!value.startsWith('+998')) {
      setFormData(prev => ({ ...prev, phone: '+998 ' }));
    } else {
      setFormData(prev => ({ ...prev, phone: value }));
    }

    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';

    const cleanedPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanedPhone.startsWith('998')) {
      newErrors.phone = 'Phone number must start with +998';
    } else if (cleanedPhone.length !== 12) {
      newErrors.phone = 'Phone number must be in format +998 XX XXX XX XX';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const cleanedPhone = formData.phone.replace(/[^0-9]/g, '');

    try {
      await axios.post(`${BASE_URL}/auth/register/`, {
        first_name: formData.firstName,
        phone: Number(cleanedPhone),
        password: formData.password,
      });

      const loginRes = await axios.post(`${BASE_URL}/auth/token/`, {
        phone: Number(cleanedPhone),
        password: formData.password,
      });

      const { access, refresh, first_name } = loginRes.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('first_name', first_name || formData.firstName);

      router.push('/');
    } catch (error: any) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        setErrors(prev => ({
          ...prev,
          server: backendErrors.detail || backendErrors.message || 'Registration or login failed',
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          server: 'Network error',
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("create_account")}</h1>
            <p className="text-gray-600">{t("join_herbastore")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.server && (
              <p className="text-red-500 text-center text-sm">{errors.server}</p>
            )}

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                {t("first_name")}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t("enter_first_name")}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

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
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : t("create_account_button")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t("already_have_account")}{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                {t("sign_in_here")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
