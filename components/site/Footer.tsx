import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="eyebrow">Youli Atelier</p>
          <h3>Quiet luxury, made intentional.</h3>
          <p className="muted-text">
            Atelier-crafted lingerie designed for a confident, luminous fit.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <ul>
              <li>
                <Link href="/collections">Shop All</Link>
              </li>
              <li>
                <Link href="/collections/sets">Signature Sets</Link>
              </li>
              <li>
                <Link href="/collections/bras">Bras</Link>
              </li>
              <li>
                <Link href="/collections/panties">Panties</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Atelier</h4>
            <ul>
              <li>
                <Link href="/pages/about">About</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li>
                <Link href="/pages/delivery-returns">Delivery & Returns</Link>
              </li>
              <li>
                <Link href="/cart">Your Bag</Link>
              </li>
              <li>
                <Link href="/checkout">Checkout</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Youli Atelier. All rights reserved.</p>
      </div>
    </footer>
  );
}
