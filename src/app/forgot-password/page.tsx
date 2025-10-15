'use client';

import React, { useEffect, useState } from "react";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from 'next/navigation';
import ReverseAuthGuard from '../../components/guards/ReverseAuthGuard';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const { 
    isAuthenticated, 
    sendOTP, 
    loading, 
    error, 
    clearError 
  } = useAuthStore();
  
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Clear any previous state when component mounts
    clearError();
  }, [clearError]);

  const handleForgotPasswordSubmit = async (credentials: any) => {
    try {
      // Only send the OTP to the user's email
      await sendOTP(credentials.email);
      
      // Show success message
      setForgotPasswordSuccess("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.");
      
      // Redirect to reset password page with email as parameter after a short delay
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(credentials.email)}`);
      }, 3000);
    } catch (error) {
      // Error is handled by the store, so we don't need to do anything here
      console.error("Send OTP error:", error);
    }
  };

  return (
    <ReverseAuthGuard>
      <ForgotPasswordForm 
        onSubmit={handleForgotPasswordSubmit} 
        isLoading={loading} 
        error={error}
        successMessage={forgotPasswordSuccess}
      />
    </ReverseAuthGuard>
  );
};

export default ForgotPasswordPage;