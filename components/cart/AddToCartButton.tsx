'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { useCart } from './CartProvider';

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  redirectToCart?: boolean;
};

export default function AddToCartButton({
  product,
  className = 'cta mini',
  redirectToCart = true,
}: AddToCartButtonProps) {
  const { addProduct } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const add = () => {
    addProduct(product);
    setAdded(true);
    if (redirectToCart) {
      router.push('/cart#cart-top');
    } else {
      window.setTimeout(() => setAdded(false), 1400);
    }
  };

  return (
    <button className={className} type="button" onClick={add}>
      {added ? 'Added' : 'Add to Bag'}
    </button>
  );
}
