import { Booking } from '../types';
import { mockBookings } from '../data/mockBookings';

class BookingService {
  private bookings: Booking[] = [...mockBookings];

  async getBookings(): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.bookings;
  }

  async getBooking(id: string): Promise<Booking | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.bookings.find(b => b.id === id) || null;
  }

  async updateBooking(booking: Booking): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.bookings.findIndex(b => b.id === booking.id);
    if (index !== -1) {
      this.bookings[index] = booking;
    }
  }
  async deleteBooking(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.bookings = this.bookings.filter(b => b.id !== id);
  }
}

export const bookingService = new BookingService();