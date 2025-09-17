import React from 'react';
import { DollarSign, Users, Calendar, Star } from 'lucide-react';
import { Analytics, Venue as Field } from '../../types';

interface KeyMetricsProps {
  analytics: Analytics;
  fields: Field[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const KeyMetrics: React.FC<KeyMetricsProps> = ({ analytics, fields }) => {
  const averageRating = fields.length > 0 
    ? (fields.reduce((sum, field) => sum + field.rating, 0) / fields.length).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-black">{formatCurrency(analytics.averageBookingValue)}</p>
          <p className="text-sm text-black">Giá trị trung bình</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-black">{formatPercentage(analytics.customerRetention)}</p>
          <p className="text-sm text-black">Tỷ lệ giữ chân KH</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-black">{formatPercentage(analytics.cancellationRate)}</p>
          <p className="text-sm text-black">Tỷ lệ hủy sân</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-black">{averageRating}</p>
          <p className="text-sm text-black">Điểm đánh giá TB</p>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;