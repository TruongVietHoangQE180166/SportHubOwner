'use client';

import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useAuthStore } from '../../stores/authStore';
import AnalyticsHeader from '../../components/analytics/AnalyticsHeader';
import RevenueCards from '../../components/analytics/RevenueCards';
import KeyMetrics from '../../components/analytics/KeyMetrics';
import PeakHours from '../analytics/PeakHours';
import RevenueChart from '../analytics/RevenueChart';
import FieldPerformance from '../analytics/FieldPerformance';

const AnalyticsPage: React.FC = () => {
  const { analytics, fetchAnalytics } = useAnalyticsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportReport = () => {
    console.log('Exporting report...');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!analytics) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AnalyticsHeader onExportReport={handleExportReport} />
      <RevenueCards analytics={analytics} />
      <KeyMetrics analytics={analytics} fields={[]} />
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <PeakHours analytics={analytics} />
      </div>
      {/* Pass userId prop to RevenueChart */}
      <RevenueChart 
        dailyRevenue={analytics.dailyRevenue}
        monthlyRevenue={analytics.monthlyRevenue}
        totalRevenue={analytics.totalRevenue}
        formatCurrency={formatCurrency}
        userId={user?.id || ''}
      />
      <FieldPerformance fields={[]} analytics={analytics} />
    </div>
  );
};

export default AnalyticsPage;