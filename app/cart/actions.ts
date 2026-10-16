'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addItem, clearCart, removeItem, updateItemQty } from '@/lib/cart';

export async function addToCart(formData: FormData) {
  const slug = formData.get('slug')?.toString();
  const qty = Number(formData.get('qty') || 1);
  const redirectTo = formData.get('redirectTo')?.toString() || '/cart';

  if (!slug) {
    redirect(redirectTo);
  }

  await addItem(slug, Number.isNaN(qty) ? 1 : qty);
  revalidatePath('/cart');
  redirect(redirectTo);
}

export async function updateCartItem(formData: FormData) {
  const itemId = formData.get('itemId')?.toString();
  const qty = Number(formData.get('qty') || 1);

  if (itemId) {
    await updateItemQty(itemId, Number.isNaN(qty) ? 1 : qty);
    revalidatePath('/cart');
  }

  redirect('/cart');
}

export async function removeCartItem(formData: FormData) {
  const itemId = formData.get('itemId')?.toString();
  if (itemId) {
    await removeItem(itemId);
    revalidatePath('/cart');
  }
  redirect('/cart');
}

export async function clearCartAction() {
  await clearCart();
  revalidatePath('/cart');
  redirect('/cart');
}
