'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Cart, CartItem, Product } from '@/lib/types';

const CART_STORAGE_KEY = 'youli_cart_v1';

type CartContextValue = {
  cart: Cart;
  ready: boolean;
  itemCount: number;
  addProduct: (product: Product, qty?: number) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

const emptyCart = (): Cart => ({
  id: 'youli-demo-cart',
  items: [],
  subtotal: 0,
  total: 0,
  currency: 'USD',
});

const withTotals = (items: CartItem[]): Cart => {
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  return {
    id: 'youli-demo-cart',
    items,
    subtotal: total,
    total,
    currency: items[0]?.currency || 'USD',
  };
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Cart>;
        if (Array.isArray(parsed.items)) {
          setCart(withTotals(parsed.items));
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, ready]);

  const addProduct = useCallback((product: Product, qty = 1) => {
    setCart((current) => {
      const existing = current.items.find((item) => item.slug === product.slug);
      const items = existing
        ? current.items.map((item) =>
            item.id === existing.id ? { ...item, qty: item.qty + qty } : item
          )
        : [
            ...current.items,
            {
              id: product.id,
              productId: product.id,
              slug: product.slug,
              name: product.title,
              image: product.images[0]?.src || '/assets/boidour4.webp',
              qty,
              unitPrice: product.price,
              currency: product.currency,
            },
          ];
      return withTotals(items);
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, qty: number) => {
    setCart((current) =>
      withTotals(
        current.items
          .map((item) => (item.id === itemId ? { ...item, qty } : item))
          .filter((item) => item.qty > 0)
      )
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCart((current) => withTotals(current.items.filter((item) => item.id !== itemId)));
  }, []);

  const clearCart = useCallback(() => setCart(emptyCart()), []);
  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.qty, 0),
    [cart.items]
  );

  const value = useMemo(
    () => ({ cart, ready, itemCount, addProduct, updateQuantity, removeItem, clearCart }),
    [cart, ready, itemCount, addProduct, updateQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
