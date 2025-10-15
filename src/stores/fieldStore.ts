import { create } from 'zustand';
import { Venue as Field, CashFlow, CashFlowResponse, Withdrawal, StatisticalResponse } from '../types';
import { fieldService } from '../services/fieldService';
import { OrderResponse } from '../types'; // Add this import

// Define the CreateFieldRequest interface to match the fieldService
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

interface FieldStore {
  fields: Field[];
  selectedField: Field | null;
  loading: boolean;
  error: string | null;
  
  fetchFields: (userId: string) => Promise<void>; // Updated signature to match the service
  fetchField: (id: string) => Promise<void>;
  createField: (fieldData: CreateFieldRequest) => Promise<void>;
  updateField: (id: string, updates: Partial<Field>) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  getOwnerOrders: (ownerId: string) => Promise<OrderResponse>; // Add this line
  getCashFlowByUser: (userId: string) => Promise<CashFlow[]>; // Add this line
  getCashFlowByUserByDay: (cashFlowId: string, day: number) => Promise<CashFlow>; // Add this line
  getCashFlowUserBy7Day: (cashFlowId: string) => Promise<CashFlow>;
  getCashFlowUserBy30Day: (cashFlowId: string) => Promise<CashFlow>;
  getCashFlowUserBy90Day: (cashFlowId: string) => Promise<CashFlow>;
  getWithdrawalHistoryByUser: (userId: string) => Promise<Withdrawal[]>; // Add this line
  clearError: () => void;
}

// Biến global để track create requests
let createInProgress = false;

export const useFieldStore = create<FieldStore>((set, get) => ({
  fields: [],
  selectedField: null,
  loading: false,
  error: null,

  fetchFields: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      // Using getFieldDetail which is the actual method available in fieldService
      const response = await fieldService.getFieldDetail(1, 100, 'createdDate', 'desc', userId);
      set({ fields: response.data.content, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải danh sách sân' 
      });
    }
  },

  fetchField: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const field = await fieldService.getField(id);
      set({ selectedField: field, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải thông tin sân' 
      });
    }
  },

  createField: async (fieldData: CreateFieldRequest) => {
    // Kiểm tra global flag
    if (createInProgress) {
      console.log('Create field request already in progress, skipping...');
      return;
    }

    createInProgress = true;
    set({ loading: true, error: null });
    
    try {
      const response = await fieldService.createField(fieldData);
      
      // Since we're now using the real API, we need to handle the response properly
      // The response should contain the created field data
      const newField = response.data || response;
      
      // Kiểm tra xem field đã tồn tại chưa trước khi thêm
      const { fields } = get();
      const existingField = fields.find(f => f.id === newField.id);
      
      if (!existingField) {
        set(state => ({
          fields: [...state.fields, newField],
          loading: false
        }));
      } else {
        console.log('Field already exists, skipping add');
        set({ loading: false });
      }
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tạo sân mới' 
      });
      throw error;
    } finally {
      createInProgress = false;
    }
  },

  updateField: async (id: string, updates: Partial<Field>) => {
    set({ loading: true, error: null });
    
    try {
      const updatedField = await fieldService.updateField(id, updates);
      set(state => ({
        fields: state.fields.map(field => 
          field.id === id ? updatedField : field
        ),
        selectedField: state.selectedField?.id === id ? updatedField : state.selectedField,
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi cập nhật sân' 
      });
      throw error;
    }
  },

  deleteField: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      await fieldService.deleteField(id);
      set(state => ({
        fields: state.fields.filter(field => field.id !== id),
        selectedField: state.selectedField?.id === id ? null : state.selectedField,
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi xóa sân' 
      });
      throw error;
    }
  },

  // Add the getOwnerOrders function here
  getOwnerOrders: async (ownerId: string) => {
    set({ loading: true, error: null });
    
    try {
      const orders = await fieldService.getOwnerOrders(ownerId);
      set({ loading: false });
      return orders;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải danh sách đơn hàng' 
      });
      throw error;
    }
  },

  // Add the getCashFlowByUser function here
  getCashFlowByUser: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const cashFlowResponse: CashFlowResponse = await fieldService.getCashFlowUser(userId);
      set({ loading: false });
      return cashFlowResponse.data.content;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải dữ liệu giao dịch' 
      });
      throw error;
    }
  },

  // Add the getCashFlowByUserByDay function here
  getCashFlowByUserByDay: async (cashFlowId: string, day: number) => {
    set({ loading: true, error: null });
    
    try {
      let cashFlowResponse: any;
      
      // Call the appropriate function based on the day parameter
      switch (day) {
        case 7:
          cashFlowResponse = await fieldService.getCashFlowUserBy7Day(cashFlowId, 7);
          break;
        case 30:
          cashFlowResponse = await fieldService.getCashFlowUserBy30Day(cashFlowId, 30);
          break;
        case 90:
          cashFlowResponse = await fieldService.getCashFlowUserBy90Day(cashFlowId, 90);
          break;
        default:
          throw new Error('Invalid day parameter. Supported values are 7, 30, or 90.');
      }
      
      set({ loading: false });
      return cashFlowResponse.data; // Return the CashFlow object directly
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải dữ liệu giao dịch theo ngày' 
      });
      throw error;
    }
  },

  // Add the getCashFlowUserBy7Day function here
  getCashFlowUserBy7Day: async (cashFlowId: string) => {
    set({ loading: true, error: null });
    
    try {
      const cashFlowResponse: any = await fieldService.getCashFlowUserBy7Day(cashFlowId, 7);
      set({ loading: false });
      return cashFlowResponse.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải dữ liệu giao dịch 7 ngày' 
      });
      throw error;
    }
  },

  // Add the getCashFlowUserBy30Day function here
  getCashFlowUserBy30Day: async (cashFlowId: string) => {
    set({ loading: true, error: null });
    
    try {
      const cashFlowResponse: any = await fieldService.getCashFlowUserBy30Day(cashFlowId, 30);
      set({ loading: false });
      return cashFlowResponse.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải dữ liệu giao dịch 30 ngày' 
      });
      throw error;
    }
  },

  // Add the getCashFlowUserBy90Day function here
  getCashFlowUserBy90Day: async (cashFlowId: string) => {
    set({ loading: true, error: null });
    
    try {
      const cashFlowResponse: any = await fieldService.getCashFlowUserBy90Day(cashFlowId, 90);
      set({ loading: false });
      return cashFlowResponse.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải dữ liệu giao dịch 90 ngày' 
      });
      throw error;
    }
  },

  // Add the getWithdrawalHistoryByUser function here
  getWithdrawalHistoryByUser: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const withdrawalResponse = await fieldService.getAllWithdrawalUser(userId);
      set({ loading: false });
      return withdrawalResponse.data.content;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải lịch sử rút tiền' 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));