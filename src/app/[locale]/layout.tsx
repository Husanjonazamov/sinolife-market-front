import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from '@/lib/LanguageContext';
import Script from "next/script";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { NextIntlClientProvider } from "next-intl";

// Google Fonts: Inter
const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "SinoLife",
  description: "Sinolife",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
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
        className={`${inter.variable}`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7QRW05Z7ZE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7QRW05Z7ZE');
          `}
        </Script>

        {/* Yandex Metrika */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]function(){(m[i].a=m[i].a[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103866129', 'ym');

            ym(103866129, 'init', {
              ssr:true,
              webvisor:true,
              clickmap:true,
              ecommerce:"dataLayer",
              accurateTrackBounce:true,
              trackLinks:true
            });
          `}
        </Script>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1317955583316560');
            fbq('track', 'PageView');
          `}
        </Script>

      </body>
    </html>
  );
}
