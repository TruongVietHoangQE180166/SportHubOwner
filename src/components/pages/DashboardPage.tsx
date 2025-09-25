'use client'
import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useFieldStore } from '../../stores/fieldStore';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';

// Import các component từ Analytics
import PeakHours from '../analytics/PeakHours';
import RevenueChart from '../dashboard/RevenueChart';

// Import các component từ Dashboard
import WelcomeHeader from '../dashboard/WelcomeHeader';
import StatCard from '../dashboard/StatCard';
import PopularFields from '../dashboard/PopularFields';
// Import component mới thay cho WithdrawableAmount cũ
import WithdrawalDashboard from '../dashboard/WithdrawableAmount';
import {
  DollarSign,
  Calendar,
  MapPin,
  TrendingUp as TrendingUpIcon,
  Users
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { analytics, loading: analyticsLoading, fetchAnalytics } = useAnalyticsStore();
  const { fields, loading: fieldsLoading, fetchFields } = useFieldStore();
  const { profile, loading: profileLoading, fetchProfile } = useUserStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAnalytics();
    if (user?.id) {
      fetchFields(user.id);
    }
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [fetchAnalytics, fetchFields, fetchProfile, user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Mock data for withdrawable amount - có thể lấy từ store sau
  const withdrawableAmount = 5000000; // 5,000,000 VND

  // Mock data for withdrawal history - có thể lấy từ store sau
  const withdrawalHistory = [
  {
    id: '1',
    date: '2025-09-20',
    amount: 3000000,
    status: 'completed' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '2',
    date: '2025-09-15',
    amount: 2500000,
    status: 'processing' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '3',
    date: '2025-09-10',
    amount: 1500000,
    status: 'pending' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '4',
    date: '2025-09-08',
    amount: 2000000,
    status: 'completed' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '5',
    date: '2025-09-05',
    amount: 1000000,
    status: 'failed' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '6',
    date: '2025-09-02',
    amount: 3500000,
    status: 'completed' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '7',
    date: '2025-08-28',
    amount: 2200000,
    status: 'pending' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '8',
    date: '2025-08-25',
    amount: 2700000,
    status: 'processing' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '9',
    date: '2025-08-20',
    amount: 1800000,
    status: 'failed' as const,
    method: 'Chuyển khoản ngân hàng',
  },
  {
    id: '10',
    date: '2025-08-15',
    amount: 4000000,
    status: 'completed' as const,
    method: 'Chuyển khoản ngân hàng',
  },
];


  const handleWithdrawRequest = (amount: number) => {
    // TODO: Implement actual withdrawal logic with your store/API
    console.log('Withdrawal request:', amount);
    alert(`Yêu cầu rút ${formatCurrency(amount)} đã được gửi!`);
    
    // Here you would typically:
    // 1. Call your withdrawal API
    // 2. Update the withdrawal history store
    // 3. Show loading state
    // 4. Handle success/error responses
  };

  if (analyticsLoading || fieldsLoading || profileLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          <span className="ml-2 text-slate-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!analytics || !fields || !profile) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️ Lỗi tải dữ liệu</div>
          <div className="text-slate-600">Không thể tải dữ liệu dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Welcome Header */}
      <WelcomeHeader 
        userName={profile.fullName || 'Người dùng'} 
        businessName={profile.nickName || profile.fullName || 'Doanh nghiệp'} 
      />

      {/* Withdrawal Dashboard - Thay thế WithdrawableAmount cũ */}
      <WithdrawalDashboard 
        withdrawableAmount={withdrawableAmount}
        withdrawalHistory={withdrawalHistory}
        onWithdrawRequest={handleWithdrawRequest}
      />

      {/* Stats Grid - 6 cards với 6 màu khác nhau */}
      <div className="grid grid-cols-1 gap-6">
        {/* Revenue-related cards (top row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Doanh thu hôm nay"
            value={formatCurrency(analytics.dailyRevenue)}
            icon={<DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />}
            trend={{
              value: "+12.5%",
              label: "so với hôm qua",
              positive: true,
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
            title="Tổng Doanh Thu"
            value={formatCurrency(analytics.totalRevenue)}
            icon={<DollarSign className="w-6 h-6" />}
            trend={{
              value: "+15.2%",
              label: "so với tháng trước",
              positive: true
            }}
            colorVariant="gray"
          />
        </div>
        
        {/* Field-related cards (bottom row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Đặt sân hôm nay"
            value={analytics.dailyBookings}
            icon={<Calendar className="w-5 h-5 lg:w-6 lg:h-6" />}
            trend={{
              value: "+8.2%",
              label: "so với hôm qua",
              positive: true,
            }}
            colorVariant="white"
          />

          <StatCard
            title="Tổng số sân"
            value={fields.length}
            icon={<MapPin className="w-5 h-5 lg:w-6 lg:h-6" />}
            additionalInfo={
              <span className="text-xs lg:text-sm text-emerald-100 font-medium">
                {fields.filter((f) => f.isActive).length} hoạt động
              </span>
            }
            useCheckCircle={true}
            colorVariant="lightGreen"
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
            colorVariant="darkGray"
          />
        </div>
      </div>

      {/* Popular Fields */}
      <div className="grid grid-cols-1 gap-6">
        <PopularFields
          popularFields={analytics.popularFields}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Analytics Section - Peak Hours */}
      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <PeakHours analytics={analytics} />
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="grid grid-cols-1 gap-6">
        <RevenueChart
          dailyRevenue={analytics.dailyRevenue}
          monthlyRevenue={analytics.monthlyRevenue}
          totalRevenue={analytics.totalRevenue}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default DashboardPage;