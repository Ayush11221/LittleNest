import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { AnimatePresence, motion } from 'motion/react';
import CartDrawer from './CartDrawer.jsx';
import SearchOverlay from './SearchOverlay.jsx';
import { fetchCategories } from '../services/productService.js';

const ANNOUNCEMENTS = [
  'Free shipping on orders over ₹1,999',
  'New arrivals every week',
  'Soft, breathable fabrics for delicate skin',
];

function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const go = (delta) => {
    setIndex((i) => (i + delta + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  return (
    <div className="bg-neutral-950 text-neutral-50">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12">
        <div className="flex items-center justify-between h-10">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous announcement"
            className="p-1 text-neutral-400 hover:text-neutral-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-xs font-medium tracking-wide"
            >
              {ANNOUNCEMENTS[index]}
            </motion.p>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next announcement"
            className="p-1 text-neutral-400 hover:text-neutral-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount, isDrawerOpen, openDrawer, closeDrawer } = useCart();
  const { user, signOut } = useAuth();
  const { productIds: wishlistIds } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const accountRef = useRef(null);
  const shopMenuRef = useRef(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    const handleClickOutside = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountOpen]);

  useEffect(() => {
    if (!shopMenuOpen) return;
    const handleClickOutside = (event) => {
      if (!shopMenuRef.current?.contains(event.target)) setShopMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [shopMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setAccountOpen(false);
    setMobileOpen(false);
  };

  const navLinks = [{ label: 'About', to: '/about' }];

  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border transition-colors">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12">
        <div className="flex md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center justify-between gap-4 py-6 lg:py-8">
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative" ref={shopMenuRef}>
              <button
                type="button"
                onClick={() => setShopMenuOpen((open) => !open)}
                aria-expanded={shopMenuOpen}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide transition-colors py-1"
              >
                Shop
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${shopMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {shopMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute left-0 mt-3 w-64 rounded-2xl border border-border bg-background shadow-soft p-4"
                  >
                    <Link
                      to="/shop"
                      onClick={() => setShopMenuOpen(false)}
                      className="block px-2 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Shop All
                    </Link>
                    <div className="mt-1 grid grid-cols-1 gap-0.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.slug}`}
                          onClick={() => setShopMenuOpen(false)}
                          className="px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="group relative text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide transition-colors py-1"
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="order-1 md:order-none font-heading text-2xl text-foreground tracking-tight text-center"
          >
            LittleNest
          </Link>

          {/* Right Actions */}
          <div className="order-2 md:order-none flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/wishlist"
              className="relative hidden sm:block p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={
                wishlistIds.length > 0 ? `Wishlist, ${wishlistIds.length} items` : 'Wishlist'
              }
            >
              <Heart className="h-5 w-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                  {wishlistIds.length > 99 ? '99+' : wishlistIds.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={
                itemCount > 0 ? `Shopping bag, ${itemCount} items` : 'Shopping bag'
              }
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden sm:block relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  aria-expanded={accountOpen}
                  aria-label="Account menu"
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-background py-1"
                    >
                      <p className="px-3 py-2 border-b border-border text-xs text-muted-foreground truncate">
                        Signed in as{' '}
                        <span className="text-foreground">{user.email}</span>
                      </p>
                      <Link
                        to="/account"
                        onClick={() => setAccountOpen(false)}
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="block text-foreground text-sm font-medium tracking-wide py-2 transition-colors"
              >
                Shop All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block pl-3 text-muted-foreground hover:text-foreground text-sm py-1.5 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide py-2 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="block text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide py-2 transition-colors"
              >
                Wishlist{wishlistIds.length > 0 ? ` (${wishlistIds.length})` : ''}
              </Link>
              {user ? (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground py-2 truncate">
                    Signed in as <span className="text-foreground">{user.email}</span>
                  </p>
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide py-2 transition-colors"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide py-2 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide py-2 transition-colors"
                >
                  Account
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
      <CartDrawer open={isDrawerOpen} onClose={closeDrawer} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export default Navbar;
