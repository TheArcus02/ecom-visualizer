import { mockProducts } from '~/lib/constants/products';
import type { Product } from '~/lib/constants/products';
import type { CartItem } from '~/lib/stores/cart-store';

export function getCartItemDetails(cartItem: CartItem): Product | null {
  return mockProducts.find((product) => product.id === cartItem.id) ?? null;
}

export function getCartItemsWithDetails(cartItems: CartItem[]): {
  product: Product;
  quantity: number;
}[] {
  return cartItems
    .map((item) => {
      const product = getCartItemDetails(item);
      if (!product) return null;

      return {
        product,
        quantity: item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export function calculateCartTotal(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => {
    const product = getCartItemDetails(item);
    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}
