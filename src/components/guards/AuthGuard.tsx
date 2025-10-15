'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading, checkAuthStatus } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      if (!isAuthenticated) {
        // Chỉ redirect nếu chưa ở trang login
        if (pathname !== '/login') {
          setShouldRedirect(true);
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Đang kiểm tra đăng nhập..." />
      </div>
    );
  }

  // Chưa đăng nhập -> chuyển về login (không hiện error page)
  if (!isAuthenticated) {
    return null;
  }

  // Đã đăng nhập -> cho phép truy cập
  return <>{children}</>;
};

export default AuthGuard;