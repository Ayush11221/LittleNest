import { useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { fetchAdminOrders, updateOrderStatus } from '../../services/adminService.js';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAdminOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleStatusChange = async (order, status) => {
    const { error } = await updateOrderStatus(order.id, status);
    if (error) {
      window.alert(error.message || 'Could not update order status.');
      return;
    }
    load();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">All customer orders.</p>
      </div>

      {loading ? (
        <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-foreground font-medium">{order.order_number}</td>
                  <td className="px-4 py-3 text-foreground">{order.shipping_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {(order.order_items || []).length}
                  </td>
                  <td className="px-4 py-3 text-foreground">{formatCurrency(order.total_amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">
                    {order.payment_status}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="h-8 rounded-full border border-border bg-background text-xs font-medium text-foreground px-3 capitalize focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status} className="capitalize">
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
