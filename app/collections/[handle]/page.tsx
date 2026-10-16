import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listCollections, listProducts } from '@/lib/clients/medusa';
import { collections as fallbackCollections } from '@/lib/data/products';
import ProductCard from '@/components/ProductCard';
import SectionTitle from '@/components/SectionTitle';

export const revalidate = 120;

const normalizedHandle = (h: string) => h?.toLowerCase().replace(/^\/+|\/+$/g, '').replace(/\s+/g, '-') || '';

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: CollectionPageProps) {
  const { handle } = await params;
  const norm = normalizedHandle(handle);
  const collections = await listCollections();
  const collection =
    collections.find((c) => normalizedHandle(c.handle) === norm) ||
    fallbackCollections.find((c) => normalizedHandle(c.handle) === norm);

  if (!collection) {
    return { title: 'Collection' };
  }

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const norm = normalizedHandle(handle);
  const collections = await listCollections();
  const collection =
    collections.find((c) => normalizedHandle(c.handle) === norm) ||
    fallbackCollections.find((c) => normalizedHandle(c.handle) === norm);

  if (!collection) {
    notFound();
  }

  const products = await listProducts({ collectionHandle: collection.handle });

  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Collection</p>
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
        <div className="hero-actions">
          <Link className="cta primary" href="/collections">
            Back to all collections
          </Link>
        </div>
      </section>

      <section className="featured-products section" aria-labelledby="collection-products-title">
        <SectionTitle
          id="collection-products-title"
          eyebrow="Pieces"
          title={`Shop ${collection.title}`}
          lead="Every piece is crafted to layer seamlessly with your existing set."
        />
        {products.length ? (
          <div className="featured-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">No pieces available yet in this collection.</div>
        )}
      </section>
    </>
  );
}
