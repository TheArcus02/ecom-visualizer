'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  DownloadIcon,
  Maximize2,
  Share2Icon,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import type { Product } from '~/lib/constants/products';
import { formatPrice } from '~/lib/utils/cart';

interface FittingRoomResultProps {
  generatedImage: string | null;
  products: Product[];
  isLoading: boolean;
  onBack: () => void;
}

export function FittingRoomResult({
  generatedImage,
  products,
  isLoading,
  onBack,
}: FittingRoomResultProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      // Works for both data URLs and normal URLs.
      const res = await fetch(generatedImage);
      if (!res.ok) throw new Error('Failed to fetch image for download');

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `fitting-room-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, '-')}.${blob.type.split('/')[1] ?? 'png'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(err);
      // Fallback: open in a new tab so the user can save manually.
      window.open(generatedImage, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <TooltipProvider>
      <div className='space-y-6 py-6'>
        {/* Header with back button */}
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onBack}
            disabled={isLoading}
            className='p-2'
          >
            <ArrowLeft className='w-4 h-4' />
          </Button>
          <h2 className='text-xl font-semibold'>
            {isLoading ? 'Generating Your Outfit...' : 'Your Generated Outfit'}
          </h2>
        </div>

        {/* Generated Image */}
        <div className='flex items-center justify-center'>
          <div className='group relative w-full max-w-lg aspect-square rounded-lg overflow-hidden bg-secondary'>
            {!isLoading && generatedImage && (
              <div className='absolute right-2 top-2 z-10 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type='button'
                      variant='secondary'
                      size='icon-sm'
                      className='bg-background/70 backdrop-blur hover:bg-background'
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <Maximize2 className='w-4 h-4' />
                      <span className='sr-only'>Enlarge image</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enlarge</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            {isLoading ? (
              <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
                <Loader2 className='w-12 h-12 animate-spin text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  Creating your outfit visualization...
                </p>
              </div>
            ) : generatedImage ? (
              <Image
                src={generatedImage}
                alt='Generated outfit visualization'
                fill
                className='object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <p className='text-sm text-muted-foreground'>
                  No image generated
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className='space-y-3'>
          <h3 className='font-semibold text-foreground'>
            Outfit Items ({products.length})
          </h3>

          <div className='flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1'>
            {products.map((product) => (
              <div
                key={product.id}
                className='flex items-start gap-3 p-3 bg-secondary/30 rounded-lg flex-shrink-0'
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

        {/* Actions */}
        {!isLoading && (
          <div className='flex items-center justify-between pt-4 border-t'>
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
                  <p>Bad</p>
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
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleDownload}
                    disabled={!generatedImage}
                  >
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
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen} modal={false}>
        <DialogContent className='max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl max-h-[90vh] p-0 overflow-hidden'>
          <div className='bg-black'>
            {generatedImage ? (
              <div className='relative h-[85vh] w-full'>
                <Image
                  src={generatedImage}
                  alt='Generated outfit visualization'
                  fill
                  sizes='95vw'
                  unoptimized
                  className='object-contain'
                />
              </div>
            ) : (
              <div className='p-6 text-sm text-muted-foreground bg-background'>
                No image generated
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
