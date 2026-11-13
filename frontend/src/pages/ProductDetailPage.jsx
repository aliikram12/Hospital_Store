import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  Award,
  Building2,
  CheckCircle2,
  ShoppingCart,
  Zap,
  FileSpreadsheet,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  FileText
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ productId, slug, onNavigate }) {
  const { addToCart, openQuoteModal } = useCart();
  const { formatPrice, currency } = useCurrency();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const identifier = productId || slug;
    fetch(`/api/products/${identifier}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image_url);
        window.scrollTo(0, 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [productId, slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading certified medical device details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Medical equipment not found</h2>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.additional_images || [])].filter(Boolean);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigate('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-sky-600">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('catalog')} className="hover:text-sky-600">Catalog</button>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Images Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square shadow-sm">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.discount_percent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                {product.discount_percent}% OFF
              </span>
            )}
            <span className="absolute top-4 right-4 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.is_in_stock ? 'In Stock' : 'Made to Order'}
            </span>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img ? 'border-sky-600 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold text-sky-700 uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 border border-sky-200">
                {product.brand}
              </span>
              <span className="text-xs font-mono text-slate-400">{product.sku}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviews_count} hospital reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatPrice(product.price)}
              </span>
              {currency === 'PKR' && (
                <span className="text-sm font-mono text-slate-400">
                  (${Math.round(product.price / 280)})
                </span>
              )}
              {product.original_price > product.price && (
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              {product.original_price > product.price && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Save {formatPrice(product.original_price - product.price)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              * Inclusive of GST Input Tax Credit. Official B2B Tax invoice provided for hospital account auditing.
            </p>
          </div>

          {/* Quick Highlights */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{product.lead_time || 'In Stock • Dispatches in 24 hours'}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{product.warranty || '2 Years Official Manufacturer Warranty'}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Truck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Insured Biomedical Express Logistics across all Cities</span>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToCart(product, quantity)}
                className="py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Equipment Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* B2B Hospital RFQ Button */}
            <button
              onClick={() => openQuoteModal(product)}
              className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-2xl text-xs border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Request Hospital Bulk RFQ Quotation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3.5 text-xs font-bold transition-all shrink-0 border-b-2 ${
              activeTab === 'specs'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-6 py-3.5 text-xs font-bold transition-all shrink-0 border-b-2 ${
              activeTab === 'features'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical Features & Benefits
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3.5 text-xs font-bold transition-all shrink-0 border-b-2 ${
              activeTab === 'description'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Detailed Overview
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-6 py-3.5 text-xs font-bold transition-all shrink-0 border-b-2 ${
              activeTab === 'warranty'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Warranty & Biomedical Support
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Technical & Engineering Parameters
              </h3>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <span className="font-bold text-slate-700">{key}</span>
                      <span className="text-slate-900 sm:text-right font-medium">{String(val)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Standard clinical parameters include CE Marked electrical protection, 220V/50Hz power input and OEM calibration certificate.
                </p>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Key Device Features
              </h3>
              {product.features && product.features.length > 0 ? (
                <ul className="space-y-2.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">Premium hospital-grade engineering for 24/7 continuous duty.</p>
              )}
            </div>
          )}

          {activeTab === 'description' && (
            <div className="prose prose-sm text-slate-600 max-w-none text-xs leading-relaxed space-y-3">
              <p>{product.full_desc || product.short_desc}</p>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">HospitalStore Biomedical Assurance</h4>
                  <p className="mt-1">
                    Every device dispatched undergoes rigorous pre-delivery inspection (PDI) and electrical safety testing by our certified biomedical engineers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900">Related Hospital Equipment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.related_products.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={(p) => onNavigate('product-detail', { productId: p.id, slug: p.slug })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
