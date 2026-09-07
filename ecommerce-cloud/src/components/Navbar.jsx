import { Link } from 'react-router-dom';
import { ShoppingCart, User, Store } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Store className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">
              Cloud<span className="text-indigo-600">Store</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Products
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-indigo-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link
              to="/login"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
              aria-label="Login"
            >
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
