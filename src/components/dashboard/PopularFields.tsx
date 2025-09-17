import React from 'react';
import { TrendingUp } from 'lucide-react';

interface PopularField {
  fieldName: string;
  bookings: number;
  revenue: number;
}

interface PopularFieldsProps {
  popularFields: PopularField[];
  formatCurrency: (amount: number) => string;
}

const PopularFields: React.FC<PopularFieldsProps> = ({ popularFields, formatCurrency }) => {
  return (
    <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-base lg:text-lg font-bold text-gray-900">Sân Phổ Biến</h3>
        <div className="p-2 rounded-lg">
          <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
        </div>
      </div>
      <div className="space-y-3 lg:space-y-4">
        {popularFields.map((field, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border-l-4 border-green-500"
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm lg:text-base flex-shrink-0 ${
                index === 0 ? 'bg-gradient-to-br from-gray-500 to-gray-600' :
                index === 1 ? 'bg-gradient-to-br from-gray-600 to-gray-700' :
                index === 2 ? 'bg-gradient-to-br from-gray-700 to-gray-800' :
                'bg-gradient-to-br from-black to-gray-900'
              }`}>
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm lg:text-base truncate">{field.fieldName}</p>
                <p className="text-xs lg:text-sm text-gray-600 font-medium">{field.bookings} lượt đặt</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="font-bold text-gray-900 text-sm lg:text-base">{formatCurrency(field.revenue)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularFields;