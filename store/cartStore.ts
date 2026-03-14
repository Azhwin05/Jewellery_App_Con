import { create } from 'zustand';
import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  priceAtAdd: number;
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
  makingCharges: () => number;
  gst: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  couponCode: null,
  couponDiscount: 0,

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { product, quantity: 1, priceAtAdd: product.price },
        ],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    }));
  },

  applyCoupon: (code, discount) =>
    set({ couponCode: code, couponDiscount: discount }),

  removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

  clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  makingCharges: () =>
    get().items.reduce(
      (sum, i) => sum + i.product.makingCharges * i.quantity,
      0,
    ),

  gst: () => {
    const { subtotal, makingCharges } = get();
    return Math.round((subtotal() + makingCharges()) * 0.03); // 3% GST on jewelry
  },

  total: () => {
    const { subtotal, makingCharges, gst, couponDiscount } = get();
    return subtotal() + makingCharges() + gst() - couponDiscount;
  },
}));
