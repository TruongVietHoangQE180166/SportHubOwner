'use client';

import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navigation from '../Navigation';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import LoadingSpinner from '../ui/LoadingSpinner';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, logout, isAuthenticated, loading } = useAuthStore();
  const { profile, fetchProfile, loading: profileLoading } = useUserStore();
  
  const [logoutLoading, setLogoutLoading] = useState(false);
  
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
  
  // Fetch profile khi có user và chưa có profile
  useEffect(() => {
    if (user?.id && isAuthenticated && !profile && !profileLoading) {
      fetchProfile(user.id);
    }
  }, [user?.id, isAuthenticated, profile, profileLoading, fetchProfile]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/${tab}`);
  };
  
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      
      // Start logout process
      await logout();
      
      // Show loading spinner for 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      setLogoutLoading(false);
    }
  };
  
  // Đang loading auth -> hiển thị loading
  if (loading || logoutLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Đang tải..." />
      </div>
    );
  }
  
  // Không có user -> return null (AuthGuard sẽ redirect)
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