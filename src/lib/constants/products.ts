export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories';
  imageUrl: string;
  description: string;
  brand: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Off-White T-Shirt',
    price: 189.99,
    category: 'tops',
    imageUrl: '/products/off-white-tee.png',
    description:
      'Premium streetwear t-shirt with signature Off-White branding.',
    brand: 'Off-White',
  },
  {
    id: '2',
    name: 'American Vintage Pants',
    price: 129.99,
    category: 'bottoms',
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
    category: 'accessories',
    imageUrl: '/products/oakly-shades.png',
    description:
      'Sport sunglasses with advanced lens technology and sleek design.',
    brand: 'Oakley',
  },
];
