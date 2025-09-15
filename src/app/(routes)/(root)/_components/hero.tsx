import Link from 'next/link';
import { Button } from '~/components/ui/button';

export function Hero() {
  return (
    <section className='min-h-[90ch] relative bg-gradient-to-r from-gray-900 to-gray-700 text-white flex flex-col items-center justify-center'>
      <div className='container mx-auto px-4 py-24 text-center'>
        <h1 className='text-4xl md:text-6xl font-bold mb-6'>
          Visualize Your Perfect Outfit
        </h1>
        <p className='text-lg mb-8 text-muted max-w-3xl mx-auto'>
          Create stunning outfit combinations with AI. Select your favorite
          pieces, generate preview images, and shop the complete look.
        </p>
        <Button asChild size='lg' variant='secondary'>
          <Link href='/products'>SHOP NOW</Link>
        </Button>
      </div>
    </section>
  );
}
