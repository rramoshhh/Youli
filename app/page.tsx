import Link from 'next/link';
import { listCollections, listProducts } from '@/lib/clients/medusa';
import { formatCurrency } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import SectionTitle from '@/components/SectionTitle';
import SmartImage from '@/components/SmartImage';
import AddToCartButton from '@/components/cart/AddToCartButton';

export const revalidate = 120;

export default async function HomePage() {
  const [collections, products] = await Promise.all([listCollections(), listProducts()]);

  const featured = products.slice(0, 3);
  const highlight = products[0];
  const highlightImage = highlight?.images?.[0];

  return (
    <>
      <section className="hero section" id="top">
        <div className="hero-media">
          <div className="hero-picture">
            <SmartImage
              src={highlight?.images?.[0]?.src || '/assets/boidour1.webp'}
              alt={highlight?.images?.[0]?.alt || highlight?.title || 'Youli Atelier signature set'}
              width={1280}
              height={1600}
              sizes="(max-width: 900px) 100vw, 58vw"
              priority
            />
          </div>
          <div className="hero-badge">New Season</div>
        </div>
        <div className="hero-content">
          <p className="eyebrow">Signature collection</p>
          <h1>Quiet luxury that feels intentional.</h1>
          <p className="lead">
            Sculpted lace, liquid satin, and soft mesh designed for a flawless foundation.
          </p>
          <div className="hero-actions">
            <Link className="cta primary" href="/collections">
              Shop the Collection
            </Link>
            <Link className="cta ghost" href={`/products/${highlight?.slug || 'noir-lace-set'}`}>
              View the Set
            </Link>
          </div>
          <ul className="hero-trust" aria-label="Highlights">
            <li>Atelier finishing</li>
            <li>Soft-touch materials</li>
            <li>Fit-tested silhouettes</li>
          </ul>
        </div>
      </section>

      <section className="featured-products section" aria-labelledby="featured-title">
        <SectionTitle
          id="featured-title"
          eyebrow="Featured"
          title="The sets clients reach for first."
          lead="Elevated essentials with a couture finish and an effortless fit."
        />
        <div className="featured-grid">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index === 0} />
          ))}
        </div>
      </section>

      <section className="collections section" aria-labelledby="shop-title">
        <SectionTitle
          id="shop-title"
          eyebrow="Shop"
          title="Shop the full atelier edit."
          lead="Refined, minimal, and designed to disappear under clothing while still feeling special."
        />
        <div className="catalog-toolbar" role="toolbar" aria-label="Filters">
          <Link className="filter-chip" href="/collections">
            New
          </Link>
          <Link className="filter-chip" href="/collections">
            Best Sellers
          </Link>
          {collections.map((collection) => (
            <Link key={collection.id} className="filter-chip" href={`/collections/${collection.handle}`}>
              {collection.title}
            </Link>
          ))}
        </div>
        <div className="collection-grid">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {highlight ? (
        <section className="product-detail section" aria-labelledby="product-title">
          <div className="product-gallery" role="group" aria-label={`${highlight.title} gallery`}>
            {highlightImage ? (
              <SmartImage
                src={highlightImage.src}
                alt={highlightImage.alt || highlight.title}
                width={900}
                height={1200}
                sizes="(max-width: 900px) 92vw, 42vw"
              />
            ) : null}
          </div>
          <div className="product-panel">
            <p className="eyebrow">Featured set</p>
            <h2 id="product-title">{highlight.title}</h2>
            <p className="product-price">{formatCurrency(highlight.price, highlight.currency)}</p>
            <div className="product-meta-line">
              <span className="rating">{highlight.rating?.toFixed(1) || '4.8'}</span>
              <span className="rating-text">({highlight.reviewCount || 240} reviews)</span>
            </div>
            <p className="product-description">{highlight.longDescription}</p>
            <div className="size-selector" role="group" aria-label="Select size">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button className="size-button" type="button" key={size}>
                  {size}
                </button>
              ))}
            </div>
            <AddToCartButton product={highlight} className="cta primary add-to-bag" />
            <ul className="badge-list" aria-label="Atelier notes">
              <li>Refined fit</li>
              <li>Studio-reviewed</li>
              <li>Soft-touch finish</li>
            </ul>
            <div className="product-details">
              <details open>
                <summary>Details</summary>
                <p>{highlight.details?.[0]}</p>
              </details>
              <details>
                <summary>Fit &amp; Care</summary>
                <p>{highlight.fitCare?.[0]}</p>
              </details>
              <details>
                <summary>Delivery</summary>
                <p>{highlight.delivery?.[0]}</p>
              </details>
            </div>
          </div>
        </section>
      ) : null}

    </>
  );
}
