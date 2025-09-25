'use client'
import React, { useEffect } from 'react';
import Settings from '../Settings';
import { useUserStore } from '../../stores/userStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { useAuthStore } from '../../stores/authStore';
import { UserProfile } from '../../types';

interface SettingsProps {
  user: UserProfile | null;
  userLoading: boolean;
  userError: string | null;
  onUpdateUser: (updates: Partial<UserProfile>) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<string>; // Updated return type
  clearUserError: () => void;
}

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
    return uploadAvatar(file);
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