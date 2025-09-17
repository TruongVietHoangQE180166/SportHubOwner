import { Booking } from '../types';

export const mockBookings: Booking[] = [
  {
    id: '1',
    fieldId: '1',
    fieldName: 'Sân Bóng Đá Số 1',
    customerName: 'Trần Văn Bình',
    customerPhone: '+84 987 654 321',
    date: '2025-01-15',
    startTime: '19:00',
    endTime: '21:00',
    duration: 2,
    totalAmount: 600000,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2025-01-14T10:30:00Z',
    notes: 'Đặt sân cho trận đấu giao hữu'
  },
  {
    id: '2',
    fieldId: '2',
    fieldName: 'Sân Tennis Court A',
    customerName: 'Lê Thị Cẩm',
    customerPhone: '+84 909 123 456',
    date: '2025-01-16',
    startTime: '08:00',
    endTime: '10:00',
    duration: 2,
    totalAmount: 300000,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2025-01-15T09:15:00Z'
  },
  {
    id: '3',
    fieldId: '3',
    fieldName: 'Sân Cầu Lông VIP',
    customerName: 'Phạm Minh Đức',
    customerPhone: '+84 912 345 678',
    date: '2025-01-15',
    startTime: '20:00',
    endTime: '22:00',
    duration: 2,
    totalAmount: 300000,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2025-01-13T14:20:00Z'
  },
  {
    id: '4',
    fieldId: '1',
    fieldName: 'Sân Bóng Đá Số 2',
    customerName: 'Nguyễn Hoàng Anh',
    customerPhone: '+84 976 543 210',
    date: '2025-01-17',
    startTime: '15:00',
    endTime: '17:00',
    duration: 2,
    totalAmount: 500000,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2025-01-16T11:45:00Z',
    notes: 'Cần xác nhận sớm cho buổi tập của đội'
  }
];