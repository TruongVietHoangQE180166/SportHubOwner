'use client';

import React, { useEffect } from "react";
import { MapPin, Shield, Users, TrendingUp } from "lucide-react";
import FeatureCard from "../../components/auth/FeatureCard";
import LoginForm from "../../components/auth/LoginForm";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from "react";

const AuthPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, checkAuthStatus } = useAuthStore();
  const { login, loading, error } = useAuthStore();

  // Check authentication status when component mounts
  useLayoutEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
      sessionStorage.removeItem('redirectUrl');
      
      // Check user role and redirect appropriately
      if (user?.role === 'ADMIN') {
        // If user is admin, redirect to admin dashboard
        router.push('/admin-dashboard');
      } else if (user?.role === 'OWNER') {
        // If user is owner, redirect to owner dashboard
        // Make sure we don't redirect to admin pages
        if (redirectUrl.startsWith('/admin-')) {
          router.push('/dashboard');
        } else {
          router.push(redirectUrl);
        }
      } else {
        router.push(redirectUrl);
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative flex items-center justify-center p-4 overflow-hidden">
      {/* Sport Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border-4 border-green-500 rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 border-4 border-green-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-green-400 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
        {/* Left Side - Features */}
        <div className="hidden lg:block order-2 lg:order-1">
          <div className="text-center mb-6 lg:mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/30">
                <MapPin className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
              SportHub
            </h1>
            <p className="text-xl lg:text-2xl text-green-400 font-medium">
              Hệ thống quản lý sân thể thao chuyên nghiệp
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6 lg:w-7 lg:h-7 text-white" />}
              title="Bảo Mật Cao"
              description="Hệ thống bảo mật đa lớp với mã hóa SSL và backup tự động 24/7"
              gradientFrom="from-green-500"
              gradientTo="to-green-600"
            />

            <FeatureCard
              icon={<Users className="w-6 h-6 lg:w-7 lg:h-7 text-white" />}
              title="Quản Lý Khách Hàng"
              description="Theo dõi và phân tích hành vi khách hàng một cách chi tiết và thông minh"
              gradientFrom="from-gray-600"
              gradientTo="to-gray-700"
            />

            <FeatureCard
              icon={<TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-white" />}
              title="Thống Kê Thông Minh"
              description="Báo cáo doanh thu và phân tích hiệu suất kinh doanh realtime"
              gradientFrom="from-green-600"
              gradientTo="to-green-700"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto order-1 lg:order-2">
          <LoginForm onSubmit={login} isLoading={loading} error={error} />
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/forgot-password')}
              className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200 underline"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;