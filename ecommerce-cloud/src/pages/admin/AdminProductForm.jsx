import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import {
  fetchAdminProductById,
  fetchAdminCategories,
  createProduct,
  updateProduct,
  slugify,
} from '../../services/adminService.js';

const GENDER_OPTIONS = ['unisex', 'boy', 'girl'];

const EMPTY_PRODUCT = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compare_at_price: '',
  category_id: '',
  age_group: '',
  gender: 'unisex',
  material: '',
  care_instructions: '',
  image_url: '',
  rating: '',
  is_featured: false,
  is_active: true,
};

const EMPTY_VARIANT = { size: '', color: '', sku: '', stock: 0, price_override: '' };

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;
    fetchAdminProductById(id).then(({ data }) => {
      if (cancelled || !data) return;
      setForm({
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        price: data.price ?? '',
        compare_at_price: data.compare_at_price ?? '',
        category_id: data.category_id || '',
        age_group: data.age_group || '',
        gender: data.gender || 'unisex',
        material: data.material || '',
        care_instructions: data.care_instructions || '',
        image_url: data.image_url || '',
        rating: data.rating ?? '',
        is_featured: data.is_featured || false,
        is_active: data.is_active,
      });
      setVariants(
        (data.product_variants || []).length > 0
          ? data.product_variants.map((v) => ({
              id: v.id,
              size: v.size,
              color: v.color || '',
              sku: v.sku || '',
              stock: v.stock,
              price_override: v.price_override ?? '',
            }))
          : [{ ...EMPTY_VARIANT }]
      );
      setImageUrls((data.product_images || []).map((img) => img.image_url));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  const handleNameChange = (name) => {
    setForm((f) => ({ ...f, name, slug: isEditing ? f.slug : slugify(name) }));
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const addVariant = () => setVariants((prev) => [...prev, { ...EMPTY_VARIANT }]);
  const removeVariant = (index) => setVariants((prev) => prev.filter((_, i) => i !== index));

  const addImageUrl = () => setImageUrls((prev) => [...prev, '']);
  const updateImageUrl = (index, value) =>
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  const removeImageUrl = (index) => setImageUrls((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.slug.trim() || form.price === '') {
      setError('Name, slug, and price are required.');
      return;
    }

    // Existing variant ids are intentionally dropped — updateProduct always
    // deletes and re-inserts the full variant list, so it needs fresh rows.
    const cleanVariants = variants
      .filter((v) => v.size.trim())
      .map((v) => ({
        size: v.size.trim(),
        color: v.color.trim() || null,
        sku: v.sku.trim() || null,
        stock: Number(v.stock) || 0,
        price_override: v.price_override === '' ? null : Number(v.price_override),
        is_active: true,
      }));

    if (cleanVariants.length === 0) {
      setError('Add at least one size/variant.');
      return;
    }

    const cleanImages = imageUrls
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ({ image_url: url }));

    const productPayload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price === '' ? null : Number(form.compare_at_price),
      category_id: form.category_id || null,
      age_group: form.age_group.trim() || null,
      gender: form.gender,
      material: form.material.trim() || null,
      care_instructions: form.care_instructions.trim() || null,
      image_url: form.image_url.trim() || null,
      rating: form.rating === '' ? 0 : Number(form.rating),
      is_featured: form.is_featured,
      is_active: form.is_active,
    };

    setSaving(true);
    const { error: saveError } = isEditing
      ? await updateProduct(id, { product: productPayload, variants: cleanVariants, images: cleanImages })
      : await createProduct({ product: productPayload, variants: cleanVariants, images: cleanImages });
    setSaving(false);

    if (saveError) {
      setError(saveError.message || 'Something went wrong. Please try again.');
      return;
    }

    navigate('/admin/products');
  };

  if (loading) {
    return <div className="h-96 rounded-2xl bg-muted animate-pulse" />;
  }

  const inputClass =
    'w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors';
  const labelClass = 'block text-sm font-medium text-foreground mb-2';

  return (
    <div className="max-w-3xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-8">
        {isEditing ? 'Edit Product' : 'Add Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Basic info */}
        <div className="rounded-2xl border border-border p-5 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Basic Information</h2>

          <div>
            <label className={labelClass}>Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              className={`${inputClass} h-auto py-2 resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Compare-at Price (₹)</label>
              <input
                type="number"
                min="0"
                value={form.compare_at_price}
                onChange={(e) => setForm((f) => ({ ...f, compare_at_price: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="rounded-2xl border border-border p-5 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Organization</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className={inputClass}
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                className={inputClass}
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age Group</label>
              <input
                type="text"
                value={form.age_group}
                onChange={(e) => setForm((f) => ({ ...f, age_group: e.target.value }))}
                placeholder="e.g. 0-3 Months"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Rating (0–5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Material</label>
            <input
              type="text"
              value={form.material}
              onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Care Instructions</label>
            <input
              type="text"
              value={form.care_instructions}
              onChange={(e) => setForm((f) => ({ ...f, care_instructions: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              Active (visible in store)
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-border p-5 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Images</h2>

          <div>
            <label className={labelClass}>Main Image URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Additional Gallery Images</label>
            <div className="space-y-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateImageUrl(i, e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    aria-label="Remove image"
                    className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addImageUrl}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add image
            </button>
          </div>
        </div>

        {/* Variants */}
        <div className="rounded-2xl border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Sizes &amp; Stock</h2>

          <div className="space-y-3">
            {variants.map((variant, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)}
                  placeholder="Size"
                  className={`${inputClass} col-span-3`}
                />
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) => updateVariant(i, 'color', e.target.value)}
                  placeholder="Color"
                  className={`${inputClass} col-span-3`}
                />
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                  placeholder="Stock"
                  className={`${inputClass} col-span-2`}
                />
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                  placeholder="SKU"
                  className={`${inputClass} col-span-3`}
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  aria-label="Remove variant"
                  className="col-span-1 p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors justify-self-end"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add size
          </button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link to="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
