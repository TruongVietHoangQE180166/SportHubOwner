import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { fieldService } from '../../services/fieldService';
import { StatisticalResponse, CashFlowDailyResponse } from '../../types';

interface RevenueChartProps {
  userId: string;
  cashFlowId: string;
  formatCurrency: (amount: number) => string;
}

interface ChartDataPoint {
  name: string;
  revenue: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ 
  userId,
  cashFlowId,
  formatCurrency
}) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [periodRevenue, setPeriodRevenue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Process data based on selected period
  useEffect(() => {
    let isCancelled = false; // Prevent state updates if component unmounts
    
    const processData = async () => {
      if (isCancelled) {
        return;
      }
      
      if (!userId || !cashFlowId) {
        return;
      }
      
      try {
        if (!isCancelled) {
          setLoading(true);
        }
        
        // Fetch data based on selected period
        let cashFlowDataResponse: any;
        
        switch (period) {
          case 'daily':
            cashFlowDataResponse = await fieldService.getCashFlowUserBy7Day(cashFlowId, 7);
            break;
          case 'weekly':
            cashFlowDataResponse = await fieldService.getCashFlowUserBy30Day(cashFlowId, 30);
            break;
          case 'monthly':
            cashFlowDataResponse = await fieldService.getCashFlowUserBy90Day(cashFlowId, 90);
            break;
          default:
            cashFlowDataResponse = await fieldService.getCashFlowUserBy7Day(cashFlowId, 7);
        }
        
        if (isCancelled) {
          return;
        }
        
        // Handle the response structure based on actual API response
        let statisticalData: StatisticalResponse[] | undefined;
        
        // Check if it's a full response object or just the data object
        if (cashFlowDataResponse && cashFlowDataResponse.data && cashFlowDataResponse.data.statisticalResponses) {
          // Full response structure
          statisticalData = cashFlowDataResponse.data.statisticalResponses;
        } else if (cashFlowDataResponse && cashFlowDataResponse.statisticalResponses) {
          // Direct data structure
          statisticalData = cashFlowDataResponse.statisticalResponses;
        }
        
        if (!statisticalData) {
          if (!isCancelled) {
            setChartData([]);
            setPeriodRevenue(0);
          }
          return;
        }
        
        // Process statistical responses into chart data
        const revenueData: ChartDataPoint[] = [];
        let totalRevenue = 0;

        for (const stat of statisticalData) {
          const revenue = stat.amountForDay || 0;
          totalRevenue += revenue;
          
          // Format date for display
          // More robust date parsing to handle ISO date strings
          const date = new Date(stat.day + 'T00:00:00');
          const formattedDate = date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit' 
          });
          
          revenueData.push({
            name: formattedDate,
            revenue
          });
        }
        
        if (!isCancelled) {
          setChartData(revenueData);
          setPeriodRevenue(totalRevenue);
        }
      } catch (error) {
        if (!isCancelled) {
          setChartData([]);
          setPeriodRevenue(0);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    
    processData();
    
    return () => {
      isCancelled = true;
    };
  }, [period, userId, cashFlowId]);

  const handlePeriodChange = useCallback((newPeriod: 'daily' | 'weekly' | 'monthly') => {
    setPeriod(newPeriod);
  }, [period]);

  const getXAxisProps = useMemo(() => {
    if (period === 'daily') {
      return {
        dataKey: "name",
        tick: { fill: '#6b7280', fontSize: 12 }
      };
    } else if (period === 'weekly') {
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
      case 'daily': return '7 ngày';
      case 'weekly': return '30 ngày';
      case 'monthly': return '90 ngày';
      default: return '';
    }
  }, [period]);

  return (
    <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0">
        <h3 className="text-base lg:text-lg font-bold text-gray-900">Biểu Đồ Doanh Thu</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePeriodChange('daily')}
            className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              period === 'daily' 
                ? 'bg-black text-white shadow-md transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            7 ngày
          </button>
          <button
            onClick={() => handlePeriodChange('weekly')}
            className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              period === 'weekly' 
                ? 'bg-black text-white shadow-md transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            30 ngày
          </button>
          <button
            onClick={() => handlePeriodChange('monthly')}
            className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              period === 'monthly' 
                ? 'bg-black text-white shadow-md transform scale-105' 
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
          <div className="text-gray-400 text-sm">Dữ liệu doanh thu sẽ hiển thị ở đây</div>
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
                formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']}
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
                dataKey="revenue" 
                name="Doanh thu" 
                stroke="#10b981" 
                activeDot={{ r: 8, fill: '#10b981', stroke: '#ffffff', strokeWidth: 3 }} 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, stroke: '#ffffff', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Period Revenue Card - Display only the selected period card */}
      <div className="mt-6">
        {period === 'daily' && (
          <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
            <p className="text-sm font-medium mb-1">Doanh thu 7 ngày</p>
            <p className="text-xl font-bold">{formatCurrency(periodRevenue)}</p>
          </div>
        )}
        {period === 'weekly' && (
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
            <p className="text-sm font-medium mb-1">Doanh thu 30 ngày</p>
            <p className="text-xl font-bold">{formatCurrency(periodRevenue)}</p>
          </div>
        )}
        {period === 'monthly' && (
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
            <p className="text-sm font-medium mb-1">Doanh thu 90 ngày</p>
            <p className="text-xl font-bold">{formatCurrency(periodRevenue)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;