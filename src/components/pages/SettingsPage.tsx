'use client'
import React, { useEffect } from 'react';
import Settings from '../Settings';
import { useUserStore } from '../../stores/userStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { useAuthStore } from '../../stores/authStore';
import { UserProfile } from '../../types';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  
  const { 
    profile, 
    loading: userLoading, 
    error: userError, 
    fetchProfile, 
    updateProfile,
    uploadAvatar,
    clearError: clearUserError 
  } = useUserStore();
  
  const { 
    fetchPaymentSettings
  } = usePaymentStore();

  useEffect(() => {
    fetchPaymentSettings();
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile, fetchPaymentSettings]);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (!user?.id) throw new Error("User ID is missing");
    return updateProfile(user.id, updates);
  };

  const handleUploadAvatar = (file: File) => {
    if (!user?.id) throw new Error("User ID is missing");
    return uploadAvatar(user.id, file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Settings
        user={profile}
        userLoading={userLoading}
        userError={userError}
        onUpdateUser={handleUpdateProfile}
        onUploadAvatar={handleUploadAvatar}
        clearUserError={clearUserError}
      />
    </div>
  );
};

export default SettingsPage;