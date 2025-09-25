import { Venue as Field, BookingResponse, FieldBooking } from '../types';
import { OrderResponse } from '../types/index';
import { mockFields } from '../data/mockFields';
import { api } from '../config/api.config';

// Interface cho request body - updated to match the actual API format
interface CreateFieldRequest {
  fieldName: string;
  typeFieldId: string;
  location: string;
  normalPricePerHour: number;
  peakPricePerHour: number;
  openTime: string; // Changed from TimeObject to string
  closeTime: string; // Changed from TimeObject to string
  description: string;
  ownerId: string;
  images: string[];
  available: boolean;
}


interface UpdateFieldRequest {
  fieldId: string;
  typeFieldId: string;
  fieldName: string;
  location: string;
  normalPricePerHour: number;
  peakPricePerHour: number;
  openTime: string;
  closeTime: string;
  description: string;
  images: string[];
  available: boolean;
}

// Interface for small field request body
interface CreateSmallFieldRequest {
  smallFiledName: string;
  description: string;
  capacity: string;
  fieldId: string;
  available: boolean;
}

// Interface for update small field request body
interface UpdateSmallFieldRequest {
  smallFieldId: string;
  smallFiledName: string;
  description: string;
  capacity: string;
  available: boolean;
}

// Interface for sport type response
interface SportType {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  lastModifiedDate: string;
  status: boolean;
}

// Interface for user response
interface User {
  username: string;
  password: string;
  email: string;
  status: string;
  role: string;
  deleted: boolean;
}

