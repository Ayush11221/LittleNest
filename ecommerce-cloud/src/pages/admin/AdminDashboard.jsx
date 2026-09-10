import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderTree, ClipboardList, Users, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import {
  fetchDashboardStats,
  fetchRecentOrders,
  seedDemoData,
} from '../../services/adminService.js';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../../admin/seedData.js';

const STATUS_STYLES = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-highlight/20 text-foreground',
  shipped: 'bg-highlight/20 text-foreground',
  delivered: 'bg-primary text-primary-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      <p className="mt-4 text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([fetchDashboardStats(), fetchRecentOrders(5)]).then(([s, o]) => {
      setStats(s);
      setOrders(o);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    const result = await seedDemoData(SEED_CATEGORIES, SEED_PRODUCTS);
    setSeedResult(result);
    setSeeding(false);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">A snapshot of your store.</p>
        </div>
        <Button variant="outline" onClick={handleSeed} disabled={seeding}>
          <Sparkles className="h-4 w-4" data-icon="inline-start" />
          {seeding ? 'Seeding demo data…' : 'Seed Demo Data'}
        </Button>
      </div>

      {seedResult && (
        <div className="mb-8 rounded-2xl border border-border p-4 text-sm">
          <p className="text-foreground font-medium">
            Added {seedResult.categoriesCreated} categories and {seedResult.productsCreated} products.
          </p>
          {seedResult.errors.length > 0 && (
            <ul className="mt-2 text-destructive space-y-1">
              {seedResult.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
          {seedResult.categoriesCreated === 0 &&
            seedResult.productsCreated === 0 &&
            seedResult.errors.length === 0 && (
              <p className="text-muted-foreground">
                Demo data already exists — nothing new to add.
              </p>
            )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Package} label="Products" value={stats.productCount} />
          <StatCard icon={FolderTree} label="Collections" value={stats.categoryCount} />
          <StatCard icon={ClipboardList} label="Orders" value={stats.orderCount} />
          <StatCard icon={Users} label="Customers" value={stats.customerCount} />
        </div>
      )}

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg text-foreground">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="h-40 rounded-2xl bg-muted animate-pulse" />
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
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-foreground font-medium">{order.order_number}</td>
                    <td className="px-4 py-3 text-foreground">{order.shipping_name}</td>
                    <td className="px-4 py-3 text-foreground">{formatCurrency(order.total_amount)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          STATUS_STYLES[order.order_status] || 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
