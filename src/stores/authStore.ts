/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { AuthState, AuthUser, LoginCredentials, ForgotPasswordCredentials } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (credentials: ForgotPasswordCredentials) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  forgotPasswordSuccess: string | null;
  clearForgotPasswordSuccess: () => void;
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
      set({ 
        isAuthenticated: true, 
        user, 
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

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
  clearForgotPasswordSuccess: () => set({ forgotPasswordSuccess: null })
}));
