import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Search, Trash2, X, Shield, Building2, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminUsers() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    hospital_name: '',
    role: 'Procurement Officer',
    status: 'Active'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load user accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Status update failed');
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      addToast(`User ${user.full_name} is now ${updated.status}`, 'info');
    } catch (err) {
      console.error(err);
      addToast('Failed to toggle status', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user account for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      addToast('User deleted', 'info');
      fetchUsers();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete user', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to create user');
      }
      addToast('New hospital user created successfully!', 'success');
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.hospital_name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Hospital Buyers & User Accounts</h1>
          <p className="text-xs text-slate-400">
            Manage hospital administrators, procurement directors, and clinical buyers
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              full_name: '',
              email: '',
              phone: '',
              hospital_name: '',
              role: 'Procurement Officer',
              status: 'Active'
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hospital User</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users by name, email, or hospital name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white pl-9 pr-3 py-2 text-xs rounded-xl outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase bg-slate-950/80">
                <th className="py-3 px-4">User / Doctor</th>
                <th className="py-3 px-4">Hospital / Institution</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    Loading registered hospital users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No users found matching search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{u.full_name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                      {u.phone && <p className="text-[10px] text-slate-500">{u.phone}</p>}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-200">{u.hospital_name || 'Individual'}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-400 border border-sky-800/40">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {u.total_orders || 0} orders
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          u.status === 'Active'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900'
                            : 'bg-rose-950 text-rose-400 border-rose-800/50 hover:bg-rose-900'
                        }`}
                        title="Click to toggle Active / Suspended status"
                      >
                        {u.status}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(u.id, u.full_name)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-base font-bold text-white">Create Hospital User Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Dr. Tariq Mehmood"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tariq@hospital.org"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">User Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                  >
                    <option value="Hospital Admin">Hospital Admin</option>
                    <option value="Procurement Officer">Procurement Officer</option>
                    <option value="Medical Superintendent">Medical Superintendent</option>
                    <option value="Bio-Medical Engineer">Bio-Medical Engineer</option>
                    <option value="Chief Doctor">Chief Doctor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hospital / Clinic Name</label>
                <input
                  type="text"
                  value={formData.hospital_name}
                  onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                  placeholder="Shaukat Khanum Memorial / AKUH"
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
