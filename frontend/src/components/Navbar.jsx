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
  Menu,
  X,
  Building2,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, getCategoryIcon } from '../utils/helpers';

export default function Navbar({ onNavigate, currentView, categories = [] }) {
  const { cartCount, setIsCartOpen, openQuoteModal } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const searchRef = useRef(null);

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

  // Click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    onNavigate('product-detail', { productId: product.id, slug: product.slug });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      onNavigate('catalog', { search: searchQuery });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              Verified Medical Equipment Supplier
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-sky-400" /> Pan-India Biomedical Logistics
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> B2B GST Invoicing & Hospital Tenders
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto text-xs">
            <a
              href="tel:1800467786"
              className="flex items-center gap-1 text-slate-200 hover:text-sky-300 transition-colors font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
              <span>Helpline: +91 8000 467 786</span>
            </a>
            <button
              onClick={() => onNavigate('track-order')}
              className="hover:text-sky-300 transition-colors flex items-center gap-1 text-slate-300"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all shadow-sm"
              title="Access Admin Management Portal"
            >
              <UserCheck className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                  Hospital<span className="text-sky-600">Store</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  PRO
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-medium -mt-0.5">
                Medical Devices & Hospital Supplies
              </p>
            </div>
          </button>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search ICU monitors, ventilators, ECG, hospital beds, autoclaves..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 pl-11 pr-24 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 text-sm transition-all shadow-inner outline-none"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Live Search Autocomplete Dropdown */}
            {showSearchDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Medical Equipment Results</span>
                  {isSearching && <span className="text-sky-600 animate-pulse">Searching catalog...</span>}
                </div>

                {searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-3 hover:bg-sky-50/70 flex items-center gap-3.5 cursor-pointer transition-colors"
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-sky-700 truncate">{product.brand}</p>
                          <h4 className="text-sm font-medium text-slate-800 line-clamp-1">{product.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-slate-900">{formatPrice(product.price)}</span>
                            {product.original_price > product.price && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatPrice(product.original_price)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-sky-600 font-medium px-2 py-1 rounded bg-sky-100/60 shrink-0">
                          View
                        </span>
                      </div>
                    ))}
                    <div
                      onClick={handleSearchSubmit}
                      className="p-3 text-center text-xs font-bold text-sky-600 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      View all results for "{searchQuery}" →
                    </div>
                  </div>
                ) : (
                  !isSearching && (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      No medical devices found matching "{searchQuery}". Try searching by category or brand name.
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Request Quote Button */}
            <button
              onClick={() => openQuoteModal()}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors shadow-sm"
            >
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>Request Hospital RFQ</span>
            </button>

            {/* WhatsApp Quick Chat */}
            <a
              href="https://wa.me/919811234567?text=Hi%20HospitalStore,%20I%20need%20quotation%20and%20support%20for%20medical%20equipment."
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
              title="Chat directly with our Biomedical Specialists on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Chat</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 border border-slate-200 hover:border-sky-200 transition-all shadow-sm focus:outline-none"
              aria-label="Open Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-sky-600 to-teal-500 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden border border-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search medical equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="bg-slate-50 border-t border-slate-200/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-2 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1 shrink-0 mr-4">
            <button
              onClick={() => onNavigate('catalog')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                currentView === 'catalog' ? 'bg-sky-600 text-white' : 'hover:bg-slate-200/70 text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>All Equipment</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {categories.slice(0, 7).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('catalog', { category: cat.slug })}
                className="px-2.5 py-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 hover:text-sky-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {getCategoryIcon(cat.icon_name, 'w-3.5 h-3.5 text-sky-600')}
                <span>{cat.name}</span>
              </button>
            ))}

            <button
              onClick={() => onNavigate('catalog')}
              className="px-2.5 py-1.5 rounded-lg text-sky-600 font-bold hover:bg-sky-100 transition-colors shrink-0"
            >
              More Categories →
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Browse Categories</p>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('catalog', { category: c.slug });
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
              >
                {getCategoryIcon(c.icon_name, 'w-4 h-4 text-sky-600')}
                <span>{c.name}</span>
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

