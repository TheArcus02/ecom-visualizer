'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { Check, Mars, Venus, WandSparkles } from 'lucide-react';
import { mockProducts } from '~/lib/constants/products';
import type { Product } from '~/lib/constants/products';
import {
  outfitStateToFormData,
} from '~/lib/utils/outfit-builder';
import type { OutfitBuilderState } from '~/lib/utils/outfit-builder';
import type { OutfitFormData } from '~/lib/schemas/outfit';
import { SlotSection } from './slot-section';
import { Button } from '~/components/ui/button';
import { Field, FieldLabel, FieldError } from '~/components/ui/field';
import { cn } from '~/lib/utils';

function getProductById(productId: string): Product | null {
  return mockProducts.find((p) => p.id === productId) ?? null;
}

const ALL_SLOTS = [
  { name: 'top', label: 'Top' },
  { name: 'bottom', label: 'Bottom' },
  { name: 'shoes', label: 'Shoes' },
  { name: 'outerwear', label: 'Outerwear' },
  { name: 'shades', label: 'Shades' },
  { name: 'hats', label: 'Hats' },
] as const;

const OPTIONAL_SLOT_NAMES = ['outerwear', 'shades', 'hats'];

interface FittingRoomConfigurationProps {
  outfitState: OutfitBuilderState;
  onOutfitStateChange: (state: OutfitBuilderState) => void;
  onSubmit: (products: Product[], model: 'male' | 'female') => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function FittingRoomConfiguration({
  outfitState,
  onOutfitStateChange,
  onSubmit,
  onCancel,
  isSubmitting,
}: FittingRoomConfigurationProps) {
  const defaultFormValues: OutfitFormData = outfitStateToFormData(outfitState);

  const form = useForm({
    defaultValues: defaultFormValues,
    onSubmit: ({ value }) => {
      const outfitProducts: Product[] = [];

      const addProduct = (productId: string | undefined) => {
        if (productId) {
          const product = getProductById(productId);
          if (product) outfitProducts.push(product);
        }
      };

      addProduct(value.top);
      addProduct(value.bottom);
      addProduct(value.shoes);
      addProduct(value.outerwear);
      addProduct(value.shades);
      addProduct(value.hats);

      onSubmit(outfitProducts, value.model);
    },
  });

  // Sync form with outfit state changes
  useEffect(() => {
    const formData = outfitStateToFormData(outfitState);
    form.setFieldValue('top', formData.top);
    form.setFieldValue('bottom', formData.bottom);
    form.setFieldValue('shoes', formData.shoes);
    form.setFieldValue('outerwear', formData.outerwear);
    form.setFieldValue('shades', formData.shades);
    form.setFieldValue('hats', formData.hats);
    form.setFieldValue('model', formData.model);
  }, [outfitState, form]);

  const handleSlotSelect = (slotName: string, productId: string) => {
    const slot = outfitState.slots[slotName as keyof typeof outfitState.slots];
    
    if (!slot) {
      // Create new slot for optional items
      onOutfitStateChange({
        ...outfitState,
        slots: {
          ...outfitState.slots,
          [slotName]: {
            selected: productId,
            alternatives: [],
          },
        },
      });
    } else {
      // Update selected, keep alternatives stable
      onOutfitStateChange({
        ...outfitState,
        slots: {
          ...outfitState.slots,
          [slotName]: {
            ...slot,
            selected: productId,
          },
        },
      });
    }

    form.setFieldValue(slotName as keyof OutfitFormData, productId);
  };

  const handleSlotDeselect = (slotName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [slotName]: _removed, ...remainingSlots } = outfitState.slots as Record<string, unknown>;

    onOutfitStateChange({
      ...outfitState,
      slots: remainingSlots as typeof outfitState.slots,
    });

    form.setFieldValue(slotName as keyof OutfitFormData, undefined);
  };

  const getSlotProduct = (slotName: string): Product | null => {
    const slot = outfitState.slots[slotName as keyof typeof outfitState.slots];
    if (!slot) return null;
    return getProductById(slot.selected);
  };

