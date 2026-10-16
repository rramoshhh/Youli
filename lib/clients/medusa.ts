import 'server-only';
import { collections as fallbackCollections, products as fallbackProducts } from '../data/products';
import type { Cart, Collection, Product } from '../types';

// Note: Endpoints follow the common Medusa Store API shape. Adjust params if your backend differs.
const MEDUSA_API_URL = process.env.MEDUSA_API_URL;
const MEDUSA_PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY;

type MedusaFetchResult<T> = {
  data: T | null;
  failed: boolean;
};

const withMedusaBase = (url?: string) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (!MEDUSA_API_URL) return url;
  return `${MEDUSA_API_URL}${url}`;
};

const normalizeHandle = (value?: string) => value?.replace(/^\/+|\/+$/g, '') || '';

const buildHeaders = (headers?: HeadersInit) => ({
  'Content-Type': 'application/json',
  ...(MEDUSA_PUBLISHABLE_KEY ? { 'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY } : {}),
  ...headers,
});

const medusaFetch = async <T>(
  path: string,
  options: RequestInit & { next?: { revalidate?: number } } = {}
): Promise<MedusaFetchResult<T>> => {
  if (!MEDUSA_API_URL) return { data: null, failed: true };
  try {
    const res = await fetch(`${MEDUSA_API_URL}${path}`, {
      ...options,
      headers: buildHeaders(options.headers),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const details = body ? `: ${body.slice(0, 300)}` : '';
      console.warn(`[medusa] Request failed (${res.status}) for ${path}${details}`);
      return { data: null, failed: true };
    }

    return { data: (await res.json()) as T, failed: false };
  } catch {
    console.warn(`[medusa] Network error for ${path}`);
    return { data: null, failed: true };
  }
};

const normalizeCollection = (raw: any): Collection => {
  const handle = normalizeHandle(
    raw?.handle || raw?.slug || raw?.title?.toLowerCase?.().replace(/\s+/g, '-') || 'collection'
  );
  const imageSrc = withMedusaBase(raw?.metadata?.image) || '/assets/boidour4.webp';
  return {
    id: raw?.id || `col_${handle}`,
    handle,
    title: raw?.title || raw?.name || 'Collection',
    description: raw?.description || 'Curated pieces from the atelier.',
    image: {
      src: imageSrc,
      alt: raw?.title || raw?.name || 'Collection image',
    },
  };
};

const normalizeProduct = (raw: any): Product => {
  const slug = normalizeHandle(
    raw?.handle || raw?.slug || raw?.title?.toLowerCase?.().replace(/\s+/g, '-') || 'product'
  );
  const imageSrc = withMedusaBase(raw?.thumbnail || raw?.images?.[0]?.url) || '/assets/boidour4.webp';
  const gallery =
    raw?.images
      ?.map((image: any) => withMedusaBase(image?.url))
      .filter(Boolean)
      .map((url: string) => ({
        src: url,
        alt: raw?.title || raw?.name || 'Product image',
      })) || [];

  const images = gallery.length
    ? gallery
    : [
        {
          src: imageSrc,
          alt: raw?.title || raw?.name || 'Product image',
        },
      ];
  return {
    id: raw?.id || `prod_${slug}`,
    slug,
    title: raw?.title || raw?.name || 'Product',
    description: raw?.description || 'Refined essentials with an atelier finish.',
    longDescription: raw?.description || 'Refined essentials with an atelier finish.',
    price: raw?.variants?.[0]?.prices?.[0]?.amount
      ? raw.variants[0].prices[0].amount / 100
      : 128,
    currency: raw?.variants?.[0]?.prices?.[0]?.currency_code?.toUpperCase?.() || 'USD',
    images,
    collectionHandle: normalizeHandle(raw?.collection?.handle) || 'sets',
    collectionTitle: raw?.collection?.title || 'Signature Sets',
    badge: raw?.metadata?.badge,
    rating: raw?.metadata?.rating,
    reviewCount: raw?.metadata?.reviewCount,
  };
};

const mapCart = (raw: any): Cart => {
  const items = (raw?.items || []).map((item: any) => ({
    id: item?.id || crypto.randomUUID(),
    productId: item?.product_id || item?.product?.id || 'prod',
    variantId: item?.variant_id,
    slug: item?.metadata?.slug || item?.product?.handle || 'product',
    name: item?.title || item?.product?.title || 'Product',
    image:
      withMedusaBase(item?.thumbnail || item?.product?.thumbnail) || '/assets/boidour4.webp',
    qty: item?.quantity || 1,
    unitPrice: item?.unit_price ? item.unit_price / 100 : 0,
    currency: item?.currency_code?.toUpperCase?.() || 'USD',
  }));

  const subtotal = items.reduce((sum: number, item: any) => sum + item.unitPrice * item.qty, 0);
  return {
    id: raw?.id || crypto.randomUUID(),
    items,
    subtotal,
    total: subtotal,
    currency: raw?.currency_code?.toUpperCase?.() || 'USD',
  };
};

export const listCollections = async (): Promise<Collection[]> => {
  const { data, failed } = await medusaFetch<{ collections?: any[] }>('/store/collections', {
    next: { revalidate: 300 },
  });

  if (failed || !data?.collections?.length) {
    return fallbackCollections;
  }

  return (data.collections || []).map(normalizeCollection);
};

export const listProducts = async (options: { collectionHandle?: string } = {}): Promise<Product[]> => {
  if (!MEDUSA_API_URL) {
    return options.collectionHandle
      ? fallbackProducts.filter((product) => product.collectionHandle === options.collectionHandle)
      : fallbackProducts;
  }

  const { data, failed } = await medusaFetch<{ products?: any[] }>(
    '/store/products',
    { next: { revalidate: 120 } }
  );

  if (failed) {
    return options.collectionHandle
      ? fallbackProducts.filter((product) => product.collectionHandle === options.collectionHandle)
      : fallbackProducts;
  }

  const products = (data?.products || []).map(normalizeProduct);
  const collectionHandle = normalizeHandle(options.collectionHandle);

  if (!collectionHandle) {
    return products;
  }

  return products.filter((product) => product.collectionHandle === collectionHandle);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const normalizedSlug = normalizeHandle(slug);
  const fallback = fallbackProducts.find((product) => product.slug === normalizedSlug);
  if (!MEDUSA_API_URL) {
    return fallback || null;
  }

  // Fetch then match normalized handles so both "lingerie" and "/lingerie" work.
  const { data, failed } = await medusaFetch<{ products?: any[] }>('/store/products', {
    next: { revalidate: 120 },
  });

  if (failed) {
    return fallback || null;
  }

  const rawProduct = (data?.products || []).find((raw) => {
    const rawHandle = normalizeHandle(
      raw?.handle || raw?.slug || raw?.title?.toLowerCase?.().replace(/\s+/g, '-') || ''
    );
    return rawHandle === normalizedSlug;
  });

  return rawProduct ? normalizeProduct(rawProduct) : null;
};

export const createCart = async (): Promise<Cart> => {
  const fallback: Cart = {
    id: crypto.randomUUID(),
    items: [],
    subtotal: 0,
    total: 0,
    currency: 'USD',
  };

  const { data } = await medusaFetch<{ cart?: any }>(
    '/store/carts',
    {
      method: 'POST',
      body: JSON.stringify({}),
      cache: 'no-store',
    }
  );

  if (!data?.cart) {
    return fallback;
  }

  return mapCart(data.cart);
};

export const addLineItem = async (cartId: string, variantId: string, quantity = 1): Promise<Cart | null> => {
  const { data } = await medusaFetch<{ cart?: any }>(
    `/store/carts/${cartId}/line-items`,
    {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId, quantity }),
      cache: 'no-store',
    }
  );

  return data?.cart ? mapCart(data.cart) : null;
};
