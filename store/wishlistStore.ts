import { create } from 'zustand';
import type { Product } from '../types/product';

interface WishlistStore {
  items: Product[];

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  addItem: (product) => {
    set((state) => {
      if (state.items.find((i) => i.id === product.id)) return state;
      return { items: [...state.items, product] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    }));
  },

  toggleItem: (product) => {
    const { isInWishlist, addItem, removeItem } = get();
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  },

  isInWishlist: (productId) =>
    get().items.some((i) => i.id === productId),

  clearWishlist: () => set({ items: [] }),
}));
