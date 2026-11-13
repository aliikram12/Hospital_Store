import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Printer,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import InvoiceModal from '../../components/InvoiceModal';

export default function AdminDashboard({ onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeInvoiceOrderId, setActiveInvoiceOrderId] = useState(null);

  useEffect(() => {
    fetch('/api/admin/analytics/dashboard')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Aggregating hospital analytics...</p>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-slate-400 text-xs">Failed to load analytics.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
            Real-Time Medical Commerce Engine
          </span>
          <h1 className="text-2xl font-black text-white mt-0.5">
            HospitalStore Management Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live monitor of medical device orders, B2B hospital quotations, and inventory levels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition-all hover:scale-105"
          >
            + Add Equipment
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Processed Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{formatPrice(stats.total_revenue)}</h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.monthly_growth_rate} this month</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Hospital Orders</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{stats.total_orders} Orders</h3>
            <p className="text-[11px] text-sky-400 font-semibold mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats.pending_orders} pending dispatch</span>
            </p>
          </div>
        </div>

        {/* Active Products */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Devices</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{stats.active_products} Units</h3>
            <p className="text-[11px] text-teal-400 font-semibold mt-1">
              Across 8 clinical departments
            </p>
          </div>
        </div>

        {/* RFQ & Inquiries */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Hospital RFQ Quotes</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{stats.total_inquiries} Inquiries</h3>
            <p className="text-[11px] text-amber-400 font-semibold mt-1">
              Institutional wholesale leads
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Sales by Status & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Status */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Consignment Dispatch Status
          </h3>
          <div className="space-y-3">
            {stats.sales_by_status &&
              Object.entries(stats.sales_by_status).map(([st, count]) => (
                <div key={st} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{st}</span>
                    <span className="text-slate-400 font-mono">{count} orders</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full"
                      style={{
                        width: `${stats.total_orders > 0 ? (count / stats.total_orders) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Top Equipment Departments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.top_categories &&
              stats.top_categories.map((cat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-200">{cat.name}</span>
                  <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-lg border border-sky-800/40">
                    {cat.product_count} items
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Hospital Consignments
            </h3>
            <p className="text-xs text-slate-500">Live order activity and invoice dispatch status</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>View All ({stats.total_orders})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Hospital / Purchaser</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Tax Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recent_orders &&
                stats.recent_orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-sky-400">{ord.order_number}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-white">{ord.hospital_clinic_name || ord.customer_name}</p>
                      <p className="text-[11px] text-slate-500">{ord.city}, {ord.state}</p>
                    </td>
                    <td className="py-3 px-3 font-bold text-white font-mono">
                      {formatPrice(ord.total_amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-400 border border-sky-800/40">
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveInvoiceOrderId(ord.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-sky-400" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {activeInvoiceOrderId && (
        <InvoiceModal orderId={activeInvoiceOrderId} onClose={() => setActiveInvoiceOrderId(null)} />
      )}
    </div>
  );
}

