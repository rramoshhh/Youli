import Link from 'next/link';
import { listCollections, listProducts } from '@/lib/clients/medusa';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import SectionTitle from '@/components/SectionTitle';

export const metadata = {
  title: 'Collections',
  description: 'Shop all Youli Atelier collections and signature sets.',
};

export const revalidate = 120;

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([listCollections(), listProducts()]);

  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Collections</p>
        <h1>Shop the full atelier edit.</h1>
        <p>
          Refined essentials designed to feel intentional, with silhouettes that layer effortlessly.
        </p>
        <div className="hero-actions">
          <Link className="cta primary" href="/collections/sets">
            Explore Signature Sets
          </Link>
        </div>
      </section>

      <section className="collections section" aria-labelledby="collection-grid-title">
        <SectionTitle
          id="collection-grid-title"
          eyebrow="Shop"
          title="Collections curated by the atelier."
          lead="Build a wardrobe anchored in refined sets, soft basics, and luminous layers."
        />
        <div className="collection-grid">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <section className="featured-products section" aria-labelledby="all-products-title">
        <SectionTitle
          id="all-products-title"
          eyebrow="All pieces"
          title="Every piece, ready to layer."
          lead="Tailored for confident dressing, from everyday sets to evening layers."
        />
        {products.length ? (
          <div className="featured-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">No products available yet. Check back soon.</div>
        )}
      </section>
    </>
  );
}
