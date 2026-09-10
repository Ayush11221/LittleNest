import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Sun, Moon, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { AnimatePresence, motion } from 'motion/react';

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
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    if (!accountOpen) return;
    const handleClickOutside = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountOpen]);

  const handleSignOut = async () => {
    await signOut();
    setAccountOpen(false);
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Shop', to: '/shop' },
    { label: 'Collections', to: '/shop' },
    { label: 'About', to: '/about' },
  ];

  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border transition-colors">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12">
        <div className="flex items-center justify-between py-6 lg:py-8">
          {/* Logo */}
          <Link to="/" className="font-heading text-2xl text-foreground tracking-tight">
            LittleNest
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
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

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
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
            </Link>

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
              {user ? (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground py-2 truncate">
                    Signed in as <span className="text-foreground">{user.email}</span>
                  </p>
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
    </div>
  );
}

export default Navbar;
