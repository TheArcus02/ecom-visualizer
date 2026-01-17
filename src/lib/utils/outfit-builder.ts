import type { CartItem } from '~/lib/stores/cart-store';
import type { Product, ProductCategory } from '~/lib/constants/products';
import { mockProducts } from '~/lib/constants/products';
import type { OutfitFormData } from '~/lib/schemas/outfit';

export interface OutfitSlotState {
  selected: string; // product ID
  alternatives: string[]; // product IDs for swapping
}

export interface OutfitBuilderState {
  slots: {
    top: OutfitSlotState;
    bottom: OutfitSlotState;
    shoes: OutfitSlotState;
    outerwear?: OutfitSlotState;
    shades?: OutfitSlotState;
    hats?: OutfitSlotState;
  };
  model: 'male' | 'female';
}

/**
 * Get product by ID
 */
function getProductById(productId: string): Product | null {
  return mockProducts.find((p) => p.id === productId) ?? null;
}

/**
 * Get default product for a category
 */
function getDefaultProduct(category: ProductCategory): Product | null {
  return mockProducts.find((p) => p.category === category && p.isDefault === true) ?? null;
}

/**
 * Build initial outfit state from cart items
 * Priority:
 * 1. Use cart items if available
 * 2. For conflicts, use most recently added (last in cart array)
 * 3. Fill empty required slots with defaults
 */
export function buildInitialOutfitState(
  cartItems: CartItem[],
  initialModel: 'male' | 'female' = 'male'
): OutfitBuilderState {
  // Get product details for cart items, preserving order
  const cartProducts = cartItems
    .map((item) => getProductById(item.id))
    .filter((p): p is Product => p !== null);

  // Group products by category, preserving order (most recent last)
  const productsByCategory = new Map<ProductCategory, Product[]>();
  for (const product of cartProducts) {
    const existing = productsByCategory.get(product.category) ?? [];
    existing.push(product);
    productsByCategory.set(product.category, existing);
  }

  // Helper to get selected and alternatives for a slot
  const getSlotState = (
    category: ProductCategory,
    isRequired: boolean
  ): OutfitSlotState | undefined => {
    const categoryProducts = productsByCategory.get(category) ?? [];
    const defaultProduct = getDefaultProduct(category);

    if (categoryProducts.length > 0) {
      // Priority 1 & 2: Use cart items, most recent is selected
      const lastIndex = categoryProducts.length - 1;
      const selected = categoryProducts[lastIndex];
      const alternatives = categoryProducts.slice(0, -1).map((p) => p.id);
      
      // Add default as alternative if it exists and is different
      if (defaultProduct && defaultProduct.id !== selected.id) {
        alternatives.push(defaultProduct.id);
      }

      return {
        selected: selected.id,
        alternatives,
      };
    } else if (isRequired && defaultProduct) {
      // Priority 3: Use default for required slots
      return {
        selected: defaultProduct.id,
        alternatives: [],
      };
    } else if (!isRequired) {
      // Optional slot with no items - return undefined
      return undefined;
    }

    // Required slot but no default found - use first available product of that category
    const fallback = mockProducts.find((p) => p.category === category && !p.isDefault);
    if (fallback) {
      return {
        selected: fallback.id,
        alternatives: [],
      };
    }

    // Last resort: return undefined (shouldn't happen with defaults)
    return undefined;
  };

  const topSlot = getSlotState('top', true);
  const bottomSlot = getSlotState('bottom', true);
  const shoesSlot = getSlotState('shoes', true);
  const outerwearSlot = getSlotState('outerwear', false);
  const shadesSlot = getSlotState('shades', false);
  const hatsSlot = getSlotState('hats', false);

  // Ensure required slots are set
  if (!topSlot || !bottomSlot || !shoesSlot) {
    throw new Error('Failed to initialize required outfit slots');
  }

  return {
    slots: {
      top: topSlot,
      bottom: bottomSlot,
      shoes: shoesSlot,
      ...(outerwearSlot && { outerwear: outerwearSlot }),
      ...(shadesSlot && { shades: shadesSlot }),
      ...(hatsSlot && { hats: hatsSlot }),
    },
    model: initialModel,
  };
}

/**
 * Convert outfit builder state to form data
 */
export function outfitStateToFormData(state: OutfitBuilderState): OutfitFormData {
  return {
    top: state.slots.top.selected,
    bottom: state.slots.bottom.selected,
    shoes: state.slots.shoes.selected,
    ...(state.slots.outerwear && { outerwear: state.slots.outerwear.selected }),
    ...(state.slots.shades && { shades: state.slots.shades.selected }),
    ...(state.slots.hats && { hats: state.slots.hats.selected }),
    model: state.model,
  };
}

/**
 * Get all alternative products for a slot
 */
export function getAlternativesForSlot(
  slotState: OutfitSlotState | undefined
): Product[] {
  if (!slotState) return [];
  
  return slotState.alternatives
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== null);
}
