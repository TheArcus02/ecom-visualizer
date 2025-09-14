import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  concatenateProductImages,
  imageToBase64,
  validateProductImages,
} from '~/lib/utils/image-processing';
import { getCartItemsWithDetails } from '~/lib/utils/cart';
import type { CartItem } from '~/lib/stores/cart-store';

export interface GenerateFitRequest {
  cartItems: CartItem[];
}

export interface GenerateFitResponse {
  success: boolean;
  data?: {
    concatenatedImage: string; // base64 data URL
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

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateFitResponse>> {
  try {
    // Parse request body
    const body = (await request.json()) as GenerateFitRequest;
    const { cartItems } = body;

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

    // Prepare response
    const response: GenerateFitResponse = {
      success: true,
      data: {
        concatenatedImage: base64Image,
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
