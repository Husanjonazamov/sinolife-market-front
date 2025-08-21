import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import { LanguageProvider } from '@/lib/LanguageContext';
import Script from "next/script";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

import { NextIntlClientProvider } from "next-intl";

// Google Fonts
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'], // faqat latin
  display: 'swap',
  variable: '--font-poppins',
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['cyrillic', 'cyrillic-ext'], // faqat ruscha
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "SinoLife",
  description: "Sinolife",
  icons: {
    icon: "/images/logo.png",          // public/images/logo4.png faylini ishlatamiz
    apple: "/images/logo.png",         // Apple devices uchun ham
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  let messages;
  try {
    messages = (await import(`../../messages/${params.locale}.json`)).default;
  } catch {
    messages = {};
  }

  return (
    <html lang={params.locale || 'uz'} suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${roboto.variable}`}
        style={{
          fontFamily: `'var(--font-poppins)', 'var(--font-roboto)', sans-serif`,
        }}
      >
        <NextIntlClientProvider locale={params.locale || 'uz'} messages={messages}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </NextIntlClientProvider>

        {/* Bitrix24 site button script */}
        <Script
          id="bitrix24-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,u){
                var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);
                var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
              })(window,document,'https://cdn-ru.bitrix24.kz/b33790974/crm/site_button/loader_4_fn0dwg.js');
            `,
          }}
        />
      </body>
    </html>
  );
}
