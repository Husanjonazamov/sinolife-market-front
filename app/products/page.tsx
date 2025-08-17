'use client';

import dynamic from 'next/dynamic';

// Client Component'ni dynamic import bilan suspense orqali yuklaymiz
const ProductsPageClient = dynamic(() => import('./ProductsPageClient'), {
  ssr: false,
});

export default function ProductsPage() {
  return <ProductsPageClient />;
}
