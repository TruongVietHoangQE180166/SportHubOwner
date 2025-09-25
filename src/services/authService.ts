/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthUser, LoginCredentials } from '../types';
import { api } from '../config/api.config';

// Define interfaces for API responses
interface LoginResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    accessToken: string;
    userId: string;
    username: string;
    email: string;
  };
  success: boolean;
}

interface UserDetailResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    id: string;
    email: string;
    role: string;
    status: string;
    createdDate: string;
    lastModifiedDate: string;
  };
  success: boolean;
}

interface SendOTPRequest {
  email: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      // Step 1: Call login API
      const loginResponse = await api.post<LoginResponse>('/api/auth/login', credentials);
      
      if (!loginResponse.data.success) {
        throw new Error('Đăng nhập thất bại');
      }
      
      // Lấy thông tin từ login response
      const accessToken = loginResponse.data.data.accessToken;
      const userId = loginResponse.data.data.userId;

      // Step 2: Lưu token ngay lập tức để interceptor có thể sử dụng
      sessionStorage.setItem('accessToken', accessToken);

      // Step 3: Gọi get user details (interceptor sẽ tự động thêm token)
      const userDetailResponse = await api.get<UserDetailResponse>(`/api/user/get-detail/${userId}`);
           
      if (!userDetailResponse.data.success) {
        throw new Error('Không thể lấy thông tin người dùng');
      }
      
      // Check if user has OWNER or ADMIN role
      const userRole = userDetailResponse.data.data.role?.toLowerCase();
      if (userRole !== 'owner' && userRole !== 'admin') {
        // Clear tokens if user doesn't have required roles
        this.clearAuthData();
        throw new Error('Bạn không có quyền truy cập vào hệ thống này');
      }

      // Step 5: Lưu tất cả thông tin vào sessionStorage
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('username', loginResponse.data.data.username);
      sessionStorage.setItem('email', loginResponse.data.data.email);
      sessionStorage.setItem('role', userDetailResponse.data.data.role);

      // Transform the response to AuthUser format
      const authUser: AuthUser = {
        id: userId,
        email: userDetailResponse.data.data.email,
        password: credentials.password, // We don't get the actual password back, so we use the input
        role: userDetailResponse.data.data.role,
        isActive: userDetailResponse.data.data.status === 'ACTIVE'
      };

      return authUser;
    } catch (error: any) {
      // Clear all auth data if login fails
      this.clearAuthData();
           
      // Nếu là lỗi từ API response, ưu tiên message từ server
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // Nếu là lỗi tự throw (như role check), giữ nguyên message
      if (error.message && error.message !== 'Request failed with status code 401') {
        throw error; // Giữ nguyên error để preserve message
      }
      
      // Chỉ fallback khi không có thông tin cụ thể
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  }

  // Helper method để clear auth data
  private clearAuthData(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
  }

  async logout(): Promise<void> {
    // Clear all authentication data from sessionStorage
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('redirectUrl');
  }

  // New function to send OTP
  async sendOTP(email: string): Promise<void> {
    try {
      const otpRequest: SendOTPRequest = { email };
      await api.post('/api/auth/sendOTP', otpRequest);
    } catch (error: any) {
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // Fallback error message
      throw new Error('Không thể gửi mã OTP. Vui lòng thử lại sau.');
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const changePasswordRequest: ChangePasswordRequest = {
        oldPassword,
        newPassword
      };
      await api.post('/api/user/change-password', changePasswordRequest);
    } catch (error: any) {
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // Fallback error message
      throw new Error('Không thể thay đổi mật khẩu. Vui lòng thử lại sau.');
    }
  }

  async forgotPassword(credentials: any): Promise<void> {
    // This would be implemented when we have the actual API endpoint
    throw new Error('Chức năng này chưa được hỗ trợ');
  }

  async resetPassword(credentials: any): Promise<void> {
    try {
      const resetPasswordRequest: ResetPasswordRequest = {
        email: credentials.email,
        otp: credentials.otp,
        newPassword: credentials.newPassword
      };
      await api.post('/api/user/reset-password', resetPasswordRequest);
    } catch (error: any) {
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // Fallback error message
      throw new Error('Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
    }
  }
}

export const authService = new AuthService();