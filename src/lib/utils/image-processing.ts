import sharp from 'sharp';
import { join } from 'path';
import { readFile } from 'fs/promises';
import type { Product } from '~/lib/constants/products';

export interface ConcatenationResult {
  buffer: Buffer;
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

export interface ImageProcessingOptions {
  targetWidth?: number;
  targetHeight?: number;
  backgroundColor?: string;
  padding?: number;
  quality?: number;
}

const DEFAULT_OPTIONS: Required<ImageProcessingOptions> = {
  targetWidth: 800,
  targetHeight: 800,
  backgroundColor: 'white',
  padding: 20,
  quality: 90,
};

export async function concatenateProductImages(
  products: Product[],
  options: ImageProcessingOptions = {}
): Promise<ConcatenationResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  if (products.length === 0) {
    throw new Error('No products provided for image concatenation');
  }

  try {
    // Load all product images
    const imageBuffers = await Promise.all(
      products.map(async (product) => {
        const imagePath = join(process.cwd(), 'public', product.imageUrl);
        try {
          const buffer = await readFile(imagePath);
          return { product, buffer };
        } catch (error) {
          console.warn(
            `Failed to load image for product ${product.id}: ${product.imageUrl}`
          );
          console.error(error);
          // Return null for missing images, we'll filter them out
          return null;
        }
      })
    );

    // Filter out failed image loads
    const validImages = imageBuffers.filter(
      (img): img is NonNullable<typeof img> => img !== null
    );

    if (validImages.length === 0) {
      throw new Error('No valid product images found');
    }

    // Determine grid layout based on number of images
    const gridLayout = calculateGridLayout(validImages.length);

    // Calculate individual image dimensions
    const cellWidth = Math.floor(
      (config.targetWidth - config.padding * (gridLayout.cols + 1)) /
        gridLayout.cols
    );
    const cellHeight = Math.floor(
      (config.targetHeight - config.padding * (gridLayout.rows + 1)) /
        gridLayout.rows
    );

    // Process each image to fit the cell dimensions
    const processedImages = await Promise.all(
      validImages.map(async ({ product, buffer }) => {
        const processedBuffer = await sharp(buffer)
          .resize(cellWidth, cellHeight, {
            fit: 'cover',
            position: 'center',
          })
          .png()
          .toBuffer();

        return { product, buffer: processedBuffer };
      })
    );

    // Create the composite image
    const composite = sharp({
      create: {
        width: config.targetWidth,
        height: config.targetHeight,
        channels: 3,
        background: config.backgroundColor,
      },
    });

    // Calculate positions and create composite input
    const compositeInputs = processedImages.map(({ buffer }, index) => {
      const row = Math.floor(index / gridLayout.cols);
      const col = index % gridLayout.cols;

      const left = config.padding + col * (cellWidth + config.padding);
      const top = config.padding + row * (cellHeight + config.padding);

      return {
        input: buffer,
        left,
        top,
      };
    });

    // Composite all images
    const finalBuffer = await composite
      .composite(compositeInputs)
      .jpeg({ quality: config.quality })
      .toBuffer();

    // Get metadata
    const metadata = await sharp(finalBuffer).metadata();

    return {
      buffer: finalBuffer,
      metadata: {
        width: metadata.width ?? config.targetWidth,
        height: metadata.height ?? config.targetHeight,
        format: metadata.format ?? 'jpeg',
        size: finalBuffer.length,
      },
    };
  } catch (error) {
    console.error('Image concatenation failed:', error);
    throw new Error(
      `Failed to concatenate images: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

function calculateGridLayout(imageCount: number): {
  rows: number;
  cols: number;
} {
  if (imageCount === 1) return { rows: 1, cols: 1 };
  if (imageCount === 2) return { rows: 1, cols: 2 };
  if (imageCount === 3) return { rows: 2, cols: 2 }; // 3 images in 2x2 grid
  if (imageCount === 4) return { rows: 2, cols: 2 };
  if (imageCount <= 6) return { rows: 2, cols: 3 };
  if (imageCount <= 9) return { rows: 3, cols: 3 };

  // For more than 9 images, calculate optimal rectangle
  const cols = Math.ceil(Math.sqrt(imageCount));
  const rows = Math.ceil(imageCount / cols);

  return { rows, cols };
}

export function imageToBase64(buffer: Buffer, format = 'jpeg'): string {
  return `data:image/${format};base64,${buffer.toString('base64')}`;
}

export async function validateProductImages(products: Product[]): Promise<{
  valid: Product[];
  invalid: Product[];
}> {
  const results = await Promise.allSettled(
    products.map(async (product) => {
      const imagePath = join(process.cwd(), 'public', product.imageUrl);
      await readFile(imagePath);
      return product;
    })
  );

  const valid: Product[] = [];
  const invalid: Product[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      valid.push(products[index]);
    } else {
      invalid.push(products[index]);
    }
  });

  return { valid, invalid };
}
