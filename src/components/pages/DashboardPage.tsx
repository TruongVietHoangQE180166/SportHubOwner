'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useFieldStore } from '../../stores/fieldStore';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { fieldService } from '../../services/fieldService';

// Import các component từ Analytics
import PeakHours from '../analytics/PeakHours';
import RevenueChart from '../dashboard/RevenueChart';

// Import các component từ Dashboard
import WelcomeHeader from '../dashboard/WelcomeHeader';
import StatCard from '../dashboard/StatCard';
import PopularFields from '../dashboard/PopularFields';
// Import component mới thay cho WithdrawableAmount cũ
import WithdrawalDashboard from '../dashboard/WithdrawableAmount';
import LoadingSpinner from '../ui/LoadingSpinner';
import {
  DollarSign,
  Calendar,
  MapPin,
  TrendingUp as TrendingUpIcon,
  Users
} from 'lucide-react';
import { CashFlow, Withdrawal, StatisticalResponse } from '../../types';

// Define the WithdrawalData interface to match the component's expectations
interface WithdrawalData {
  id: string;
  date: string;
  amount: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  method: string;
}

// Define the DashboardData interface
interface DashboardData {
  times: Record<string, number>;
  totalBookingToday: number;
  totalBookings: number;
  topFields: {
    id: string;
    createdDate: string;
    smallFiledName: string;
    description: string;
    capacity: string;
    booked: boolean;
    available: boolean;
  }[];
}

