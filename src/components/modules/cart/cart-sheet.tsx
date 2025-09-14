'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  Trash2Icon,
  Loader2,
} from 'lucide-react';
import { useCartStore } from '~/lib/stores/cart-store';
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
import type { Product } from '~/lib/constants/products';
import { useGenerateFit } from '~/hooks/use-generate-fit';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, updateQuantity, removeItem } = useCartStore();
  const cartItemsWithDetails = getCartItemsWithDetails(items);
  const total = calculateCartTotal(items);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateFitMutation = useGenerateFit({
    onSuccess: (data) => {
      if (data.success && data.data) {
        setGeneratedImage(data.data.concatenatedImage);
      }
    },
    onError: (error) => {
      alert(`Failed to generate fit: ${error.message}`);
    },
  });

  const handleGenerateFit = () => {
    if (items.length === 0) {
      console.warn('No items in cart to generate fit');
      return;
    }
    generateFitMutation.mutate(items);
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

        {/* Generated Image Display */}
        {generatedImage ? (
          <div className='py-4 border-t'>
            <h4 className='font-medium text-foreground mb-3'>
              Your Generated Outfit
            </h4>
            <div className='relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden bg-secondary'>
              <Image
                src={generatedImage}
                alt='Generated outfit visualization'
                fill
                className='object-cover'
              />
            </div>
            <button
              onClick={() => setGeneratedImage(null)}
              className='mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center'
            >
              Close Preview
            </button>
          </div>
        ) : null}

        {cartItemsWithDetails.length > 0 && (
          <SheetFooter className='gap-4 pt-4 border-t'>
            <div className='flex items-center justify-between w-full'>
              <span className='font-semibold text-lg'>Total:</span>
              <span className='font-semibold text-lg'>
                {formatPrice(total)}
              </span>
            </div>

            <div className='grid grid-cols-1 gap-3 w-full'>
              <button
                className='w-full bg-foreground text-background hover:bg-foreground/90 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                onClick={handleGenerateFit}
                disabled={generateFitMutation.isPending}
              >
                {generateFitMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Generating...
                  </>
                ) : (
                  'Visualize Your Fit'
                )}
              </button>

              <button
                className='w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 py-3 px-4 rounded-lg font-medium transition-colors'
                onClick={() => {
                  // TODO: Implement payment logic
                  console.log('Proceed to payment');
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartItem({
  product,
  quantity,
  onUpdateQuantity,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className='flex items-start gap-4 p-4'>
      <div className='aspect-[3/4] w-16 relative overflow-hidden rounded-md bg-secondary flex-shrink-0'>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className='object-cover'
        />
      </div>

      <div className='flex-1 min-w-0'>
        <h4 className='font-medium text-foreground truncate'>{product.name}</h4>
        <p className='text-sm text-muted-foreground'>{product.brand}</p>
        <p className='text-sm font-semibold text-foreground mt-1'>
          {formatPrice(product.price)}
        </p>
      </div>

      <div className='flex flex-col items-end gap-2'>
        <button
          onClick={onRemove}
          className='text-muted-foreground hover:text-foreground p-1'
        >
          <Trash2Icon className='w-4 h-4' />
        </button>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className='w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <MinusIcon className='w-3 h-3' />
          </button>

          <span className='w-8 text-center text-sm font-medium'>
            {quantity}
          </span>

          <button
            onClick={() => onUpdateQuantity(quantity + 1)}
            className='w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary'
          >
            <PlusIcon className='w-3 h-3' />
          </button>
        </div>
      </div>
    </div>
  );
}
