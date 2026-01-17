import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import {
  concatenateProductImages,
  imageToBase64,
  validateProductImages,
} from '~/lib/utils/image-processing';
import { getCartItemsWithDetails } from '~/lib/utils/cart';
import type { CartItem } from '~/lib/stores/cart-store';

// Route segment config for Vercel deployment
export const maxDuration = 60; // 60 seconds max execution time
export const dynamic = 'force-dynamic'; // Disable static optimization

export interface GenerateFitRequest {
  cartItems: CartItem[];
  model?: 'male' | 'female';
}

export interface GenerateFitResponse {
  success: boolean;
  data?: {
    concatenatedImage: string; // base64 data URL - original concatenation
    generatedImage: string; // base64 data URL - AI generated lifestyle image
    metadata: {
      width: number;
      height: number;
      format: string;
      size: number;
      productCount: number;
      validProducts: number;
      invalidProducts: string[];
    };
  };
  error?: string;
}

console.log('AI Gateway API key available:', !!process.env.AI_GATEWAY_API_KEY);

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateFitResponse>> {
  try {
    // Parse request body
    const body = (await request.json()) as GenerateFitRequest;
    const { cartItems, model = 'male' } = body;

    // Validate input
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or empty cart items provided',
        },
        { status: 400 }
      );
    }

    console.log(
      `Processing ${cartItems.length} cart items for image concatenation`
    );

    // Get product details from cart items
    const cartItemsWithDetails = getCartItemsWithDetails(cartItems);
    const products = cartItemsWithDetails.map((item) => item.product);

    if (products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid products found in cart items',
        },
        { status: 400 }
      );
    }

    // Validate that product images exist
    const { valid: validProducts, invalid: invalidProducts } =
      await validateProductImages(products);

    if (validProducts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid product images found',
        },
        { status: 400 }
      );
    }

    console.log(
      `Found ${validProducts.length} valid products, ${invalidProducts.length} invalid`
    );

    // Concatenate images
    const concatenationResult = await concatenateProductImages(validProducts, {
      targetWidth: 800,
      targetHeight: 800,
      backgroundColor: 'white',
      padding: 20,
      quality: 90,
    });

    // Convert to base64 data URL
    const base64Image = imageToBase64(
      concatenationResult.buffer,
      concatenationResult.metadata.format
    );

    console.log('Starting AI generation with Gemini...');

    // Generate lifestyle image with AI
    const result = await generateText({
      model: 'gemini-2.5-flash-image-preview',
      providerOptions: {
        google: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Assemble the outfit and put it on a ${model === 'male' ? 'male' : 'female'} model, lifestyle image. Do not add additional items besides the ones provided.`,
            },
            {
              type: 'image',
              image: base64Image,
            },
          ],
        },
      ],
    });

    console.log('AI generation completed');

    const imageFiles = result.files.filter((f) =>
      f.mediaType.startsWith('image/')
    );
    console.log('Image files found:', imageFiles.length || 0);

    if (imageFiles.length === 0) {
      console.log('[v0] No image files generated');
      return NextResponse.json(
        { success: false, error: 'No image was generated' },
        { status: 500 }
      );
    }

    const generatedImage = imageFiles[0];
    console.log('Generated image mediaType:', generatedImage.mediaType);
    console.log('Generated image has base64:', !!generatedImage.base64);

    const generatedBase64Image = `data:${generatedImage.mediaType};base64,${generatedImage.base64}`;
    console.log('[v0] Base64 image created, length:', base64Image.length);

    console.log('[v0] Successfully generated image');

    // Prepare response
    const response: GenerateFitResponse = {
      success: true,
      data: {
        concatenatedImage: base64Image,
        generatedImage: generatedBase64Image,
        metadata: {
          ...concatenationResult.metadata,
          productCount: products.length,
          validProducts: validProducts.length,
          invalidProducts: invalidProducts.map((p) => p.name),
        },
      },
    };

    console.log(
      `Successfully concatenated ${validProducts.length} images. Final size: ${concatenationResult.metadata.size} bytes`
    );

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Generate fit API error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
