'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import ErrorPage from '../../components/pages/ErrorPage';
import { usePathname } from 'next/navigation';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuthStore();
  const pathname = usePathname(); 

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      sessionStorage.setItem('redirectUrl', pathname);
    }
  }, [isAuthenticated, loading, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <ErrorPage errorType="unauthorized" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
