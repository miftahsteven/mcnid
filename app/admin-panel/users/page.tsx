"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Shield,
  Edit,
  Trash2,
  UserCheck,
  KeyRound,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAdminUser } from "@/components/admin/UserContext";

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700",
  ADMIN: "bg-orange-100 text-orange-700",
  EDITOR: "bg-blue-100 text-blue-700",
  MODERATOR: "bg-indigo-100 text-indigo-700",
  PENGAJAR: "bg-green-100 text-green-700",
};

const roleAvatarColors: Record<string, string> = {
  SUPER_ADMIN: "bg-red-600",
  ADMIN: "bg-orange-600",
  EDITOR: "bg-blue-600",
  MODERATOR: "bg-indigo-600",
  PENGAJAR: "bg-green-600",
};

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const currentUser = useAdminUser();
  const isSuperAdmin =
    currentUser?.role === "SUPER_ADMIN" || currentUser?.role === "ADMIN";

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "EDITOR",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/proxy-users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data || []);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: "create" | "edit", user?: User) => {
    setModalMode(mode);
    setErrorMsg("");
    if (mode === "edit" && user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
      });
    } else {
      setSelectedUser(null);
      setFormData({ name: "", email: "", role: "EDITOR", password: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "EDITOR", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const endpoint =
        modalMode === "create"
          ? "/api/admin/proxy-users"
          : `/api/admin/proxy-users/${selectedUser?.id}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const payload: any = { ...formData };
      if (modalMode === "edit" && !payload.password) {
        delete payload.password; // Don't send empty password on edit
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        handleCloseModal();
        fetchUsers();
      } else {
        setErrorMsg(data.error || "Terjadi kesalahan");
      }
    } catch (err) {
      setErrorMsg("Gagal memproses permintaan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (user.id === currentUser?.sub) {
      alert("Anda tidak bisa menghapus akun Anda sendiri.");
      return;
    }
    if (!confirm(`Yakin ingin menghapus ${user.name}?`)) return;

    try {
      const res = await fetch(`/api/admin/proxy-users/${user.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus pengguna");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
    }
  };

  const handleReset2FA = async (user: User) => {
    if (
      !confirm(
        `Yakin ingin mereset Google Authenticator (2FA) untuk ${user.name}? Mereka harus scan QR code lagi saat login berikutnya.`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/proxy-users/${user.id}/reset-2fa`, {
        method: "POST",
      });
      if (res.ok) {
        alert(`2FA untuk ${user.name} berhasil direset.`);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mereset 2FA");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
    }
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const getRoleStats = () => {
    const stats: Record<string, number> = {};
    users.forEach((u) => {
      stats[u.role] = (stats[u.role] || 0) + 1;
    });
    return stats;
  };

  const stats = getRoleStats();

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Shield size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Akses Ditolak</h2>
        <p className="text-gray-500 mt-2">
          Anda tidak memiliki izin untuk melihat halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 relative">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pengguna Sistem</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {users.length} pengguna terdaftar
          </p>
        </div>
        <button
          onClick={() => handleOpenModal("create")}
          className="flex items-center gap-2 bg-[#1a4731] hover:bg-[#2d6b4a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> Tambah Pengguna
        </button>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {[
          {
            role: "SUPER_ADMIN",
            label: "Superadmin",
            icon: Shield,
            color: "text-red-600 bg-red-50",
          },
          {
            role: "ADMIN",
            label: "Admin",
            icon: UserCheck,
            color: "text-orange-600 bg-orange-50",
          },
          {
            role: "EDITOR",
            label: "Editor",
            icon: UserCheck,
            color: "text-blue-600 bg-blue-50",
          },
          {
            role: "MODERATOR",
            label: "Moderator",
            icon: UserCheck,
            color: "text-indigo-600 bg-indigo-50",
          },
          {
            role: "PENGAJAR",
            label: "Pengajar",
            icon: UserCheck,
            color: "text-green-600 bg-green-50",
          },
        ].map((s) => (
          <div
            key={s.role}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center shrink-0`}
            >
              <s.icon size={16} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {stats[s.role] || 0}
              </p>
              <p className="text-[11px] text-gray-500 font-medium uppercase">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pengguna berdasarkan nama atau email..."
            className="w-full max-w-sm pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a4731]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#1a4731] animate-spin mb-2" />
            <p className="text-sm font-medium text-gray-600">Memuat data...</p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="hidden lg:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="hidden md:table-cell text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  2FA Status
                </th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${roleAvatarColors[u.role] || "bg-gray-500"} flex shrink-0 items-center justify-center text-white text-xs font-bold uppercase`}
                      >
                        {u.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-3 py-3 text-xs text-gray-500 font-mono">
                    @{u.username}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors[u.role] || "bg-gray-100 text-gray-700"}`}
                    >
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 py-3">
                    {u.twoFactorEnabled ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md font-medium">
                        <Shield size={12} /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium">
                        <KeyRound size={12} /> Belum Set
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleReset2FA(u)}
                        title="Reset Google Authenticator"
                        className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors"
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenModal("edit", u)}
                        title="Edit Pengguna"
                        className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      {u.id !== currentUser?.sub && (
                        <button
                          onClick={() => handleDelete(u)}
                          title="Hapus Pengguna"
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-sm text-gray-500"
                  >
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD / EDIT USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">
                {modalMode === "create"
                  ? "Tambah Pengguna Baru"
                  : "Edit Pengguna"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {errorMsg && (
                <div className="mb-4 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all text-sm"
                    placeholder="Masukkan nama pengguna"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all text-sm"
                    placeholder="email@mcnid.net"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all text-sm bg-white"
                  >
                    <option value="SUPER_ADMIN">Superadmin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="PENGAJAR">Pengajar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password{" "}
                    {modalMode === "edit" && (
                      <span className="text-gray-400 font-normal">
                        (Kosongkan jika tidak ingin diubah)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    required={modalMode === "create"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all text-sm"
                    placeholder="Masukkan password"
                  />
                  {modalMode === "create" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Gunakan password yang kuat. Pengguna akan diminta
                      menghubungkan Google Authenticator saat login pertama.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#1a4731] text-white rounded-lg hover:bg-[#2d6b4a] transition-colors text-sm font-semibold flex justify-center items-center"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
