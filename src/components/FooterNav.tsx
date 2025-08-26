import Link from 'next/link';
import { HomeIcon, ProductsIcon, BrandsIcon, CartIcon } from './icon';

export default function MobileFooterNav({ cartCount }: { cartCount: number }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner sm:hidden z-50">
      <ul className="flex justify-around items-center px-6 py-2">
        {/* Home */}
        <li className="flex flex-col items-center text-gray-700 hover:text-green-600">
          <Link href="/" className="flex flex-col items-center">
            <HomeIcon className="mb-1" />
            <span className="text-xs">Home</span>
          </Link>
        </li>

        {/* Products */}
        <li className="flex flex-col items-center text-gray-700 hover:text-green-600">
          <Link href="/products" className="flex flex-col items-center">
            <ProductsIcon className="mb-1" />
            <span className="text-xs">Products</span>
          </Link>
        </li>

        {/* Brands */}
        <li className="flex flex-col items-center text-gray-700 hover:text-green-600">
          <Link href="/categories" className="flex flex-col items-center">
            <BrandsIcon className="mb-1" />
            <span className="text-xs">Brands</span>
          </Link>
        </li>

        {/* Cart */}
        <li className="flex flex-col items-center text-gray-700 hover:text-green-600 relative">
          <Link href="/cart" className="flex flex-col items-center relative">
            <CartIcon className="mb-1" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
