'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { getTodayDate } from '@/lib/utils/dateHelpers';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on department
      if (user.is_admin) {
        // Admin can choose, but default to shipping
        router.replace('/shipping');
      } else if (user.department === 'shipping') {
        router.replace('/shipping');
      } else if (user.department === 'transportation') {
        const today = getTodayDate();
        router.replace(`/transportation/day/${today}`);
      } else {
        router.replace('/shipping');
      }
    }
  }, [user, isLoading, router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}
