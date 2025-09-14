'use client';

import Image from 'next/image';
import { useState } from 'react';
import { mockProducts } from '~/lib/constants/products';
import type { Product } from '~/lib/constants/products';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? mockProducts
      : mockProducts.filter((product) => product.category === selectedCategory);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Products</h1>
        <p className='text-muted-foreground'>
          Discover our collection of fashion items to create your perfect outfit
        </p>
      </div>

      {/* Category Filter */}
      <div className='mb-8'>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className='group cursor-pointer'>
      <div className='aspect-[3/4] relative overflow-hidden rounded-lg bg-secondary mb-4'>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />

        {/* Add to Outfit Button */}
        <button className='absolute top-3 right-3 p-2 rounded-full bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background'>
          <PlusIcon className='w-4 h-4' />
        </button>
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
            ${product.price}
          </span>
        </div>

        <p className='text-sm text-muted-foreground line-clamp-2'>
          {product.description}
        </p>

      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
      />
    </svg>
  );
}
