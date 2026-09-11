import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button.jsx';

const BURST_PARTICLES = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  return {
    id: i,
    x: Math.cos(angle) * 60,
    y: Math.sin(angle) * 60,
  };
});

function SuccessBurst() {
  return (
    <div className="relative h-20 w-20 mx-auto">
      {/* Particle burst */}
      {BURST_PARTICLES.map((p, i) => (
        <motion.span
          key={p.id}
          className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-highlight"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        />
      ))}

      {/* Circle + checkmark */}
      <motion.svg
        viewBox="0 0 80 80"
        className="relative h-20 w-20"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          strokeWidth="3"
          className="stroke-primary"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M25 41 L35 51 L56 29"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-primary"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.45 }}
        />
      </motion.svg>
    </div>
  );
}

function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
      <SuccessBurst />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <h1 className="mt-6 font-heading text-3xl md:text-4xl text-foreground">
          Thank you for your order
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your payment was successful and your order has been placed.
        </p>
        {orderNumber && (
          <p className="mt-4 text-sm text-foreground">
            Order number: <span className="font-semibold">{orderNumber}</span>
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-3">
          {orderNumber && (
            <Button asChild size="lg" variant="outline">
              <Link to={`/account/orders/${orderNumber}`}>View Order</Link>
            </Button>
          )}
          <Button asChild size="lg">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default OrderConfirmation;
