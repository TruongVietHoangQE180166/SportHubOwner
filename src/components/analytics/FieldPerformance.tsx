import React from 'react';
import { PieChart } from 'lucide-react';
import { Venue as Field } from '../../types';
import { Analytics } from '../../types';

interface FieldPerformanceProps {
  fields: Field[];
  analytics: Analytics;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const FieldPerformance: React.FC<FieldPerformanceProps> = ({ fields, analytics }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-bold text-gray-900">Hiệu Suất Từng Sân</h3>
        <div className="p-2 rounded-lg">
          <PieChart className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Sân</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng Đặt</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doanh Thu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.map((field) => {
              const fieldAnalytics = analytics.popularFields.find(f => f.fieldName === field.name);
              return (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900">{field.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{field.totalBookings}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(fieldAnalytics?.revenue || 0)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      field.isActive ? 'bg-green-500/90 text-white shadow-sm' : 'bg-red-500/90 text-white shadow-sm'
                    }`}>
                      {field.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FieldPerformance;