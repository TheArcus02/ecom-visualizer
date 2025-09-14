'use client';

import { SiteHeader } from '~/components/layout/site-header';
import { SiteFooter } from '~/components/layout/site-footer';
import { CartSheet } from '~/components/modules/cart/cart-sheet';
import { useCartStore } from '~/lib/stores/cart-store';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSheetOpen, setSheetOpen } = useCartStore();

  return (
    <div className='bg-background relative z-10 flex min-h-svh flex-col'>
      <SiteHeader />
      <main className='flex flex-1 flex-col'>{children}</main>
      <SiteFooter />
      <CartSheet open={isSheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
