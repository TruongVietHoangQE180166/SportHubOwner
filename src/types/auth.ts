export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface ForgotPasswordCredentials {
    email: string;
  }
  
  export interface ResetPasswordCredentials {
    email: string;
    resetCode: string;
    newPassword: string;
  }
  export interface AuthUser {
    id: string;
    email: string;
    password: string; 
    role: 'admin' | 'user' | 'owner';
    isActive: boolean;
  }
  export interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
  }
  