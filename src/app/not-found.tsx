import { Button } from '~/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='grid min-h-[100ch] place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <p className='text-base font-semibold text-foreground'>404</p>
        <h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl'>
          Page not found
        </h1>
        <p className='mt-6 text-lg font-medium text-pretty text-muted-foreground'>
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Button variant='secondary' asChild>
            <Link href='/'>Go back home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
