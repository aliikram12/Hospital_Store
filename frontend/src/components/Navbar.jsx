import React, { useState, useEffect, useRef } from 'react';
import {
  HeartPulse,
  Search,
  ShoppingCart,
  PhoneCall,
  ShieldCheck,
  Truck,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Building2,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Globe,
  User
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getCategoryIcon } from '../utils/helpers';

// Authentic Department Categories & 4-Column Subitems (Strictly matching HospitalStore Reference Screenshot)
const MEGA_MENU_DEPARTMENTS = [
  {
    id: 'homecare',
    name: 'HOMECARE',
    slug: 'respiratory-care',
    subitems: [
      'BIPAP Machine & BiPAP Ventilator', 'CPAP Machine', 'Oxygen Concentrator', 'Nebulizer Machine',
      'Hearing Aid', 'Wheelchair', 'Breast Feeding Pump', 'Sleep Test Machine',
      'Air Mattress', 'Insulin Pump', 'Stair Climbing Wheelchair', 'Commode Chair',
      'Crutches', 'Feno Test Machine', 'Air Purifier', 'Cough Assist Machine',
      'Health & Personal Care', 'Heart Rate Monitor', 'Fitness Equipment', 'Step Counter/Pedometer',
      'Massager', 'Oxygen Concentrator Accessories', 'Walking Sticks', 'Walker For Adults',
      'Skin Tag Remover', 'Support-Braces & Splints', 'Bath/Shower Chair', 'CPAP BiPAP Mask & Accessories',
      'Physiotherapy & Rehabilitation', 'Respiratory Mask', 'Steam Vaporizer', 'Ankle & Foot Supports',
      'Arm Support', 'Back Support', 'Body Belts', 'Hip Support',
      'Shoulder Support', 'Waist & Abdomen Supports', 'Splints', 'Nebulizer Kit',
      'Incentive Spirometer', 'Oxygen Analyzer', 'Peak Flow Meter', 'Polysomnography Machine',
      'Oxygen Cylinder', 'Body Plethysmograph', 'Oscillometry Device', 'Breath Analyser Machine'
    ]
  },
  {
    id: 'icu',
    name: 'ICU/CRITICALCARE',
    slug: 'icu-critical-care',
    subitems: [
      'Multi-Parameter Patient Monitors', 'ICU Turbine Ventilators', 'Defibrillators & AED', 'Syringe Infusion Pumps',
      'Volumetric Infusion Pumps', 'Central Monitoring Stations', 'Vital Signs Monitors', 'Blood Gas Analyzers (ABG)',
      'Portable Transport Ventilators', 'Biphasic Defibrillator Units', 'Capnography ETCO2 Monitors', 'Temporary Pacemakers',
      'ICU Motorized 5-Function Beds', 'Medical Crash Carts', 'Infusion Warmers', 'Critical Care Hemodialysis',
      'Suction Regulators & Jars', 'Pulse Oximeter Hubs', 'Cardiac Output Monitors', 'Invasive Blood Pressure (IBP) Sets'
    ]
  },
  {
    id: 'ot',
    name: 'OT EQUIPMENT',
    slug: 'operation-theatre',
    subitems: [
      'LED Surgical OT Lights', 'Electro-Hydraulic OT Tables', 'Electrosurgical Cautery Units', 'Anesthesia Workstations',
      'High-Vacuum OT Suction', 'C-Arm Mobile Fluoroscopy', 'Patient Warming Blankets', 'Pneumatic Tourniquets',
      'Surgical Ceiling Pendants', 'Laparoscopic Tower Systems', 'OT Sterilization Autoclaves', 'Smoke Evacuation Systems',
      'Bipolar Cautery Forceps', 'Shadowless Examination Lights', 'Surgical Scrub Sinks', 'Surgical Diathermy Accessories'
    ]
  },
  {
    id: 'diagnostic',
    name: 'DIAGNOSTIC & IMAGING',
    slug: 'diagnostic-imaging',
    subitems: [
      'Color Doppler Ultrasound 4D', 'Portable Black & White Ultrasound', '12-Lead Digital ECG Machines', '3-Channel Portable ECG',
      'High Frequency X-Ray Systems', 'Mobile X-Ray Units', 'Fetal Doppler & CTG Monitors', 'Holter 24h ECG Analyzers',
      'Spirometry Pulmonary Devices', 'Tympanic Thermometers', 'Digital Otoscopes & Ophthalmoscopes', 'Ambulatory Blood Pressure'
    ]
  },
  {
    id: 'supplies',
    name: 'SUPPLIES & ACCESSORIES',
    slug: 'supplies-accessories',
    subitems: [
      'ECG 3/5-Lead Trunk Cables', 'Reusable SpO2 Adult Probes', 'Pediatric SpO2 Sensors', 'NIBP Arm Cuffs (All Sizes)',
      'Dual Tube Air Hoses', 'Ultrasound Convex Probes', 'Ultrasound Linear Transducers', 'Cautery Grounding Plates',
      'Bipolar Foot Switches', 'Anesthesia Breathing Bags', 'Ventilator Silicon Breathing Circuits', 'Disposable Defib Pads'
    ]
  },
  {
    id: 'dental',
    name: 'DENTAL',
    slug: 'dental-equipment',
    subitems: [
      'Microprocessor Dental Chairs', 'Dental Digital X-Ray Sensors', 'Intraoral Cameras HD', 'Ultrasonic Piezo Scalers',
      'Class-B Vacuum Autoclaves', 'LED Dental Curing Lights', 'Oil-Free Air Compressors', 'High Speed Handpieces',
      'Dental Apex Locators', 'Endodontic Motors', 'Air Polishing Units', 'Dental Suction Aspirators'
    ]
  },
  {
    id: 'specialities',
    name: 'SPECIALITIES',
    slug: 'specialities',
    subitems: [
      'Neonatal Intensive Incubators', 'Infant Radiant Warmers', 'LED Phototherapy Systems', 'Hemodialysis Machines',
      'Rigid Endoscopes & Scopes', 'Orthopedic Battery Drills', 'Ophthalmic Slit Lamps', 'ENT Treatment Workstations',
      'Dermatology Laser Machines', 'Urology Resectoscopes', 'Cardiology Angioplasty Consoles', 'Plastic Surgery Instruments'
    ]
  },
  {
    id: 'lab',
    name: 'LAB EQUIPMENT',
    slug: 'laboratory-sterilization',
    subitems: [
      'Fully Automated Biochemistry Analyzers', '3-Part Hematology Analyzers', 'Clinical Centrifuges 4000 RPM', 'Binocular LED Microscopes',
      'Horizontal Autoclaves', 'Dry Heat Sterilizers', 'Microtome Sectioning Units', 'Electrolyte Analyzers Na/K/Cl',
      'Laboratory Water Distillers', 'Incubator Shakers', 'ELISA Microplate Readers', 'Pipette Calibration Systems'
    ]
  },
  {
    id: 'furniture',
    name: 'HOSPITAL FURNITURE',
    slug: 'hospital-furniture',
    subitems: [
      'Electric 5-Function ICU Beds', 'Manual 2-Crank Hospital Beds', 'Hydraulic Patient Stretchers', 'Emergency Resuscitation Trolleys',
      'Stainless Steel Crash Carts', 'ABS Bedside Medical Lockers', 'Gas-Spring Overbed Tables', 'Comfort Recliner Dialysis Chairs',
      'Gynecological Delivery Tables', 'Patient Transfer Wheelchairs', 'Stainless Steel IV Infusion Poles', 'Attendant Bed Chairs'
    ]
  },
  {
    id: 'infra',
    name: 'HOSPITAL INFRA',
    slug: 'hospital-infra',
    subitems: [
      'Medical Gas Pipeline Outlets (O2/Air/Vac)', 'PSA Medical Oxygen Generators', 'Wall-Mounted Bed Head Units', 'Modular OT Wall Cladding',
      'Cleanroom Laminar Air Flow', 'Anti-Bacterial PVC Vinyl Flooring', 'Nurse Call Master Stations', 'Pass Boxes for Sterile Rooms'
    ]
  },
  {
    id: 'refurbished',
    name: 'REFURBISHED MEDICAL EQUIPMENT',
    slug: 'refurbished-equipment',
    subitems: [
      'Certified Refurbished Patient Monitors', 'Pre-Owned Dräger Ventilators', 'Refurbished GE Ultrasound Logiq', 'Certified Defibrillators & AED',
      'Refurbished C-Arm Fluoroscopes', 'Refurbished Anesthesia Workstations', 'Warranty-Backed Dialysis Units', 'Biomedically Tested Syringe Pumps'
    ]
  }
];

