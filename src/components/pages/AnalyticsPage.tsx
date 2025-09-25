'use client';

import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import AnalyticsHeader from '../../components/analytics/AnalyticsHeader';
import RevenueCards from '../../components/analytics/RevenueCards';
import KeyMetrics from '../../components/analytics/KeyMetrics';
import PeakHours from '../analytics/PeakHours';
import RevenueChart from '../analytics/RevenueChart';
import FieldPerformance from '../analytics/FieldPerformance';

const AnalyticsPage: React.FC = () => {
  const { analytics, fetchAnalytics } = useAnalyticsStore();

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
      {/* Sửa cách truyền props cho RevenueChart */}
      <RevenueChart 
        dailyRevenue={analytics.dailyRevenue}
        monthlyRevenue={analytics.monthlyRevenue}
        totalRevenue={analytics.totalRevenue}
        formatCurrency={formatCurrency}
      />
      <FieldPerformance fields={[]} analytics={analytics} />
    </div>
  );
};

export default AnalyticsPage;