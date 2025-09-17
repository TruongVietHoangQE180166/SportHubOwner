import { SubField } from '../types';

export const mockSubFields: SubField[] = [
  // Sub-fields for Venue 1 (Sân Thể Thao Quy Nhơn Center - Bóng đá)
  {
    id: '1',
    venueId: '1',
    name: 'Sân Chính A',
    capacity: 22,
    isActive: true,
    totalBookings: 145,
    description: 'Sân chính cỡ tiêu chuẩn 11 người'
  },
  {
    id: '2',
    venueId: '1',
    name: 'Sân Chính B',
    capacity: 22,
    isActive: true,
    totalBookings: 132,
    description: 'Sân phụ cỡ tiêu chuẩn 11 người'
  },
  {
    id: '3',
    venueId: '1',
    name: 'Sân Mini 1',
    capacity: 10,
    isActive: true,
    totalBookings: 89,
    description: 'Sân mini dành cho nhóm nhỏ'
  },
  {
    id: '4',
    venueId: '1',
    name: 'Sân Mini 2',
    capacity: 10,
    isActive: true,
    totalBookings: 71,
    description: 'Sân mini dành cho nhóm nhỏ'
  },
  {
    id: '789',
    venueId: '1',
    name: 'Sân Training',
    capacity: 14,
    isActive: true,
    totalBookings: 71,
    description: 'Sân dành cho tập luyện và hướng dẫn'
  },
  
  // Sub-fields for Venue 2 (SportHub Bình Định - Cầu lông)
  {
    id: '5',
    venueId: '2',
    name: 'Sân Số 1',
    capacity: 4,
    isActive: true,
    totalBookings: 203,
    description: 'Sân cầu lông tiêu chuẩn thi đấu'
  },
  {
    id: '6',
    venueId: '2',
    name: 'Sân Số 2',
    capacity: 4,
    isActive: true,
    totalBookings: 156,
    description: 'Sân cầu lông tiêu chuẩn thi đấu'
  },
  {
    id: '7',
    venueId: '2',
    name: 'Sân VIP',
    capacity: 4,
    isActive: true,
    totalBookings: 98,
    description: 'Sân VIP với tiện nghi cao cấp'
  },
  
  // Sub-fields for Venue 3 (Elite Sports Complex - Tennis)
  {
    id: '8',
    venueId: '3',
    name: 'Sân Premium 1',
    capacity: 4,
    isActive: true,
    totalBookings: 67,
    description: 'Sân tennis premium với tiêu chuẩn quốc tế'
  },
  {
    id: '9',
    venueId: '3',
    name: 'Sân Premium 2',
    capacity: 4,
    isActive: true,
    totalBookings: 45,
    description: 'Sân tennis premium với hệ thống điều hòa'
  },
  {
    id: '10',
    venueId: '3',
    name: 'Sân VIP',
    capacity: 4,
    isActive: false,
    totalBookings: 22,
    description: 'Sân VIP riêng tư với dịch vụ đặc biệt'
  }
];