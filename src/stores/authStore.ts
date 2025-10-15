/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { AuthState, AuthUser, LoginCredentials, ForgotPasswordCredentials, ResetPasswordCredentials } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (credentials: ForgotPasswordCredentials) => Promise<void>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>; // Add changePassword function
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  forgotPasswordSuccess: string | null;
  clearForgotPasswordSuccess: () => void;
  checkAuthStatus: () => void;
  sendOTP: (email: string) => Promise<void>; // Add this new function
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  forgotPasswordSuccess: null,

  login: async (credentials: LoginCredentials) => {
  set({ loading: true, error: null });
  try {
    const user = await authService.login(credentials);
    
    // Check if user exists
    if (!user) {
      throw new Error('Không thể lấy thông tin người dùng');
    }
    
    // Check if user is an owner or admin
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      throw new Error('Bạn không có quyền truy cập vào hệ thống này');
    }
    set({
      isAuthenticated: !!user,
      user: user || null,
      loading: false
    });
  } catch (error) {
    
    set({
      loading: false,
      error: error instanceof Error ? error.message : 'Đăng nhập thất bại'
    });
    throw error;
  }
},

  logout: async () => {
    set({ loading: true });
    
    try {
      await authService.logout();
      set({ 
        isAuthenticated: false, 
        user: null, 
        loading: false,
        error: null 
      });
    } catch (error) {
      set({ loading: false });
    }
  },

  forgotPassword: async (credentials: ForgotPasswordCredentials) => {
    set({ loading: true, error: null, forgotPasswordSuccess: null });
    
    try {
      await authService.forgotPassword(credentials);
      set({ 
        loading: false,
        forgotPasswordSuccess: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.'
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Gửi email thất bại' 
      });
      throw error;
    }
  },

  resetPassword: async (credentials: ResetPasswordCredentials) => {
    set({ loading: true, error: null });
    
    try {
      await authService.resetPassword(credentials);
      set({ 
        loading: false,
        error: null
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại' 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
  clearForgotPasswordSuccess: () => set({ forgotPasswordSuccess: null }),
  
  // New function to check authentication status from sessionStorage
  checkAuthStatus: () => {
    // Check if we're running on the client side
    if (typeof window === 'undefined') return;
    
    try {
      // Get user data from sessionStorage
      const userId = sessionStorage.getItem('userId');
      const email = sessionStorage.getItem('email');
      const role = sessionStorage.getItem('role');
      
      // Check if we have a valid accessToken
      const accessToken = sessionStorage.getItem('accessToken');
      
      if (userId && email && role && accessToken) {
        // Reconstruct the user object
        const user: AuthUser = {
          id: userId,
          email: email,
          password: '', // We don't store the actual password
          role: role,
          isActive: true // Assume active if we have the data
        };
        
        set({
          isAuthenticated: true,
          user: user
        });
      } else {
        // No valid auth data found, ensure we're logged out
        set({
          isAuthenticated: false,
          user: null
        });
      }
    } catch (error) {
      // If there's an error reading sessionStorage, ensure we're logged out
      set({
        isAuthenticated: false,
        user: null
      });
    }
  },
  
  // New function to send OTP
  sendOTP: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await authService.sendOTP(email);
      set({ loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Gửi OTP thất bại' 
      });
      throw error;
    }
  },
  
  // New function to change password
  changePassword: async (oldPassword: string, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      await authService.changePassword(oldPassword, newPassword);
      set({ loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Thay đổi mật khẩu thất bại' 
      });
      throw error;
    }
  }
}));