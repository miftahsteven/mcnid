'use client';
import { useState } from 'react';
import { Save, Globe, Mail, Shield, Search, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: 'MCN.ID',
    tagline: 'Media Islam Nasional Modern',
    siteUrl: 'https://mcn.id',
    adminEmail: 'admin@mcn.id',
    postsPerPage: '12',
    allowComments: true,
    requireModeration: true,
    maintenanceMode: false,
    googleAnalytics: 'G-XXXXXXXXXX',
    metaDescription: 'Portal media Islam nasional modern yang menyajikan berita aktual, pemikiran moderat, dan edukasi Islam.',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'general', label: 'Umum', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
  ];
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Konfigurasi website MCN.ID</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all ${saved ? 'bg-green-600' : 'bg-[#1a4731] hover:bg-[#2d6b4a]'}`}>
          <Save size={15} /> {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Tab nav */}
        <div className="lg:w-48 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                  activeTab === tab.id
                    ? 'border-[#1a4731] text-[#1a4731] bg-green-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}>
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings form */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Pengaturan Umum</h2>
              {[
                { label: 'Nama Website', key: 'siteName', desc: 'Nama yang ditampilkan di browser dan SEO' },
                { label: 'Tagline', key: 'tagline', desc: 'Deskripsi singkat website' },
                { label: 'URL Website', key: 'siteUrl', desc: 'URL utama website' },
                { label: 'Email Admin', key: 'adminEmail', desc: 'Email untuk notifikasi sistem' },
                { label: 'Artikel per Halaman', key: 'postsPerPage', desc: 'Jumlah artikel per halaman listing' },
                { label: 'Google Analytics ID', key: 'googleAnalytics', desc: 'Masukkan Measurement ID (G-XXXXXXXX)' },
                { label: 'Meta Description', key: 'metaDescription', desc: 'Deskripsi default untuk SEO', textarea: true },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                  <p className="text-xs text-gray-400 mb-1.5">{field.desc}</p>
                  {field.textarea ? (
                    <textarea
                      value={(form as Record<string, string>)[field.key] || ''}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      rows={3}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731] resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={(form as Record<string, string>)[field.key] || ''}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a4731]"
                    />
                  )}
                </div>
              ))}

              {/* Toggle settings */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                {[
                  { key: 'allowComments', label: 'Izinkan Komentar', desc: 'Pengunjung bisa berkomentar di artikel' },
                  { key: 'requireModeration', label: 'Moderasi Komentar', desc: 'Komentar harus disetujui admin sebelum tampil' },
                  { key: 'maintenanceMode', label: 'Mode Maintenance', desc: 'Nonaktifkan website untuk pengunjung umum' },
                ].map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{toggle.label}</p>
                      <p className="text-xs text-gray-400">{toggle.desc}</p>
                    </div>
                    <button
                      onClick={() => setForm({ ...form, [toggle.key]: !(form as Record<string, boolean>)[toggle.key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${(form as Record<string, boolean>)[toggle.key] ? 'bg-[#1a4731]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${(form as Record<string, boolean>)[toggle.key] ? 'translate-x-5' : 'translate-x-0.5'}`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                {activeTab === 'email' && <Mail size={24} className="text-gray-400" />}
                {activeTab === 'security' && <Shield size={24} className="text-gray-400" />}
                {activeTab === 'notifications' && <Bell size={24} className="text-gray-400" />}
              </div>
              <p className="font-bold text-gray-600 text-sm">Pengaturan {tabs.find(t => t.id === activeTab)?.label}</p>
              <p className="text-xs text-gray-400 mt-1.5">Fitur ini sedang dalam pengembangan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
