'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { Loader2, WandSparkles } from 'lucide-react';
import type { CartItem } from '~/lib/stores/cart-store';
import { mockProducts  } from '~/lib/constants/products';
import type {Product} from '~/lib/constants/products';
import {
  buildInitialOutfitState,
  outfitStateToFormData,
} from '~/lib/utils/outfit-builder';
import type {OutfitBuilderState} from '~/lib/utils/outfit-builder';
import type {OutfitFormData} from '~/lib/schemas/outfit';
import { SlotSection } from './slot-section';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';
import { Field, FieldLabel, FieldError } from '~/components/ui/field';
import { useGenerateFit } from '~/hooks/use-generate-fit';
import { OutfitPreviewDialog } from '../cart/outfit-preview-dialog';

interface FittingRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
}

function getProductById(productId: string): Product | null {
  return mockProducts.find((p) => p.id === productId) ?? null;
}

export function FittingRoomModal({
  open,
  onOpenChange,
  cartItems,
}: FittingRoomModalProps) {
  const [outfitState, setOutfitState] = useState<OutfitBuilderState | null>(
    null
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  const generateFitMutation = useGenerateFit({
    onSuccess: (data) => {
      if (data.success && data.data) {
        setGeneratedImage(data.data.generatedImage);
        setShowPreviewDialog(true);
        onOpenChange(false);
      }
    },
    onError: (error) => {
      alert(`Failed to generate fit: ${error.message}`);
    },
  });

  // Initialize outfit state when modal opens
  useEffect(() => {
    if (open && cartItems.length > 0) {
      try {
        const initialState = buildInitialOutfitState(cartItems, 'male');
        setOutfitState(initialState);
      } catch (error) {
        console.error('Failed to initialize outfit state:', error);
        alert('Failed to initialize outfit. Please try again.');
        onOpenChange(false);
      }
    }
  }, [open, cartItems, onOpenChange]);

  const defaultFormValues: OutfitFormData = outfitState
    ? outfitStateToFormData(outfitState)
    : {
        top: '',
        bottom: '',
        shoes: '',
        model: 'male',
      };

  const form = useForm({
    defaultValues: defaultFormValues,
    onSubmit: async ({ value }) => {
      // Convert outfit form data to cart items format for API
      const outfitProducts: Product[] = [];
      if (value.top) outfitProducts.push(getProductById(value.top)!);
      if (value.bottom) outfitProducts.push(getProductById(value.bottom)!);
      if (value.shoes) outfitProducts.push(getProductById(value.shoes)!);
      if (value.outerwear && value.outerwear.length > 0)
        outfitProducts.push(getProductById(value.outerwear)!);
      if (value.shades && value.shades.length > 0)
        outfitProducts.push(getProductById(value.shades)!);
      if (value.hats && value.hats.length > 0)
        outfitProducts.push(getProductById(value.hats)!);

      // Convert to cart items format
      const outfitCartItems: CartItem[] = outfitProducts.map((p) => ({
        id: p.id,
        quantity: 1,
      }));

      // Call API with model parameter
      generateFitMutation.mutate({
        cartItems: outfitCartItems,
        model: value.model,
      });
    },
  });

  // Update form when outfit state changes
  useEffect(() => {
    if (outfitState) {
      const formData = outfitStateToFormData(outfitState);
      form.setFieldValue('top', formData.top);
      form.setFieldValue('bottom', formData.bottom);
      form.setFieldValue('shoes', formData.shoes);
      form.setFieldValue('outerwear', formData.outerwear);
      form.setFieldValue('shades', formData.shades);
      form.setFieldValue('hats', formData.hats);
      form.setFieldValue('model', formData.model);
    }
  }, [outfitState, form]);

  if (!outfitState) {
    return null;
  }

  const handleSlotSelect = (slotName: string, productId: string) => {
    setOutfitState((prev) => {
      if (!prev) return null;

      const slot = prev.slots[slotName as keyof typeof prev.slots];
      if (!slot) {
        // Create new slot for optional items
        return {
          ...prev,
          slots: {
            ...prev.slots,
            [slotName]: {
              selected: productId,
              alternatives: [],
            },
          },
        };
      }

      // Just update the selected, keep alternatives stable
      return {
        ...prev,
        slots: {
          ...prev.slots,
          [slotName]: {
            ...slot,
            selected: productId,
          },
        },
      };
    });

    // Update form field
    form.setFieldValue(slotName as keyof OutfitFormData, productId);
  };

  const handleSlotDeselect = (slotName: string) => {
    setOutfitState((prev) => {
      if (!prev) return null;

      const { [slotName]: _, ...remainingSlots } = prev.slots as Record<string, unknown>;

      return {
        ...prev,
        slots: remainingSlots as typeof prev.slots,
      };
    });

    // Clear form field
    form.setFieldValue(slotName as keyof OutfitFormData, undefined);
  };

  const optionalSlotNames = ['outerwear', 'shades', 'hats'];

  const getSlotProduct = (slotName: string): Product | null => {
    const slot = outfitState?.slots[slotName as keyof typeof outfitState.slots];
    if (!slot) return null;
    return getProductById(slot.selected);
  };

  const allSlots = [
    { name: 'top', label: 'Top' },
    { name: 'bottom', label: 'Bottom' },
    { name: 'shoes', label: 'Shoes' },
    { name: 'outerwear', label: 'Outerwear' },
    { name: 'shades', label: 'Shades' },
    { name: 'hats', label: 'Hats' },
  ];

  // Get all products for a category - always show all available options
  const getProductsForSlot = (slotName: string): Product[] => {
    // Get all products matching this category (excluding defaults for optional slots)
    const isOptional = optionalSlotNames.includes(slotName);
    const categoryProducts = mockProducts.filter(
      (p) => p.category === slotName && (isOptional ? !p.isDefault : true)
    );
    
    return categoryProducts;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              Virtual Fitting Room
            </DialogTitle>
            <DialogDescription>
              Configure your outfit before generating the visualization
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
            className='space-y-6'
          >
            {/* Model Selector */}
            <Field>
              <FieldLabel>Model</FieldLabel>
              <form.Field
                name='model'
                validators={{
                  onChange: ({ value }) => {
                    if (value !== 'male' && value !== 'female') {
                      return { message: 'Model must be male or female' };
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value as 'male' | 'female');
                      setOutfitState((prev) =>
                        prev ? { ...prev, model: value as 'male' | 'female' } : null
                      );
                    }}
                    className='flex gap-4'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='male' id='male' />
                      <Label htmlFor='male'>Male</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='female' id='female' />
                      <Label htmlFor='female'>Female</Label>
                    </div>
                  </RadioGroup>
                )}
              </form.Field>
            </Field>

            {/* All Slot Sections */}
            <div className='space-y-6'>
              {allSlots.map((slot) => {
                const selectedProduct = getSlotProduct(slot.name);
                const availableProducts = getProductsForSlot(slot.name);
                const isOptional = optionalSlotNames.includes(slot.name);

                return (
                  <form.Field
                    key={slot.name}
                    name={slot.name as keyof OutfitFormData}
                  >
                    {(field) => (
                      <div>
                        <SlotSection
                          title={slot.label}
                          selectedProduct={selectedProduct}
                          availableProducts={availableProducts}
                          onSelect={(productId) =>
                            handleSlotSelect(slot.name, productId)
                          }
                          onDeselect={
                            isOptional
                              ? () => handleSlotDeselect(slot.name)
                              : undefined
                          }
                          isOptional={isOptional}
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    )}
                  </form.Field>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className='flex justify-end gap-4 pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={generateFitMutation.isPending}
                size='lg'
              >
                {generateFitMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Generating...
                  </>
                ) : (
                  <>
                    <WandSparkles className='w-4 h-4 mr-2' />
                    Generate Outfit
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Outfit Preview Dialog */}
      <OutfitPreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        generatedImage={generatedImage}
        products={
          outfitState
            ? [
                getSlotProduct('top'),
                getSlotProduct('bottom'),
                getSlotProduct('shoes'),
                getSlotProduct('outerwear'),
                getSlotProduct('shades'),
                getSlotProduct('hats'),
              ].filter((p): p is Product => p !== null)
            : []
        }
        isLoading={generateFitMutation.isPending}
      />
    </>
  );
}
