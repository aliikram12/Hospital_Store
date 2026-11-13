import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function CartDrawer({ onNavigate }) {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    taxAmount,
    shippingFee,
    totalAmount,
    cartCount
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 5000;
  const freeShippingDiff = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Hospital Equipment Cart</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
              {cartCount} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-4 py-3 bg-sky-50/60 border-b border-sky-100 text-xs">
          <div className="flex items-center justify-between text-slate-700 font-medium mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-sky-600" />
              {freeShippingDiff > 0
                ? `Add ${formatPrice(freeShippingDiff)} more for FREE Pan-India Freight`
                : '🎉 You have unlocked FREE Express Biomedical Delivery!'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our catalog of certified ICU monitors, ventilators, hospital beds, and surgical lights.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('catalog');
                }}
                className="mt-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Browse Medical Equipment
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="pt-3 flex gap-3 items-start">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wide">
                    {item.brand}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-slate-900">
                      {formatPrice(item.price)}
                    </span>
                    {item.original_price > item.price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatPrice(item.original_price)}
                      </span>
                    )}
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartCount} units)</span>
                <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Medical GST (12%)</span>
                <span className="font-semibold text-slate-800">{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biomedical Freight Logistics</span>
                <span className="font-semibold text-slate-800">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-sky-700">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Includes Official GST Input Tax Credit Invoice</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

