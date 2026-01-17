'use client';

import Image from 'next/image';
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  DownloadIcon,
  Share2Icon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { Skeleton } from '~/components/ui/skeleton';
import type { Product } from '~/lib/constants/products';
import { formatPrice } from '~/lib/utils/cart';

interface OutfitPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedImage: string | null;
  products: Product[];
  isLoading?: boolean;
}

export function OutfitPreviewDialog({
  open,
  onOpenChange,
  generatedImage,
  products,
  isLoading = false,
}: OutfitPreviewDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='lg:max-w-2xl'>
        <TooltipProvider>
          <DialogHeader className='mb-6'>
            <DialogTitle className='text-xl font-semibold'>
              {isLoading ? 'Generating Your Outfit...' : 'Your Generated Outfit'}
            </DialogTitle>
          </DialogHeader>

          {/* Top Section - Image and Items */}
          <div className='flex flex-col gap-8 flex-1 overflow-hidden'>
            {/* Generated Image */}
            <div className='flex-1 flex items-center justify-center min-h-0'>
              <div className='relative w-full max-w-lg aspect-square rounded-lg overflow-hidden bg-secondary'>
                {isLoading ? (
                  <Skeleton className='w-full h-full' />
                ) : generatedImage ? (
                  <Image
                    src={generatedImage}
                    alt='Generated outfit visualization'
                    fill
                    className='object-cover'
                  />
                ) : null}
              </div>
            </div>

            {/* Product List */}
            <div className='w-full flex flex-col min-h-0'>
              <h3 className='font-semibold text-foreground mb-4'>
                Outfit Items ({products.length})
              </h3>

              <div className='flex space-x-3 w-full  overflow-y-hidden pr-2'>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className='flex items-start gap-3 p-3 bg-secondary/30 rounded-lg'
                  >
                    <div className='aspect-[3/4] w-14 relative overflow-hidden rounded-md bg-secondary flex-shrink-0'>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className='object-cover'
                      />
                    </div>

                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-foreground text-sm truncate'>
                        {product.name}
                      </h4>
                      <p className='text-xs text-muted-foreground'>
                        {product.brand}
                      </p>
                      <p className='text-xs font-semibold text-foreground mt-1'>
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - Actions */}
          {!isLoading && (
            <div className='flex items-center justify-between pt-6 border-t mt-6'>
              {/* Rating Section */}
              <div className='flex items-center gap-2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-green-500 hover:text-green-700 hover:bg-green-50'
                    >
                      <ThumbsUpIcon className='w-4 h-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Good!</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-400 hover:text-red-700 hover:bg-red-50'
                    >
                      <ThumbsDownIcon className='w-4 h-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>bad</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <Share2Icon className='w-4 h-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <DownloadIcon className='w-4 h-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
