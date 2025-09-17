import { create } from 'zustand';
import { Analytics } from '../types';
import { analyticsService } from '../services/analyticsService';

interface AnalyticsStore {
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
  
  fetchAnalytics: () => Promise<void>;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  analytics: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    
    try {
      const analytics = await analyticsService.getAnalytics();
      set({ analytics, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải dữ liệu phân tích' 
      });
    }
  },


  clearError: () => set({ error: null })
}));
