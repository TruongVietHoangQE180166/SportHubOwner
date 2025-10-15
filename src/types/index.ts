export * from './auth';
export * from './user';
export * from './field';
export * from './booking';
export * from './analytics';
export * from './payment';

// Order Types
export interface SmallFieldOrder {
  id: string;
  createdDate: string;
  smallFiledName: string;
  description: string;
  capacity: string;
  booked: boolean;
  available: boolean;
}

export interface BookingOrder {
  id: string;
  userId: string;
  fieldId: string;
  fieldName: string;
  smallField: SmallFieldOrder;
  avatar: string;
  email: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  createDate: string | null;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  userId: string;
  email: string;
  booking: BookingOrder[];
  location: string;
}

export interface OrderResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: Order[];
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