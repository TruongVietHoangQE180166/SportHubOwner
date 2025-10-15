'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ReverseAuthGuardProps {
  children: ReactNode;
}

const ReverseAuthGuard = ({ children }: ReverseAuthGuardProps) => {
  const { isAuthenticated, loading, checkAuthStatus, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && isAuthenticated) {
      const targetPath = user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';
      
      // Chỉ redirect nếu đang không ở trang đích
      if (pathname !== targetPath) {
        setShouldRedirect(true);
        router.push(targetPath);
      }
    }
  }, [isAuthenticated, user, loading, router, pathname]);

  // Đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Đang kiểm tra..." />
      </div>
    );
  }

  // Đã đăng nhập và đang redirect
  if (isAuthenticated && shouldRedirect) {
    return null;
  }

  // Đã đăng nhập nhưng vẫn đang ở trang này (trường hợp bất thường)
  if (isAuthenticated) {
    return null;
  }

  // Chưa đăng nhập -> cho phép truy cập trang login/forgot-password
  return <>{children}</>;
};

export default ReverseAuthGuard;