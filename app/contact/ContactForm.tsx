'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../config';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      toast.error('Telefon raqami kamida 8 ta raqamdan iborat bo‘lishi kerak');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${BASE_URL}/api/message/`, formData);
      toast.success('Xabaringiz yuborildi!');

      setFormData({
        first_name: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast.error('Xabar yuborishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({
      ...prev,
      phone: onlyDigits
    }));
  };

  return (
    <div>
      <ToastContainer position="top-center" />

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Get In Touch</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onInput={handlePhoneInput} // faqat raqam uchun
              maxLength={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="998940014741"
            />
            <p className="text-xs text-gray-500 mt-1">
              Faqat raqam kiriting. Kamida 8 ta raqam bo‘lishi kerak.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={500}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="Tell us how we can help you..."
          ></textarea>
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.message.length}/500 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Yuborilmoqda...
            </span>
          ) : (
            'Xabarni Yuborish'
          )}
        </button>
      </form>
    </div>
  );
}
