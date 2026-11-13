import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  Edit,
  Trash2,
  X,
  CreditCard,
  Building2,
  ExternalLink
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import InvoiceModal from '../../components/InvoiceModal';

export default function AdminOrders() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Selected Order for Status Update Modal
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusFormData, setStatusFormData] = useState({
    order_status: 'Processing',
    payment_status: 'Paid',
    tracking_courier: '',
    tracking_number: '',
    notes: ''
  });

  // Invoice Modal
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setStatusFormData({
      order_status: order.order_status,
      payment_status: order.payment_status,
      tracking_courier: order.tracking_courier || 'BlueDart Health Express',
      tracking_number: order.tracking_number || '',
      notes: order.notes || ''
    });
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const res = await fetch(`/api/admin/orders/${editingOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusFormData)
      });

      if (!res.ok) throw new Error('Update failed');
      addToast(`Order ${editingOrder.order_number} status updated!`, 'success');
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to update order', 'error');
    }
  };

  const handleDelete = async (orderId, orderNum) => {
    if (!window.confirm(`Delete order ${orderNum}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      addToast(`Order ${orderNum} deleted`, 'info');
      fetchOrders();
    } catch (err) {
      console.error(err);
      addToast('Error deleting order', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Hospital Orders & GST Invoicing</h1>
          <p className="text-xs text-slate-400">
            Process consignments, update courier airway bills, and issue B2B tax invoices
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order #, hospital name, doctor, phone, or AWB tracking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white pl-9 pr-3 py-2 text-xs rounded-xl outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white px-3 py-2 text-xs rounded-xl outline-none focus:border-sky-500 w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Confirmation</option>
            <option value="Processing">Processing & Quality Check</option>
            <option value="Dispatched">Dispatched / In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase bg-slate-950/80">
                <th className="py-3.5 px-4">Order Ref #</th>
                <th className="py-3.5 px-4">Hospital / Buyer</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total Value</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Shipment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No hospital orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-sky-400">{ord.order_number}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">
                        {ord.hospital_clinic_name || ord.customer_name}
                      </p>
                      <p className="text-[11px] text-slate-400">Attn: {ord.customer_name}</p>
                      <p className="text-[10px] text-slate-500">{ord.city}, {ord.state}</p>
                      {ord.gstin && (
                        <p className="text-[9px] font-mono text-emerald-400">GST: {ord.gstin}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-200 truncate">
                        {ord.items && ord.items.length > 0 ? ord.items[0].product_name : 'Equipment order'}
                      </p>
                      {ord.items && ord.items.length > 1 && (
                        <span className="text-[10px] text-sky-400 font-medium">
                          + {ord.items.length - 1} more items
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {formatPrice(ord.total_amount)}
                      <p className="text-[10px] font-normal text-slate-500">
                        GST: {formatPrice(ord.tax_amount)}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          ord.payment_status.toLowerCase().includes('paid')
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                            : 'bg-amber-950 text-amber-400 border-amber-800/40'
                        }`}
                      >
                        {ord.payment_status}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{ord.payment_method}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          ord.order_status.toLowerCase().includes('delivered')
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                            : ord.order_status.toLowerCase().includes('dispatched')
                            ? 'bg-sky-950 text-sky-400 border-sky-800/40'
                            : 'bg-indigo-950 text-indigo-400 border-indigo-800/40'
                        }`}
                      >
                        {ord.order_status}
                      </span>
                      {ord.tracking_number && (
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          AWB: {ord.tracking_number}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(ord)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                          title="Update Status & Courier"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveInvoiceId(ord.id)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          title="Generate & Print Tax Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ord.id, ord.order_number)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Status Update Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-sm font-bold text-white">Update Consignment Status</h3>
                <p className="text-[11px] font-mono text-sky-400">{editingOrder.order_number}</p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Dispatch / Order Status</label>
                <select
                  value={statusFormData.order_status}
                  onChange={(e) => setStatusFormData({ ...statusFormData, order_status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                >
                  <option value="Pending Confirmation">Pending Confirmation</option>
                  <option value="Processing">Processing & Quality Calibration Check</option>
                  <option value="Dispatched">Dispatched (Picked by Specialized Courier)</option>
                  <option value="Out for Hospital Delivery">Out for Hospital Delivery</option>
                  <option value="Delivered">Delivered & Verification Complete</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Payment Status</label>
                <select
                  value={statusFormData.payment_status}
                  onChange={(e) => setStatusFormData({ ...statusFormData, payment_status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                >
                  <option value="Paid">Paid / Verified</option>
                  <option value="Pending (Pay on Delivery)">Pending (Pay on Delivery)</option>
                  <option value="Failed">Payment Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Carrier / Logistics Partner</label>
                <input
                  type="text"
                  value={statusFormData.tracking_courier}
                  onChange={(e) => setStatusFormData({ ...statusFormData, tracking_courier: e.target.value })}
                  placeholder="BlueDart Health Express / Gati KWE"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Airway Bill (AWB) / Tracking No</label>
                <input
                  type="text"
                  value={statusFormData.tracking_number}
                  onChange={(e) => setStatusFormData({ ...statusFormData, tracking_number: e.target.value })}
                  placeholder="e.g. BD-MED-99482102"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Admin Internal Remarks</label>
                <textarea
                  rows="2"
                  value={statusFormData.notes}
                  onChange={(e) => setStatusFormData({ ...statusFormData, notes: e.target.value })}
                  placeholder="e.g. Biomedical engineer demo requested on Monday..."
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow"
                >
                  Update Consignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {activeInvoiceId && (
        <InvoiceModal orderId={activeInvoiceId} onClose={() => setActiveInvoiceId(null)} />
      )}
    </div>
  );
}

