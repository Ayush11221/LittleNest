import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { fetchAdminProducts, deleteProduct, setProductActive } from '../../services/adminService.js';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchAdminProducts().then(({ data, error: fetchError }) => {
      setProducts(data);
      setError(!!fetchError);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    const { error: deleteError } = await deleteProduct(product.id);
    if (deleteError) {
      window.alert(deleteError.message || 'Could not delete this product.');
      return;
    }
    load();
  };

  const handleToggleActive = async (product) => {
    const { error: toggleError } = await setProductActive(product.id, !product.is_active);
    if (toggleError) {
      window.alert(toggleError.message || 'Could not update this product.');
      return;
    }
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your catalog.</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4" data-icon="inline-start" />
            Add Product
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      ) : error ? (
        <div className="rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-foreground font-medium">Something went wrong.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't load products. You may need an admin account to view this page.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No products yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const totalStock = (product.product_variants || []).reduce(
                  (sum, v) => sum + (v.is_active ? v.stock : 0),
                  0
                );
                return (
                  <tr key={product.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                          {product.image_url && (
                            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span className="text-foreground font-medium truncate">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.categories?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-foreground">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{totalStock}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(product)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.is_active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          aria-label={`Edit ${product.name}`}
                          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          aria-label={`Delete ${product.name}`}
                          className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
