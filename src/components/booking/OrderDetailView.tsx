import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Order, BookingOrder } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  // Handle null/undefined dates
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatTime = (dateString: string) => {
  // Handle null/undefined times
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getStatusColor = (status: string) => {
  // Handle null/undefined status
  if (!status) return 'bg-gray-100 text-gray-800';
  
  switch (status.toLowerCase()) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  // Handle null/undefined status
  if (!status) return 'N/A';
  
  switch (status.toLowerCase()) {
    case 'confirmed': return 'Đã xác nhận';
    case 'pending': return 'Chờ xác nhận';
    case 'cancelled': return 'Đã hủy';
    case 'completed': return 'Hoàn thành';
    default: return status;
  }
};

const formatFieldData = (data: string | null | undefined): string => {
  return data || 'N/A';
};

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onBack
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi Tiết Đơn Hàng</h1>
          <p className="text-gray-600">Thông tin chi tiết về đơn hàng và các booking</p>
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
                <h2 className="text-2xl font-bold text-white">Đơn hàng #{order.id ? order.id.substring(0, 8) : 'N/A'}</h2>
                <p className="text-gray-300 text-lg">Khách hàng: {formatFieldData(order.email)}</p>
              </div>
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Tổng tiền
              </h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{order.totalAmount !== undefined ? formatCurrency(order.totalAmount) : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Số lượng booking
              </h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{order.booking ? order.booking.length : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Trạng thái
              </h3>
              <div className="flex items-center justify-center">
                <div className={`px-6 py-3 text-base font-semibold rounded-xl shadow-sm border-2 ${getStatusColor(order.status)} transition-all duration-200 hover:scale-105`}>
                  {getStatusText(order.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Danh sách booking</h3>
            {order.booking && order.booking.length > 0 ? (
              order.booking.map((booking: BookingOrder) => (
                <div key={booking.id || Math.random()} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sân</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Tên sân</p>
                          <p className="font-medium">{formatFieldData(booking.fieldName)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sân con</p>
                          <p className="font-medium">{booking.smallField?.smallFiledName ? booking.smallField.smallFiledName : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Thời gian</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Ngày</p>
                          <p className="font-medium">{formatDate(booking.startTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Giờ</p>
                          <p className="font-medium">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Trạng thái</p>
                        <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Thành tiền</p>
                        <p className="text-xl font-bold text-gray-900">{booking.totalPrice !== undefined ? formatCurrency(booking.totalPrice) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-600">Không có booking nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;