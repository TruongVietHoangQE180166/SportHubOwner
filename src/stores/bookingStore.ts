/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { Booking } from '../types';
import { bookingService } from '../services/bookingService';

interface BookingStore {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
  
  fetchBookings: () => Promise<void>;
  fetchBooking: (id: string) => Promise<void>;
  updateBooking: (booking: Booking) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  selectedBooking: null,
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