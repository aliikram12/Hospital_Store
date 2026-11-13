import React, { useState, useEffect } from 'react';
import { X, Printer, Download, ShieldCheck, HeartPulse } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function InvoiceModal({ orderId, onClose }) {
  const { formatPrice } = useCurrency();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/orders/${orderId}/invoice`)
      .then((res) => {
        if (!res.ok) throw new Error('Invoice not found');
        return res.json();
      })
      .then((data) => setInvoice(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Action Header */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold">Tax Invoice Preview (HospitalStore B2B Format)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 font-sans text-slate-800 bg-white space-y-6 text-xs">
          {loading ? (
            <div className="py-20 text-center text-slate-500">Generating tax invoice...</div>
          ) : !invoice ? (
            <div className="py-20 text-center text-slate-500">Unable to load invoice data.</div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">
                      Hospital<span className="text-sky-600">Store</span>
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">{invoice.seller.name}</p>
                  <p className="text-slate-500">{invoice.seller.address}</p>
                  <p className="text-slate-700 font-mono font-semibold">NTN: {invoice.seller.pan} | GST: {invoice.seller.gstin}</p>
                  <p className="text-slate-500">Support: {invoice.seller.phone} • {invoice.seller.email}</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="inline-block bg-slate-900 text-white font-black text-xs px-3 py-1 rounded">
                    ORIGINAL TAX INVOICE
                  </div>
                  <p className="font-mono text-sm font-black text-slate-900 mt-2">{invoice.invoice_number}</p>
                  <p className="text-slate-500">Date: {invoice.invoice_date}</p>
                  <p className="text-slate-700 font-semibold">Order: {invoice.order_details.order_number}</p>
                  <p className="text-sky-600 font-bold font-mono">Currency: {invoice.currency} (Rate: {invoice.exchange_rate})</p>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Billed & Shipped To (Buyer):</p>
                  <h4 className="font-bold text-slate-900">{invoice.buyer.hospital}</h4>
                  <p className="text-slate-700 font-medium">Attn: {invoice.buyer.name}</p>
                  <p className="text-slate-500">{invoice.buyer.address}</p>
                  <p className="text-slate-500">Phone: {invoice.buyer.phone} • {invoice.buyer.email}</p>
                  <p className="text-slate-800 font-mono font-bold mt-1">Buyer NTN/GST: {invoice.buyer.gstin}</p>
                </div>

                <div className="space-y-1 border-l border-slate-200 pl-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Logistics & Payment Details:</p>
                  <p><span className="text-slate-500">Payment Mode:</span> <span className="font-bold">{invoice.order_details.payment_method}</span></p>
                  <p><span className="text-slate-500">Payment Status:</span> <span className="font-bold text-emerald-700">{invoice.order_details.payment_status}</span></p>
                  <p><span className="text-slate-500">Dispatch Status:</span> <span className="font-bold">{invoice.order_details.dispatch_status}</span></p>
                  <p><span className="text-slate-500">Carrier:</span> <span className="font-medium">{invoice.order_details.courier}</span></p>
                  <p><span className="text-slate-500">Tracking No:</span> <span className="font-mono font-bold">{invoice.order_details.tracking_number}</span></p>
                  {invoice.order_details.transaction_ref && (
                    <p><span className="text-slate-500">Trx Ref:</span> <span className="font-mono font-bold text-sky-700">{invoice.order_details.transaction_ref}</span></p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-[11px] uppercase">
                      <th className="p-2 border border-slate-200">#</th>
                      <th className="p-2 border border-slate-200">Description of Medical Goods</th>
                      <th className="p-2 border border-slate-200 text-center">HSN</th>
                      <th className="p-2 border border-slate-200 text-center">Qty</th>
                      <th className="p-2 border border-slate-200 text-right">Rate</th>
                      <th className="p-2 border border-slate-200 text-right">Taxable</th>
                      <th className="p-2 border border-slate-200 text-right">GST (12%)</th>
                      <th className="p-2 border border-slate-200 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2 border border-slate-200 text-center">{idx + 1}</td>
                        <td className="p-2 border border-slate-200 font-semibold">{item.name}</td>
                        <td className="p-2 border border-slate-200 text-center font-mono">{item.hsn}</td>
                        <td className="p-2 border border-slate-200 text-center">{item.qty}</td>
                        <td className="p-2 border border-slate-200 text-right font-mono">{formatPrice(item.unit_price_pkr)}</td>
                        <td className="p-2 border border-slate-200 text-right font-mono">{formatPrice(item.taxable_value)}</td>
                        <td className="p-2 border border-slate-200 text-right font-mono">{formatPrice(item.cgst_amount + item.sgst_amount)}</td>
                        <td className="p-2 border border-slate-200 text-right font-black font-mono">{formatPrice(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary and Totals */}
              <div className="flex justify-between items-start pt-2">
                <div className="max-w-xs space-y-2 text-slate-500 text-[11px]">
                  <p className="font-bold text-slate-700">Terms & Conditions:</p>
                  <p>1. Certified hospital-grade equipment covered under OEM warranty.</p>
                  <p>2. Payment verified via selected mode ({invoice.order_details.payment_method}).</p>
                </div>

                <div className="w-72 space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/80">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold font-mono">{formatPrice(invoice.summary.subtotal_pkr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (12%):</span>
                    <span className="font-semibold font-mono">{formatPrice(invoice.summary.total_tax_pkr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Logistics Shipping:</span>
                    <span className="font-semibold">{invoice.summary.shipping_fee_pkr === 0 ? 'FREE' : formatPrice(invoice.summary.shipping_fee_pkr)}</span>
                  </div>
                  {invoice.summary.discount_pkr > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatPrice(invoice.summary.discount_pkr)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                    <span>Invoice Grand Total:</span>
                    <span className="text-sky-700 font-mono">{formatPrice(invoice.summary.grand_total_pkr, true)}</span>
                  </div>
                </div>
              </div>

              {/* Signature & Stamp */}
              <div className="pt-8 flex justify-between items-end border-t border-slate-200">
                <div className="text-[10px] text-slate-400">
                  Computer-generated official tax invoice verified electronically.
                </div>
                <div className="text-center space-y-1">
                  <div className="w-32 h-14 border border-dashed border-sky-400 rounded-lg flex items-center justify-center bg-sky-50/40 text-[10px] text-sky-800 font-bold mx-auto">
                    [ HOSPITAL STORE SEAL ]
                  </div>
                  <p className="font-bold text-slate-800 text-[11px]">Hospital Store Pvt. Ltd.</p>
                  <p className="text-[10px] text-slate-400">Authorized Signatory</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
