import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import Drawer from '../../components/ui/drawer.jsx';
import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  slugify,
} from '../../services/adminService.js';

const EMPTY_FORM = { name: '', slug: '', description: '', image_url: '', display_order: 0 };

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchAdminCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setDrawerOpen(true);
  };

  const openEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || '',
      display_order: category.display_order,
    });
    setError('');
    setDrawerOpen(true);
  };

  const handleNameChange = (name) => {
    setForm((f) => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      display_order: Number(form.display_order) || 0,
    };

    const { error: saveError } = editingId
      ? await updateCategory(editingId, payload)
      : await createCategory(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message || 'Something went wrong.');
      return;
    }
    setDrawerOpen(false);
    load();
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? This can't be undone.`)) return;
    const { error: deleteError } = await deleteCategory(category.id);
    if (deleteError) {
      window.alert(deleteError.message || 'Could not delete this collection.');
      return;
    }
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground">Collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage product categories.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" data-icon="inline-start" />
          Add Collection
        </Button>
      </div>

      {loading ? (
        <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No collections yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-foreground font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {category.products?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{category.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        aria-label={`Edit ${category.name}`}
                        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        aria-label={`Delete ${category.name}`}
                        className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingId ? 'Edit Collection' : 'Add Collection'}
        footer={
          <Button size="lg" className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Display Order</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </Drawer>
    </div>
  );
}

export default AdminCategories;