  const getProductsForSlot = (slotName: string): Product[] => {
    const isOptional = OPTIONAL_SLOT_NAMES.includes(slotName);
    return mockProducts.filter(
      (p) => p.category === slotName && (isOptional ? !p.isDefault : true)
    );
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className='space-y-6 pb-6'
        id='fitting-room-form'
      >
        {/* Model Selector */}
        <Field>
          <FieldLabel>Model</FieldLabel>
          <form.Field name='model'>
            {(field) => (
              <div
                role='radiogroup'
                aria-label='Model'
                className='grid grid-cols-2 gap-3'
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    field.handleChange('male');
                    onOutfitStateChange({ ...outfitState, model: 'male' });
                  }
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    field.handleChange('female');
                    onOutfitStateChange({ ...outfitState, model: 'female' });
                  }
                }}
              >
                <button
                  type='button'
                  role='radio'
                  aria-checked={field.state.value === 'male'}
                  onClick={() => {
                    field.handleChange('male');
                    onOutfitStateChange({ ...outfitState, model: 'male' });
                  }}
                  className={cn(
                    'group flex w-full items-center justify-between gap-3 rounded-xl border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                    field.state.value === 'male' &&
                      'border-primary bg-accent/30 ring-1 ring-primary/30'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={cn(
                        'flex size-10 items-center justify-center rounded-lg border bg-background',
                        field.state.value === 'male' && 'border-primary/40'
                      )}
                    >
                      <Mars
                        className={cn(
                          'size-5 text-muted-foreground',
                          field.state.value === 'male' && 'text-primary'
                        )}
                      />
                    </div>
                    <div className='leading-tight'>
                      <div className='font-medium'>Men</div>
                      <div className='text-xs text-muted-foreground'>
                        Male model
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex size-6 items-center justify-center rounded-full border text-muted-foreground transition-opacity',
                      field.state.value === 'male'
                        ? 'border-primary bg-primary text-primary-foreground opacity-100'
                        : 'opacity-0'
                    )}
                    aria-hidden='true'
                  >
                    <Check className='size-4' />
                  </div>
                </button>

                <button
                  type='button'
                  role='radio'
                  aria-checked={field.state.value === 'female'}
                  onClick={() => {
                    field.handleChange('female');
                    onOutfitStateChange({ ...outfitState, model: 'female' });
                  }}
                  className={cn(
                    'group flex w-full items-center justify-between gap-3 rounded-xl border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                    field.state.value === 'female' &&
                      'border-primary bg-accent/30 ring-1 ring-primary/30'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={cn(
                        'flex size-10 items-center justify-center rounded-lg border bg-background',
                        field.state.value === 'female' && 'border-primary/40'
                      )}
                    >
                      <Venus
                        className={cn(
                          'size-5 text-muted-foreground',
                          field.state.value === 'female' && 'text-primary'
                        )}
                      />
                    </div>
                    <div className='leading-tight'>
                      <div className='font-medium'>Women</div>
                      <div className='text-xs text-muted-foreground'>
                        Female model
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex size-6 items-center justify-center rounded-full border text-muted-foreground transition-opacity',
                      field.state.value === 'female'
                        ? 'border-primary bg-primary text-primary-foreground opacity-100'
                        : 'opacity-0'
                    )}
                    aria-hidden='true'
                  >
                    <Check className='size-4' />
                  </div>
                </button>
              </div>
            )}
          </form.Field>
        </Field>

        {/* All Slot Sections */}
        <div className='space-y-6'>
          {ALL_SLOTS.map((slot) => {
            const selectedProduct = getSlotProduct(slot.name);
            const availableProducts = getProductsForSlot(slot.name);
            const isOptional = OPTIONAL_SLOT_NAMES.includes(slot.name);

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
      </form>

      {/* Sticky Footer with Buttons */}
      <div className='sticky bottom-0 bg-background border-t pt-4 pb-6 -mx-6 px-6 mt-6'>
        <div className='flex justify-end gap-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type='submit'
            form='fitting-room-form'
            disabled={isSubmitting}
            size='lg'
          >
            <WandSparkles className='w-4 h-4 mr-2' />
            Generate Outfit
          </Button>
        </div>
      </div>
    </>
  );
}
