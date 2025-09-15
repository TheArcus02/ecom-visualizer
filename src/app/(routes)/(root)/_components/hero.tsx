import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export function Hero() {
  return (
    <section className='max-h-screen w-full aspect-video relative flex flex-col justify-end -mt-16 pt-16'>
      <Image
        src='/hero.png'
        alt='Hero Image'
        fill
        className='opacity object-cover z-0'
        priority
      />
      <div className='container mx-auto px-4 py-24 z-10'>
        <h1 className='text-4xl max-w-2xl md:text-6xl text-white font-semibold'>
          Visualize your dream outfit
        </h1>
        <p className='text-lg text-white/90 max-w-md mt-2'>
          Create stunning outfit combinations from our collections with AI.
        </p>
        <Button asChild size='lg' variant='secondary' className='mt-6'>
          <Link href='/products'>SHOP NOW</Link>
        </Button>
      </div>
    </section>
  );
}
