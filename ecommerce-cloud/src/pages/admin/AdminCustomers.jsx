import { useEffect, useState } from 'react';
import { fetchAdminCustomers } from '../../services/adminService.js';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everyone with an account.</p>
      </div>

      {loading ? (
        <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No customers yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-foreground font-medium">
                    {customer.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        customer.role === 'admin'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {customer.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(customer.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
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

export default AdminCustomers;
