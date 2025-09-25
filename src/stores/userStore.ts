import { create } from 'zustand';
import { UserProfile } from '../types';
import { userService } from '../services/userService';

interface UserStore {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>; // Updated return type to match implementation
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const profile = await userService.getUserProfile(userId);
      set({ profile, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải thông tin người dùng' 
      });
    }
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    set({ loading: true, error: null });
    
    try {
      const updatedProfile = await userService.updateUserProfile(userId, updates);
      set({ 
        profile: updatedProfile,
        loading: false 
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi cập nhật thông tin' 
      });
    }
  },

  uploadAvatar: async (file: File) => {
    set({ loading: true, error: null });
    
    try {
      const avatarUrl = await userService.uploadAvatar(file);
      set((state) => ({
        profile: state.profile ? { ...state.profile, avatar: avatarUrl } : null,
        loading: false
      }));
      // Return the avatar URL for the caller to use if needed
      return avatarUrl;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải ảnh đại diện' 
      });
      // Re-throw the error so the caller can handle it
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));