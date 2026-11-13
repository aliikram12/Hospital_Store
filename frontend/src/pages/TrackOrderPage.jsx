import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  Building2,
  Printer,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import InvoiceModal from '../components/InvoiceModal';

export default function TrackOrderPage({ initialOrderNumber = '', onNavigate }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderNumber(initialOrderNumber);
      handleTrack(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleTrack = async (searchNum) => {
    const num = (searchNum || orderNumber).trim();
    if (!num) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(num)}`);
      if (!res.ok) {
        throw new Error('Order not found. Please verify the order number (e.g. HS-2026-8941).');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Error tracking shipment');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Order Received', desc: 'Order confirmed & recorded' },
    { title: 'Biomedical Quality Check', desc: 'Safety & calibration verified' },
    { title: 'Dispatched', desc: 'Picked by specialized medical freight' },
    { title: 'Out for Hospital Delivery', desc: 'Arriving at clinic/hospital' },
    { title: 'Delivered', desc: 'Handed over to Biomedical Department' }
  ];

  // Helper to determine step index
  const getStepIndex = (status) => {
    const st = (status || '').toLowerCase();
    if (st.includes('delivered')) return 4;
    if (st.includes('out') || st.includes('transit')) return 3;
    if (st.includes('dispatched') || st.includes('shipped')) return 2;
    if (st.includes('processing') || st.includes('check')) return 1;
    return 0;
  };

  const currentStep = order ? getStepIndex(order.order_status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
          <Truck className="w-3.5 h-3.5" />
          <span>Biomedical Cold & Heavy Cargo Telemetry</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Track Your Hospital Shipment
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Enter your HospitalStore Order Reference number (e.g. HS-2026-8941) to monitor real-time shipping telemetry and quality check updates.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Enter Order Number e.g. HS-2026-8941"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs font-mono font-bold rounded-xl outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-70"
          >
            {loading ? 'Locating...' : 'Track Order'}
          </button>
        </form>

        {/* Demo fast click buttons */}
        <div className="pt-2 px-2 flex items-center gap-2 text-[11px] text-slate-400">
          <span>Sample orders to test:</span>
          <button
            onClick={() => {
              setOrderNumber('HS-2026-8941');
              handleTrack('HS-2026-8941');
            }}
            className="text-sky-600 hover:underline font-mono font-semibold"
          >
            HS-2026-8941
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setOrderNumber('HS-2026-7822');
              handleTrack('HS-2026-7822');
            }}
            className="text-sky-600 hover:underline font-mono font-semibold"
          >
            HS-2026-7822
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Tracking Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden space-y-6">
          {/* Header summary */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                Order Reference
              </span>
              <h2 className="text-xl font-black font-mono text-white mt-0.5">{order.order_number}</h2>
              <p className="text-xs text-slate-300 mt-1">
                Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Carrier: {order.tracking_courier}
              </span>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="px-3.5 py-1.5 bg-white text-slate-900 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all hover:bg-slate-100"
              >
                <Printer className="w-3.5 h-3.5 text-sky-600" />
                <span>GST Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
              Shipment Telemetry Progress
            </h3>

            <div className="relative">
              {/* Horizontal line for desktop */}
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="hidden sm:block absolute top-1/2 left-0 h-1 bg-sky-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                          isDone
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                            : 'bg-slate-200 text-slate-500'
                        } ${isCurrent ? 'ring-4 ring-sky-300' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <h4 className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {st.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Logistics & Destination Info */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Consignment Destination</span>
              <p className="font-bold text-slate-900 text-sm">
                {order.hospital_clinic_name || order.customer_name}
              </p>
              <p className="text-slate-600">{order.shipping_address}</p>
              <p className="text-slate-600">{order.city}, {order.state} - {order.postal_code}</p>
              <p className="text-slate-600">Contact: {order.customer_phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Airway Bill (AWB) Tracking</span>
              <p className="font-bold text-slate-900 text-sm font-mono">{order.tracking_number}</p>
              <p className="text-slate-600">
                Payment Method: <span className="font-semibold text-slate-800">{order.payment_method}</span>
              </p>
              <p className="text-slate-600">
                Payment Status: <span className="font-semibold text-emerald-600">{order.payment_status}</span>
              </p>
              <p className="text-slate-600">
                Total Order Value: <span className="font-bold text-sky-700">{formatPrice(order.total_amount)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && order && (
        <InvoiceModal orderId={order.id} onClose={() => setShowInvoiceModal(false)} />
      )}
    </div>
  );
}

