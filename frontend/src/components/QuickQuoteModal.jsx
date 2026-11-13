import React, { useState } from 'react';
import { X, Building2, Send, CheckCircle2, MessageCircle, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';

export default function QuickQuoteModal() {
  const { quoteModalProduct, closeQuoteModal } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    hospital_name: '',
    city: '',
    quantity: 1,
    target_timeline: 'Immediate (within 7 days)',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState(null);

  if (!quoteModalProduct && quoteModalProduct !== '') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        product_id: quoteModalProduct?.id || null,
        product_name: quoteModalProduct?.name || 'General Hospital Equipment Inquiry',
        quantity: parseInt(formData.quantity) || 1
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to submit quote');
      const data = await res.json();
      setSubmittedQuote(data);
      addToast('Institutional RFQ submitted successfully! Biomedical team assigned.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Submission failed. Please check connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedQuote(null);
    closeQuoteModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">B2B Hospital RFQ Quotation</h3>
              <p className="text-xs text-slate-300">Direct Institutional & Wholesale Medical Pricing</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedQuote ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">RFQ Request Received!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Reference ID: <span className="font-mono font-bold text-sky-600">RFQ-2026-0{submittedQuote.id}</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Our senior biomedical sales engineer will verify your institutional requirements and send a formal stamp-signed PDF quotation to <b>{submittedQuote.email}</b> within 2 business hours.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <a
                href={`https://wa.me/919811234567?text=Hi,%20I%20just%20submitted%20RFQ%20ID:%20RFQ-2026-0${submittedQuote.id}%20for%20${encodeURIComponent(submittedQuote.product_name)}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Expedite via WhatsApp Specialist</span>
              </a>
              <button
                onClick={handleClose}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Quote Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {quoteModalProduct && typeof quoteModalProduct === 'object' && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img
                  src={quoteModalProduct.image_url}
                  alt={quoteModalProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-sky-600">{quoteModalProduct.brand}</span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{quoteModalProduct.name}</h4>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    Unit Price: {formatPrice(quoteModalProduct.price)} <span className="text-[10px] text-slate-400 font-normal">+ GST</span>
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh / Procurement Officer"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Apollo / Lifecare Nursing Home"
                  value={formData.hospital_name}
                  onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="doctor@hospital.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Units Required</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Timeline</label>
                <select
                  value={formData.target_timeline}
                  onChange={(e) => setFormData({ ...formData, target_timeline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none bg-white"
                >
                  <option>Immediate (1-7 Days)</option>
                  <option>Within 15 Days</option>
                  <option>Within 30 Days</option>
                  <option>Turnkey Hospital Project</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specific Technical Specs / Custom Accessories Needed
              </label>
              <textarea
                rows="2"
                placeholder="Mention required probes, warranty period (2 or 3 years AMC), mounting brackets, or tender specifications..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Generating RFQ Lead...' : 'Submit Institutional RFQ Quotation'}</span>
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                🔒 Official HospitalStore Quotations are compliant with GeM / Government Tenders & Private Hospital Audits.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

