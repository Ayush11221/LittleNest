import { useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const SIZE_ROWS = [
  { size: 'Newborn', age: 'Up to 1 month', weight: 'Up to 3.6 kg', height: 'Up to 51 cm', chest: '34 cm' },
  { size: '0-3M', age: '0–3 months', weight: '3.6–6 kg', height: '51–61 cm', chest: '36 cm' },
  { size: '3-6M', age: '3–6 months', weight: '6–7.8 kg', height: '61–67 cm', chest: '38 cm' },
  { size: '6-12M', age: '6–12 months', weight: '7.8–10 kg', height: '67–76 cm', chest: '41 cm' },
  { size: '1-2Y', age: '1–2 years', weight: '10–12.5 kg', height: '76–86 cm', chest: '45 cm' },
  { size: '2-3Y', age: '2–3 years', weight: '12.5–15 kg', height: '86–96 cm', chest: '48 cm' },
];

/** Centered modal with a standard baby-clothing size chart (age/weight/height/chest). */
function SizeGuide({ open, onClose }) {
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Size guide"
          className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-background shadow-soft p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl text-foreground">Size Guide</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Babies grow at their own pace — if you're between sizes, we
              generally recommend sizing up.
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Size</th>
                    <th className="py-2 pr-3 font-medium">Age</th>
                    <th className="py-2 pr-3 font-medium">Weight</th>
                    <th className="py-2 pr-3 font-medium">Height</th>
                    <th className="py-2 font-medium">Chest</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_ROWS.map((row) => (
                    <tr key={row.size} className="border-b border-border last:border-b-0">
                      <td className="py-2.5 pr-3 font-medium text-foreground whitespace-nowrap">
                        {row.size}
                      </td>
                      <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">{row.age}</td>
                      <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">{row.weight}</td>
                      <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">{row.height}</td>
                      <td className="py-2.5 text-muted-foreground whitespace-nowrap">{row.chest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              "One Size" items (accessories like beanies and booties) are
              designed to fit most babies from 0–12 months with a stretch fit.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SizeGuide;
