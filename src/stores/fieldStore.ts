import { create } from 'zustand';
import { Venue as Field } from '../types';
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

  clearError: () => set({ error: null })
}));