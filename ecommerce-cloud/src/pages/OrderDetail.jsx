import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchOrderByNumber } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';

const STATUS_STYLES = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-highlight/20 text-foreground',
  shipped: 'bg-highlight/20 text-foreground',
  delivered: 'bg-primary text-primary-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

function OrderDetail() {
  const { user, loading: authLoading } = useAuth();
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchOrderByNumber(orderNumber).then(({ data }) => {
      setOrder(data);
      setNotFound(!data);
      setLoading(false);
    });
  }, [user, orderNumber]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: `/account/orders/${orderNumber}` }} />;

  if (loading) return null;

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-heading text-2xl text-foreground">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find an order with that number on your account.
        </p>
        <Link
          to="/account"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Back to order history
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <Link
        to="/account"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Order History
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground">{order.order_number}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
            STATUS_STYLES[order.order_status] || 'bg-muted text-muted-foreground'
          }`}
        >
          {order.order_status}
        </span>
      </div>

      <div className="mt-8 border border-border rounded-2xl divide-y divide-border">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4">
            <div className="w-16 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
              {item.product_image && (
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item.product_name}</p>
              {(item.size || item.color) && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {[item.size, item.color].filter(Boolean).join(' · ')}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-foreground whitespace-nowrap">
              {formatCurrency(item.subtotal)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 border border-border rounded-2xl p-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">
            {order.shipping > 0 ? formatCurrency(order.shipping) : 'Free'}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-semibold text-foreground">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      <div className="mt-6 border border-border rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-2">Shipping to</h2>
        <p className="text-sm text-muted-foreground">{order.shipping_name}</p>
        <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
        {order.shipping_phone && (
          <p className="text-sm text-muted-foreground">{order.shipping_phone}</p>
        )}
      </div>
    </div>
  );
}

export default OrderDetail;
