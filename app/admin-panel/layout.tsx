import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import AdminShell from '@/components/admin/AdminShell';
import { UserProvider, AdminUser } from '@/components/admin/UserContext';

export const metadata: Metadata = {
  title: {
    default: 'MCN Admin',
    template: '%s — MCN Admin',
  },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  let user: AdminUser | null = null;
  
  if (token) {
    try {
      user = jose.decodeJwt(token) as AdminUser;
    } catch (e) {}
  }

  return (
    <UserProvider user={user}>
      <AdminShell>
        {children}
      </AdminShell>
    </UserProvider>
  );
}
