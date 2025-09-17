import React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  formatTime: (timestamp: string) => string;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, formatTime }) => {
  return (
    <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-base lg:text-lg font-bold text-gray-900">Hoạt Động Gần Đây</h3>
        <div className="p-2 rounded-lg">
          <ActivityIcon className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
        </div>
      </div>
      <div className="space-y-3 lg:space-y-4">
        {activities.slice(0, 3).map((activity) => (
          <div 
            key={activity.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm lg:text-base truncate">{activity.title}</p>
                <p className="text-xs lg:text-sm text-gray-600 font-medium line-clamp-2">{activity.description}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-xs text-gray-400">{formatTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;