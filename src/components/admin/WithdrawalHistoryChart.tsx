import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Withdrawal } from '../../types/payment';

interface WithdrawalHistoryChartProps {
  withdrawals: Withdrawal[];
  formatCurrency: (amount: number) => string;
}

interface ChartDataPoint {
  name: string;
  amount: number;
}

const WithdrawalHistoryChart: React.FC<WithdrawalHistoryChartProps> = ({ 
  withdrawals,
  formatCurrency
}) => {
  const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('7days');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [periodTotal, setPeriodTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Helper function to generate date range
  const generateDateRange = (days: number): string[] => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      dates.push(formattedDate);
    }
    
    return dates;
  };

  // Process withdrawal data based on selected period
  useEffect(() => {
    const processData = async () => {
      setLoading(true);
      
      try {
        // Generate all dates for the selected period
        let dateRange: string[] = [];
        switch (period) {
          case '7days':
            dateRange = generateDateRange(7);
            break;
          case '30days':
            dateRange = generateDateRange(30);
            break;
          case '90days':
            dateRange = generateDateRange(90);
            break;
        }
        
        // Create a map with all dates initialized to 0
        const groupedWithdrawals: Record<string, number> = {};
        dateRange.forEach(date => {
          groupedWithdrawals[date] = 0;
        });
        
        // Filter withdrawals based on selected period
        const cutoffDate = new Date();
        switch (period) {
          case '7days':
            cutoffDate.setDate(cutoffDate.getDate() - 7);
            break;
          case '30days':
            cutoffDate.setDate(cutoffDate.getDate() - 30);
            break;
          case '90days':
            cutoffDate.setDate(cutoffDate.getDate() - 90);
            break;
        }
        
        const filteredWithdrawals = withdrawals.filter(w => {
          const withdrawalDate = new Date(w.createdDate);
          return withdrawalDate >= cutoffDate;
        });
        
        // Add actual withdrawal amounts
        filteredWithdrawals.forEach(withdrawal => {
          const date = new Date(withdrawal.createdDate);
          const dateKey = date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit' 
          });
          
          if (groupedWithdrawals.hasOwnProperty(dateKey)) {
            groupedWithdrawals[dateKey] += withdrawal.amount;
          }
        });
        
        // Convert to chart data format with all dates
        const chartDataPoints: ChartDataPoint[] = dateRange.map(date => ({
          name: date,
          amount: groupedWithdrawals[date] || 0
        }));
        
        setChartData(chartDataPoints);
        setPeriodTotal(chartDataPoints.reduce((sum, point) => sum + point.amount, 0));
      } catch (error) {
        setChartData([]);
        setPeriodTotal(0);
      } finally {
        setLoading(false);
      }
    };
    
    processData();
  }, [withdrawals, period]);

  const handlePeriodChange = useCallback((newPeriod: '7days' | '30days' | '90days') => {
    setPeriod(newPeriod);
  }, []);

  const getXAxisProps = useMemo(() => {
    if (period === '7days') {
      return {
        dataKey: "name",
        tick: { fill: '#6b7280', fontSize: 12 }
      };
    } else if (period === '30days') {
      return {
        dataKey: "name",
        tick: { fill: '#6b7280', fontSize: 12 },
        interval: 4 
      };
    } else {
      return {
        dataKey: "name",
        tick: { fill: '#6b7280', fontSize: 12 },
        interval: 14 
      };
    }
  }, [period]);

  // Get label for current period
  const getPeriodLabel = useMemo(() => {
    switch (period) {
      case '7days': return '7 ngày';
      case '30days': return '30 ngày';
      case '90days': return '90 ngày';
      default: return '';
    }
  }, [period]);

  return (
    <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0">
        <h3 className="text-base lg:text-lg font-bold text-gray-900">Lịch Sử Rút Tiền</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePeriodChange('7days')}
            className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              period === '7days' 
                ? 'bg-green-400 text-white shadow-md transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            7 ngày
          </button>
          <button
            onClick={() => handlePeriodChange('30days')}
            className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              period === '30days' 
                ? 'bg-green-400 text-white shadow-md transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            30 ngày
          </button>
          <button
            onClick={() => handlePeriodChange('90days')}
            className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              period === '90days' 
                ? 'bg-green-400 text-white shadow-md transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            90 ngày
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-gray-500 text-lg mb-2">Không có dữ liệu</div>
          <div className="text-gray-400 text-sm">Dữ liệu rút tiền sẽ hiển thị ở đây</div>
        </div>
      ) : (
        <div className="h-80 bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis {...getXAxisProps} />
              <YAxis 
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`;
                  } else {
                    return value.toString();
                  }
                }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Số tiền']}
                labelStyle={{ color: '#111827', fontWeight: 600 }}
                contentStyle={{ 
                  borderRadius: '0.5rem',
                  border: '2px solid #9ca3af',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  backgroundColor: '#ffffff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                name="Số tiền rút" 
                stroke="#ef4444" 
                activeDot={{ r: 8, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 3 }} 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, stroke: '#ffffff', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Period Total Card */}
      <div className="mt-6">
        {period === '7days' && (
          <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
            <p className="text-sm font-medium mb-1">Tổng tiền rút 7 ngày</p>
            <p className="text-xl font-bold">{formatCurrency(periodTotal)}</p>
          </div>
        )}
        {period === '30days' && (
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
            <p className="text-sm font-medium mb-1">Tổng tiền rút 30 ngày</p>
            <p className="text-xl font-bold">{formatCurrency(periodTotal)}</p>
          </div>
        )}
        {period === '90days' && (
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
            <p className="text-sm font-medium mb-1">Tổng tiền rút 90 ngày</p>
            <p className="text-xl font-bold">{formatCurrency(periodTotal)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistoryChart;