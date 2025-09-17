import React from 'react';

interface WelcomeHeaderProps {
  userName: string;
  businessName: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, businessName }) => {
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6"></div>
      </div>
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black mb-2 lg:mb-3">
            Chào mừng trở lại, <span className="text-green-400">{userName}</span>!
          </h1>
          <p className="text-gray-300 text-sm lg:text-base font-medium">
            Quản lý hiệu quả <span className="text-white font-bold">{businessName}</span>
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-sm text-gray-300 font-medium">Hôm nay</p>
            <p className="text-xl lg:text-2xl font-bold text-green-400">
              {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
    </div>
  );
};

export default WelcomeHeader;