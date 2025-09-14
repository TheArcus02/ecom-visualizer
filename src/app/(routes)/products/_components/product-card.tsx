'use client';

import { CheckIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '~/lib/constants/products';
import { useCartStore } from '~/lib/stores/cart-store';
import { formatPrice } from '~/lib/utils/cart';

export function ProductCard({ product }: { product: Product }) {
  const { addItem, isInCart, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addItem(product.id);
  };

  return (
    <article className='group cursor-pointer'>
      <div className='aspect-[3/4] relative overflow-hidden rounded-lg bg-secondary mb-4'>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
            inCart
              ? 'bg-foreground text-background opacity-100'
              : 'bg-background/90 opacity-0 group-hover:opacity-100 hover:bg-background'
          }`}
        >
          {inCart ? (
            <CheckIcon className='w-4 h-4' />
          ) : (
            <PlusIcon className='w-4 h-4' />
          )}
        </button>

        {/* Quantity Badge */}
        {quantity > 0 && (
          <div className='absolute top-1 right-1 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
            {quantity}
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <div className='flex items-start justify-between'>
          <div>
            <h3 className='font-medium text-foreground group-hover:text-foreground/80 transition-colors'>
              {product.name}
            </h3>
            <p className='text-sm text-muted-foreground'>{product.brand}</p>
          </div>
          <span className='font-semibold text-foreground'>
            {formatPrice(product.price)}
          </span>
        </div>

        <p className='text-sm text-muted-foreground line-clamp-2'>
          {product.description}
        </p>
      </div>
    </article>
  );
}
