import { useCallback } from 'react';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types/product';

export function useCart() {
  const store = useCartStore();

  const addToCart = useCallback(
    (product: Product) => {
      store.addItem(product);
    },
    [store],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      store.removeItem(productId);
    },
    [store],
  );

  return {
    items: store.items,
    totalItems: store.totalItems(),
    subtotal: store.subtotal(),
    makingCharges: store.makingCharges(),
    gst: store.gst(),
    total: store.total(),
    couponCode: store.couponCode,
    couponDiscount: store.couponDiscount,
    addToCart,
    removeFromCart,
    updateQuantity: store.updateQuantity,
    applyCoupon: store.applyCoupon,
    removeCoupon: store.removeCoupon,
    clearCart: store.clearCart,
  };
}
