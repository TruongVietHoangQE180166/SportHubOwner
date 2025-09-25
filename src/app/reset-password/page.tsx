'use client';

import React, { useEffect, useState } from "react";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from 'next/navigation';
import { ResetPasswordCredentials } from "../../types";

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const { 
    isAuthenticated, 
    resetPassword, 
    sendOTP, 
    loading, 
    error, 
    clearError 
  } = useAuthStore();
  
  const [resetEmail, setResetEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
    
    // Client-side only: get email from URL params
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const emailFromParams = urlParams.get('email');
      if (emailFromParams) {
        setResetEmail(emailFromParams);
        // Also save to sessionStorage for fallback
        sessionStorage.setItem('resetEmail', emailFromParams);
      } else {
        // Fallback to sessionStorage if URL param not found
        const emailFromStorage = sessionStorage.getItem('resetEmail') || "";
        setResetEmail(emailFromStorage);
      }
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Clear any previous state when component mounts
    clearError();
  }, [clearError]);

  const handleResetPassword = async (credentials: any) => {
    try {
      // Convert the form credentials to the expected format
      const resetCredentials: ResetPasswordCredentials = {
        email: credentials.email,
        otp: credentials.otp,
        newPassword: credentials.newPassword
      };
      
      await resetPassword(resetCredentials);
      
      // Show success message
      setSuccessMessage("Mật khẩu đã được đặt lại thành công!");
      
      // Clear the stored email
      sessionStorage.removeItem('resetEmail');
      
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      // Error is handled by the store, so we don't need to do anything here
      console.error("Reset password error:", error);
    }
  };

  const handleResendOTP = async (email: string) => {
    try {
      setIsResending(true);
      await sendOTP(email);
    } catch (error) {
      // Error is handled by the store
      console.error("Resend OTP error:", error);
    } finally {
      setIsResending(false);
    }
  };

  // If we have a success message, we want to show it instead of the form
  if (successMessage) {
    return (
      <ResetPasswordForm 
        onSubmit={handleResetPassword}
        onResendOTP={handleResendOTP}
        isLoading={false}
        isResending={isResending}
        error={null}
        successMessage={successMessage}
        email={resetEmail}
      />
    );
  }

  return (
    <ResetPasswordForm 
      onSubmit={handleResetPassword}
      onResendOTP={handleResendOTP}
      isLoading={loading}
      isResending={isResending}
      error={error}
      successMessage={successMessage}
      email={resetEmail}
    />
  );
};

export default ResetPasswordPage;