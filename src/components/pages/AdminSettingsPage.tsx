'use client'
import React, { useEffect } from 'react';
import Settings from '../Settings';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { UserProfile } from '../../types';

const AdminSettingsPage: React.FC = () => {
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

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

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

export default AdminSettingsPage;