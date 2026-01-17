import { useMutation } from '@tanstack/react-query';
import type { CartItem } from '~/lib/stores/cart-store';
import type {
  GenerateFitRequest,
  GenerateFitResponse,
} from '~/app/api/generate-fit/route';

interface UseGenerateFitOptions {
  onSuccess?: (data: GenerateFitResponse) => void;
  onError?: (error: Error) => void;
}

export function useGenerateFit(options?: UseGenerateFitOptions) {
  return useMutation({
    mutationFn: async (
      request: GenerateFitRequest
    ): Promise<GenerateFitResponse> => {
      const response = await fetch('/api/generate-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request satisfies GenerateFitRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        console.log('Image concatenation successful:', {
          size: data.data.metadata.size,
          dimensions: `${data.data.metadata.width}x${data.data.metadata.height}`,
          validProducts: data.data.metadata.validProducts,
          invalidProducts: data.data.metadata.invalidProducts,
        });
        options?.onSuccess?.(data);
      } else {
        console.error('Image concatenation failed:', data.error);
        const error = new Error(data.error ?? 'Failed to generate fit');
        options?.onError?.(error);
      }
    },
    onError: (error) => {
      console.error('Error calling generate-fit API:', error);
      options?.onError?.(error);
    },
  });
}