interface UsersResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: User[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

// Interface for user profile response
interface UserProfile {
  id: string;
  createdDate: string;
  updatedDate: string;
  nickName: string | null;
  fullName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  avatar: string;
  gender: string;
  addresses: any[];
  information: any | null;
  bankNo: string | null;
  accountNo: string | null;
  bankName: string | null;
  qrCode: string | null;
  userId: string;
  username: string;
}

interface GetUserProfileResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: UserProfile[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

// Interface for create owner request
interface CreateOwnerRequest {
  username: string;
  password: string;
  email: string;
  bankNo: string;
  accountNo: string;
  bankName: string;
}

// Interface for withdrawal response
interface Withdrawal {
  id: string;
  userId: string;
  email: string;
  role: string;
  description: string;
  amount: number;
  status: string;
  createdDate: string;
}

interface WithdrawalResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: Withdrawal[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

// Interface for cash flow response
interface CashFlow {
  id: string;
  userId: string;
  email: string;
  role: string;
  amountAvailable: number;
  balance: number;
  createdDate: string;
  statisticalResponses: any | null;
}

interface CashFlowResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: CashFlow[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

class FieldService {
  private fields: Field[] = mockFields;
  private idCounter: number = Date.now();

  // Tạo unique ID
  private generateId(): string {
    this.idCounter += 1;
    return `field_${this.idCounter}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getFieldDetail(
    page: number = 1,
    size: number = 1,
    field: string = 'createdDate',
    direction: string = 'desc',
    userId: string
  ): Promise<any> {
    try {
      const response = await api.get('/api/field', {
        params: {
          page,
          size,
          field,
          direction,
          userId
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể lấy danh sách sân. Vui lòng thử lại sau.');
    }
  }

  async getField(id: string): Promise<Field | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.fields.find(f => f.id === id) || null;
  }

  async createField(fieldData: CreateFieldRequest): Promise<any> {
    try {
      console.log('Sending request to create field with data:', fieldData);
      const response = await api.post('/api/field', fieldData);
      
      console.log('Received response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating field:', error);
      console.error('Error response:', error.response);
      
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // If it's a validation error, show the details
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(`Lỗi xác thực: ${errorMessages}`);
      }
      
      // Fallback error message
      throw new Error('Không thể tạo sân mới. Vui lòng thử lại sau.');
    }
  }

  async updateField(id: string, updates: Partial<Field>): Promise<Field> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fieldIndex = this.fields.findIndex(f => f.id === id);
    if (fieldIndex === -1) {
      throw new Error('Không tìm thấy sân');
    }
    
    this.fields[fieldIndex] = { ...this.fields[fieldIndex], ...updates };
    return this.fields[fieldIndex];
  }

  async updateFieldAPI(fieldData: UpdateFieldRequest): Promise<any> {
    try {
      console.log('Sending request to update field with data:', fieldData);
      const response = await api.put('/api/field/update', fieldData);
      
      console.log('Received response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating field:', error);
      console.error('Error response:', error.response);
      
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // If it's a validation error, show the details
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(`Lỗi xác thực: ${errorMessages}`);
      }
      
      // Fallback error message
      throw new Error('Không thể cập nhật sân. Vui lòng thử lại sau.');
    }
  }

  async deleteField(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const fieldIndex = this.fields.findIndex(f => f.id === id);
    if (fieldIndex === -1) {
      throw new Error('Không tìm thấy sân');
    }
    
    this.fields.splice(fieldIndex, 1);
  }

  async getTypeFields(): Promise<SportType[]> {
    try {
      // Use fixed parameters as per project requirements
      const response = await api.get('/api/type-field', {
        params: {
          page: 1,
          size: 10,
          field: 'createdDate',
          direction: 'desc'
        }
      });
      
      // Return only the content array as per project requirements
      // The API returns data in { data: { content: [...] } } format
      return response.data.data.content;
    } catch (error: any) {
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // Fallback error message
      throw new Error('Không thể lấy danh sách type field. Vui lòng thử lại sau.');
    }
  }

  async uploadImage(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể upload hình ảnh. Vui lòng thử lại sau.');
    }
  }

  async createSmallField(smallFieldData: CreateSmallFieldRequest): Promise<any> {
    try {
      console.log('Sending request to create small field with data:', smallFieldData);
      const response = await api.post('/api/small-field', smallFieldData);
      
      console.log('Received response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating small field:', error);
      console.error('Error response:', error.response);
      
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // If it's a validation error, show the details
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(`Lỗi xác thực: ${errorMessages}`);
      }
      
      // Fallback error message
      throw new Error('Không thể tạo small field. Vui lòng thử lại sau.');
    }
  }

  async getSmallFields(
    page: number = 1,
    size: number = 100,
    field: string = 'createdDate',
    direction: string = 'desc',
    fieldId: string
  ): Promise<any> {
    try {
      const response = await api.get('/api/small-field', {
        params: {
          page,
          size,
          field,
          direction,
          fieldId
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể lấy danh sách small field. Vui lòng thử lại sau.');
    }
  }

  async updateSmallField(smallFieldData: UpdateSmallFieldRequest): Promise<any> {
    try {
      console.log('Sending request to update small field with data:', smallFieldData);
      const response = await api.put('/api/small-field/update', smallFieldData);
      
      console.log('Received response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating small field:', error);
      console.error('Error response:', error.response);
      
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // If it's a validation error, show the details
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(`Lỗi xác thực: ${errorMessages}`);
      }
      
      // Fallback error message
      throw new Error('Không thể cập nhật small field. Vui lòng thử lại sau.');
    }
  }

  async deleteSmallField(smallFieldId: string): Promise<any> {
    try {
      console.log('Sending request to delete small field with ID:', smallFieldId);
      const response = await api.delete(`/api/small-field/${smallFieldId}`);
      
      console.log('Received response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting small field:', error);
      console.error('Error response:', error.response);
      
      // Handle error from API response
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      
      // Fallback error message
      throw new Error('Không thể xóa small field. Vui lòng thử lại sau.');
    }
  }

  async getSmallFieldBookings(smallFieldId: string): Promise<BookingResponse> {
    try {
      const response = await api.get<BookingResponse>('/api/booking/smallfield-or-field', {
        params: {
          page: 1,
          size: 1000,
          field: 'createdDate',
          direction: 'desc',
          smallFieldIdOrFieldId: smallFieldId,
        },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Filter the bookings to only include those for the requested small field
      const filteredContent = response.data.data.content.filter((booking: FieldBooking) => 
        booking.smallField && booking.smallField.id === smallFieldId
      );
      
      // Return the response with filtered content
      return {
        ...response.data,
        data: {
          ...response.data.data,
          content: filteredContent
        }
      };
    } catch (error) {
      console.error('Error fetching small field bookings for ID', smallFieldId, ':', error);
      throw error;
    }
  }

  async getOrders(): Promise<OrderResponse> {
    try {
      const response = await api.get<OrderResponse>('/api/orders', {
        params: {
          page: 1,
          size: 1000,
          field: 'createdDate',
          direction: 'desc'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOwnerOrders(ownerId: string): Promise<OrderResponse> {
    try {
      const response = await api.get<OrderResponse>('/api/orders/owner', {
        params: {
          page: 1,
          size: 1000,
          field: 'createdDate',
          direction: 'desc',
          ownerId: ownerId
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching owner orders:', error);
      throw error;
    }
  }

  async createOwner(ownerData: CreateOwnerRequest): Promise<any> {
    try {
      const response = await api.post('/api/user/create-owner', ownerData);
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể tạo tài khoản chủ sân. Vui lòng thử lại sau.');
    }
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'INACTIVE'): Promise<any> {
    try {
      const response = await api.put(`/api/user/status/${userId}`, null, {
        params: {
          status
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.');
    }
  }

  async getUsers(
    page: number = 1,
    size: number = 1000,
    field: string = 'createdDate',
    direction: string = 'desc'
  ): Promise<UsersResponse> {
    try {
      const response = await api.get<UsersResponse>('/api/user', {
        params: {
          page,
          size,
          sort: `${field},${direction}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể lấy danh sách người dùng. Vui lòng thử lại sau.');
    }
  }

  async getUserProfiles(
    page: number = 1,
    size: number = 1000,
    field: string = 'createdDate',
    direction: string = 'desc'
  ): Promise<GetUserProfileResponse> {
    try {
      const response = await api.get<GetUserProfileResponse>('/api/profile', {
        params: {
          page,
          size,
          sort: `${field},${direction}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể lấy danh sách hồ sơ người dùng. Vui lòng thử lại sau.');
    }
  }

  async getAllWithdrawal(
    page: number = 1,
    size: number = 1000,
    field: string = 'createdDate',
    direction: string = 'desc'
  ): Promise<WithdrawalResponse> {
    try {
      const response = await api.get<WithdrawalResponse>('/api/withdrawal', {
        params: {
          page,
          size,
          sort: `${field},${direction}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể lấy danh sách yêu cầu rút tiền. Vui lòng thử lại sau.');
    }
  }

  async getCashFlow(
    page: number = 1,
    size: number = 1000,
    field: string = 'createdDate',
    direction: string = 'desc'
  ): Promise<CashFlowResponse> {
    try {
      const response = await api.get<CashFlowResponse>('/api/cash-flow', {
        params: {
          page,
          size,
          sort: `${field},${direction}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message?.messageDetail) {
        throw new Error(error.response.data.message.messageDetail);
      }
      throw new Error('Không thể lấy danh sách giao dịch. Vui lòng thử lại sau.');
    }
  }

}

export const fieldService = new FieldService();
