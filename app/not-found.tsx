import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="eyebrow">404</p>
          <h1>We couldn’t find that page.</h1>
          <p>Return to the atelier edit or explore the latest collections.</p>
          <div className="hero-actions">
            <Link className="cta primary" href="/collections">
              Shop the Collection
            </Link>
            <Link className="cta ghost" href="/">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
