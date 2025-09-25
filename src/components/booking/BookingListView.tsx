import React from 'react';
import { Eye } from 'lucide-react';
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
    case 'confirmed': return 'bg-green-50 text-green-700 border border-green-200';
    case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
    case 'completed': return 'bg-blue-50 text-blue-700 border border-blue-200';
    default: return 'bg-gray-50 text-gray-600 border border-gray-200';
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

interface BookingListViewProps {
  bookings: Booking[];
  onViewBooking: (booking: Booking) => void;
  // Removed onConfirmBooking and onCancelBooking props
}

const BookingListView: React.FC<BookingListViewProps> = ({
  bookings,
  onViewBooking
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 px-6 py-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-xl font-semibold text-white">Danh sách đặt sân</h2>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-green-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Sân
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {bookings.map((booking, index) => (
              <tr 
                key={booking.id} 
                className={`transition-all duration-200 hover:!bg-gray-100 hover:shadow-sm ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{booking.customerName}</p>
                    <p className="text-xs text-gray-500 mt-1">{booking.customerPhone}</p>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <p className="font-medium text-gray-800 text-sm">{booking.fieldName}</p>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{formatDate(booking.date)}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <p className="font-bold text-black text-sm">{formatCurrency(booking.totalAmount)}</p>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewBooking(booking)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Xem chi tiết
                    </button>
                    
                    {/* Removed confirm and cancel buttons */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Không có đặt sân nào</h3>
          <p className="text-gray-600">Không có đặt sân nào phù hợp với bộ lọc hiện tại</p>
        </div>
      )}
    </div>
  );
};

export default BookingListView;