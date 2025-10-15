'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '../ui/LoadingSpinner';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !loading) {
      // Không có user -> redirect to login
      if (!user) {
        if (pathname !== '/login') {
          setShouldRedirect(true);
          router.push('/login');
        }
        return;
      }

      // User có role không được phép
      if (!allowedRoles.includes(user.role)) {
        const targetPath = user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';
        
        // Chỉ redirect nếu đang không ở trang đích
        if (pathname !== targetPath) {
          setShouldRedirect(true);
          router.push(targetPath);
        }
      }
    }
  }, [user, allowedRoles, router, pathname, loading]);

  // Đang load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Đang tải..." />
      </div>
    );
  }

  // Không có user
  if (!user) {
    return null;
  }

  // Role không được phép
  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  // Đã có user và role đúng
  return <>{children}</>;
};

export default RoleGuard;