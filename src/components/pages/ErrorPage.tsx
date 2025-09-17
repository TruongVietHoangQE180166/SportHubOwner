'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface ErrorPageProps {
  errorType: 'unauthorized' | 'forbidden';
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorType }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const getPageContent = () => {
    if (errorType === 'unauthorized') {
      return {
        title: "Bạn chưa đăng nhập",
        message: "Vui lòng đăng nhập để truy cập vào hệ thống.",
        buttonText: "Đến trang đăng nhập",
        action: () => router.push('/login')
      };
    } else {
      return {
        title: "Truy cập bị từ chối",
        message: "Tài khoản của bạn không có quyền truy cập vào trang này.",
        buttonText: "Quay lại trang chủ",
        action: () => router.push('/dashboard')
      };
    }
  };

  const content = getPageContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mx-auto bg-red-100 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h1>
        <p className="text-gray-600 mb-6">{content.message}</p>
        
        <button
          onClick={content.action}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="mr-2" size={16} />
          {content.buttonText}
        </button>
        
        {isAuthenticated && errorType === 'forbidden' && (
          <div className="mt-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Nếu bạn cần truy cập vào trang này, vui lòng liên hệ quản trị viên.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;