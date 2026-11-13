import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  HeartPulse,
  ExternalLink,
  ChevronRight,
  Bell,
  Search,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function AdminLayout({ activeTab, onTabChange, onExitAdmin, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'products', label: 'Medical Equipment (Products)', icon: Package },
    { id: 'categories', label: 'Specialty Categories', icon: Layers },
    { id: 'orders', label: 'Orders & GST Billing', icon: ShoppingCart },
    { id: 'quotes', label: 'Hospital RFQ Quotations', icon: FileSpreadsheet },
    { id: 'settings', label: 'Store & Tax Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col shrink-0 z-30`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-500/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-base font-black tracking-tight text-white">
                  Hospital<span className="text-sky-400">Store</span>
                </span>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Admin Command Console
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
              Management Modules
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                  }`}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!sidebarCollapsed && isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-sky-200" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions: View Storefront & Toggle */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {!sidebarCollapsed && <span>Return to Public Store</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Admin Top Header */}
        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-white capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || 'Console'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FastAPI + SQLite Active</span>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight">Admin Officer</p>
                <p className="text-[10px] text-slate-400">HospitalStore Headquarters</p>
              </div>
            </div>
          </div>
        </header>

        {/* Child Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

