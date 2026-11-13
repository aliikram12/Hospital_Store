import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Eye,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Link
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';

export default function AdminProducts({ categories = [] }) {
  const { addToast } = useToast();
  const { formatPrice, currency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUploadTab, setImageUploadTab] = useState('upload'); // 'upload' | 'url'
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brand: 'HospitalStore Elite',
    model_number: '',
    sku: '',
    category_id: categories[0]?.id || 1,
    price: 50000,
    original_price: 65000,
    stock_quantity: 15,
    is_in_stock: true,
    is_featured: false,
    is_trending: false,
    warranty: '2 Years Manufacturer Warranty',
    lead_time: 'In Stock • Ships in 24 Hours',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    short_desc: '',
    full_desc: '',
    specifications_text: 'Display: 12.1 inch TFT Color\nStandard Parameters: ECG, SpO2, NIBP, TEMP, RESP\nBattery: 4 Hours Rechargeable Lithium-ion\nCertifications: CE, ISO 13485',
    features_text: 'High-precision diagnostic arrhythmia algorithm\nWaterproof grade IPX1 protection\nCentral nursing station network connectivity'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('limit', '100');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const handleDeviceFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body
      });
      if (!res.ok) throw new Error('Failed to upload image file');
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image_url: data.url }));
      addToast('Product image uploaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('File upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setImageUploadTab('upload');
    setFormData({
      name: '',
      slug: '',
      brand: 'HospitalStore Elite',
      model_number: '',
      sku: `HS-${Math.floor(1000 + Math.random() * 9000)}`,
      category_id: categories[0]?.id || 1,
      price: 45000,
      original_price: 60000,
      stock_quantity: 12,
      is_in_stock: true,
      is_featured: false,
      is_trending: false,
      warranty: '2 Years Manufacturer Warranty',
      lead_time: 'In Stock • Ships in 24 Hours',
      image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      short_desc: '',
      full_desc: '',
      specifications_text: 'Display: 12.1 inch TFT Color\nStandard Parameters: ECG, SpO2, NIBP, TEMP, RESP\nBattery: 4 Hours Lithium-ion\nCertifications: CE, ISO 13485',
      features_text: 'High-precision diagnostic arrhythmia algorithm\nWaterproof grade IPX1 protection\nCentral nursing station network connectivity'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setImageUploadTab('url');

    let specsStr = '';
    if (p.specifications && typeof p.specifications === 'object') {
      specsStr = Object.entries(p.specifications)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
    }

    let featsStr = '';
    if (Array.isArray(p.features)) {
      featsStr = p.features.join('\n');
    }

    setFormData({
      name: p.name,
      slug: p.slug,
      brand: p.brand || '',
      model_number: p.model_number || '',
      sku: p.sku || '',
      category_id: p.category_id,
      price: p.price,
      original_price: p.original_price,
      stock_quantity: p.stock_quantity,
      is_in_stock: p.is_in_stock,
      is_featured: p.is_featured,
      is_trending: p.is_trending,
      warranty: p.warranty || '',
      lead_time: p.lead_time || '',
      image_url: p.image_url || '',
      short_desc: p.short_desc || '',
      full_desc: p.full_desc || '',
      specifications_text: specsStr,
      features_text: featsStr
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const specsDict = {};
    if (formData.specifications_text) {
      formData.specifications_text.split('\n').forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          specsDict[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      });
    }

    const featuresArr = formData.features_text
      ? formData.features_text.split('\n').map((l) => l.trim()).filter(Boolean)
      : [];

    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 100),
      brand: formData.brand,
      model_number: formData.model_number,
      sku: formData.sku,
      category_id: parseInt(formData.category_id),
      price: parseFloat(formData.price),
      original_price: parseFloat(formData.original_price),
      stock_quantity: parseInt(formData.stock_quantity),
      is_in_stock: formData.is_in_stock,
      is_featured: formData.is_featured,
      is_trending: formData.is_trending,
      warranty: formData.warranty,
      lead_time: formData.lead_time,
      image_url: formData.image_url,
      short_desc: formData.short_desc,
      full_desc: formData.full_desc,
      specifications: specsDict,
      features: featuresArr
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update product');
        addToast('Equipment updated successfully!', 'success');
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to create product');
        addToast('New medical equipment added to catalog!', 'success');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      addToast('Product deleted from inventory', 'info');
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast('Error deleting product', 'error');
    }
  };

  const handleToggleStock = async (p) => {
    try {
      await fetch(`/api/products/${p.id}/toggle-stock`, { method: 'PATCH' });
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_in_stock: !item.is_in_stock } : item))
      );
      addToast(`Updated stock status for ${p.name.slice(0, 20)}...`, 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (p) => {
    try {
      await fetch(`/api/products/${p.id}/toggle-featured`, { method: 'PATCH' });
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_featured: !item.is_featured } : item))
      );
      addToast(`Updated featured status for ${p.name.slice(0, 20)}...`, 'info');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Hospital Medical Equipment Inventory</h1>
          <p className="text-xs text-slate-400">
            Upload equipment photos from device or URL, set technical specs & stock
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medical Equipment</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search equipment by name, brand, model, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white pl-9 pr-3 py-2 text-xs rounded-xl outline-none focus:border-sky-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-white px-3 py-2 text-xs rounded-xl outline-none focus:border-sky-500 w-full sm:w-auto"
        >
          <option value="">All Departments</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase bg-slate-950/80">
                <th className="py-3 px-4">Equipment</th>
                <th className="py-3 px-4">Brand / Model</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    Loading inventory records...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No medical equipment found matching search criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0 bg-white"
                        />
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-bold text-white truncate">{p.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-sky-400">{p.brand}</span>
                      <p className="text-[10px] text-slate-500">{p.model_number}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                        {p.category_name}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {formatPrice(p.price)}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          p.is_in_stock
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900'
                            : 'bg-rose-950 text-rose-400 border-rose-800/50 hover:bg-rose-900'
                        }`}
                        title="Click to toggle stock status"
                      >
                        {p.is_in_stock ? `In Stock (${p.stock_quantity})` : 'Out of Stock'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.is_featured
                            ? 'text-amber-400 bg-amber-950/60'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Star className={`w-4 h-4 ${p.is_featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                          title="Edit Equipment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal with Device Upload & URL Switch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Medical Equipment' : 'Add New Medical Equipment'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mindray uMEC 12 Multi-Parameter Patient Monitor"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              {/* Photo Upload: Device File vs URL (Both Supported) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-bold">
                    📸 Product Image (Upload from Device or enter URL) *
                  </label>
                  <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setImageUploadTab('upload')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        imageUploadTab === 'upload' ? 'bg-sky-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      Device Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadTab('url')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        imageUploadTab === 'url' ? 'bg-sky-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageUploadTab === 'upload' ? (
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-sky-400 font-bold rounded-xl border border-sky-500/30 cursor-pointer flex items-center gap-2 shadow-sm">
                      <Upload className="w-4 h-4 text-sky-400" />
                      <span>{isUploading ? 'Uploading file...' : 'Choose File from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDeviceFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 truncate max-w-xs">
                      {formData.image_url || 'No file selected yet'}
                    </span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                    />
                  </div>
                )}

                {/* Thumbnail Preview */}
                {formData.image_url && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 bg-white"
                    />
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Image ready for catalog
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Department Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Manufacturer / Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Mindray, Philips, GE Healthcare"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Model / SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="HS-ICU-MN12"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Selling Price (Base PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Auto-converts to USD (${Math.round(formData.price / 280)})
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Original MRP</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Warranty Term</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    placeholder="2 Years On-Site Comprehensive Warranty"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lead Time / Shipping Status</label>
                  <input
                    type="text"
                    value={formData.lead_time}
                    onChange={(e) => setFormData({ ...formData, lead_time: e.target.value })}
                    placeholder="In Stock • Ships in 24 Hours"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Technical Specifications (Key: Value per line)
                </label>
                <textarea
                  rows="3"
                  value={formData.specifications_text}
                  onChange={(e) => setFormData({ ...formData, specifications_text: e.target.value })}
                  placeholder="Display: 12.1 inch TFT&#10;Battery: 4 Hours backup&#10;Certifications: CE, ISO 13485"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Clinical Features (One per line)
                </label>
                <textarea
                  rows="2"
                  value={formData.features_text}
                  onChange={(e) => setFormData({ ...formData, features_text: e.target.value })}
                  placeholder="High-precision diagnostic arrhythmia detection&#10;Fanless quiet ICU design"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_in_stock}
                    onChange={(e) => setFormData({ ...formData, is_in_stock: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span className="text-slate-300 font-semibold">Mark In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span className="text-slate-300 font-semibold">Feature on Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_trending}
                    onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span className="text-slate-300 font-semibold">Trending Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
