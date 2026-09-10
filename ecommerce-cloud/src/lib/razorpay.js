const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptPromise = null;

/** Injects Razorpay's checkout script once; resolves true once window.Razorpay is ready. */
export function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Opens the Razorpay checkout modal.
 *
 * There's no deployed backend for this project yet, so this uses
 * Razorpay's amount-only mode (no server-created order_id) — the payment
 * succeeds without a signature to verify. That's fine for a college-project
 * demo; a real store should create the order via the Razorpay Orders API
 * from a server (e.g. a Supabase Edge Function holding the secret key) and
 * verify the payment signature there before trusting it.
 */
export async function openRazorpayCheckout({
  amount,
  name = 'LittleNest',
  description = 'Order payment',
  prefill = {},
  onSuccess,
  onDismiss,
  onFailure,
}) {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!key) {
    onFailure?.(new Error('Razorpay is not configured (missing VITE_RAZORPAY_KEY_ID).'));
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure?.(new Error('Could not load Razorpay checkout. Check your connection and try again.'));
    return;
  }

  const rzp = new window.Razorpay({
    key,
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency: 'INR',
    name,
    description,
    prefill,
    theme: { color: '#0d0d0d' },
    handler: (response) => onSuccess?.(response),
    modal: {
      ondismiss: () => onDismiss?.(),
    },
  });

  rzp.on('payment.failed', (response) => onFailure?.(response.error));
  rzp.open();
}
