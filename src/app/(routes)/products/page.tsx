'use client';

import { useState } from 'react';
import { mockProducts } from '~/lib/constants/products';
import { ProductCard } from '../../../components/modules/products/product-card';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'top', label: 'Tops' },
    { id: 'bottom', label: 'Bottoms' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'shades', label: 'Shades' },
    { id: 'hats', label: 'Hats' },
  ];

  // Filter out default products from display
  const displayProducts = mockProducts.filter((product) => !product.isDefault);

  const filteredProducts =
    selectedCategory === 'all'
      ? displayProducts
      : displayProducts.filter((product) => product.category === selectedCategory);

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
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12'>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
