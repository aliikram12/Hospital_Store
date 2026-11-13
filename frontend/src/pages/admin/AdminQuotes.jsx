import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  MessageCircle,
  Trash2,
  Search
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminQuotes() {
  const { addToast } = useToast();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== 'All' ? `/api/admin/quotes?status=${statusFilter}` : '/api/admin/quotes';
      const res = await fetch(url);
      const data = await res.json();
      setQuotes(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load RFQ quotations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  const handleUpdateStatus = async (quoteId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Status update failed');
      addToast('RFQ status updated!', 'success');
      fetchQuotes();
    } catch (err) {
      console.error(err);
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Delete this RFQ request?')) return;
    try {
      await fetch(`/api/admin/quotes/${quoteId}`, { method: 'DELETE' });
      addToast('RFQ deleted', 'info');
      fetchQuotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Hospital RFQ Quotations & Tenders</h1>
          <p className="text-xs text-slate-400">
            Institutional volume pricing requests and tender bids submitted by hospitals
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-white px-3 py-2 text-xs rounded-xl outline-none focus:border-sky-500"
        >
          <option value="All">All RFQs</option>
          <option value="New">New Leads</option>
          <option value="Contacted">Contacted</option>
          <option value="Quotation Sent">Quotation Sent</option>
          <option value="Won">Deal Won</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            Loading hospital RFQ leads...
          </div>
        ) : quotes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            No quotation requests in this category.
          </div>
        ) : (
          quotes.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 shadow-md hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-800/40">
                    RFQ-2026-0{q.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      q.status === 'New'
                        ? 'bg-rose-950 text-rose-400 border-rose-800/40'
                        : q.status === 'Quotation Sent'
                        ? 'bg-sky-950 text-sky-400 border-sky-800/40'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {q.hospital_name || 'Hospital Lead'}
                  </h3>
                  <p className="text-xs text-slate-400">Doctor / Attn: {q.customer_name}</p>
                  {q.city && <p className="text-[11px] text-slate-500">City: {q.city}</p>}
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <p className="font-bold text-sky-300">{q.product_name}</p>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Units Required: <b>{q.quantity}</b></span>
                    <span>Timeline: <b>{q.target_timeline}</b></span>
                  </div>
                  {q.message && (
                    <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-800">
                      "{q.message}"
                    </p>
                  )}
                </div>

                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{q.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{q.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Selector & Contact Actions */}
              <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                <select
                  value={q.status}
                  onChange={(e) => handleUpdateStatus(q.id, e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white px-2 py-1 text-[11px] rounded-lg outline-none focus:border-sky-500 flex-1"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Won">Won</option>
                  <option value="Closed">Closed</option>
                </select>

                <a
                  href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                    q.customer_name
                  )},%20regarding%20your%20HospitalStore%20quotation%20request%20for%20${encodeURIComponent(
                    q.product_name
                  )}...`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 transition-colors"
                  title="WhatsApp Doctor"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete RFQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

