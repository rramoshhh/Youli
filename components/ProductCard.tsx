import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { addToCart } from '@/app/cart/actions';
import SmartImage from '@/components/SmartImage';

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  showBadge?: boolean;
};

export default function ProductCard({ product, priority = false, showBadge = true }: ProductCardProps) {
  const mainImage = product.images[0] || {
    src: '/assets/boidour4.webp',
    alt: product.title,
  };

  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/products/${product.slug}`} aria-label={product.title}>
          <SmartImage
            src={mainImage.src}
            alt={mainImage.alt}
            width={900}
            height={1200}
            sizes="(max-width: 900px) 92vw, (max-width: 1200px) 46vw, 30vw"
            priority={priority}
          />
        </Link>
        {showBadge && product.badge ? <span className="media-chip">{product.badge}</span> : null}
        <button className="wishlist" type="button" aria-label={`Save ${product.title}`}>
          <span aria-hidden="true">❤</span>
        </button>
      </div>
      <div className="card-body">
        <h3>
          <Link href={`/products/${product.slug}`}>{product.title}</Link>
        </h3>
        <p>{product.description}</p>
        <div className="product-meta">
          <span className="price">{formatCurrency(product.price, product.currency)}</span>
          <div className="product-actions">
            <Link className="cta mini" href={`/products/${product.slug}`}>
              Quick View
            </Link>
            <form action={addToCart}>
              <input type="hidden" name="slug" value={product.slug} />
              <input type="hidden" name="qty" value="1" />
              <input type="hidden" name="redirectTo" value="/cart#cart-top" />
              <button className="cta mini" type="submit">Add to Bag</button>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
}
