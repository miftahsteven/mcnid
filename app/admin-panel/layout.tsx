import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export const metadata: Metadata = {
  title: {
    default: 'MCN Admin',
    template: '%s — MCN Admin',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f0f1] font-sans">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
