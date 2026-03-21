'use client';
import { createContext, useContext } from 'react';

export interface AdminUser {
  sub: string;
  email: string;
  role: string;
  username: string;
  name: string;
}

export const UserContext = createContext<AdminUser | null>(null);

export function useAdminUser() {
  return useContext(UserContext);
}

export function UserProvider({ user, children }: { user: AdminUser | null, children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
