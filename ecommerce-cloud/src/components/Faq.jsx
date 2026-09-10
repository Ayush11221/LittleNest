import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const faqs = [
  {
    question: 'How do I know what size to order?',
    answer:
      "Each product page lists the exact size and age range for that piece. Babies grow at different rates, so if you're between sizes, we generally recommend sizing up for a little extra room.",
  },
  {
    question: 'What are your clothes made from?',
    answer:
      'We favour natural, breathable fabrics — mostly cotton — chosen to feel gentle against delicate skin. The exact material and care instructions are listed on every product page.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Delivery times vary by location. An estimated shipping window is shown at checkout before you place your order.',
  },
  {
    question: 'Can I return or exchange an item?',
    answer:
      "Yes — returns are simple and transparent within 15 days of delivery. See our Help page for the full details.",
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-foreground font-medium">{faq.question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed pr-8">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-muted/30 border-t border-border">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            Questions, answered
          </h2>
        </div>

        <div className="border-t border-border">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
