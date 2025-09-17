import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Analytics } from '../../types';

interface PopularFieldsProps {
  analytics: Analytics;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const PopularFields: React.FC<PopularFieldsProps> = ({ analytics }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sân Phổ Biến Nhất</h3>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {analytics.popularFields.map((field, index) => {
          const percentage = (field.revenue / analytics.totalRevenue) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{field.fieldName}</p>
                    <p className="text-sm text-gray-500">{field.bookings} lượt đặt</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(field.revenue)}</p>
                  <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularFields;