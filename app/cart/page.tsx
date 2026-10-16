import Link from 'next/link';
import { getCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';
import { clearCartAction, removeCartItem, updateCartItem } from './actions';
import SmartImage from '@/components/SmartImage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cart',
  description: 'Review your bag and proceed to checkout.',
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <section className="cart-page section" id="cart-top">
      <div className="cart-page-header">
        <p className="eyebrow">Your Bag</p>
        <h1>Review your selections.</h1>
        <p className="cart-page-lead">Every piece is reserved for a limited time.</p>
      </div>

      {cart.items.length === 0 ? (
        <div className="cart-empty">
          <p>Your bag is empty. Begin with the signature sets.</p>
          <Link className="cta primary" href="/collections">
            Shop the Collection
          </Link>
        </div>
      ) : (
        <div className="cart-page-grid">
          <ul className="cart-page-items" aria-label="Items in your bag">
            {cart.items.map((item) => {
              const lineTotal = item.unitPrice * item.qty;
              const newQtyDown = Math.max(1, item.qty - 1);
              const newQtyUp = item.qty + 1;
              return (
                <li className="cart-page-item" key={item.id}>
                  <Link href={`/products/${item.slug}`} className="cart-page-item-image">
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      width={140}
                      height={175}
                    />
                  </Link>
                  <div className="cart-page-item-body">
                    <div className="cart-page-item-main">
                      <h3>
                        <Link href={`/products/${item.slug}`}>{item.name}</Link>
                      </h3>
                      <p className="cart-page-item-unit">
                        {formatCurrency(item.unitPrice, item.currency)} each
                      </p>
                      <div className="cart-page-item-actions">
                        <div className="cart-page-qty" role="group" aria-label={`Quantity for ${item.name}`}>
                          <form action={updateCartItem} className="cart-page-qty-form">
                            <input type="hidden" name="itemId" value={item.id} />
                            <input type="hidden" name="qty" value={newQtyDown} />
                            <button type="submit" className="cart-page-qty-btn" aria-label="Decrease quantity" disabled={item.qty <= 1}>
                              −
                            </button>
                          </form>
                          <span className="cart-page-qty-value" aria-live="polite">{item.qty}</span>
                          <form action={updateCartItem} className="cart-page-qty-form">
                            <input type="hidden" name="itemId" value={item.id} />
                            <input type="hidden" name="qty" value={newQtyUp} />
                            <button type="submit" className="cart-page-qty-btn" aria-label="Increase quantity">
                              +
                            </button>
                          </form>
                        </div>
                        <form action={removeCartItem}>
                          <input type="hidden" name="itemId" value={item.id} />
                          <button type="submit" className="cart-page-remove" aria-label={`Remove ${item.name}`}>
                            Remove
                          </button>
                        </form>
                      </div>
                    </div>
                    <p className="cart-page-item-total">
                      {formatCurrency(lineTotal, item.currency)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="cart-page-summary">
            <div className="cart-page-summary-card">
              <h2>Order Summary</h2>
              <dl className="cart-page-summary-lines">
                {cart.items.map((item) => (
                  <div className="cart-page-summary-line" key={item.id}>
                    <dt>
                      {item.name} × {item.qty}
                    </dt>
                    <dd>{formatCurrency(item.unitPrice * item.qty, item.currency)}</dd>
                  </div>
                ))}
              </dl>
              <div className="cart-page-summary-divider" />
              <div className="cart-page-summary-total">
                <span>Total</span>
                <span>{formatCurrency(cart.total, cart.currency)}</span>
              </div>
              <p className="cart-page-summary-note">Taxes and shipping calculated at checkout.</p>
            </div>
            <div className="cart-page-summary-actions">
              <Link className="cta primary cart-page-checkout" href="/checkout">
                Continue to Checkout
              </Link>
              <form action={clearCartAction}>
                <button type="submit" className="cart-page-clear">
                  Clear bag
                </button>
              </form>
              <p className="cart-page-notice">
                Checkout is handled by your commerce backend. Connect Stripe to activate payments.
              </p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
