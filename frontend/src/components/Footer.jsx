import React from 'react';
import {
  HeartPulse,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Trust & Accreditations Banner */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine OEM</h4>
              <p className="text-xs text-slate-400">Direct factory warranty & certifications</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Biomedical Logistics</h4>
              <p className="text-xs text-slate-400">Insured express cold/fragile freight</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ISO 13485 Certified</h4>
              <p className="text-xs text-slate-400">CE, CDSCO & US FDA compliant</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">AMC & Engineer Support</h4>
              <p className="text-xs text-slate-400">On-site biomedical installation team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-lg">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Hospital<span className="text-sky-400">Store</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              HospitalStore is India's leading healthcare technology platform and authorized medical equipment distributor. We supply top-tier hospitals, nursing homes, diagnostic centers, and clinics with authentic medical devices, ICU equipment, surgical tables, and diagnostic systems.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+91 8000 467 786 / 011 4987 6543 (Toll-Free)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>procurement@hospitalstore.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Plot 42, Okhla Industrial Area, Phase III, New Delhi 110020, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>GSTIN: 07AAECH7890M1Z8 (Official B2B Invoicing)</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
              Equipment Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'icu-critical-care' })} className="hover:text-white transition-colors">
                  ICU Patient Monitors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'operation-theatre' })} className="hover:text-white transition-colors">
                  OT Tables & Surgical Lights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'diagnostic-imaging' })} className="hover:text-white transition-colors">
                  ECG & Ultrasound Scanners
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'hospital-furniture' })} className="hover:text-white transition-colors">
                  Electric Motorized ICU Beds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'respiratory-care' })} className="hover:text-white transition-colors">
                  Oxygen Concentrators & BiPAP
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'emergency-defibrillators' })} className="hover:text-white transition-colors">
                  Biphasic Defibrillators & AED
                </button>
              </li>
            </ul>
          </div>

          {/* Hospital Support & Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Procurement & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-white transition-colors">
                  Track Live Shipment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Request B2B Hospital Quotation
                </button>
              </li>
              <li>
                <span className="cursor-default hover:text-white transition-colors">
                  Biomedical AMC / CMC Plans
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-white transition-colors">
                  Equipment Installation & Demo
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-white transition-colors">
                  GST Input Tax Credit Invoices
                </span>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-sky-400 font-semibold hover:underline">
                  Hospital Admin Control Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Biomedical Certification & Security */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Compliance & Security
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              All electrical medical equipment conforms to IEC 60601-1 safety guidelines and CDSCO regulatory clearance.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted
              </div>
              <p className="text-[11px] text-slate-400">
                Authorized distributor for Mindray, Philips, GE Healthcare, ResMed, BPL & Contec.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Hospital Store. All rights reserved. HospitalStore is a registered medical equipment trademark.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Sale</span>
          <span>•</span>
          <span>Biomedical Standards</span>
        </div>
      </div>
    </footer>
  );
}

