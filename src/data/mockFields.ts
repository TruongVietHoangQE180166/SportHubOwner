import { Venue as Field } from '../types';

export const mockFields: Field[] = [
  {
    id: '1',
    name: 'Sân Bóng Đá Số 1',
    sport: 'Football',
    description: 'Sân bóng đá cỏ nhân tạo chất lượng cao với hệ thống chiếu sáng LED hiện đại',
    images: [
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/159698/football-player-ball-footballer-competition-159698.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Parking', 'Lighting', 'Changing Room', 'Shower', 'Water'],
    hourlyRate: 200000,
    peakRate: 300000,
    openTime: '06:00',
    closeTime: '22:00',
    isActive: true,
    location: 'Quận Quy Nhơn, Bình Định',
    capacity: 22,
    rating: 4.8,
    totalBookings: 145,
    reviews: [],
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Sân Tennis Court A',
    sport: 'Tennis',
    description: 'Sân tennis tiêu chuẩn quốc tế với mặt sân acrylic chuyên nghiệp',
    images: [
      'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Parking', 'Lighting', 'Equipment Rental', 'Water', 'Seating'],
    hourlyRate: 150000,
    peakRate: 200000,
    openTime: '06:00',
    closeTime: '21:00',
    isActive: true,
    location: 'Quận Quy Nhơn, Bình Định',
    capacity: 4,
    rating: 4.6,
    totalBookings: 89,
    reviews: [],
    createdAt: '2024-02-20T10:30:00Z'
  },
  {
    id: '3',
    name: 'Sân Cầu Lông VIP',
    sport: 'Badminton',
    description: 'Sân cầu lông trong nhà với hệ thống điều hòa và âm thanh hiện đại',
    images: [
      'https://images.pexels.com/photos/163444/sport-tenis-ball-tennis-163444.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Air Conditioning', 'Sound System', 'Parking', 'Changing Room', 'Equipment Rental'],
    hourlyRate: 100000,
    peakRate: 150000,
    openTime: '07:00',
    closeTime: '23:00',
    isActive: true,
    location: 'Quận Quy Nhơn, Bình Định',
    capacity: 4,
    rating: 4.9,
    totalBookings: 203,
    reviews: [],
    createdAt: '2024-03-10T14:15:00Z'
  }
];