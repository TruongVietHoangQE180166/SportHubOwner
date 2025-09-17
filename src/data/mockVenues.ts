import { Venue } from '../types';
import { mockReviews } from './mockReviews';

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Sân Thể Thao Quy Nhơn Center',
    description: 'Khu liên hợp thể thao hiện đại với đầy đủ tiện nghi và dịch vụ chất lượng cao',
    sport: 'Bóng đá',
    images: [
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/159698/football-player-ball-footballer-competition-159698.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: '123 Đường Nguyễn Huệ, Quận Quy Nhơn, Bình Định',
    hourlyRate: 200000,
    peakRate: 300000,
    openTime: '06:00',
    closeTime: '22:00',
    isActive: true,
    rating: 4.8,
    totalBookings: 437,
    reviews: mockReviews.filter(r => ['1', '2', '3', '4'].includes(r.id)),
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'SportHub Bình Định',
    description: 'Trung tâm thể thao đa năng với nhiều loại sân và dịch vụ tiện ích cao cấp',
    sport: 'Cầu lông',
    images: [
      'https://images.pexels.com/photos/163444/sport-tenis-ball-tennis-163444.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040482/pexels-photo-1040482.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: '456 Đường Lê Duẩn, Quận Quy Nhơn, Bình Định',
    hourlyRate: 180000,
    peakRate: 250000,
    openTime: '05:30',
    closeTime: '23:00',
    isActive: true,
    rating: 4.6,
    totalBookings: 312,
    reviews: mockReviews.filter(r => ['5', '6', '7'].includes(r.id)),
    createdAt: '2024-02-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'Elite Sports Complex',
    description: 'Khu phức hợp thể thao cao cấp với tiêu chuẩn quốc tế và dịch vụ VIP',
    sport: 'Tennis',
    images: [
      'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040482/pexels-photo-1040482.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: '789 Đường Trần Hưng Đạo, Quận Quy Nhơn, Bình Định',
    hourlyRate: 250000,
    peakRate: 350000,
    openTime: '06:00',
    closeTime: '21:30',
    isActive: true,
    rating: 4.9,
    totalBookings: 189,
    reviews: mockReviews.filter(r => ['8', '9', '10'].includes(r.id)),
    createdAt: '2024-03-10T09:45:00Z'
  }
];