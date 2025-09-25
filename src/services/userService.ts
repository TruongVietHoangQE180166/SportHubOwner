/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserProfile } from '../types';
import { api } from '../config/api.config';

// Define interface for API response
interface GetUserProfileResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: UserProfile;
  success: boolean;
}

// Define interface for image upload response
interface ImageUploadResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: {
    field: string;
    message: string;
  }[] | null;
  data: string; // URL of the uploaded image
  success: boolean;
}

class UserService {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await api.get<GetUserProfileResponse>(`/api/profile/user/${userId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Không thể tải thông tin người dùng');
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await api.put<GetUserProfileResponse>(`/api/profile`, updates);
      if (response.data.success) {
        return response.data.data;
      }
      // Extract error message from API response
      throw new Error(response.data.message?.messageDetail || 'Không thể cập nhật thông tin người dùng');
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      // Handle network errors or other exceptions
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message.messageDetail || 'Không thể cập nhật thông tin người dùng');
      }
      throw new Error('Không thể cập nhật thông tin người dùng');
    }
  }

  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<ImageUploadResponse>(
        "/api/images/upload",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Check if we have the data (URL) even if success is false
      if (response.data.data) {
        return response.data.data; // Return the URL of the uploaded image
      }
      
      // Handle validation errors
      if (response.data.errors && response.data.errors.length > 0) {
        const errorMessages = response.data.errors.map(error => `${error.field}: ${error.message}`).join(', ');
        throw new Error(errorMessages);
      }
      
      // Extract error message from API response
      throw new Error(response.data.message?.messageDetail || 'Không thể tải lên ảnh đại diện');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      // Handle network errors or other exceptions
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message.messageDetail || 'Không thể tải lên ảnh đại diện');
      }
      throw new Error('Không thể tải lên ảnh đại diện');
    }
  }
}


export const userService = new UserService();