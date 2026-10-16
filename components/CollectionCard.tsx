import Link from 'next/link';
import type { Collection } from '@/lib/types';
import SmartImage from '@/components/SmartImage';

type CollectionCardProps = {
  collection: Collection;
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <article className="collection-card reveal">
      <div className="collection-media">
        <Link href={`/collections/${collection.handle}`} aria-label={collection.title}>
          <SmartImage
            src={collection.image.src}
            alt={collection.image.alt || collection.title}
            width={900}
            height={1200}
            sizes="(max-width: 900px) 92vw, (max-width: 1200px) 46vw, 30vw"
          />
        </Link>
        <span className="media-chip">Curated</span>
        <button className="wishlist" type="button" aria-label={`Save ${collection.title}`}>
          <span aria-hidden="true">❤</span>
        </button>
      </div>
      <div className="card-body">
        <h3>
          <Link href={`/collections/${collection.handle}`}>{collection.title}</Link>
        </h3>
        <p>{collection.description}</p>
        <Link className="cta mini" href={`/collections/${collection.handle}`}>
          Explore Collection
        </Link>
      </div>
    </article>
  );
}
