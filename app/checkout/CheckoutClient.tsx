'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutClient() {
  const { cart, ready } = useCart();
  const [message, setMessage] = useState('');

  return (
    <section className="checkout section">
      <div className="section-title">
        <p className="eyebrow">Checkout Demo</p>
        <h2>Finalize your order.</h2>
        <p className="section-lead">Explore the checkout flow without submitting payment details.</p>
      </div>
      <div className="checkout-grid">
        <aside className="order-summary">
          <div className="summary-card">
            <h3>Your Order</h3>
            {!ready ? <p className="muted-text">Loading your bag…</p> : cart.items.length === 0 ? (
              <p className="muted-text">Your bag is empty.</p>
            ) : cart.items.map((item) => (
              <div className="summary-line" key={item.id}>
                <span>{item.name} × {item.qty}</span>
                <span>{formatCurrency(item.unitPrice * item.qty, item.currency)}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-line total">
              <span>Total</span>
              <span>{formatCurrency(cart.total, cart.currency)}</span>
            </div>
            <p className="summary-note">No payment is taken in this portfolio demo.</p>
          </div>
        </aside>
        <div className="payment-panel">
          <form className="payment-form" onSubmit={(event) => event.preventDefault()}>
            <div className="form-header"><h3>Delivery Details</h3><span className="pill">Demo</span></div>
            <label className="field"><span>Name</span><input type="text" placeholder="Avery Lenoir" autoComplete="name" /></label>
            <label className="field"><span>Email</span><input type="email" placeholder="hello@example.com" autoComplete="email" /></label>
            <label className="field"><span>Delivery address</span><input type="text" placeholder="12 Rue de l’Atelier" autoComplete="street-address" /></label>
            <div className="payment-actions">
              <button
                className="cta primary"
                type="button"
                disabled={!ready || cart.items.length === 0}
                onClick={() => setMessage('Demo checkout complete — no order or payment was submitted.')}
              >Complete Demo Checkout</button>
              {message ? <p className="payment-note" role="status">{message}</p> : null}
            </div>
            <p className="form-footnote">Need help? <Link href="/pages/delivery-returns">Delivery & returns</Link></p>
          </form>
        </div>
      </div>
    </section>
  );
}
