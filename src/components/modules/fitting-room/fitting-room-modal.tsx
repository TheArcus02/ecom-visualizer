'use client';

import { useState, useEffect, useCallback } from 'react';
import { mockProducts } from '~/lib/constants/products';
import type { Product } from '~/lib/constants/products';
import type { CartItem } from '~/lib/stores/cart-store';
import { useFittingRoomStore } from '~/lib/stores/fitting-room-store';
import { buildInitialOutfitState } from '~/lib/utils/outfit-builder';
import type { OutfitBuilderState } from '~/lib/utils/outfit-builder';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog';
import { useGenerateFit } from '~/hooks/use-generate-fit';
import { FittingRoomConfiguration } from './fitting-room-configuration';
import { FittingRoomResult } from './fitting-room-result';
import type { FittingRoomStep } from './types';

function getProductById(productId: string): Product | null {
  return mockProducts.find((p) => p.id === productId) ?? null;
}

export function FittingRoomModal() {
  const { isOpen, prefilledItems, closeFittingRoom } = useFittingRoomStore();
  
  // Flow state management
  const [step, setStep] = useState<FittingRoomStep>('configuration');
  const [outfitState, setOutfitState] = useState<OutfitBuilderState | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const generateFitMutation = useGenerateFit({
    onSuccess: (data) => {
      if (data.success && data.data) {
        setGeneratedImage(data.data.generatedImage);
        setStep('result');
      }
    },
    onError: (error) => {
      alert(`Failed to generate fit: ${error.message}`);
      setStep('configuration');
    },
  });

  // Initialize outfit state when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const cartItems: CartItem[] = prefilledItems.map((item) => ({
          id: item.productId,
          quantity: 1,
        }));
        const initialState = buildInitialOutfitState(cartItems, 'male');
        setOutfitState(initialState);
        setStep('configuration');
        setGeneratedImage(null);
        setSelectedProducts([]);
      } catch (error) {
        console.error('Failed to initialize outfit state:', error);
        alert('Failed to initialize outfit. Please try again.');
        closeFittingRoom();
      }
    }
  }, [isOpen, prefilledItems, closeFittingRoom]);

  const handleSubmit = useCallback((products: Product[], model: 'male' | 'female') => {
    setSelectedProducts(products);
    setStep('generating');

    const outfitCartItems: CartItem[] = products.map((p) => ({
      id: p.id,
      quantity: 1,
    }));

    generateFitMutation.mutate({
      cartItems: outfitCartItems,
      model,
    });
  }, [generateFitMutation]);

  const handleBack = useCallback(() => {
    setStep('configuration');
  }, []);

  const handleOutfitStateChange = useCallback((newState: OutfitBuilderState) => {
    setOutfitState(newState);
  }, []);

  // Get current products from outfit state for result view
  const getCurrentProducts = useCallback((): Product[] => {
    if (selectedProducts.length > 0) {
      return selectedProducts;
    }
    
    if (!outfitState) return [];
    
    const products: Product[] = [];
    const slotNames = ['top', 'bottom', 'shoes', 'outerwear', 'shades', 'hats'];
    
    for (const slotName of slotNames) {
      const slot = outfitState.slots[slotName as keyof typeof outfitState.slots];
      if (slot) {
        const product = getProductById(slot.selected);
        if (product) products.push(product);
      }
    }
    
    return products;
  }, [outfitState, selectedProducts]);

  if (!outfitState) {
    return null;
  }

  const isGenerating = step === 'generating' || generateFitMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeFittingRoom()}>
      <DialogContent className='max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0'>
        {step === 'configuration' && (
          <>
            <DialogHeader className='px-6 pt-6 pb-4 flex-shrink-0'>
              <DialogTitle className='text-2xl font-bold'>
                Virtual Fitting Room
              </DialogTitle>
              <DialogDescription>
                Configure your outfit before generating the visualization
              </DialogDescription>
            </DialogHeader>

            <div className='flex-1 overflow-y-auto overflow-x-hidden px-6 min-h-0'>
              <FittingRoomConfiguration
                outfitState={outfitState}
                onOutfitStateChange={handleOutfitStateChange}
                onSubmit={handleSubmit}
                onCancel={closeFittingRoom}
                isSubmitting={isGenerating}
              />
            </div>
          </>
        )}

        {(step === 'generating' || step === 'result') && (
          <div className='flex-1 overflow-y-auto overflow-x-hidden px-6 min-h-0'>
            <FittingRoomResult
              generatedImage={generatedImage}
              products={getCurrentProducts()}
              isLoading={isGenerating}
              onBack={handleBack}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
