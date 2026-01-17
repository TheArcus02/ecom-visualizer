'use client';

import { ShoppingBagIcon, WandSparkles } from 'lucide-react';
import { useCartStore } from '~/lib/stores/cart-store';
import { useFittingRoomStore } from '~/lib/stores/fitting-room-store';
import {
  getCartItemsWithDetails,
  calculateCartTotal,
  formatPrice,
} from '~/lib/utils/cart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '~/components/ui/sheet';
import { CartItem } from './cart-item';
import { Button } from '~/components/ui/button';

export function CartSheet() {
  const open = useCartStore((state) => state.isSheetOpen);
  const onOpenChange = useCartStore((state) => state.setSheetOpen);
  const openFittingRoom = useFittingRoomStore((state) => state.openFittingRoom);

  const { items, updateQuantity, removeItem } = useCartStore();
  const cartItemsWithDetails = getCartItemsWithDetails(items);
  const total = calculateCartTotal(items);

  const handleOpenFittingRoom = () => {
    if (items.length === 0) {
      console.warn('No items in cart to generate fit');
      return;
    }
    // Pass cart items as prefilled items
    openFittingRoom(items.map((item) => ({ productId: item.id })));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>Your Outfit ({items.length})</SheetTitle>
          <SheetDescription>
            Review your selected items and create your perfect look
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-auto py-4'>
          {cartItemsWithDetails.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <ShoppingBagIcon className='w-12 h-12 text-muted-foreground mb-4' />
              <h3 className='font-semibold text-foreground mb-2'>
                Your cart is empty
              </h3>
              <p className='text-sm text-muted-foreground'>
                Add some items to get started on your outfit
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {cartItemsWithDetails.map(({ product, quantity }) => (
                <CartItem
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  onUpdateQuantity={(newQuantity) =>
                    updateQuantity(product.id, newQuantity)
                  }
                  onRemove={() => removeItem(product.id)}
                />
              ))}
            </div>
          )}
        </div>

        {cartItemsWithDetails.length > 0 && (
          <SheetFooter className='gap-4 pt-4 border-t'>
            <div className='flex items-center justify-between w-full'>
              <span className='font-semibold text-lg'>Total:</span>
              <span className='font-semibold text-lg'>
                {formatPrice(total)}
              </span>
            </div>

            <div className='grid grid-cols-1 gap-3 w-full'>
              <Button
                variant='secondary'
                size='lg'
                onClick={handleOpenFittingRoom}
              >
                <WandSparkles className='w-4 h-4 mr-2' />
                Visualize Your Fit
              </Button>

              <Button
                size='lg'
                variant='default'
                onClick={() => {
                  // TODO: Implement payment logic
                  console.log('Proceed to payment');
                }}
              >
                Proceed to Payment
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
