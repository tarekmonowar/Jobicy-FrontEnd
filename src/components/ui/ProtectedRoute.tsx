'use client';

// Client route guard — redirects guests to login and non-admins away from /admin.

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

/**
 * Wraps auth-required pages. Shows a skeleton while bootstrap runs,
 * redirects guests to /login?next=…, and blocks non-admins when requireAdmin.
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useAuthStore();

  useEffect(() => {
    if (status === 'idle') return;

    if (status === 'guest') {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
      return;
    }

    if (requireAdmin && user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [status, user, requireAdmin, router, pathname]);

  if (status === 'idle') {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (status === 'guest') return null;
  if (requireAdmin && user?.role !== 'ADMIN') return null;

  return <>{children}</>;
}
