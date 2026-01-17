'use client';

import Image from 'next/image';
import type { Product } from '~/lib/constants/products';

interface SlotCardProps {
  product: Product;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SlotCard({
  product,
  isSelected = false,
  onClick,
}: SlotCardProps) {
  return (
    <div
      onClick={onClick}
      className='cursor-pointer group'
    >
      <div className='aspect-[3/4] relative overflow-hidden rounded-lg bg-secondary mb-2 transition-all duration-200 group-hover:ring-2 group-hover:ring-primary/50'>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className='object-cover transition-transform duration-200 group-hover:scale-105'
        />
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
            isSelected ? 'bg-primary/20 opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`bg-primary text-primary-foreground rounded-full p-2 transition-transform duration-200 ${
              isSelected ? 'scale-100' : 'scale-0'
            }`}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
        </div>
      </div>
      <h4 className='font-medium text-sm text-center line-clamp-2 leading-tight'>
        {product.name}
      </h4>
    </div>
  );
}
