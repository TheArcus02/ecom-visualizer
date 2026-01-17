import { SiteHeader } from '~/components/layout/site-header';
import { SiteFooter } from '~/components/layout/site-footer';
import { CartSheet } from '~/components/modules/cart/cart-sheet';
import { FittingRoomModal } from '~/components/modules/fitting-room/fitting-room-modal';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='bg-background relative z-10 flex min-h-svh flex-col'>
      <SiteHeader />
      <main className='flex flex-1 flex-col'>{children}</main>
      <SiteFooter />
      <CartSheet />
      <FittingRoomModal />
    </div>
  );
}
