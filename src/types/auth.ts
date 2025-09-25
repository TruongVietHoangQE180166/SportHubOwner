export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface ForgotPasswordCredentials {
    email: string;
  }
  
  export interface ResetPasswordCredentials {
    email: string;
    otp: string;
    newPassword: string;
  }
  export interface AuthUser {
    id: string;
    email: string;
    password: string; 
    role: string;
    isActive: boolean;
  }
  export interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
  }
  