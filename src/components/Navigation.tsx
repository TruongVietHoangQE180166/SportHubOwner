'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

interface UserInfo {
  name: string;
  businessName: string;
  avatar?: string;
}

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserInfo;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  user,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'fields', label: 'Quản Lý Sân', icon: MapPin, path: '/fields' },
    { id: 'bookings', label: 'Đặt Sân', icon: Calendar, path: '/bookings' },
    { id: 'analytics', label: 'Thống Kê', icon: BarChart3, path: '/analytics' },
    { id: 'settings', label: 'Cài Đặt', icon: Settings, path: '/settings' },
  ];

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      {/* <div className="lg:hidden bg-white border-b-2 border-green-500 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-lg">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">SportHub</h1>
            <p className="text-xs text-gray-600">Field Management</p>
          </div>
        </div>
    
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div> */}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-60"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out flex flex-col h-screen shadow-xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Desktop Logo */}
        {/*
        <div className="hidden lg:block p-6 border-b-2 border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">SportHub</h1>
              <p className="text-sm text-green-600 font-medium">Field Management</p>
            </div>
          </div>
        </div>*/}

        {/* User Profile */}
        <div className="p-6 border-b-2 border-gray-200 mt-4 lg:mt-0 bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gray-400 rounded-full translate-y-4 -translate-x-4"></div>
          </div>
          
          <div className="relative z-10 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative border-2 border-green-400 mt-1">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 py-1">
              <p className="font-bold text-white text-base leading-tight break-words" title={user.name}>
                {user.name.length > 20 ? `${user.name.substring(0, 20)}...` : user.name}
              </p>
              <p className="text-sm text-green-400 font-medium leading-tight break-words mt-1" title={user.businessName}>
                {user.businessName.length > 25 ? `${user.businessName.substring(0, 25)}...` : user.businessName}
              </p>
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600"></div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 overflow-y-auto min-h-0 bg-gradient-to-b from-white to-gray-50">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border-2 font-semibold ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-green-600 transform scale-105'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-700 border-transparent hover:border-green-200 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-green-600'}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout - Fixed at bottom */}
        <div className="p-4 border-t-2 border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-red-200 font-semibold hover:shadow-md"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;