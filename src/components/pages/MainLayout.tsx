'use client';

import React, { useState, useEffect, useLayoutEffect, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navigation from '../Navigation';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, logout, checkAuthStatus } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();
  
  useLayoutEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  const getActiveTab = useCallback((): string => {
    if (pathname.startsWith('/admin-dashboard')) return 'admin-dashboard';
    if (pathname.startsWith('/admin-users')) return 'admin-users';
    if (pathname.startsWith('/admin-payments')) return 'admin-payments';
    if (pathname.startsWith('/admin-settings')) return 'admin-settings';
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    if (pathname.startsWith('/fields')) return 'fields';
    if (pathname.startsWith('/bookings')) return 'bookings';
    if (pathname.startsWith('/analytics')) return 'analytics';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'dashboard';
  }, [pathname]);
  
  const [activeTab, setActiveTab] = useState<string>(getActiveTab());
    
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [getActiveTab]);
  
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/${tab}`);
  };
  
  const handleLogout = () => {
    // Clear redirectUrl from sessionStorage on logout
    sessionStorage.removeItem('redirectUrl');
    logout();
  };
  
  if (!user) {
    return null;
  }
  
  const navigationUser = {
    name: profile?.username || user.email.split('@')[0] || 'User',
    businessName: profile?.fullName || 'Business Name',
    avatar: profile?.avatar
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={navigationUser}
        onLogout={handleLogout}
      />
      
      {/* Main content với margin phù hợp cho navigation */}
      <div className="lg:ml-32 min-h-screen">
        {/* Content wrapper - đảm bảo content sát navigation */}
        <div className="w-full min-h-screen p-0 m-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;