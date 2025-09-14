'use client';

import Image from 'next/image';
import { PlusIcon, MinusIcon, Trash2Icon } from 'lucide-react';
import { formatPrice } from '~/lib/utils/cart';

import type { Product } from '~/lib/constants/products';

export function CartItem({
  product,
  quantity,
  onUpdateQuantity,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className='flex items-start gap-4 p-4'>
      <div className='aspect-[3/4] w-16 relative overflow-hidden rounded-md bg-secondary flex-shrink-0'>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className='object-cover'
        />
      </div>

      <div className='flex-1 min-w-0'>
        <h4 className='font-medium text-foreground truncate'>{product.name}</h4>
        <p className='text-sm text-muted-foreground'>{product.brand}</p>
        <p className='text-sm font-semibold text-foreground mt-1'>
          {formatPrice(product.price)}
        </p>
      </div>

      <div className='flex flex-col items-end gap-2'>
        <button
          onClick={onRemove}
          className='text-muted-foreground hover:text-foreground p-1'
        >
          <Trash2Icon className='w-4 h-4' />
        </button>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className='w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <MinusIcon className='w-3 h-3' />
          </button>

          <span className='w-8 text-center text-sm font-medium'>
            {quantity}
          </span>

          <button
            onClick={() => onUpdateQuantity(quantity + 1)}
            className='w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary'
          >
            <PlusIcon className='w-3 h-3' />
          </button>
        </div>
      </div>
    </div>
  );
}
