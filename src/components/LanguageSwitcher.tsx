'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const languages = [
    { code: 'uz', name: 'O‘zbek', flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const changeLanguage = (lang: string) => {
    const segments = pathname.split('/');
    segments[1] = lang;
    router.push(segments.join('/'));
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 uppercase">Tilni tanlang</div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`w-full flex items-center px-2 py-2 text-sm rounded 
            ${locale === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'} 
            hover:bg-gray-100`}
        >
          <span>{lang.flag}</span>
          <span className="ml-2">{lang.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
