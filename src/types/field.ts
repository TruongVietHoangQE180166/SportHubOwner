export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userAvatar?: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  sport: string;
  images: string[];
  location: string;
  hourlyRate: number;
  peakRate: number;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  rating: number;
  totalBookings: number;
  reviews: Review[];
  createdAt: string;
  // Adding missing properties that are used in components and mock data
  capacity?: number;
  amenities?: string[];
}

export interface SubField {
  id: string;
  venueId: string;
  name: string;
  capacity: number;
  isActive: boolean;
  totalBookings: number;
  description?: string;
}