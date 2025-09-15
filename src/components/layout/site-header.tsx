'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '~/lib/stores/cart-store';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';
import { useScroll } from '~/hooks/use-scroll';

export function SiteHeader() {
  const { getTotalItems, setSheetOpen } = useCartStore();
  const totalItems = getTotalItems();
  const pathname = usePathname();
  const isScrolled = useScroll(10);

  const isLandingPage = pathname === '/';

  const handleCartClick = () => {
    setSheetOpen(true);
  };

  const isTransparent = isLandingPage && !isScrolled;
  const headerBg = isTransparent ? 'bg-transparent' : 'bg-background';
  const borderStyle = isTransparent ? 'border-transparent' : 'border-b';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        headerBg,
        borderStyle
      )}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex-1'>
            <Link
              href='/products'
              className={cn(
                'text-sm font-medium transition-colors',
                isTransparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Products
            </Link>
          </div>

          <div className='flex-1 flex justify-center'>
            <Link
              href='/'
              className={cn(
                'font-light tracking-wide text-xl transition-colors uppercase',
                isTransparent
                  ? 'text-white hover:text-white/80'
                  : 'text-foreground hover:text-foreground/80'
              )}
            >
              Thalorra
            </Link>
          </div>

          <div className='flex-1 flex justify-end'>
            <button
              onClick={handleCartClick}
              className={cn(
                'relative p-2 transition-colors',
                isTransparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ShoppingCart className='w-5 h-5' />
              {totalItems > 0 && (
                <span
                  className={cn(
                    'absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium',
                    isTransparent
                      ? 'bg-white text-black'
                      : 'bg-foreground text-background'
                  )}
                >
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
