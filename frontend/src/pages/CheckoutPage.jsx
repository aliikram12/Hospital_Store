import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Truck,
  QrCode,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

export default function CheckoutPage({ onNavigate, onOrderCompleted }) {
  const { cartItems, subtotal, taxAmount, shippingFee, totalAmount, clearCart } = useCart();
  const { formatPrice, currency, exchangeRate } = useCurrency();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    hospital_clinic_name: '',
    shipping_address: '',
    city: '',
    state: 'Punjab',
    postal_code: '',
    gstin: '',
    notes: '',
    payment_method: 'Cash on Delivery', // ONLY 2 METHODS: 'Cash on Delivery' or 'QR Code / Bank Transfer'
    payment_proof_image: '',
    transaction_ref: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingSS, setIsUploadingSS] = useState(false);

  const provincesList = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa (KPK)', 'Balochistan', 'Islamabad Capital Territory', 'Azad Kashmir', 'Gilgit-Baltistan'
  ];

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'HOSPITAL10') {
      const disc = Math.round(subtotal * 0.10);
      setDiscountAmount(disc);
      setAppliedCoupon('HOSPITAL10 (10% Institutional Discount)');
      addToast('Coupon HOSPITAL10 applied! Saved 10%', 'success');
    } else if (code === 'MEDICARE5') {
      const disc = Math.round(subtotal * 0.05);
      setDiscountAmount(disc);
      setAppliedCoupon('MEDICARE5 (5% Clinic Discount)');
      addToast('Coupon MEDICARE5 applied! Saved 5%', 'success');
    } else {
      addToast('Invalid coupon code. Try HOSPITAL10 or MEDICARE5', 'error');
    }
  };

  const finalTotal = Math.max(0, totalAmount - discountAmount);

  // Handle Screenshot Upload for QR / Bank Transfer
  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingSS(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body
      });
      if (!res.ok) throw new Error('Failed to upload receipt screenshot');
      const data = await res.json();
      setFormData((prev) => ({ ...prev, payment_proof_image: data.url }));
      addToast('Payment receipt screenshot uploaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Screenshot upload failed. Please try again or paste image URL.', 'error');
    } finally {
      setIsUploadingSS(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    if (formData.payment_method === 'QR Code / Bank Transfer' && !formData.payment_proof_image && !formData.transaction_ref) {
      addToast('Please upload the transaction screenshot (SS) or enter the Transaction ID to confirm payment.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        hospital_clinic_name: formData.hospital_clinic_name,
        shipping_address: formData.shipping_address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: 'Pakistan',
        gstin: formData.gstin,
        currency: currency,
        exchange_rate: exchangeRate,
        payment_method: formData.payment_method,
        payment_proof_image: formData.payment_proof_image,
        transaction_ref: formData.transaction_ref,
        notes: formData.notes,
        discount_amount: discountAmount,
        items: cartItems.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_image: item.image_url,
          unit_price: item.price,
          quantity: item.quantity
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to place order');
      }

      const orderResult = await res.json();

      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      addToast(`Order ${orderResult.order_number} confirmed!`, 'success');
      clearCart();
      if (onOrderCompleted) {
        onOrderCompleted(orderResult);
      }
      onNavigate('order-success', { order: orderResult });
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Error creating order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Please add medical equipment to proceed with checkout.</p>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-6 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow"
        >
          Browse Equipment Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Checkout Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hospital Equipment Checkout
          </h1>
          <p className="text-xs text-slate-500">
            Pay via Cash on Delivery or QR Code / Bank Transfer with Screenshot Confirmation
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Biomedical Quality Assurance Guaranteed</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Doctor / Purchaser Details */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-sm border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>1. Purchaser & Hospital Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Physician / Procurement Officer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Tariq / Bilal Qureshi"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital / Clinic / Medical Center Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shaukat Khanum / AKUH / City Clinic"
                  value={formData.hospital_clinic_name}
                  onChange={(e) => setFormData({ ...formData, hospital_clinic_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (for Official Tax Invoice PDF) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="doctor@hospital.org"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / WhatsApp Number (for Courier Dispatch) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital NTN / GSTIN Number (Optional - for Tax Exemption or Input Credit)
              </label>
              <input
                type="text"
                placeholder="e.g. NTN-4892102-1"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none uppercase"
              />
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-sm border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>2. Delivery Address & Logistics Instructions</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Street Address / Ward / OT Block *
              </label>
              <textarea
                required
                rows="2"
                placeholder="Biomedical Department, 2nd Floor, Main Building"
                value={formData.shipping_address}
                onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="Lahore / Karachi / Islamabad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Province *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none bg-white"
                >
                  {provincesList.map((pr) => (
                    <option key={pr} value={pr}>{pr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  placeholder="54000"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Delivery Notes / Unloading Ramp Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Call before delivery; heavy equipment crate unloading required"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
              />
            </div>
          </div>

          {/* Section 3: Payment Method (EXACTLY 2 PAYMENT METHODS) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-sm border-b border-slate-100 pb-3">
              <Banknote className="w-4 h-4 text-sky-600" />
              <span>3. Payment Method (Select 1 of 2 Options)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Cash on Delivery */}
              <div
                onClick={() => setFormData({ ...formData, payment_method: 'Cash on Delivery' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'Cash on Delivery'
                    ? 'border-sky-600 bg-sky-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">1. Cash on Delivery (COD)</h4>
                    <p className="text-[10px] text-slate-500">Pay cash upon device inspection</p>
                  </div>
                </div>
              </div>

              {/* Option 2: QR Code & Bank Transfer with SS */}
              <div
                onClick={() => setFormData({ ...formData, payment_method: 'QR Code / Bank Transfer' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'QR Code / Bank Transfer'
                    ? 'border-sky-600 bg-sky-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">2. QR Code / Bank Transfer</h4>
                    <p className="text-[10px] text-slate-500">Scan QR / Bank Transfer + SS upload</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-panel for QR Code / Bank Transfer with Screenshot Upload */}
            {formData.payment_method === 'QR Code / Bank Transfer' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Official Verified HospitalStore Bank Account</span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-slate-200 max-w-sm mx-auto shadow-inner space-y-2 text-xs">
                    <div className="w-36 h-36 bg-slate-100 p-2 rounded-xl mx-auto flex items-center justify-center border">
                      <QrCode className="w-28 h-28 text-slate-800" />
                    </div>
                    <div className="text-left space-y-1 font-mono text-[11px]">
                      <p><b className="text-slate-700">Bank:</b> Meezan Bank Ltd</p>
                      <p><b className="text-slate-700">Account Title:</b> Hospital Store Official</p>
                      <p><b className="text-slate-700">Account No:</b> 0201-0105492819</p>
                      <p><b className="text-slate-700">EasyPaisa / JazzCash:</b> 0300-1234567</p>
                      <p><b className="text-slate-700">Amount Due:</b> <span className="font-bold text-sky-700">{formatPrice(finalTotal, true)}</span></p>
                    </div>
                  </div>
                </div>

                {/* Screenshot (SS) Upload Form */}
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-900">
                    📸 Upload Payment Screenshot (SS) or Transaction Receipt *
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow transition-all">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingSS ? 'Uploading Screenshot...' : 'Upload SS from Device'}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        placeholder="Or enter Transaction ID / Trx Reference (TID)"
                        value={formData.transaction_ref}
                        onChange={(e) => setFormData({ ...formData, transaction_ref: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-sky-500 font-mono"
                      />
                    </div>
                  </div>

                  {formData.payment_proof_image && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800">
                      <img
                        src={formData.payment_proof_image}
                        alt="Payment Proof"
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div>
                        <p className="font-bold">Screenshot Attached & Ready!</p>
                        <p className="text-[11px] text-emerald-600 font-mono truncate">{formData.payment_proof_image}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-2 flex items-center gap-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Voucher / Coupon Code */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. HOSPITAL10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs uppercase font-mono rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {appliedCoupon}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>GST Tax (12% Medical Instruments)</span>
                <span className="font-semibold text-slate-900">{formatPrice(taxAmount)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Biomedical Freight Express</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Institutional Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>Total Payable</span>
                <div className="text-right">
                  <span className="text-sky-700 block">{formatPrice(finalTotal)}</span>
                  {currency === 'PKR' && (
                    <span className="text-[11px] text-slate-400 font-mono font-normal">
                      (${Math.round(finalTotal / 280)})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-700 hover:to-teal-600 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Securing Medical Order...' : `Place Certified Order • ${formatPrice(finalTotal)}`}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Includes OEM Calibration Warranty & GST Input Invoice</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
