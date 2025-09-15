'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '~/lib/stores/cart-store';

export function SiteHeader() {
  const { getTotalItems, setSheetOpen } = useCartStore();
  const totalItems = getTotalItems();

  const handleCartClick = () => {
    setSheetOpen(true);
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex-1'>
            <Link
              href='/products'
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            >
              Products
            </Link>
          </div>

          <div className='flex-1 flex justify-center'>
            <Link
              href='/'
              className='font-light tracking-wide text-xl text-foreground hover:text-foreground/80 transition-colors uppercase'
            >
              Thalorra
            </Link>
          </div>

          <div className='flex-1 flex justify-end'>
            <button
              onClick={handleCartClick}
              className='relative p-2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <ShoppingCart className='w-5 h-5' />
              {totalItems > 0 && (
                <span className='absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
