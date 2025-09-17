'use client';

import React, { useEffect } from "react";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from 'next/navigation';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, forgotPassword, loading, error, forgotPasswordSuccess, clearError, clearForgotPasswordSuccess } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Clear any previous state when component mounts
    clearError();
    clearForgotPasswordSuccess();
  }, [clearError, clearForgotPasswordSuccess]);

  return (
    <ForgotPasswordForm 
      onSubmit={forgotPassword} 
      isLoading={loading} 
      error={error}
      successMessage={forgotPasswordSuccess}
    />
  );
};

export default ForgotPasswordPage;