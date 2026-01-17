'use client';

import { useMemo } from 'react';
import type { Product } from '~/lib/constants/products';
import { SlotCard } from './slot-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import { Card, CardContent } from '~/components/ui/card';

interface SlotSectionProps {
  title: string;
  selectedProduct: Product | null;
  availableProducts: Product[];
  onSelect: (productId: string) => void;
  onDeselect?: () => void;
  isOptional?: boolean;
}

export function SlotSection({
  title,
  selectedProduct,
  availableProducts,
  onSelect,
  onDeselect,
  isOptional = false,
}: SlotSectionProps) {
  // Maintain stable order - don't rearrange based on selection
  const allProducts = useMemo(() => {
    const productIds = new Set<string>();
    const result: Product[] = [];
    
    // Add all available products in their original order
    for (const product of availableProducts) {
      if (!productIds.has(product.id)) {
        productIds.add(product.id);
        result.push(product);
      }
    }
    
    // Add selected product if not already in list
    if (selectedProduct && !productIds.has(selectedProduct.id)) {
      result.unshift(selectedProduct);
    }
    
    return result;
  }, [availableProducts, selectedProduct]);

  const handleProductClick = (product: Product) => {
    if (isOptional && product.id === selectedProduct?.id) {
      // Toggle off if clicking selected optional item
      onDeselect?.();
    } else {
      onSelect(product.id);
    }
  };

  return (
    <div className='space-y-3'>
      <h3 className='font-semibold text-base'>{title}</h3>

      {selectedProduct && availableProducts.length === 0 ? (
        // Single selected item - show card
        <div className='max-w-[140px]'>
          <SlotCard
            product={selectedProduct}
            isSelected
            onClick={isOptional ? onDeselect : undefined}
          />
        </div>
      ) : allProducts.length > 0 ? (
        // Multiple options - show carousel (no arrows)
        <Carousel
          opts={{
            align: 'start',
            loop: false,
            dragFree: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2 mr-0'>
            {allProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className='pl-2 basis-[140px] min-w-[140px]'
              >
                <SlotCard
                  product={product}
                  isSelected={product.id === selectedProduct?.id}
                  onClick={() => handleProductClick(product)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        // No products available
        <div className='max-w-[140px]'>
          <Card>
            <CardContent className='p-3'>
              <div className='aspect-[3/4] flex items-center justify-center rounded-lg bg-secondary/50 border-2 border-dashed'>
                <p className='text-xs text-muted-foreground text-center px-2'>
                  No items available
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
