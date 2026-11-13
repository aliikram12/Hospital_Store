import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Truck,
  CreditCard,
  QrCode,
  Landmark,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Tag,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';

export default function CheckoutPage({ onNavigate, onOrderCompleted }) {
  const { cartItems, subtotal, taxAmount, shippingFee, totalAmount, clearCart } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    hospital_clinic_name: '',
    shipping_address: '',
    city: '',
    state: 'Delhi',
    postal_code: '',
    gstin: '',
    notes: '',
    payment_method: 'UPI / Instant QR'
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statesList = [
    'Delhi NCR', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat',
    'Uttar Pradesh', 'West Bengal', 'Telangana', 'Kerala', 'Rajasthan',
    'Punjab', 'Madhya Pradesh', 'Haryana', 'Bihar', 'Odisha', 'Assam'
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

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      addToast('Your cart is empty', 'error');
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
        country: 'India',
        gstin: formData.gstin,
        payment_method: formData.payment_method,
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

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore confetti errors
      }

      addToast(`Order ${orderResult.order_number} confirmed successfully!`, 'success');
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
            Secure 256-Bit SSL Encrypted Medical Order Processing with B2B GST Invoicing
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
              <span>1. Purchaser & Organization Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Physician / Officer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Sharma"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital / Clinic / Center Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Multispeciality Hospital"
                  value={formData.hospital_clinic_name}
                  onChange={(e) => setFormData({ ...formData, hospital_clinic_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (for GST Tax Invoice PDF) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="billing@hospital.org"
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
                  placeholder="+91 98210 44892"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital GSTIN Number (Optional - for 12% Input Tax Credit)
              </label>
              <input
                type="text"
                placeholder="e.g. 07AAAAA0000A1Z5"
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
              <span>2. Delivery Address & Freight Instructions</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Street Address / Ward / Block / Suite *
              </label>
              <textarea
                required
                rows="2"
                placeholder="Suite 402, Main OT Block, Sector 14"
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
                  placeholder="Gurugram / Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none bg-white"
                >
                  {statesList.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="122001"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Delivery Notes / Unloading Details
              </label>
              <input
                type="text"
                placeholder="e.g. Heavy equipment unloading ramp required; deliver to Biomedical Dept."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none"
              />
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-sm border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-sky-600" />
              <span>3. Payment Method</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'UPI / Instant QR', label: 'UPI / Instant QR Code', icon: QrCode, desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                { id: 'Credit/Debit Card (Visa/MC)', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, RuPay (256-Bit SSL)' },
                { id: 'Hospital PO / RTGS Transfer', label: 'Hospital PO / RTGS Wire', icon: Landmark, desc: 'Official B2B institutional account transfer' },
                { id: 'Cash on Delivery (COD)', label: 'Pay on Delivery / Inspection', icon: Banknote, desc: 'Inspect device upon arrival before payment' }
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = formData.payment_method === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setFormData({ ...formData, payment_method: method.id })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-sky-600' : 'text-slate-500'}`} />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900">{method.label}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{method.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment simulation sub-boxes */}
            {formData.payment_method === 'UPI / Instant QR' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <p className="text-xs font-bold text-slate-800">Scan & Pay via any UPI App</p>
                <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-200 mx-auto shadow-inner flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <QrCode className="w-20 h-20 text-slate-800 mx-auto" />
                    <span className="text-[9px] font-mono font-bold text-slate-500">hospitalstore@icici</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Instant biometric confirmation upon order placement</p>
              </div>
            )}

            {formData.payment_method === 'Hospital PO / RTGS Transfer' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">Institutional Bank Account Details:</p>
                <p className="font-mono text-[11px]">Bank: HDFC Bank Ltd • Branch: Okhla Industrial Area</p>
                <p className="font-mono text-[11px]">Account Name: Hospital Store Pvt. Ltd.</p>
                <p className="font-mono text-[11px]">Account No: 50200089412039 • IFSC: HDFC0000281</p>
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
                <span className="text-sky-700">{formatPrice(finalTotal)}</span>
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

