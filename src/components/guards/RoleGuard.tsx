
'use client';

import { ReactNode } from 'react';
import {useAuthStore} from '../../stores/authStore';
import ErrorPage from '../../components/pages/ErrorPage';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user } = useAuthStore();

  // Nếu không có user (đã được AuthGuard xử lý, nhưng để an toàn)
  if (!user) {
    return <ErrorPage errorType="unauthorized" />;
  }

  // Kiểm tra role
  if (!allowedRoles.includes(user.role)) {
    return <ErrorPage errorType="forbidden" />;
  }

  return <>{children}</>;
};

export default RoleGuard;