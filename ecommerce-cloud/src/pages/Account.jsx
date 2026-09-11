import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchUserOrders } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';

const STATUS_STYLES = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-highlight/20 text-foreground',
  shipped: 'bg-highlight/20 text-foreground',
  delivered: 'bg-primary text-primary-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

function Account() {
  const { user, loading: authLoading, profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUserOrders(user.id).then(({ data }) => {
      setOrders(data);
      setLoadingOrders(false);
    });
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: '/account' }} />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">My Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Signed in as <span className="text-foreground">{profile?.email || user.email}</span>
      </p>

      <h2 className="font-heading text-xl text-foreground mt-12 mb-5">Order History</h2>

      {loadingOrders ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-border rounded-2xl py-16 text-center">
          <Package className="h-8 w-8 text-muted-foreground mx-auto" strokeWidth={1.5} />
          <p className="mt-4 text-foreground font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When you place an order, it'll show up here.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to={`/account/orders/${order.order_number}`}
                className="flex items-center justify-between gap-4 border border-border rounded-2xl p-5 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{order.order_number}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    · {order.order_items?.length ?? 0} item
                    {(order.order_items?.length ?? 0) === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-medium text-foreground whitespace-nowrap">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                      STATUS_STYLES[order.order_status] || 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Account;
