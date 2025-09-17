import React from 'react';
import { TrendingUp, CheckCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    label: string;
    positive?: boolean;
  };
  additionalInfo?: React.ReactNode;
  useCheckCircle?: boolean;
  colorVariant?: 'green' | 'white' | 'black' | 'gray';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  additionalInfo,
  useCheckCircle = false,
  colorVariant = 'white'
}) => {
  const colorClasses = {
    green: {
      card: 'bg-gradient-to-br from-green-600 to-green-700 border-green-800 shadow-lg shadow-green-600/25',
      title: 'text-green-50 font-semibold',
      value: 'text-white font-bold',
      icon: 'text-white',
      trendLabel: 'text-green-50 font-medium',
      iconBg: 'bg-white/20 backdrop-blur-sm',
      iconColor: 'text-white'
    },
    white: {
      card: 'bg-white border-gray-200 shadow-lg',
      title: 'text-gray-700 font-semibold',
      value: 'text-gray-900 font-bold',
      icon: 'text-gray-600',
      trendLabel: 'text-gray-600 font-medium',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-700'
    },
    black: {
      card: 'bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg shadow-black/25',
      title: 'text-gray-100 font-semibold',
      value: 'text-white font-bold',
      icon: 'text-gray-100',
      trendLabel: 'text-gray-200 font-medium',
      iconBg: 'bg-white/10 backdrop-blur-sm',
      iconColor: 'text-white'
    },
    gray: {
      card: 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500 shadow-lg',
      title: 'text-gray-900 font-semibold',
      value: 'text-gray-900 font-bold',
      icon: 'text-gray-900',
      trendLabel: 'text-gray-800 font-medium',
      iconBg: 'bg-white/80 backdrop-blur-sm',
      iconColor: 'text-gray-900'
    }
  };

  const currentColors = colorClasses[colorVariant];

  return (
    <div className={`${currentColors.card} rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-xs sm:text-sm ${currentColors.title} mb-1`}>{title}</p>
          <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${currentColors.value} truncate`}>{value}</p>
        </div>
        <div className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center flex-shrink-0 ml-3 ${currentColors.icon}`}>
          {icon}
        </div>
      </div>
            
      {(trend || additionalInfo) && (
        <div className="flex items-center mt-3 lg:mt-4 space-x-2">
          {useCheckCircle ? (
            <CheckCircle className={`w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0 ${
              colorVariant === 'green' ? 'text-green-100' :
              colorVariant === 'black' ? 'text-green-300' :
              colorVariant === 'gray' ? 'text-green-600' :
              'text-green-500'
            }`} />
          ) : (
            trend && (
              <>
                <TrendingUp className={`w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0 ${
                  trend.positive !== false 
                    ? (colorVariant === 'green' ? 'text-green-100' :
                       colorVariant === 'black' ? 'text-green-300' :
                       colorVariant === 'gray' ? 'text-green-600' :
                       'text-green-500')
                    : (colorVariant === 'green' ? 'text-red-100' :
                       colorVariant === 'black' ? 'text-red-300' :
                       colorVariant === 'gray' ? 'text-red-600' :
                       'text-red-500')
                }`} />
                <span className={`text-xs lg:text-sm font-medium ${
                  trend.positive !== false 
                    ? (colorVariant === 'green' ? 'text-green-100' :
                       colorVariant === 'black' ? 'text-green-300' :
                       colorVariant === 'gray' ? 'text-green-700' :
                       'text-green-600')
                    : (colorVariant === 'green' ? 'text-red-100' :
                       colorVariant === 'black' ? 'text-red-300' :
                       colorVariant === 'gray' ? 'text-red-700' :
                       'text-red-600')
                }`}>
                  {trend.value}
                </span>
              </>
            )
          )}
                    
          {trend && !useCheckCircle && (
            <span className={`text-xs lg:text-sm ${currentColors.trendLabel} truncate`}>{trend.label}</span>
          )}
                    
          {additionalInfo}
        </div>
      )}
    </div>
  );
};

export default StatCard;