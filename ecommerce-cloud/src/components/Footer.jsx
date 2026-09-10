import { Link } from 'react-router-dom';

/**
 * Deliberately theme-invariant — stays a solid dark block in both
 * light and dark mode, rather than following the page's own tokens.
 */
function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-50 mt-auto">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="font-heading text-xl text-neutral-50 tracking-tight">
              LittleNest
            </Link>
            <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
              Little clothes. Big moments.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-50 mb-3 tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?category=onesies-rompers" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  Onesies &amp; Rompers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sleepwear" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  Sleepwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-50 mb-3 tracking-wide">
              Help
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-50 mb-3 tracking-wide">
              About
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about#materials" className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors">
                  Materials
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} LittleNest. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-neutral-500 hover:text-neutral-50 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-neutral-500 hover:text-neutral-50 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
