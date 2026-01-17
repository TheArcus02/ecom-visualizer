import type { Product } from '~/lib/constants/products';

export type FittingRoomStep = 'configuration' | 'generating' | 'result';

export interface FittingRoomFlowState {
  step: FittingRoomStep;
  generatedImage: string | null;
  selectedProducts: Product[];
}
