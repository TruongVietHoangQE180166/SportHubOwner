export interface Analytics {
    totalRevenue: number;
    monthlyRevenue: number;
    dailyRevenue: number;
    totalBookings: number;
    monthlyBookings: number;
    dailyBookings: number;
    averageBookingValue: number;
    popularFields: { fieldName: string; bookings: number; revenue: number }[];
    peakHours: { hour: string; bookings: number }[];
    customerRetention: number;
    cancellationRate: number;
  }
  
  export interface Activity {
    id: string;
    type: 'booking' | 'payment' | 'cancellation' | 'review';
    title: string;
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'info' | 'error';
  }
  