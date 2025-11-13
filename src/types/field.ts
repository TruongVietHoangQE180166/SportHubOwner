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
  // Adding properties that are used in API mapping
  ownerPhone?: string;
  // Adding smallFieldResponses for dashboard calculations
  smallFieldResponses?: SmallField[];
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

export interface SmallField {
  id: string;
  createdDate: string;
  smallFiledName: string; // Note: This appears to be a typo in the API ("Filed" instead of "Field")
  description: string;
  capacity: string;
  available: boolean;
  booked: boolean;
}

export interface FieldBooking {
  id: string;
  userId: string;
  fieldId: string;
  fieldName: string;
  smallField: SmallField;
  avatar: string;
  email: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  createDate: string | null;
}

export interface BookingResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: FieldBooking[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}
