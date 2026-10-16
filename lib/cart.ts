import 'server-only';
import { cookies } from 'next/headers';
import { getProductBySlug } from './clients/medusa';
import type { Cart, CartItem, Product } from './types';

const CART_COOKIE = 'youli_cart_v1';

type StoredCart = {
  id: string;
  items: CartItem[];
};

const readStoredCart = async (): Promise<StoredCart> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(CART_COOKIE)?.value;
  if (!cookie) {
    return { id: crypto.randomUUID(), items: [] };
  }
  try {
    const parsed = JSON.parse(cookie) as StoredCart;
    if (!parsed?.id || !Array.isArray(parsed.items)) {
      return { id: crypto.randomUUID(), items: [] };
    }
    return parsed;
  } catch {
    return { id: crypto.randomUUID(), items: [] };
  }
};

const writeStoredCart = async (cart: StoredCart) => {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
};


const buildCartItem = (product: Product, qty: number): CartItem => ({
  id: crypto.randomUUID(),
  productId: product.id,
  slug: product.slug,
  name: product.title,
  image: product.images[0]?.src || '/assets/boidour4.webp',
  qty,
  unitPrice: product.price,
  currency: product.currency,
});

const computeTotals = (cart: StoredCart): Cart => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  return {
    id: cart.id,
    items: cart.items,
    subtotal,
    total: subtotal,
    currency: cart.items[0]?.currency || 'USD',
  };
};

export const getCart = async (): Promise<Cart> => {
  const stored = await readStoredCart();
  return computeTotals(stored);
};

export const addItem = async (slug: string, qty = 1): Promise<Cart> => {
  const product = await getProductBySlug(slug);
  if (!product) {
    return getCart();
  }

  const stored = await readStoredCart();
  const existing = stored.items.find((item) => item.slug === slug);
  if (existing) {
    existing.qty += qty;
  } else {
    stored.items.push(buildCartItem(product, qty));
  }

  await writeStoredCart(stored);
  return computeTotals(stored);
};

export const updateItemQty = async (itemId: string, qty: number): Promise<Cart> => {
  const stored = await readStoredCart();
  stored.items = stored.items
    .map((item) => (item.id === itemId ? { ...item, qty } : item))
    .filter((item) => item.qty > 0);

  await writeStoredCart(stored);
  return computeTotals(stored);
};

export const removeItem = async (itemId: string): Promise<Cart> => {
  const stored = await readStoredCart();
  stored.items = stored.items.filter((item) => item.id !== itemId);
  await writeStoredCart(stored);
  return computeTotals(stored);
};

export const clearCart = async (): Promise<Cart> => {
  const stored = { id: crypto.randomUUID(), items: [] };
  await writeStoredCart(stored);
  return computeTotals(stored);
};
