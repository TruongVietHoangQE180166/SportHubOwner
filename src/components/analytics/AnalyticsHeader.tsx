import React from "react";
import { Download } from "lucide-react";

interface AnalyticsHeaderProps {
  onExportReport: () => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  onExportReport,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Thống Kê & Phân Tích
        </h1>
        <p className="text-gray-600">
          Theo dõi hiệu suất kinh doanh và xu hướng khách hàng
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onExportReport}
          className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
