import React from 'react';
import { Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Analytics } from '../../types';

interface PeakHoursProps {
  analytics: Analytics;
}

const PeakHours: React.FC<PeakHoursProps> = ({ analytics }) => {
  // Colors for pie chart segments - green variants
  const BASE_COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#044f3d', '#033f31'];
  
  // Function to format hour as time range
  const formatHourRange = (hour: string) => {
    const startHour = parseInt(hour.split(':')[0]);
    const endHour = startHour + 1;
    return `${hour}-${endHour.toString().padStart(2, '0')}:00`;
  };

  // Sort peak hours by bookings
  const sortedHours = [...analytics.peakHours].sort((a, b) => b.bookings - a.bookings);
  
  // Use all available hours instead of limiting to top 3
  const allHours = sortedHours;
  
  // Dynamically assign colors based on number of slots
  const getColors = () => {
    if (allHours.length <= BASE_COLORS.length) {
      return BASE_COLORS.slice(0, allHours.length);
    }
    // If we have more hours than colors, repeat the color pattern
    const colors = [];
    for (let i = 0; i < allHours.length; i++) {
      colors.push(BASE_COLORS[i % BASE_COLORS.length]);
    }
    return colors;
  };
  
  const COLORS = getColors();

  // Prepare data for pie chart
  const pieData = allHours.map((hour, index) => ({
    name: formatHourRange(hour.hour),
    value: hour.bookings,
    color: COLORS[index]
  }));

  const renderCustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { name: string; value: number } }[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-black">{data.name}</p>
          <p className="text-sm font-medium text-black">{data.value} đặt sân</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number }) => {
    // Check if required values are present
    if (cx === undefined || cy === undefined || midAngle === undefined || 
        innerRadius === undefined || outerRadius === undefined || percent === undefined) {
      return null;
    }
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Calculate grid columns based on number of hours (responsive)
  const getGridClass = () => {
    if (allHours.length <= 2) return "grid grid-cols-1 sm:grid-cols-2 gap-4";
    if (allHours.length === 3) return "grid grid-cols-1 sm:grid-cols-3 gap-4";
    return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base lg:text-lg font-bold text-gray-900">Giờ Cao Điểm</h3>
        <div className="p-2 rounded-lg">
          <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
        </div>
      </div>
      
      {/* Pie Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary - Dynamically adjust based on number of time slots */}
      <div className={getGridClass()}>
        {allHours.map((hour, index) => (
          <div 
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black text-sm">{formatHourRange(hour.hour)}</p>
                <p className="text-xs text-gray-600">{hour.bookings} đặt sân</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeakHours;