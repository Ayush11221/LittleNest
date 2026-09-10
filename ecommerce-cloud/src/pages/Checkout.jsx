import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { calculateSubtotal } from '../utils/calculations.js';
import { useCartLines } from '../context/useCartLines.js';
import { useAuth } from '../context/AuthContext.jsx';
import { openRazorpayCheckout } from '../lib/razorpay.js';
import { createOrder } from '../services/orderService.js';

const inputClass =
  'w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors';

function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const { lines, loading: cartLoading, clearCart } = useCartLines();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [paying, setPaying] = useState(false);

  const subtotal = calculateSubtotal(lines);

  if (authLoading || cartLoading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: '/checkout' }} />;
  if (lines.length === 0) return <Navigate to="/cart" replace />;

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const isValid =
    form.name.trim() &&
    form.phone.trim().length >= 10 &&
    form.addressLine1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.pincode.trim().length >= 6;

  const handlePay = async () => {
    setErrorMessage('');
    if (!isValid) {
      setErrorMessage('Please fill in all required shipping details.');
      return;
    }

    setPaying(true);

    const fullAddress = [form.addressLine1, form.addressLine2, form.city, form.state, form.pincode]
      .filter(Boolean)
      .join(', ');

    await openRazorpayCheckout({
      amount: subtotal,
      description: 'LittleNest order',
      prefill: {
        name: form.name,
        email: user.email,
        contact: form.phone,
      },
      onSuccess: async (response) => {
        const { data: order, error } = await createOrder({
          userId: user.id,
          lines,
          subtotal,
          shipping: {
            cost: 0,
            name: form.name,
            email: user.email,
            phone: form.phone,
            address: fullAddress,
          },
          razorpayPaymentId: response.razorpay_payment_id,
        });

        setPaying(false);

        if (error) {
          console.error('Order recording failed:', error.message);
          setErrorMessage(
            `Payment succeeded, but we couldn't save your order. Please contact support with your payment ID: ${response.razorpay_payment_id}`
          );
          return;
        }

        clearCart();
        navigate(`/order-confirmation/${order.order_number}`, { replace: true });
      },
      onDismiss: () => setPaying(false),
      onFailure: (err) => {
        setPaying(false);
        setErrorMessage(err?.description || 'Payment failed. Please try again.');
      },
    });
  };

  return (
    <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-12 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Checkout</h1>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        {/* Shipping details */}
        <div className="lg:col-span-2">
          <h2 className="font-heading text-xl text-foreground mb-5">Shipping details</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full name
              </label>
              <input id="name" value={form.name} onChange={update('name')} className={inputClass} />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-foreground mb-2">
                Address line 1
              </label>
              <input
                id="address1"
                value={form.addressLine1}
                onChange={update('addressLine1')}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address2" className="block text-sm font-medium text-foreground mb-2">
                Address line 2 (optional)
              </label>
              <input
                id="address2"
                value={form.addressLine2}
                onChange={update('addressLine2')}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                  City
                </label>
                <input id="city" value={form.city} onChange={update('city')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                  State
                </label>
                <input id="state" value={form.state} onChange={update('state')} className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-2">
                Pincode
              </label>
              <input
                id="pincode"
                value={form.pincode}
                onChange={update('pincode')}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-2xl p-6">
            <h2 className="font-heading text-xl text-foreground">Order summary</h2>

            <ul className="mt-4 space-y-3">
              {lines.map((line) => (
                <li key={line.variant_id} className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {line.name} × {line.quantity}
                  </span>
                  <span className="text-foreground font-medium whitespace-nowrap">
                    {formatCurrency(line.price * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-foreground">Free</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
            </div>

            {errorMessage && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <Button size="lg" className="w-full mt-6" onClick={handlePay} disabled={paying}>
              {paying ? 'Processing…' : `Pay ${formatCurrency(subtotal)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
