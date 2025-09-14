'use client';

import { useCartStore } from '~/lib/stores/cart-store';

export function SiteHeader() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="font-bold text-xl text-foreground">Fashion Visualizer</h1>
          </div>
          <nav className="flex items-center space-x-8">
            <a href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Products
            </a>
            <a href="/outfit" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative">
              My Outfit
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}