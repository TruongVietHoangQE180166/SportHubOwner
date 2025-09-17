import React from 'react';
import { DollarSign, Calendar, Users } from 'lucide-react';
import { Analytics } from '../../types';
import StatCard from '../dashboard/StatCard';

interface RevenueCardsProps {
  analytics: Analytics;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const RevenueCards: React.FC<RevenueCardsProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Tổng Doanh Thu"
        value={formatCurrency(analytics.totalRevenue)}
        icon={<DollarSign className="w-6 h-6" />}
        trend={{
          value: "+15.2%",
          label: "so với tháng trước",
          positive: true
        }}
        colorVariant="green"
      />

      <StatCard
        title="Doanh Thu Tháng"
        value={formatCurrency(analytics.monthlyRevenue)}
        icon={<Calendar className="w-6 h-6" />}
        trend={{
          value: "+8.7%",
          label: "so với tháng trước",
          positive: true
        }}
        colorVariant="black"
      />

      <StatCard
        title="Tổng Đặt Sân"
        value={analytics.totalBookings}
        icon={<Users className="w-6 h-6" />}
        trend={{
          value: "+12.3%",
          label: "so với tháng trước",
          positive: true
        }}
        colorVariant="gray"
      />
    </div>
  );
};

export default RevenueCards;