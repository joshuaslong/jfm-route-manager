'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/lib/auth/AuthContext';

// Pages that don't require authentication
const PUBLIC_PATHS = ['/login'];

// Pages that require admin access
const ADMIN_PATHS = ['/admin'];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path);
  const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path));

  // For login page, don't show navigation
  if (isPublicPath) {
    return <>{children}</>;
  }

  // For authenticated pages, wrap with AuthGuard
  return (
    <AuthGuard requireAdmin={isAdminPath}>
      <Navigation />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </AuthGuard>
  );
}