const DashboardPage: React.FC = () => {
  const { analytics, loading: analyticsLoading, fetchAnalytics } = useAnalyticsStore();
  const { fields, loading: fieldsLoading, fetchFields, getCashFlowByUser, getWithdrawalHistoryByUser } = useFieldStore();
  const { profile, loading: profileLoading, fetchProfile } = useUserStore();
  const { user } = useAuthStore();
  const [cashFlowData, setCashFlowData] = useState<CashFlow[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalData[]>([]);
  const [withdrawableAmount, setWithdrawableAmount] = useState<number>(0);
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [cashFlowLoading, setCashFlowLoading] = useState<boolean>(false);
  const [dailyRevenue, setDailyRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
  const lastFetchedUserId = useRef<string | null>(null);

  const fetchCashFlowData = useCallback(async (userId: string) => {
    setCashFlowLoading(true);
    try {
      const cashFlow = await getCashFlowByUser(userId);
      setCashFlowData(cashFlow);
      
      // Calculate withdrawable amount and balance from cash flow data
      if (cashFlow.length > 0) {
        const latestCashFlow = cashFlow[0]; // Assuming the first item is the most recent
        setWithdrawableAmount(latestCashFlow.amountAvailable || 0);
        setAccountBalance(latestCashFlow.balance || 0);
      }
    } catch (error) {
      console.error('❌ Error fetching cash flow data:', error);
    } finally {
      setCashFlowLoading(false);
    }
  }, [getCashFlowByUser]);

  const fetchRevenueData = useCallback(async (cashFlowId: string) => {
    try {
      // Fetch daily revenue (1 day data)
      const dailyDataResponse: any = await fieldService.getCashFlowUserBy1Day(cashFlowId, 1);
      if (dailyDataResponse && dailyDataResponse.data && dailyDataResponse.data.statisticalResponses && dailyDataResponse.data.statisticalResponses.length > 0) {
        // For 1 day, we take the amountForDay of the most recent day (last entry)
        const latestDayData = dailyDataResponse.data.statisticalResponses[dailyDataResponse.data.statisticalResponses.length - 1];
        const todayRevenue = latestDayData.amountForDay || 0;
        setDailyRevenue(todayRevenue);
      } else if (dailyDataResponse && dailyDataResponse.statisticalResponses && dailyDataResponse.statisticalResponses.length > 0) {
        // Alternative structure where response is directly the data object
        const latestDayData = dailyDataResponse.statisticalResponses[dailyDataResponse.statisticalResponses.length - 1];
        const todayRevenue = latestDayData.amountForDay || 0;
        setDailyRevenue(todayRevenue);
      } else {
        setDailyRevenue(0);
      }

      // Fetch monthly revenue (30 day data)
      const monthlyDataResponse: any = await fieldService.getCashFlowUserBy30Day(cashFlowId, 30);
      if (monthlyDataResponse && monthlyDataResponse.data && monthlyDataResponse.data.statisticalResponses) {
        // For 30 days, we sum up all the amountForDay values
        const monthRevenue = monthlyDataResponse.data.statisticalResponses.reduce((sum: number, item: StatisticalResponse) => sum + (item.amountForDay || 0), 0);
        setMonthlyRevenue(monthRevenue);
      } else if (monthlyDataResponse && monthlyDataResponse.statisticalResponses) {
        // Alternative structure where response is directly the data object
        const monthRevenue = monthlyDataResponse.statisticalResponses.reduce((sum: number, item: StatisticalResponse) => sum + (item.amountForDay || 0), 0);
        setMonthlyRevenue(monthRevenue);
      } else {
        setMonthlyRevenue(0);
      }
    } catch (error) {
      console.error('❌ Error fetching revenue data:', error);
      // Fallback to analytics data if API fails
      if (analytics) {
        setDailyRevenue(analytics.dailyRevenue);
        setMonthlyRevenue(analytics.monthlyRevenue);
      }
    }
  }, [analytics]);

  const fetchWithdrawalHistory = useCallback(async (userId: string) => {
    try {
      const withdrawals = await getWithdrawalHistoryByUser(userId);
      
      // Map the Withdrawal objects to WithdrawalData objects
      const mappedWithdrawals: WithdrawalData[] = withdrawals.map(withdrawal => {
        // Ensure status is one of the expected values
        let status: 'APPROVED' | 'PENDING' | 'REJECTED' = 'PENDING';
        switch (withdrawal.status.toUpperCase()) {
          case 'APPROVED':
            status = 'APPROVED';
            break;
          case 'REJECTED':
            status = 'REJECTED';
            break;
          case 'PENDING':
          default:
            status = 'PENDING';
            break;
        }
        
        return {
          id: withdrawal.id,
          date: withdrawal.createdDate,
          amount: withdrawal.amount,
          status: status,
          method: 'Chuyển khoản ngân hàng' // This could be expanded if the API provides more details
        };
      });
      
      setWithdrawalHistory(mappedWithdrawals);
    } catch (error) {
      console.error('❌ Error fetching withdrawal history:', error);
      // Keep using mock data as fallback
      const mockWithdrawalHistory: WithdrawalData[] = [
        {
          id: '1',
          date: '2025-09-20',
          amount: 3000000,
          status: 'APPROVED',
          method: 'Chuyển khoản ngân hàng',
        },
        {
          id: '2',
          date: '2025-09-15',
          amount: 2500000,
          status: 'PENDING',
          method: 'Chuyển khoản ngân hàng',
        },
        {
          id: '3',
          date: '2025-09-10',
          amount: 1500000,
          status: 'PENDING',
          method: 'Chuyển khoản ngân hàng',
        },
        {
          id: '4',
          date: '2025-09-05',
          amount: 2000000,
          status: 'REJECTED',
          method: 'Chuyển khoản ngân hàng',
        }
      ];
      setWithdrawalHistory(mockWithdrawalHistory);
    }
  }, [getWithdrawalHistoryByUser]);

  const fetchDashboardData = useCallback(async (fieldId: string) => {
    setDashboardLoading(true);
    try {
      const response = await fieldService.getDashboardData(fieldId);
      setDashboardData(response.data);
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    // Prevent infinite loops by checking if we've already fetched data for this user
    if (user?.id && lastFetchedUserId.current !== user.id) {
      lastFetchedUserId.current = user.id;
      
      fetchAnalytics();
      fetchFields(user.id);
      fetchProfile(user.id);
      fetchCashFlowData(user.id);
      fetchWithdrawalHistory(user.id);
    } else if (!user?.id) {
      // Reset the ref when there's no user
      lastFetchedUserId.current = null;
    }
  }, [fetchAnalytics, fetchFields, fetchProfile, user, fetchCashFlowData, fetchWithdrawalHistory]);

  // Fetch dashboard data when fields change
  useEffect(() => {
    if (fields.length > 0 && fields[0].id) {
      fetchDashboardData(fields[0].id);
    }
  }, [fields, fetchDashboardData]);

  // Fetch revenue data when cashFlowData changes
  useEffect(() => {
    if (cashFlowData.length > 0 && cashFlowData[0].id) {
      fetchRevenueData(cashFlowData[0].id);
    }
  }, [cashFlowData, fetchRevenueData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const refreshDashboardData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Refresh all relevant data
      await Promise.all([
        fetchCashFlowData(user.id),
        fetchWithdrawalHistory(user.id),
        fetchAnalytics(),
      ]);
    } catch (error) {
      console.error('❌ Error refreshing dashboard data:', error);
    }
  }, [user?.id, fetchCashFlowData, fetchWithdrawalHistory, fetchAnalytics]);

  const handleWithdrawRequest = (amount: number) => {
    // Show success message
    alert(`Yêu cầu rút ${formatCurrency(amount)} đã được gửi!`);
    
    // Refresh data to update balance and withdrawal history
    refreshDashboardData();
  };

  if (analyticsLoading || fieldsLoading || profileLoading || cashFlowLoading || dashboardLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" message="Đang tải dữ liệu..." />
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

  // Get the cashFlowId from cashFlowData
  const cashFlowId = cashFlowData.length > 0 ? cashFlowData[0].id : '';

  // Use dashboard data if available, otherwise fallback to analytics data
  // Transform peak hours data to match expected format and handle new time range format
  const peakHoursData = dashboardData?.times 
    ? Object.entries(dashboardData.times).map(([hourRange, bookings]) => {
        // Extract the start hour from the range (e.g., "18:00 - 19:00" -> "18:00")
        const hour = hourRange.split(' - ')[0];
        return {
          hour,
          bookings
        };
      })
    : analytics.peakHours;
    
  // Transform popular fields data to show description and capacity instead of bookings and revenue
  const popularFieldsData = dashboardData?.topFields
    ? dashboardData.topFields.map(field => ({
        fieldName: field.smallFiledName,
        // Using bookings field to store capacity info for display purposes
        bookings: parseInt(field.capacity) || 0,
        // Using revenue field to store a flag to indicate we want to show description
        revenue: field.description ? 1 : 0
      }))
    : analytics.popularFields;

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
        onRefreshData={refreshDashboardData}
      />

      {/* Stats Grid - Updated to use dashboard data where available - 3 rows with 3 cards each */}
      <div className="grid grid-cols-1 gap-6">
        {/* First row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Đặt sân hôm nay"
            value={dashboardData?.totalBookingToday ?? analytics.dailyBookings}
            icon={<Calendar className="w-5 h-5 lg:w-6 lg:h-6" />}
            trend={{
              value: "+8.2%",
              label: "so với hôm qua",
              positive: true,
            }}
            colorVariant="white"
          />

          <StatCard
            title="Tổng số đặt sân"
            value={dashboardData?.totalBookings ?? analytics.totalBookings}
            icon={<Users className="w-6 h-6" />}
            trend={{
              value: "+12.3%",
              label: "so với tháng trước",
              positive: true
            }}
            colorVariant="darkGray"
          />
          
          <StatCard
            title="Doanh thu hôm nay"
            value={formatCurrency(dailyRevenue)}
            icon={<DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />}
            trend={{
              value: "+12.5%",
              label: "so với hôm qua",
              positive: true,
            }}
            colorVariant="green"
          />
        </div>
        
        {/* Second row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Doanh Thu Tháng"
            value={formatCurrency(monthlyRevenue)}
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
            value={formatCurrency(accountBalance)}
            icon={<DollarSign className="w-6 h-6" />}
            trend={{
              value: "+15.2%",
              label: "so với tháng trước",
              positive: true
            }}
            colorVariant="gray"
          />
          
          <StatCard
            title="Tổng số sân"
            value={fields.reduce((total, field) => total + (field.smallFieldResponses?.length || 0), 0)}
            icon={<MapPin className="w-5 h-5 lg:w-6 lg:h-6" />}
            additionalInfo={
              <span className="text-xs lg:text-sm text-emerald-100 font-medium">
                {fields.filter((f) => f.isActive).length} sân lớn hoạt động
              </span>
            }
            useCheckCircle={true}
            colorVariant="lightGreen"
          />
        </div>

      </div>

      {/* Popular Fields - Updated to use dashboard data */}
      <div className="grid grid-cols-1 gap-6">
        <PopularFields
          popularFields={popularFieldsData}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Analytics Section - Peak Hours - Updated to use dashboard data */}
      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <PeakHours analytics={{ ...analytics, peakHours: peakHoursData }} />
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="grid grid-cols-1 gap-6">
        <RevenueChart
          userId={user?.id || ''}
          cashFlowId={cashFlowId}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default DashboardPage;