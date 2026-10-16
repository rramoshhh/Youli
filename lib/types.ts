export type ImageAsset = {
  src: string;
  alt: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ImageAsset;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  images: ImageAsset[];
  collectionHandle: string;
  collectionTitle: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  details?: string[];
  fitCare?: string[];
  delivery?: string[];
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  hero: string;
  sections: { title: string; body: string }[];
};

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  image: string;
  qty: number;
  unitPrice: number;
  currency: string;
};

export type Cart = {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  currency: string;
};
