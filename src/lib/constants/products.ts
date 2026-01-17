export type ProductCategory = 'top' | 'bottom' | 'shoes' | 'outerwear' | 'shades' | 'hats';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  description: string;
  brand: string;
  isDefault?: boolean; // Default items for fallback slots
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Off-White T-Shirt',
    price: 189.99,
    category: 'top',
    imageUrl: '/products/off-white-tee.png',
    description:
      'Premium streetwear t-shirt with signature Off-White branding.',
    brand: 'Off-White',
  },
  {
    id: '2',
    name: 'American Vintage Pants',
    price: 129.99,
    category: 'bottom',
    imageUrl: '/products/american-vintage-pants.png',
    description: 'Comfortable vintage-inspired pants perfect for casual wear.',
    brand: 'American Vintage',
  },
  {
    id: '3',
    name: 'Balenciaga Sneakers',
    price: 795.99,
    category: 'shoes',
    imageUrl: '/products/balenciaga-shoes.png',
    description:
      'High-fashion sneakers with modern design and premium materials.',
    brand: 'Balenciaga',
  },
  {
    id: '4',
    name: 'Oakley Sunglasses',
    price: 149.99,
    category: 'shades',
    imageUrl: '/products/oakly-shades.png',
    description:
      'Sport sunglasses with advanced lens technology and sleek design.',
    brand: 'Oakley',
  },
  {
    id: '5',
    name: 'Casablanca Jacket',
    price: 1295.99,
    category: 'outerwear',
    imageUrl: '/products/casablanca-jacket.png',
    description:
      'Luxury silk jacket with vibrant prints inspired by Moroccan heritage.',
    brand: 'Casablanca',
  },
  {
    id: '6',
    name: 'Gucci Beanie',
    price: 295.99,
    category: 'hats',
    imageUrl: '/products/gucci-beanie.png',
    description:
      'Premium wool beanie with iconic GG logo and Italian craftsmanship.',
    brand: 'Gucci',
  },
  {
    id: '7',
    name: 'MISBHV Pants',
    price: 379.99,
    category: 'bottom',
    imageUrl: '/products/misbhv-pants.png',
    description:
      'Contemporary streetwear pants with avant-garde silhouette and details.',
    brand: 'MISBHV',
  },
  {
    id: '8',
    name: 'Balenciaga Sunglasses',
    price: 525.99,
    category: 'shades',
    imageUrl: '/products/balenciaga-shades.png',
    description:
      'Designer sunglasses with futuristic frames and premium UV protection.',
    brand: 'Balenciaga',
  },
  // Default fallback items
  {
    id: 'default-top',
    name: 'Basic White Tee',
    price: 29.99,
    category: 'top',
    imageUrl: '/products/off-white-tee.png', // Using existing image as placeholder
    description: 'Classic white t-shirt - perfect base for any outfit.',
    brand: 'Basic',
    isDefault: true,
  },
  {
    id: 'default-bottom',
    name: 'Black Jeans',
    price: 79.99,
    category: 'bottom',
    imageUrl: '/products/american-vintage-pants.png', // Using existing image as placeholder
    description: 'Classic black jeans - versatile and timeless.',
    brand: 'Basic',
    isDefault: true,
  },
  {
    id: 'default-shoes',
    name: 'White Sneakers',
    price: 89.99,
    category: 'shoes',
    imageUrl: '/products/balenciaga-shoes.png', // Using existing image as placeholder
    description: 'Clean white sneakers - goes with everything.',
    brand: 'Basic',
    isDefault: true,
  },
];
