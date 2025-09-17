/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthUser, LoginCredentials, ForgotPasswordCredentials, ResetPasswordCredentials } from '../types';
import { mockUsers } from '../data/mockAuth';

class AuthService {
  private users: AuthUser[] = mockUsers;

  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.users.find(
      u => u.email === credentials.email && 
           u.password === credentials.password && 
           u.isActive
    );
    
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    if (user.role !== 'admin' && user.role !== 'owner') {
      throw new Error('Tài khoản của bạn không có quyền truy cập hệ thống');
    }
    
    return user;
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real app, would clear server-side session
  }

  async validateToken(token: string): Promise<AuthUser | null> {
    // In real app, would validate JWT token
    // For demo, just return first user
    return this.users[0];
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (!user || user.password !== oldPassword) {
      throw new Error('Mật khẩu cũ không đúng');
    }
    
    user.password = newPassword;
  }

  async forgotPassword(credentials: ForgotPasswordCredentials): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = this.users.find(u => u.email === credentials.email && u.isActive);
    if (!user) {
      throw new Error('Không tìm thấy tài khoản với email này');
    }
    
    // In real app, would send email with reset link/code
    // For demo, just simulate success
    console.log(`Sending password reset email to ${credentials.email}`);
  }

  async resetPassword(credentials: ResetPasswordCredentials): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.users.find(u => u.email === credentials.email && u.isActive);
    if (!user) {
      throw new Error('Không tìm thấy tài khoản với email này');
    }
    
    // In real app, would verify reset code
    if (credentials.resetCode !== '123456') {
      throw new Error('Mã xác thực không đúng');
    }
    
    user.password = credentials.newPassword;
  }
}

export const authService = new AuthService();