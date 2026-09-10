import { useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

/**
 * Generic right-side slide-out drawer — backdrop, Escape-to-close,
 * locks body scroll while open. Used by the cart and shop filters.
 */
function Drawer({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed top-0 right-0 z-[101] h-full w-full sm:w-[420px] bg-background shadow-soft flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-border shrink-0">
              <h2 className="font-heading text-xl text-foreground">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

            {footer && <div className="shrink-0 px-5 py-5 border-t border-border">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Drawer;
