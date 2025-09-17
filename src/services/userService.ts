/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserProfile } from '../types';
import { mockUserProfiles } from '../data/mockUserProfiles';

class UserService {
  private profiles: UserProfile[] = mockUserProfiles;

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.profiles.find(p => p.id === userId) || null;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profileIndex = this.profiles.findIndex(p => p.id === userId);
    if (profileIndex === -1) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    
    this.profiles[profileIndex] = { ...this.profiles[profileIndex], ...updates };
    return this.profiles[profileIndex];
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const avatarUrl = `https://example.com/avatars/${userId}_${Date.now()}.jpg`;
    
    const profileIndex = this.profiles.findIndex(p => p.id === userId);
    if (profileIndex !== -1) {
      this.profiles[profileIndex].avatar = avatarUrl;
    }
    
    return avatarUrl;
  }
}

export const userService = new UserService();