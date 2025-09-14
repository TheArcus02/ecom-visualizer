export function SiteFooter() {
  return (
    <footer className='border-t bg-background mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <h3 className='font-semibold text-lg text-foreground'>Fashion Visualizer</h3>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              AI-powered outfit visualization for the perfect look.
            </p>
          </div>
          <div className='space-y-4'>
            <h4 className='font-medium text-foreground'>Shop</h4>
            <ul className='space-y-3 text-sm text-muted-foreground'>
              <li>
                <a href='/products' className='hover:text-foreground transition-colors'>
                  All Products
                </a>
              </li>
              <li>
                <a
                  href='/products?category=tops'
                  className='hover:text-foreground transition-colors'
                >
                  Tops
                </a>
              </li>
              <li>
                <a
                  href='/products?category=bottoms'
                  className='hover:text-foreground transition-colors'
                >
                  Bottoms
                </a>
              </li>
              <li>
                <a
                  href='/products?category=shoes'
                  className='hover:text-foreground transition-colors'
                >
                  Shoes
                </a>
              </li>
            </ul>
          </div>
          <div className='space-y-4'>
            <h4 className='font-medium text-foreground'>Features</h4>
            <ul className='space-y-3 text-sm text-muted-foreground'>
              <li>
                <a href='/outfit' className='hover:text-foreground transition-colors'>
                  My Outfit
                </a>
              </li>
              <li>
                <a href='/generate' className='hover:text-foreground transition-colors'>
                  AI Preview
                </a>
              </li>
              <li>
                <a href='/style-presets' className='hover:text-foreground transition-colors'>
                  Style Presets
                </a>
              </li>
            </ul>
          </div>
          <div className='space-y-4'>
            <h4 className='font-medium text-foreground'>Support</h4>
            <ul className='space-y-3 text-sm text-muted-foreground'>
              <li>
                <a href='/help' className='hover:text-foreground transition-colors'>
                  Help Center
                </a>
              </li>
              <li>
                <a href='/contact' className='hover:text-foreground transition-colors'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='/about' className='hover:text-foreground transition-colors'>
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-12 pt-8 border-t text-center text-sm text-muted-foreground'>
          <p>&copy; 2024 Fashion Visualizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
