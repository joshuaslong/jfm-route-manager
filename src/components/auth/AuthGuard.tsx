'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { getTodayDate } from '@/lib/utils/dateHelpers';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Check department-based access
      const isTransportationPath = pathname.startsWith('/transportation');
      const isShippingPath = pathname.startsWith('/shipping');
      const isAdminPath = pathname.startsWith('/admin');

      // Admin can access everything
      if (user.is_admin) {
        return;
      }

      // Check if user is trying to access a section they don't have permission for
      if (isAdminPath) {
        // Non-admin trying to access admin
        router.replace('/');
        return;
      }

      if (isTransportationPath && user.department !== 'transportation') {
        // Non-transportation user trying to access transportation
        router.replace('/shipping');
        return;
      }

      if (isShippingPath && user.department !== 'shipping') {
        // Non-shipping user trying to access shipping
        const today = getTodayDate();
        router.replace(`/transportation/day/${today}`);
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireAdmin && !user?.is_admin) {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, requireAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !user?.is_admin) {
    return null;
  }

  // Check department access - don't render if user shouldn't see this page
  if (user && !user.is_admin) {
    const isTransportationPath = pathname.startsWith('/transportation');
    const isShippingPath = pathname.startsWith('/shipping');

    if (isTransportationPath && user.department !== 'transportation') {
      return null;
    }

    if (isShippingPath && user.department !== 'shipping') {
      return null;
    }
  }

  return <>{children}</>;
}
