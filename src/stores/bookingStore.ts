/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { Booking, Order } from '../types';
import { bookingService } from '../services/bookingService';
import { fieldService } from '../services/fieldService';

interface BookingStore {
  bookings: Booking[];
  orders: Order[];
  selectedBooking: Booking | null;
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  
  fetchBookings: () => Promise<void>;
  fetchOrders: (ownerId: string) => Promise<void>;
  fetchBooking: (id: string) => Promise<void>;
  updateBooking: (booking: Booking) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  orders: [],
  selectedBooking: null,
  selectedOrder: null,
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    
    try {
      const bookings = await bookingService.getBookings();
      set({ bookings, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải danh sách booking' 
      });
    }
  },

  fetchOrders: async (ownerId: string) => {
    set({ loading: true, error: null });
    
    try {
      const orders = await fieldService.getOwnerOrders(ownerId);
      set({ orders: orders.data.content, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải danh sách đơn hàng' 
      });
    }
  },

  fetchBooking: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const booking = await bookingService.getBooking(id);
      set({ selectedBooking: booking, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi tải thông tin booking' 
      });
    }
  },

  updateBooking: async (booking: Booking) => {
    set({ loading: true });
    try {
      await bookingService.updateBooking(booking);
      set((state) => ({
        bookings: state.bookings.map(b => b.id === booking.id ? booking : b),
        selectedBooking: state.selectedBooking?.id === booking.id ? booking : state.selectedBooking,
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi cập nhật booking' 
      });
    }
  },
  deleteBooking: async (id: string) => {
    set({ loading: true });
    try {
      await bookingService.deleteBooking(id);
      set((state) => ({
        bookings: state.bookings.filter(b => b.id !== id),
        selectedBooking: state.selectedBooking?.id === id ? null : state.selectedBooking,
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Lỗi xóa booking' 
      });
    }
  },

  clearError: () => set({ error: null })
}));