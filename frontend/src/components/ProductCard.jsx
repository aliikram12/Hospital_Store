import React from 'react';
import { ShoppingCart, Star, ShieldCheck, FileSpreadsheet, Eye, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelect }) {
  const { addToCart, openQuoteModal } = useCart();
  const { formatPrice, currency } = useCurrency();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleRequestQuote = (e) => {
    e.stopPropagation();
    openQuoteModal(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-sky-300 card-hover-effect animate-pop-in flex flex-col overflow-hidden cursor-pointer shadow-sm"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.discount_percent > 0 && (
            <span className="bg-rose-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              {product.discount_percent}% OFF
            </span>
          )}
          {product.is_trending && (
            <span className="bg-amber-500 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Trending
            </span>
          )}
        </div>

        {product.is_in_stock ? (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
            In Stock
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Made to Order
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative pt-[72%] bg-slate-100/60 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm text-slate-700 flex items-center justify-center shadow-md hover:bg-white hover:text-sky-600 transition-colors">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold text-sky-700 tracking-wide uppercase text-[10.5px]">
              {product.brand}
            </span>
            {product.sku && <span className="text-[10px] font-mono text-slate-400">{product.sku}</span>}
          </div>

          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating || '4.8'}</span>
            <span className="text-[11px] text-slate-400">({product.reviews_count || 12})</span>
          </div>

          {/* Warranty tag */}
          <p className="text-[10.5px] text-slate-500 mt-2 flex items-center gap-1 line-clamp-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{product.warranty || '1 Year Official Warranty'}</span>
          </p>
        </div>

        {/* Price and CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between gap-1 mb-3">
            <div>
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {currency === 'PKR' && (
                <span className="text-[10px] text-slate-400 block font-mono">
                  (${Math.round(product.price / 280)})
                </span>
              )}
            </div>

            {product.original_price > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-medium">
              +12% GST
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-1.5 shadow-sm shadow-sky-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleRequestQuote}
              className="w-full py-2 px-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 border border-slate-200 hover:border-sky-200 transition-colors flex items-center justify-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
              <span>RFQ Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
