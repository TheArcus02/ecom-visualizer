import { z } from 'zod';

export const outfitSchema = z.object({
  top: z.string().min(1, 'Top is required'),
  bottom: z.string().min(1, 'Bottom is required'),
  shoes: z.string().min(1, 'Shoes are required'),
  outerwear: z.string().optional(),
  shades: z.string().optional(),
  hats: z.string().optional(),
  model: z.enum(['male', 'female']),
});

export type OutfitFormData = z.infer<typeof outfitSchema>;
