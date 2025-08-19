import Link from 'next/link';
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineShop, AiOutlineTags } from 'react-icons/ai';

export default function MobileFooterNav({ cartCount }: { cartCount: number }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner sm:hidden z-50">
      <ul className="flex justify-between items-center px-6 py-2">
        <li className="flex flex-col items-center text-gray-700 hover:text-green-600">
          <Link href="/">
            <AiOutlineHome size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
        </li>
        <li className="flex flex-col items-center text-gray-700 hover:text-green-600">
          <Link href="/products">
            <AiOutlineShop size={24} />
            <span className="text-xs mt-1">Products</span>
          </Link>
        </li>
        <li className="flex flex-col items-center text-gray-700 hover:text-green-600">
          <Link href="/categories">
            <AiOutlineTags size={24} />
            <span className="text-xs mt-1">Brand</span>
          </Link>
        </li>
        <li className="flex flex-col items-center text-gray-700 hover:text-green-600 relative">
          <Link href="/cart">
            <AiOutlineShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
