import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Package, Upload, Image as ImageIcon } from 'lucide-react';
import { getCategoryIcon } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function AdminCategories({ onCategoriesUpdated }) {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imageUploadTab, setImageUploadTab] = useState('upload'); // 'upload' | 'url'
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_name: 'Activity',
    banner_image: '',
    display_order: 1
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
      if (onCategoriesUpdated) onCategoriesUpdated(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
      setFormData((prev) => ({ ...prev, banner_image: data.url }));
      addToast('Category picture uploaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Image upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setImageUploadTab('upload');
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon_name: 'HeartPulse',
      banner_image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      display_order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c) => {
    setEditingCategory(c);
    setImageUploadTab('url');
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      icon_name: c.icon_name || 'Activity',
      banner_image: c.banner_image || '',
      display_order: c.display_order || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      display_order: parseInt(formData.display_order) || 0
    };

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
        addToast('Department category updated!', 'success');
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Creation failed');
        addToast('New department category created!', 'success');
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Products inside may be affected.`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      addToast('Category deleted', 'info');
      fetchCategories();
    } catch (err) {
      console.error(err);
      addToast('Error deleting category', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Hospital Department Categories</h1>
          <p className="text-xs text-slate-400">
            Upload custom category pictures from device or URL, set medical icons and ordering
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            Loading departments...
          </div>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md group overflow-hidden"
            >
              <div>
                {c.banner_image && (
                  <div className="h-28 rounded-2xl overflow-hidden mb-3 relative border border-slate-800">
                    <img src={c.banner_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    {getCategoryIcon(c.icon_name, 'w-4 h-4')}
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950 px-2.5 py-0.5 rounded-full border border-sky-800/40">
                    {c.product_count || 0} devices
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{c.name}</h3>
                <p className="text-[10px] font-mono text-slate-500">slug: {c.slug}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {c.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Order: #{c.display_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(c)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? 'Edit Department Category' : 'Add Department Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ICU & Critical Care"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. icu-critical-care"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* Category Picture Upload from Device or URL */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold block">
                    Category Banner / Photo (Upload from Device or URL)
                  </label>
                  <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setImageUploadTab('upload')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        imageUploadTab === 'upload' ? 'bg-sky-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      Device Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadTab('url')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        imageUploadTab === 'url' ? 'bg-sky-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageUploadTab === 'upload' ? (
                  <label className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-sky-400 font-bold rounded-xl border border-sky-500/30 cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Choose Category Photo from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDeviceFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <input
                    type="text"
                    value={formData.banner_image}
                    onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                )}

                {formData.banner_image && (
                  <img
                    src={formData.banner_image}
                    alt="Category preview"
                    className="h-16 w-full object-cover rounded-xl border border-slate-800"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Medical Icon</label>
                  <select
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  >
                    <option value="HeartPulse">HeartPulse</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="ScanLine">ScanLine</option>
                    <option value="BedDouble">BedDouble</option>
                    <option value="Wind">Wind</option>
                    <option value="Zap">Zap</option>
                    <option value="FlaskConical">FlaskConical</option>
                    <option value="Activity">Activity</option>
                    <option value="Scissors">Scissors</option>
                    <option value="Stethoscope">Stethoscope</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of clinical purpose..."
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
