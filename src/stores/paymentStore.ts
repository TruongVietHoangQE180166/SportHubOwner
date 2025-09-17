import { create } from 'zustand';
import { Payment } from '../types';
import { paymentService } from '../services/paymentService';

interface PaymentStore {
  settings: Payment | null;
  loading: boolean;
  error: string | null;
  
  fetchPaymentSettings: () => Promise<void>;
  updatePaymentSettings: (updates: Partial<Payment>) => Promise<void>;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchPaymentSettings: async () => {
    set({ loading: true, error: null });
    
    try {
      const settings = await paymentService.getPaymentSettings();
      set({ settings, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải cài đặt thanh toán' 
      });
    }
  },

  updatePaymentSettings: async (updates: Partial<Payment>) => {
    set({ loading: true, error: null });
    
    try {
      const settings = await paymentService.updatePaymentSettings(updates);
      set({ settings, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi cập nhật cài đặt thanh toán' 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));