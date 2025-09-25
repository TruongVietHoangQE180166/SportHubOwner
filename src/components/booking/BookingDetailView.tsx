import React from 'react';
import { ArrowLeft } from 'lucide-react';
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

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return date.toLocaleString('vi-VN');
};

interface BookingDetailViewProps {
  booking: Booking;
  onBack: () => void;
  // Removed onConfirmBooking and onCancelBooking props
}

const BookingDetailView: React.FC<BookingDetailViewProps> = ({
  booking,
  onBack
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi Tiết Đặt Sân</h1>
          <p className="text-gray-600">Thông tin chi tiết về đơn đặt sân</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 px-6 py-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{booking.fieldName}</h2>
                <p className="text-gray-300 text-lg">{formatDate(booking.date)}</p>
              </div>
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Time and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Thời Gian
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Thời gian đặt</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </p>
                </div>
                <div className="text-center pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Thời lượng</p>
                  <p className="text-lg font-semibold text-gray-900">{booking.duration} giờ</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Khách Hàng
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Tên khách hàng</p>
                  <p className="text-xl font-bold text-gray-900">{booking.customerName}</p>
                </div>
                <div className="text-center pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                  <p className="text-lg font-semibold text-gray-900">{booking.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Trạng Thái
              </h3>
              <div className="flex items-center justify-center">
                <div className={`px-6 py-3 text-base font-semibold rounded-xl shadow-sm border-2 ${getStatusColor(booking.status)} transition-all duration-200 hover:scale-105`}>
                  {getStatusText(booking.status)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Thanh Toán
              </h3>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Tổng tiền</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Notes and Creation Time */}
          <div className="space-y-6">
            {booking.notes && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi Chú</h3>
                <p className="text-gray-800">{booking.notes}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Thêm</h3>
              <div>
                <p className="text-sm text-gray-600">Thời gian tạo đơn</p>
                <p className="font-medium">{formatDateTime(booking.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Removed confirm and cancel buttons */}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailView;