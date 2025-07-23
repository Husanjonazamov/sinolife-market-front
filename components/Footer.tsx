
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  

  return (
    <footer className="bg-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <i className="ri-leaf-line text-green-600 text-lg"></i>
              </div>
              <span className="text-xl font-pacifico">Sinolife</span>
            </div>
            <p className="text-green-100 mb-4">
              {t("brand_tagline")}
            </p>
            <div className="flex space-x-4">
              <button className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-sm"></i>
              </button>
              <button className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <i className="ri-twitter-fill text-sm"></i>
              </button>
              <button className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <i className="ri-instagram-fill text-sm"></i>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quick_links_title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-green-100 hover:text-white transition-colors cursor-pointer">
                  {t("quick_links_0")}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-green-100 hover:text-white transition-colors cursor-pointer">
                  {t("quick_links_1")}
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-green-100 hover:text-white transition-colors cursor-pointer">
                  {t("quick_links_2")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-green-100 hover:text-white transition-colors cursor-pointer">
                  {t("quick_links_3")}
                </Link>
              </li>
          </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("customer_care_title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-green-100 hover:text-white transition-colors cursor-pointer">
                  {t("customer_care_links_0")}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-green-100 hover:text-white transition-colors cursor-pointer">
                  {t("customer_care_links_1")}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-green-100 hover:text-white transition-colors cursor-pointer">
                  {t("customer_care_links_2")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-100 hover:text-white transition-colors cursor-pointer">
                  {t("customer_care_links_3")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("newssletter_title")}</h3>
            <p className="text-green-100 mb-4">{t("newssletter_description")}</p>
          
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-100">&copy; {t("copyright")}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-green-100 hover:text-white transition-colors cursor-pointer">{t("privacy_policy")}</Link>
            <Link href="/terms" className="text-green-100 hover:text-white transition-colors cursor-pointer">{t("terms_of_service")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
