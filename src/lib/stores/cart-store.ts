import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isSheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSheetOpen: false,

      setSheetOpen: (open: boolean) => {
        set({ isSheetOpen: open });
      },

      addItem: (productId: string) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === productId);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isSheetOpen: true,
            };
          } else {
            return {
              items: [...state.items, { id: productId, quantity: 1 }],
              isSheetOpen: true,
            };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find((item) => item.id === productId);
        return item?.quantity ?? 0;
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      isInCart: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'cart-storage',
      version: 1,
    }
  )
);