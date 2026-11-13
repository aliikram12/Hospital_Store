import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Building2, PhoneCall } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    store_name: '',
    support_phone: '',
    support_email: '',
    whatsapp_number: '',
    gstin: '',
    tax_rate: '12',
    free_shipping_threshold: '5000',
    announcement_banner: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to update settings');
      addToast('Store configuration & tax rates updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Store & Biomedical Configuration</h1>
          <p className="text-xs text-slate-400">
            Configure contact lines, GSTIN taxation, free logistics thresholds, and top banners
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl text-xs">
        {/* Company & Legal Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Store Identity & Legal Entity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Store / Entity Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Company GSTIN Number</label>
              <input
                type="text"
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Corporate Registered Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Support & Contact Lines */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            <span>Helpline & Communication Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Toll-Free Helpline</label>
              <input
                type="text"
                value={settings.support_phone}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Official Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">WhatsApp Specialist Number</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Tax & Logistics Rules */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Taxation & Free Shipping Logic</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Standard Medical GST Rate (%)</label>
              <input
                type="number"
                value={settings.tax_rate}
                onChange={(e) => setSettings({ ...settings, tax_rate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Standard rate for ICU & diagnostic instruments under HSN 9018 is 12%
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Free Pan-India Delivery Threshold (₹)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Orders equal or exceeding this value receive free freight
              </p>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Announcement Ribbon Text</label>
            <input
              type="text"
              value={settings.announcement_banner}
              onChange={(e) => setSettings({ ...settings, announcement_banner: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-105 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

