import Link from 'next/link';
import CartLink from '@/components/cart/CartLink';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <input id="nav-toggle" className="nav-toggle-input" type="checkbox" aria-label="Toggle menu" />
        <label htmlFor="nav-toggle" className="nav-toggle icon-button" aria-label="Toggle menu">
          <span className="nav-toggle__bar" aria-hidden="true"></span>
        </label>
        <Link className="brand" href="/" aria-label="Youli Atelier home">
          YOULI
        </Link>
        <nav className="header-nav" aria-label="Primary">
          <Link href="/collections">Shop All</Link>
          <Link href="/collections/bras">Bras</Link>
          <Link href="/collections/panties">Panties</Link>
          <Link href="/collections/sets">Sets</Link>
          <Link href="/pages/about">About</Link>
        </nav>
        <div className="header-actions">
          <Link className="icon-button" href="/collections" aria-label="Search">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
              <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M15.5 15.5 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <CartLink />
          <Link className="cta header-cta" href="/collections">
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  );
}
