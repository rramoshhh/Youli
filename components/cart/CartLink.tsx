'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link className="icon-button cart-button" href="/cart" aria-label={`Open cart with ${itemCount} items`}>
      <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
        <path
          d="M7 7h11l-1.2 10.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 4H3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.4" fill="currentColor" />
        <circle cx="16" cy="20" r="1.4" fill="currentColor" />
      </svg>
      {itemCount > 0 ? <span className="cart-count">{itemCount}</span> : null}
    </Link>
  );
}
