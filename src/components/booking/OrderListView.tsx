import React from 'react';
import { Eye } from 'lucide-react';
import { Order } from '../../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-green-50 text-green-700 border border-green-200';
    case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
    default: return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'Hoàn thành';
    case 'pending': return 'Chờ xác nhận';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

interface OrderListViewProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

const OrderListView: React.FC<OrderListViewProps> = ({
  orders,
  onViewOrder
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
          <h2 className="text-xl font-semibold text-white">Danh sách đơn hàng</h2>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-green-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Mã đơn hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Số lượng booking
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Tổng tiền
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
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`transition-all duration-200 hover:!bg-gray-100 hover:shadow-sm ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <p className="font-semibold text-gray-900 text-sm">{order.id.substring(0, 8)}...</p>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <p className="font-medium text-gray-800 text-sm">{order.booking.length} booking</p>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <p className="font-bold text-black text-sm">{formatCurrency(order.totalAmount)}</p>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Xem chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Không có đơn hàng nào</h3>
          <p className="text-gray-600">Không có đơn hàng nào phù hợp với bộ lọc hiện tại</p>
        </div>
      )}
    </div>
  );
};

export default OrderListView;