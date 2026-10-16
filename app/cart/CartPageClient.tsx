'use client';

import Link from 'next/link';
import SmartImage from '@/components/SmartImage';
import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils';

export default function CartPageClient() {
  const { cart, ready, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <section className="cart-page section" id="cart-top">
      <div className="cart-page-header">
        <p className="eyebrow">Your Bag</p>
        <h1>Review your selections.</h1>
        <p className="cart-page-lead">Your demo bag is saved in this browser.</p>
      </div>

      {!ready ? (
        <div className="cart-empty"><p>Loading your bag…</p></div>
      ) : cart.items.length === 0 ? (
        <div className="cart-empty">
          <p>Your bag is empty. Begin with the signature sets.</p>
          <Link className="cta primary" href="/collections">Shop the Collection</Link>
        </div>
      ) : (
        <div className="cart-page-grid">
          <ul className="cart-page-items" aria-label="Items in your bag">
            {cart.items.map((item) => (
              <li className="cart-page-item" key={item.id}>
                <Link href={`/products/${item.slug}`} className="cart-page-item-image">
                  <SmartImage src={item.image} alt={item.name} width={140} height={175} />
                </Link>
                <div className="cart-page-item-body">
                  <div className="cart-page-item-main">
                    <h3><Link href={`/products/${item.slug}`}>{item.name}</Link></h3>
                    <p className="cart-page-item-unit">{formatCurrency(item.unitPrice, item.currency)} each</p>
                    <div className="cart-page-item-actions">
                      <div className="cart-page-qty" role="group" aria-label={`Quantity for ${item.name}`}>
                        <button
                          type="button"
                          className="cart-page-qty-btn"
                          aria-label="Decrease quantity"
                          disabled={item.qty <= 1}
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                        >−</button>
                        <span className="cart-page-qty-value" aria-live="polite">{item.qty}</span>
                        <button
                          type="button"
                          className="cart-page-qty-btn"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                        >+</button>
                      </div>
                      <button type="button" className="cart-page-remove" onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="cart-page-item-total">{formatCurrency(item.unitPrice * item.qty, item.currency)}</p>
                </div>
              </li>
            ))}
          </ul>
          <aside className="cart-page-summary">
            <div className="cart-page-summary-card">
              <h2>Order Summary</h2>
              <dl className="cart-page-summary-lines">
                {cart.items.map((item) => (
                  <div className="cart-page-summary-line" key={item.id}>
                    <dt>{item.name} × {item.qty}</dt>
                    <dd>{formatCurrency(item.unitPrice * item.qty, item.currency)}</dd>
                  </div>
                ))}
              </dl>
              <div className="cart-page-summary-divider" />
              <div className="cart-page-summary-total">
                <span>Total</span>
                <span>{formatCurrency(cart.total, cart.currency)}</span>
              </div>
              <p className="cart-page-summary-note">Demo total; taxes and shipping are not charged.</p>
            </div>
            <div className="cart-page-summary-actions">
              <Link className="cta primary cart-page-checkout" href="/checkout">Continue to Checkout</Link>
              <button type="button" className="cart-page-clear" onClick={clearCart}>Clear bag</button>
              <p className="cart-page-notice">This public demo does not process payments.</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
