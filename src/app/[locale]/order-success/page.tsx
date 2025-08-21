import { Suspense } from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Yuklanmoqda...</div>}>
      <OrderSuccessClient />
    </Suspense>
  );
}
