import React, { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  Truck,
  ArrowRight,
  Building2,
  PackageCheck,
  ShieldCheck,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import InvoiceModal from '../components/InvoiceModal';

export default function OrderSuccessPage({ order, onNavigate }) {
  const { addToast } = useToast();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No recent order found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    addToast('Order number copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Success Badge */}
      <div className="bg-gradient-to-b from-emerald-500/10 to-transparent p-8 rounded-3xl border border-emerald-500/20 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Medical Equipment Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Thank you, <span className="font-bold text-slate-900">{order.customer_name}</span>. Your hospital order has been transmitted to our biomedical logistics center for quality testing and dispatch.
        </p>

        {/* Order Number pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm mt-2">
          <span className="text-xs text-slate-500 font-medium">Order Reference:</span>
          <span className="text-sm font-black font-mono text-sky-700">{order.order_number}</span>
          <button
            onClick={handleCopyOrderNumber}
            className="p-1 rounded text-slate-400 hover:text-slate-800 transition-colors"
            title="Copy reference number"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setShowInvoiceModal(true)}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-all hover:scale-105"
        >
          <Printer className="w-4 h-4 text-sky-400" />
          <span>View & Print Official GST Invoice</span>
        </button>

        <button
          onClick={() => onNavigate('track-order', { orderNumber: order.order_number })}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-all hover:scale-105"
        >
          <Truck className="w-4 h-4" />
          <span>Track Live Shipment</span>
        </button>

        <button
          onClick={() => onNavigate('catalog')}
          className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs rounded-xl transition-colors"
        >
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Dispatch Details</span>
            <h3 className="text-sm font-bold text-slate-900">
              Courier Partner: <span className="text-sky-700">{order.tracking_courier || 'BlueDart Health Express'}</span>
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              AWB No: {order.tracking_number || 'BD-HS-88492019'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Status: {order.order_status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Payment: {order.payment_status}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered Equipment</h4>
          <div className="divide-y divide-slate-100">
            {order.items && order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                    {item.product_image ? (
                      <img src={item.product_image} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <PackageCheck className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{item.product_name}</h5>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900">
                  {formatPrice(item.total_price)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-slate-100 flex flex-col items-end space-y-1.5 text-xs">
            <div className="flex justify-between w-64 text-slate-500">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between w-64 text-slate-500">
              <span>GST (12%):</span>
              <span className="font-semibold text-slate-800">{formatPrice(order.tax_amount)}</span>
            </div>
            <div className="flex justify-between w-64 text-slate-500">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-slate-800">{order.shipping_fee === 0 ? 'FREE' : formatPrice(order.shipping_fee)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between w-64 text-emerald-600 font-semibold">
                <span>Discount:</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between w-64 text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-sky-700">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Delivering To:</h5>
            <p className="font-bold text-slate-900">{order.hospital_clinic_name || order.customer_name}</p>
            <p className="text-slate-600">{order.shipping_address}</p>
            <p className="text-slate-600">{order.city}, {order.state} - {order.postal_code}</p>
            <p className="text-slate-600">Contact: {order.customer_phone}</p>
          </div>

          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">GST & Payment Info:</h5>
            <p className="text-slate-600">Method: <span className="font-semibold text-slate-900">{order.payment_method}</span></p>
            <p className="text-slate-600">Buyer GSTIN: <span className="font-mono text-slate-900">{order.gstin || 'Consumer / Unregistered'}</span></p>
            <p className="text-slate-600">Invoice: <span className="font-mono text-slate-900">INV-{order.order_number.replace('HS-', '')}</span></p>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal orderId={order.id} onClose={() => setShowInvoiceModal(false)} />
      )}
    </div>
  );
}