export default function Navbar({ onNavigate, currentView, categories = [] }) {
  const { cartCount, setIsCartOpen, openQuoteModal } = useCart();
  const { currency, setCurrency, toggleCurrency, formatPrice } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mega Menu State
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(MEGA_MENU_DEPARTMENTS[0]);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const megaMenuRef = useRef(null);
  const searchRef = useRef(null);
  const currencyMenuRef = useRef(null);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product) => {
    setShowSearchDropdown(false);
    setIsMegaMenuOpen(false);
    setSearchQuery('');
    onNavigate('product-detail', { productId: product.id, slug: product.slug });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      setIsMegaMenuOpen(false);
      onNavigate('catalog', { search: searchQuery });
    }
  };

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Top Utility Announcement Ticker Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              ISO & CE Certified Biomedical Equipment Supplier
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-sky-400" /> Insured Heavy Biomedical Cargo Delivery
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Institutional & Hospital RFQ Tenders
            </span>
          </div>

          <div className="flex items-center gap-3.5 ml-auto text-xs">
            {/* Currency Selector (PKR vs USD) */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setCurrency('PKR')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  currency === 'PKR' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Pakistani Rupee (₨)"
              >
                PKR (₨)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  currency === 'USD' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="US Dollar ($)"
              >
                USD ($)
              </button>
            </div>

            <button
              onClick={() => onNavigate('track-order')}
              className="hover:text-sky-300 transition-colors flex items-center gap-1 text-slate-300 text-xs font-medium"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Track Order</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs shadow-sm transition-all"
              title="Open Admin Console"
            >
              <UserCheck className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Authentic HospitalStore Royal Blue Navbar (Strictly matching User Uploaded Screenshot) */}
      <div className="bg-[#30449e] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 lg:gap-4 relative">
          
          {/* 1. Authentic Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 rounded-full border-2 border-white/80 flex items-center justify-center text-white bg-white/10 group-hover:bg-white/20 transition-all">
              <HeartPulse className="w-5 h-5 animate-pulse text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center">
                Hospital<span className="font-extrabold text-sky-200">Store</span>
              </span>
            </div>
          </button>

          {/* 2. Categories Pill Button (Matches User Screenshot: 'Categories ⌃' next to search bar) */}
          <div
            ref={megaMenuRef}
            className="relative hidden md:block shrink-0"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
          >
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isMegaMenuOpen ? 'rotate-180 text-sky-200' : ''
                }`}
              />
            </button>

            {/* Expansive Animated Mega Menu (Exact Replica of User Reference Screenshot) */}
            {isMegaMenuOpen && (
              <div
                className="absolute top-full left-0 mt-3 w-[940px] xl:w-[1080px] bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex divide-x divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                {/* Left Departments Column */}
                <div className="w-64 bg-slate-50/80 p-2 space-y-0.5 shrink-0 max-h-[520px] overflow-y-auto border-r border-slate-100">
                  <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-3 py-2">
                    Departments & Specialities
                  </p>
                  {MEGA_MENU_DEPARTMENTS.map((dept) => {
                    const isSelected = activeDepartment.id === dept.id;
                    return (
                      <div
                        key={dept.id}
                        onMouseEnter={() => setActiveDepartment(dept)}
                        onClick={() => {
                          setIsMegaMenuOpen(false);
                          onNavigate('catalog', { category: dept.slug });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold tracking-tight cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-sky-50 text-sky-700 border-l-4 border-sky-600 font-extrabold shadow-sm'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{dept.name}</span>
                        {isSelected && <ChevronRight className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                      </div>
                    );
                  })}

                  <div
                    onClick={() => {
                      setIsMegaMenuOpen(false);
                      onNavigate('catalog');
                    }}
                    className="pt-3 px-3 pb-2 text-[11px] font-bold text-sky-600 hover:text-sky-800 cursor-pointer block border-t border-slate-200 mt-2"
                  >
                    View All Products & Equipment →
                  </div>
                </div>

                {/* Right 4-Column Subcategory Matrix */}
                <div className="flex-1 p-5 bg-white max-h-[520px] overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-sky-600 tracking-wider">
                        {activeDepartment.name}
                      </span>
                      <h3 className="text-sm font-black text-slate-900">
                        Hospital & Clinical Equipment Subcategories
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        onNavigate('catalog', { category: activeDepartment.slug });
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                    >
                      <span>Explore Department</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 4-Column Subcategory Grid (as in User Screenshot) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2.5">
                    {activeDepartment.subitems.map((sub, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setIsMegaMenuOpen(false);
                          onNavigate('catalog', { search: sub });
                        }}
                        className="py-1 px-1.5 rounded hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <span className="line-clamp-1">{sub}</span>
                        <span className="text-slate-300 group-hover:text-sky-500 text-[10px] ml-1 shrink-0">›</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Highlight Strip inside Mega Menu */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-sky-950 text-white flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Hospital Bulk RFQ & Institutional Procurement
                      </p>
                      <p className="text-[11px] text-slate-300">
                        Official biomedical warranty, calibration & customized quotation
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        openQuoteModal();
                      }}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg shadow shrink-0"
                    >
                      Request RFQ Quote
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Search Bar with Rounded-Full shape (Matches User Reference Screenshot) */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-white text-slate-900 pl-4 pr-12 py-2 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 w-8 h-8 rounded-full bg-[#394ca6] hover:bg-[#283884] flex items-center justify-center text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Search Dropdown */}
            {showSearchDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Medical Equipment Catalog Results</span>
                  {isSearching && <span className="text-sky-600 animate-pulse">Searching...</span>}
                </div>

                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-2.5 hover:bg-sky-50 flex items-center gap-3 cursor-pointer transition-colors"
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded border border-slate-200 bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-sky-700 truncate">{product.brand}</p>
                          <h4 className="text-xs font-medium text-slate-800 line-clamp-1">{product.name}</h4>
                          <span className="text-xs font-bold text-slate-900">{formatPrice(product.price)}</span>
                        </div>
                        <span className="text-xs text-sky-600 font-semibold px-2 py-1 rounded bg-sky-100 shrink-0">
                          View
                        </span>
                      </div>
                    ))}
                    <div
                      onClick={handleSearchSubmit}
                      className="p-2.5 text-center text-xs font-bold text-sky-600 hover:bg-slate-100 cursor-pointer"
                    >
                      View all results for "{searchQuery}" →
                    </div>
                  </div>
                ) : (
                  !isSearching && (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      No medical devices found matching "{searchQuery}".
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* 4. Right Side Utility Items (Matches User Screenshot: Phone, Log in, Currency, Cart) */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Phone Number */}
            <a
              href="tel:+923001234567"
              className="hidden xl:flex items-center gap-1.5 text-white/95 hover:text-white text-xs font-semibold"
            >
              <PhoneCall className="w-4 h-4 text-sky-200" />
              <span>+92 300 1234567</span>
            </a>

            {/* Log in / Sign Up button */}
            <button
              onClick={() => onNavigate('admin')}
              className="hidden lg:flex items-center gap-1.5 text-white/95 hover:text-white text-xs font-semibold"
            >
              <User className="w-4 h-4 text-sky-200" />
              <span>Log in/Sign Up</span>
            </button>

            {/* Currency Switcher Pill Dropdown (PKR / USD) */}
            <div ref={currencyMenuRef} className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                title="Switch Currency (PKR / USD)"
              >
                <span>{currency === 'PKR' ? 'PKR ₨' : 'USD $'}</span>
                <ChevronDown className="w-3 h-3 text-sky-200" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <button
                    onClick={() => {
                      setCurrency('PKR');
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between ${
                      currency === 'PKR' ? 'bg-sky-50 text-sky-700 font-bold' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span>PKR (₨)</span>
                    {currency === 'PKR' && <span className="text-[10px] text-sky-600 font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      setCurrency('USD');
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between ${
                      currency === 'USD' ? 'bg-sky-50 text-sky-700 font-bold' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span>USD ($)</span>
                    {currency === 'USD' && <span className="text-[10px] text-sky-600 font-bold">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Button with Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/10 text-white transition-all focus:outline-none"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-white hover:bg-white/10 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Categories Button */}
        <div className="p-3 border-t border-white/10 flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="px-3 py-1.5 rounded-full border border-white/30 bg-white/10 text-white text-xs font-bold flex items-center gap-1 shrink-0"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 pl-4 pr-9 py-1.5 rounded-full text-xs outline-none"
            />
            <button type="submit" className="absolute right-2 top-2 text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-slate-800 border-b border-slate-200 p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Hospital Categories & Departments
            </p>
            {MEGA_MENU_DEPARTMENTS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('catalog', { category: c.slug });
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center justify-between"
              >
                <span>{c.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openQuoteModal();
              }}
              className="w-full py-2.5 bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
            >
              <Building2 className="w-4 h-4" />
              <span>Request Hospital RFQ Quote</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('track-order');
              }}
              className="w-full py-2 bg-slate-100 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Track Live Shipment</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('admin');
              }}
              className="w-full py-2 bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
