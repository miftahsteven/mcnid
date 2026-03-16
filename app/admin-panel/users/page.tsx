'use client';
import { useState } from 'react';
import { Search, Plus, Shield, Edit, Trash2, UserCheck } from 'lucide-react';

const users = [
  { id: 1, name: 'Ahmad Cholil', email: 'ahmad@mcn.id', role: 'Superadmin', avatar: 'AC', joined: '2025-01-15', status: 'active', lastLogin: '16 Maret 2026' },
  { id: 2, name: 'Siti Rahmawati', email: 'siti@mcn.id', role: 'Editor', avatar: 'SR', joined: '2025-02-20', status: 'active', lastLogin: '15 Maret 2026' },
  { id: 3, name: 'Budi Santoso', email: 'budi@mcn.id', role: 'Penulis', avatar: 'BS', joined: '2025-03-10', status: 'active', lastLogin: '14 Maret 2026' },
  { id: 4, name: 'Fatimah Zahra', email: 'fatimah@mcn.id', role: 'Editor', avatar: 'FZ', joined: '2025-04-05', status: 'active', lastLogin: '16 Maret 2026' },
  { id: 5, name: 'Rizki Prayoga', email: 'rizki@mcn.id', role: 'Penulis', avatar: 'RP', joined: '2025-05-18', status: 'inactive', lastLogin: '1 Maret 2026' },
  { id: 6, name: 'Dr. Muhamad Aziz', email: 'm.aziz@mcn.id', role: 'Kontributor', avatar: 'MA', joined: '2025-06-22', status: 'active', lastLogin: '13 Maret 2026' },
];

const roleColors: Record<string, string> = {
  Superadmin: 'bg-red-100 text-red-700',
  Editor: 'bg-blue-100 text-blue-700',
  Penulis: 'bg-green-100 text-green-700',
  Kontributor: 'bg-gray-100 text-gray-600',
};

const roleAvatarColors: Record<string, string> = {
  Superadmin: 'bg-red-600',
  Editor: 'bg-blue-600',
  Penulis: 'bg-green-600',
  Kontributor: 'bg-gray-500',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const filtered = users.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pengguna</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} pengguna terdaftar</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Tambah Pengguna
        </button>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { role: 'Superadmin', count: 1, icon: Shield, color: 'text-red-600 bg-red-50' },
          { role: 'Editor', count: 2, icon: UserCheck, color: 'text-blue-600 bg-blue-50' },
          { role: 'Penulis', count: 2, icon: UserCheck, color: 'text-green-600 bg-green-50' },
          { role: 'Kontributor', count: 1, icon: UserCheck, color: 'text-gray-600 bg-gray-50' },
        ].map((s) => (
          <div key={s.role} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon size={16} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.count}</p>
              <p className="text-xs text-gray-500">{s.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pengguna..." className="w-full max-w-xs pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a4731]" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengguna</th>
              <th className="hidden md:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="hidden lg:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Login Terakhir</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${roleAvatarColors[u.role]} flex items-center justify-center text-white text-xs font-bold`}>
                      {u.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-3 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
                </td>
                <td className="hidden lg:table-cell px-3 py-3 text-xs text-gray-500">{u.lastLogin}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className="text-xs text-gray-500 capitalize">{u.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"><Edit size={14} /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
