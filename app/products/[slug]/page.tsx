import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, listProducts } from '@/lib/clients/medusa';
import { formatCurrency } from '@/lib/utils';
import SectionTitle from '@/components/SectionTitle';
import ProductCard from '@/components/ProductCard';
import SmartImage from '@/components/SmartImage';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { products as fallbackProducts } from '@/lib/data/products';

export const revalidate = 120;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return fallbackProducts.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: 'Product' };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const products = await listProducts({ collectionHandle: product.collectionHandle });
  const recommendations = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <>
      <section className="product-detail section" aria-labelledby="product-title">
        <div className="product-gallery" role="group" aria-label={`${product.title} gallery`}>
          {product.images.map((image) => (
            <SmartImage
              key={image.src}
              src={image.src}
              alt={image.alt || product.title}
              width={900}
              height={1200}
              sizes="(max-width: 900px) 92vw, 42vw"
            />
          ))}
        </div>
        <div className="product-panel">
          <p className="eyebrow">{product.collectionTitle}</p>
          <h1 id="product-title">{product.title}</h1>
          <p className="product-price">{formatCurrency(product.price, product.currency)}</p>
          <div className="product-meta-line">
            <span className="rating">{product.rating?.toFixed(1) || '4.8'}</span>
            <span className="rating-text">({product.reviewCount || 180} reviews)</span>
          </div>
          <p className="product-description">{product.longDescription}</p>
          <div className="size-selector" role="group" aria-label="Select size">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button className="size-button" type="button" key={size}>
                {size}
              </button>
            ))}
          </div>
          <AddToCartButton product={product} className="cta primary add-to-bag" />
          <div className="trust-badges" aria-label="Product notes">
            <span>Atelier finishing</span>
            <span>Soft-touch materials</span>
            <span>Fit-tested silhouette</span>
          </div>
          <div className="product-details">
            <details open>
              <summary>Details</summary>
              <p>{product.details?.[0]}</p>
            </details>
            <details>
              <summary>Fit &amp; Care</summary>
              <p>{product.fitCare?.[0]}</p>
            </details>
            <details>
              <summary>Delivery</summary>
              <p>{product.delivery?.[0]}</p>
            </details>
          </div>
          <Link className="cta ghost" href="/collections">
            Continue shopping
          </Link>
        </div>
      </section>

      <section className="featured-products section" aria-labelledby="recommendations-title">
        <SectionTitle
          id="recommendations-title"
          eyebrow="Recommended"
          title="Pieces that layer beautifully together."
          lead="Curated from the same atelier edit for a seamless silhouette."
        />
        <div className="featured-grid" id="recommendations-title">
          {recommendations.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </>
  );
}
