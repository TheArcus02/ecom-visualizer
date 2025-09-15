import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '~/components/modules/products/product-card';
import { mockProducts } from '~/lib/constants/products';

export function Bestsellers() {
  const bestsellerProducts = mockProducts.slice(0, 4);

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Bestsellers
          </h2>
          <Link href='/products' className='flex items-center'>
            Shop All
            <ChevronRight className='size-5 ml-1' />
          </Link>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {bestsellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
