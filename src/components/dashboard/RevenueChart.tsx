import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface RevenueChartProps {
  dailyRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  formatCurrency: (amount: number) => string;
}

const generateChartData = (period: 'daily' | 'weekly' | 'monthly') => {
  if (period === 'daily') {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        name: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: Math.floor(Math.random() * 3000000) + 1000000
      };
    });
  } else if (period === 'weekly') {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        name: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: Math.floor(Math.random() * 4000000) + 1500000
      };
    });
  } else {
    return Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      return {
        name: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: Math.floor(Math.random() * 5000000) + 2000000
      };
    });
  }
};

const RevenueChart: React.FC<RevenueChartProps> = ({ 
  dailyRevenue, 
  monthlyRevenue, 
  totalRevenue,
  formatCurrency
}) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState(generateChartData('daily'));

  const handlePeriodChange = (newPeriod: 'daily' | 'weekly' | 'monthly') => {
    setPeriod(newPeriod);
    setChartData(generateChartData(newPeriod));
  };

  // Calculate revenue based on period
  const calculatePeriodRevenue = () => {
    // In a real app, this would come from props or API
    // For now, we'll use the generated chart data
    const total = chartData.reduce((sum, item) => sum + item.revenue, 0);
    return total;
  };

  const periodRevenue = calculatePeriodRevenue();

  const getXAxisProps = () => {
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
  };

  // Get label for current period
  const getPeriodLabel = () => {
    switch (period) {
      case 'daily': return '7 ngày';
      case 'weekly': return '30 ngày';
      case 'monthly': return '90 ngày';
      default: return '';
    }
  };

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
      
      <div className="h-80 bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis {...getXAxisProps()} />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
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
      
      {/* Period Revenue Cards with More Gray Tones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg p-4 text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <p className="text-sm font-medium mb-1">Doanh thu 7 ngày</p>
          <p className="text-xl font-bold">{formatCurrency(
            period === 'daily' ? periodRevenue : 
            generateChartData('daily').reduce((sum, item) => sum + item.revenue, 0)
          )}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg p-4 text-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <p className="text-sm font-medium mb-1">Doanh thu 30 ngày</p>
          <p className="text-xl font-bold">{formatCurrency(
            period === 'weekly' ? periodRevenue : 
            generateChartData('weekly').reduce((sum, item) => sum + item.revenue, 0)
          )}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <p className="text-sm text-gray-100 font-medium mb-1">Doanh thu 90 ngày</p>
          <p className="text-xl font-bold">{formatCurrency(
            period === 'monthly' ? periodRevenue : 
            generateChartData('monthly').reduce((sum, item) => sum + item.revenue, 0)
          )}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;