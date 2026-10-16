import Link from 'next/link';

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
          <Link className="icon-button cart-button" href="/cart" aria-label="Open cart">
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
          </Link>
          <Link className="cta header-cta" href="/collections">
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  );
}
