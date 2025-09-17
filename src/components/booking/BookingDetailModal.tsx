import React from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import { Booking } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

const formatTime = (time: string) => time.slice(0, 5);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Đã xác nhận';
    case 'pending': return 'Chờ xác nhận';
    case 'cancelled': return 'Đã hủy';
    case 'completed': return 'Hoàn thành';
    default: return status;
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'refunded': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'Đã thanh toán';
    case 'pending': return 'Chờ thanh toán';
    case 'refunded': return 'Đã hoàn tiền';
    default: return status;
  }
};

const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('vi-VN');
  };
  
  interface BookingDetailModalProps {
    booking: Booking | null;
    onClose: () => void;
    onConfirmBooking: (bookingId: string) => void;
    onCancelBooking: (bookingId: string) => void;
    onDeleteBooking: (bookingId: string) => void; 
  }
  
  const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
    booking,
    onClose,
    onConfirmBooking,
    onCancelBooking,
    onDeleteBooking 
  }) => {
    if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Chi Tiết Đặt Sân</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">{booking.fieldName}</p>
              <p className="text-sm text-gray-500">{formatDate(booking.date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Thời gian</p>
              <p className="font-medium">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Thời lượng</p>
              <p className="font-medium">{booking.duration} giờ</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Khách hàng</p>
            <p className="font-medium">{booking.customerName}</p>
            <p className="text-sm text-gray-500">{booking.customerPhone}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Trạng thái đặt sân</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                {getPaymentStatusText(booking.paymentStatus)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Tổng tiền</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
          </div>

          {booking.notes && (
            <div>
              <p className="text-sm text-gray-600">Ghi chú</p>
              <p className="text-sm text-gray-800">{booking.notes}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600">Thời gian tạo</p>
            <p className="text-sm text-gray-800">{formatDateTime(booking.createdAt)}</p>
          </div>

          {booking.status === 'pending' && (
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onConfirmBooking(booking.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận</span>
              </button>
              <button
                onClick={() => {
                  onCancelBooking(booking.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
            </div>
          )}
          <button
              onClick={() => {
                onDeleteBooking(booking.id);
                onClose();
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;