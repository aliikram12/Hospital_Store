import React, { useState } from 'react';
import {
  HeartPulse,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Building2,
  FileCheck,
  CheckCircle2,
  PhoneCall,
  Search,
  Zap,
  Star,
  Users
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getCategoryIcon, formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

export default function HomePage({ categories = [], products = [], onNavigate }) {
  const { openQuoteModal } = useCart();
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  // Filter products by tab
  const filteredProducts = activeCategoryTab === 'all'
    ? products
    : products.filter((p) => {
        const cat = categories.find((c) => c.id === p.category_id);
        return cat?.slug === activeCategoryTab;
      });

  const trendingProducts = products.filter((p) => p.is_trending).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-12 pb-20 px-4">
        {/* Ambient lighting glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>India's Most Trusted Hospital & Clinic Equipment Superstore</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              Next-Gen Medical Devices for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">Critical Care</span> & Hospitals.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Direct OEM distribution of advanced multi-parameter patient monitors, turbine ventilators, shadowless OT lights, 5-function ICU beds, and digital ultrasound scanners with genuine warranty and on-site AMC support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('catalog')}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Browse All Equipment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openQuoteModal()}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm rounded-2xl border border-slate-700 backdrop-blur-md flex items-center justify-center gap-2 transition-all hover:border-slate-500"
              >
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Request B2B Hospital RFQ</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">50,000+</p>
                <p className="text-[11px] text-slate-400">Hospitals & Clinics</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-sky-400">100%</p>
                <p className="text-[11px] text-slate-400">OEM Genuine Devices</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-teal-400">24 Hours</p>
                <p className="text-[11px] text-slate-400">Fast Dispatch</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Highlight Device Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-tr from-slate-800/80 to-slate-900/80 p-6 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl">
              {/* Highlight Device Card */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                  alt="Mindray uMEC 12 Patient Monitor"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  ⭐ Flagship ICU Monitor
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">Mindray Healthcare</span>
                  <h3 className="text-sm font-bold truncate">uMEC 12 Multi-Parameter Patient Monitor</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-black text-white">₹68,500</span>
                    <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      In Stock • Dispatches in 24h
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Features Badge List */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Glasgow Arrhythmia & ST-segment diagnostic analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Input GST Tax credit invoice with 12% deduction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2 Years Comprehensive Biomedical AMC Warranty</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('catalog', { category: 'icu-critical-care' })}
                className="mt-5 w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <span>View ICU Equipment Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="flex items-center gap-3.5 px-2">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Genuine OEM</h4>
              <p className="text-[11px] text-slate-500">Official manufacturer warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 pt-3 sm:pt-0">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Pan-India Freight</h4>
              <p className="text-[11px] text-slate-500">Free delivery on ₹5,000+</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 pt-3 sm:pt-0">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">B2B GST Invoices</h4>
              <p className="text-[11px] text-slate-500">Input credit for hospitals</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 pt-3 sm:pt-0">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Biomedical AMC</h4>
              <p className="text-[11px] text-slate-500">Installation & engineer demo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Hospital Departments</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Shop by Medical Specialty
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onNavigate('catalog', { category: category.slug })}
              className="group p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all flex items-center justify-center mb-4 shadow-sm">
                  {getCategoryIcon(category.icon_name, 'w-6 h-6')}
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">
                  {category.product_count || 10}+ devices
                </span>
                <span className="font-bold text-sky-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Tabs */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">High Demand Equipment</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Top Rated Hospital Medical Equipment
            </h2>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategoryTab === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Equipment
            </button>
            {categories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategoryTab(c.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeCategoryTab === c.slug
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => onNavigate('product-detail', { productId: p.id, slug: p.slug })}
            />
          ))}
        </div>
      </section>

      {/* Hospital Quotation & RFQ Calculator Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Turnkey Hospital & ICU Setup Quotations</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Planning an ICU, Operation Theatre, or Clinic Expansion?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Get an itemized institutional quotation with volume discounts, biomedical engineer installation, GeM tender compliance, and official GST input tax breakdown.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => openQuoteModal()}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Institutional RFQ</span>
              </button>

              <a
                href="tel:1800467786"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-sky-400" />
                <span>Call Biomedical Desk: 1800 467 786</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Authorized Brands Strip */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Authorized Direct Distributor For World-Class Biomedical Manufacturers
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all">
          <div className="text-base sm:text-lg font-black text-slate-700 font-serif">MINDRAY HEALTHCARE</div>
          <div className="text-base sm:text-lg font-black text-slate-700 font-sans tracking-widest">PHILIPS</div>
          <div className="text-base sm:text-lg font-black text-slate-700 font-mono">GE HEALTHCARE</div>
          <div className="text-base sm:text-lg font-black text-slate-700 font-sans">BPL MEDICAL</div>
          <div className="text-base sm:text-lg font-black text-slate-700 font-serif">RESMED</div>
          <div className="text-base sm:text-lg font-black text-slate-700 font-mono">DRÄGER</div>
          <div className="text-base sm:text-lg font-black text-slate-700 font-sans">TUTTNAUER</div>
        </div>
      </section>

      {/* Customer Reviews / Testimonials */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Hospital Endorsements</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Trusted by Doctors & Hospital Administrators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "We procured 8 units of Mindray uMEC patient monitors and 2 OT shadowless lights for our new surgical wing. HospitalStore handled everything from prompt insured shipping to on-site calibration demo."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Dr. Rajesh Varma, MS (Ortho)</h4>
              <p className="text-[11px] text-slate-400">Varma Multispeciality Hospital, Delhi NCR</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "HospitalStore provides 100% genuine products with proper GST tax invoices for input credit. Their technical team answered all our biomedical questions before dispatch."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Kavita Singhania</h4>
              <p className="text-[11px] text-slate-400">Procurement Manager, Fortis Escorts Network</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Ordered SonoScape color Doppler and ECG machine. Delivered safely in sturdy wooden crate packaging within 48 hours. Exceptional customer service!"
            </p>
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Dr. Meenakshi Sundaram</h4>
              <p className="text-[11px] text-slate-400">Chief Radiologist, Sundaram Diagnostic Center</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

