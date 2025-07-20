
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <i className="ri-leaf-line text-green-600 text-lg"></i>
              </div>
              <span className="text-xl font-pacifico">HerbaStore</span>
            </div>
            <p className="text-green-100 mb-4">
              Your trusted partner for premium herbal products and natural wellness solutions.
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
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-green-100 hover:text-white transition-colors cursor-pointer">All Products</Link></li>
              <li><Link href="/categories" className="text-green-100 hover:text-white transition-colors cursor-pointer">Categories</Link></li>
              <li><Link href="/deals" className="text-green-100 hover:text-white transition-colors cursor-pointer">Special Deals</Link></li>
              <li><Link href="/blog" className="text-green-100 hover:text-white transition-colors cursor-pointer">Health Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-green-100 hover:text-white transition-colors cursor-pointer">Help Center</Link></li>
              <li><Link href="/shipping" className="text-green-100 hover:text-white transition-colors cursor-pointer">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-green-100 hover:text-white transition-colors cursor-pointer">Returns</Link></li>
              <li><Link href="/contact" className="text-green-100 hover:text-white transition-colors cursor-pointer">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-green-100 mb-4">Subscribe for health tips and exclusive offers</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-green-800 border border-green-700 rounded-l-md text-white placeholder-green-300 focus:outline-none focus:border-green-500"
              />
              <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-r-md transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-send-plane-line"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-100">&copy; 2024 HerbaStore. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-green-100 hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
            <Link href="/terms" className="text-green-100 hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
