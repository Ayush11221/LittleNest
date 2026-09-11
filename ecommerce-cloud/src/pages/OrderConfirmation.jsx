import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';

function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
      <CheckCircle2 className="h-12 w-12 text-primary mx-auto" strokeWidth={1.5} />
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
    </div>
  );
}

export default OrderConfirmation;
