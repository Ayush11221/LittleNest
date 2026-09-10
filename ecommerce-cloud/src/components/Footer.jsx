import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="font-heading text-xl text-foreground tracking-tight">
              LittleNest
            </Link>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              Little clothes. Big moments.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?category=onesies-rompers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Onesies &amp; Rompers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sleepwear" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sleepwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 tracking-wide">
              Help
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  Shipping
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  Returns
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  Contact
                </span>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 tracking-wide">
              About
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  Our Story
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  Materials
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LittleNest. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
