import { Analytics, Activity } from '../types';

export const mockAnalytics: Analytics = {
  totalRevenue: 45600000,
  monthlyRevenue: 12400000,
  dailyRevenue: 1200000,
  totalBookings: 437,
  monthlyBookings: 87,
  dailyBookings: 12,
  averageBookingValue: 280000,
  popularFields: [
    { fieldName: 'Sân Cầu Lông VIP', bookings: 203, revenue: 18500000 },
    { fieldName: 'Sân Bóng Đá Số 1', bookings: 145, revenue: 16800000 },
    { fieldName: 'Sân Tennis Court A', bookings: 89, revenue: 10300000 }
  ],
  peakHours: [
    { hour: '19:00', bookings: 45 },
    { hour: '20:00', bookings: 52 },
    { hour: '18:00', bookings: 38 },
    { hour: '21:00', bookings: 34 }
  ],
  customerRetention: 78.5,
  cancellationRate: 5.2
};

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Đặt sân mới',
    description: 'Trần Văn Bình đã đặt Sân Bóng Đá Số 1 vào 19:00 ngày 15/01',
    timestamp: '2025-01-14T10:30:00Z',
    status: 'success'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Thanh toán thành công',
    description: 'Nhận được thanh toán 600,000 VNĐ từ Trần Văn Bình',
    timestamp: '2025-01-14T10:32:00Z',
    status: 'success'
  },
  {
    id: '3',
    type: 'booking',
    title: 'Đặt sân chờ xác nhận',
    description: 'Lê Thị Cẩm đặt Sân Tennis Court A vào 08:00 ngày 16/01',
    timestamp: '2025-01-15T09:15:00Z',
    status: 'warning'
  }
];