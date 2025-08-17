import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <i className="ri-leaf-line text-white text-lg"></i>
              </div>
              <span className="text-xl font-pacifico text-green-700">
                Sinolife
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t("brand_tagline")}</p>
            <div className="flex space-x-4">
              {["facebook-fill", "twitter-fill", "instagram-fill"].map((icon) => (
                <button
                  key={icon}
                  className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                >
                  <i className={`ri-${icon} text-base`}></i>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("quick_links_title")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("quick_links_0")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("quick_links_1")}
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("quick_links_2")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("quick_links_3")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("customer_care_title")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("customer_care_links_0")}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("customer_care_links_1")}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("customer_care_links_2")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("customer_care_links_3")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("newssletter_title")}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {t("newssletter_description")}
            </p>
            {/* <form className="flex items-center">
              <input
                type="email"
                placeholder={t("enter_email")}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
              >
                {t("subscribe")}
              </button>
            </form> */}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {t("copyright")}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-green-600 transition-colors"
            >
              {t("privacy_policy")}
            </Link>
            <Link
              href="/terms"
              className="hover:text-green-600 transition-colors"
            >
              {t("terms_of_service")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
