'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-check-line text-white text-2xl"></i>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for contacting us. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Get In Touch</h2>
      <p className="text-gray-600 mb-8">
        Have questions about our products or need personalized wellness advice? 
        Our expert team is here to help you find the perfect natural solutions.
      </p>

      <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="">Select a topic</option>
              <option value="product-inquiry">Product Inquiry</option>
              <option value="wellness-consultation">Wellness Consultation</option>
              <option value="order-support">Order Support</option>
              <option value="partnership">Partnership Opportunity</option>
              <option value="other">Other</option>
            </select>
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
          disabled={isSubmitting || formData.message.length > 500}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Sending Message...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}