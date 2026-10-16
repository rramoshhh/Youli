import Link from 'next/link';
import { getCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Checkout',
  description: 'Secure payment and delivery details for your order.',
};

export default async function CheckoutPage() {
  const cart = await getCart();

  return (
    <section className="checkout section">
      <div className="section-title">
        <p className="eyebrow">Checkout</p>
        <h2>Finalize your order.</h2>
        <p className="section-lead">
          Payments are completed through your commerce backend. Connect Stripe to activate.
        </p>
      </div>
      <div className="checkout-grid">
        <aside className="order-summary">
          <div className="summary-card">
            <h3>Your Order</h3>
            {cart.items.length === 0 ? (
              <p className="muted-text">Your bag is empty.</p>
            ) : (
              cart.items.map((item) => (
                <div className="summary-line" key={item.id}>
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>{formatCurrency(item.unitPrice * item.qty, item.currency)}</span>
                </div>
              ))
            )}
            <div className="summary-divider"></div>
            <div className="summary-line total">
              <span>Total</span>
              <span>{formatCurrency(cart.total, cart.currency)}</span>
            </div>
            <p className="summary-note">Taxes and shipping calculated in your backend.</p>
          </div>
          <div className="summary-card delivery-card">
            <h3>Delivery</h3>
            <p>Choose shipping options in the next step.</p>
            <p className="muted-text">Estimated delivery times will appear after address entry.</p>
          </div>
        </aside>
        <div className="payment-panel">
          <form className="payment-form" aria-describedby="payment-note">
            <div className="form-header">
              <h3>Payment Details</h3>
              <span className="pill">Stripe-ready</span>
            </div>
            <label className="field">
              <span>Cardholder Name</span>
              <input
                id="cardholder"
                name="cardholder"
                type="text"
                placeholder="Avery Lenoir"
                autoComplete="cc-name"
                required
              />
            </label>
            <label className="field">
              <span>Card Number</span>
              <input
                id="card-number"
                name="card-number"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                required
              />
            </label>
            <div className="field-row">
              <label className="field">
                <span>Expiry</span>
                <input
                  id="card-expiry"
                  name="card-expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="08 / 26"
                  required
                />
              </label>
              <label className="field">
                <span>CVC</span>
                <input
                  id="card-cvc"
                  name="card-cvc"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="394"
                  required
                />
              </label>
            </div>
            <label className="field">
              <span>Billing Email</span>
              <input
                id="billing-email"
                name="billing-email"
                type="email"
                placeholder="hello@youliatelier.com"
                autoComplete="email"
                required
              />
            </label>
            <div className="payment-actions">
              <button className="cta primary" type="button">
                Continue to Stripe Checkout
              </button>
              <p className="payment-note" id="payment-note">
                Connect Stripe in your commerce backend to accept payments.
              </p>
            </div>
            <p className="form-footnote">
              Need help? <Link href="/pages/delivery-returns">Delivery & returns</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
