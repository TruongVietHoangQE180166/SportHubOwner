'use client';

import React, { useState, useEffect, ReactNode, useCallback } from 'react';
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

  const { user, logout } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();

  const getActiveTab = useCallback((): string => {
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

  // Lấy profile khi có user
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/${tab}`);
  };

  if (!user) {
    return null; 
  }

  // Create proper user data for Navigation component
  const navigationUser = {
    name: profile?.name || user.email.split('@')[0] || 'User',
    businessName: profile?.businessName || 'Business Name',
    avatar: profile?.avatar
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={navigationUser}
        onLogout={logout}
      />
      <div className="flex-1 overflow-auto lg:ml-64">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;