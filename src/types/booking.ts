export interface Booking {
    id: string;
    fieldId: string;
    fieldName: string;
    customerName: string;
    customerPhone: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    createdAt: string;
    notes?: string;
  }