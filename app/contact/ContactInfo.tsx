'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '@/lib/LanguageContext';
import BASE_URL from '../config';

export default function ContactInfo() {
  const { language, setLanguage, t } = useLanguage();

  const [contact, setContact] = useState({
    phone: '',
    telegram: '',
    address: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/contact/`)
      .then(res => {
        const result = res.data?.data?.results?.[0];

        if (result) {
          setContact({
            phone: result.phone,
            telegram: result.telegram,
            address: result.address
          });
        }
      })
      .catch(err => {
        console.error('Contact ma\'lumotlarini olishda xatolik:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading contact information...</p>;
  }

  const contactMethods = [
    {
      icon: "ri-phone-line",
      title: t("label"),
      info: contact.phone || "Not available",
      description: t("note"),
      action: contact.phone ? `tel:${contact.phone.replace(/\s+/g, '').replace(/-/g, '')}` : "#"
    },
    {
      icon: "ri-chat-3-line",
      title: t("telegram_label"),
      info: contact.telegram 
        ? `@${contact.telegram.split('https://t.me/')[1]}` 
        : "Not available",
      description: t("telegram_note"),
      action: contact.telegram || "#"
    },
    {
      icon: "ri-map-pin-line",
      title: t("address_label"),
      info: contact.address?.replace(/\r\n/g, ', ') || "Not available",
      description: t("address_note"),
      action: "#"
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t("contact_info_title")}</h2>

      <div className="space-y-6 mb-8">
        {contactMethods.map((method, index) => (
          <a
            key={index}
            href={method.action}
            target={method.action.startsWith('http') || method.action.startsWith('tel:') ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
              method.action === "#" ? "bg-gray-100 cursor-not-allowed opacity-50" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i className={`${method.icon} text-white text-xl`}></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">{method.title}</h3>
              <p className="text-green-600 font-medium mb-1 whitespace-pre-line">{method.info}</p>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
            {method.action !== "#" && (
              <i className="ri-external-link-line text-green-600"></i>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
