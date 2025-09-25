import React, { useState } from 'react';
import { 
  DollarSign, 
  ArrowDownCircle, 
  Waves, 
  Coins, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  BarChart3,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';

interface WithdrawalData {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  method: string;
}

interface WithdrawalDashboardProps {
  withdrawableAmount: number;
  withdrawalHistory: WithdrawalData[];
  onWithdrawRequest: (amount: number) => void;
  loading?: boolean;
}

const WithdrawalDashboard: React.FC<WithdrawalDashboardProps> = ({ 
  withdrawableAmount, 
  withdrawalHistory,
  onWithdrawRequest,
  loading = false
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const totalPages = Math.ceil(withdrawalHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = withdrawalHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatInputValue = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue) || 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWithdrawAmount(value);
    setError('');
  };

  const setQuickAmount = (percentage: number) => {
    const quickAmount = Math.floor(withdrawableAmount * percentage);
    setWithdrawAmount(quickAmount.toString());
    setError('');
  };

  const handleWithdraw = () => {
    const withdrawValue = parseInt(withdrawAmount.replace(/\D/g, ''));
    
    if (!withdrawValue || withdrawValue <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    if (withdrawValue > withdrawableAmount) {
      setError('Số tiền rút vượt quá số dư khả dụng');
      return;
    }
    
    if (withdrawValue < 50000) {
      setError('Số tiền rút tối thiểu là 50,000 VND');
      return;
    }
    
    setError('');
    onWithdrawRequest(withdrawValue);
  };

  // Calculate statistics
  const completedWithdrawals = withdrawalHistory.filter(w => w.status === 'completed');
  const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const avgWithdrawal = completedWithdrawals.length > 0 ? totalWithdrawn / completedWithdrawals.length : 0;
  const thisMonthWithdrawals = withdrawalHistory.filter(w => {
    const withdrawalDate = new Date(w.date);
    const now = new Date();
    return withdrawalDate.getMonth() === now.getMonth() && withdrawalDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  // Calculate activity gauge percentage (0-100)
  const maxMonthlyActivity = 10000000; // 10M VND as max reference
  const activityPercentage = Math.min((thisMonthTotal / maxMonthlyActivity) * 100, 100);

  // Calculate tank fill percentage
  const calculateFillPercentage = (amount: number) => {
    if (amount <= 0) return 0;
    
    if (amount < 1000000) {
      return Math.min((amount / 1000000) * 30, 30);
    } else if (amount < 10000000) {
      return 30 + Math.min(((amount - 1000000) / 9000000) * 40, 40);
    } else {
      return 70 + Math.min(((amount - 10000000) / 90000000) * 25, 25);
    }
  };
  
  const fillPercentage = calculateFillPercentage(withdrawableAmount);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-900';
      case 'processing':
        return 'text-blue-400 bg-blue-900';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900';
      case 'failed':
        return 'text-red-400 bg-red-900';
      default:
        return 'text-gray-400 bg-gray-900';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      
      {/* Left Side - Withdrawal Statistics */}
      <div className="relative">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-600 rounded-3xl blur-lg opacity-30 scale-105"></div> */}
        
        
        {/* Main container */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-600 h-full">
          
          {/* Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Thống Kê Rút Tiền</h3>
            </div>
            <p className="text-slate-400 text-sm">Hoạt động rút tiền tháng này</p>
          </div>

          {/* Withdrawal History Table */}
          <div className="bg-slate-700 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 border border-slate-500 flex-1">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h4 className="text-lg font-bold text-white">Lịch Sử Rút Tiền</h4>
            </div>
            
            <div className="flex flex-col h-full">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left text-slate-400 font-medium pb-3">Ngày</th>
                      <th className="text-right text-slate-400 font-medium pb-3">Số tiền</th>
                      <th className="text-center text-slate-400 font-medium pb-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render current items */}
                    {currentItems.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-slate-800 hover:bg-opacity-50 transition-colors">
                        <td className="py-4 text-slate-300">
                          {new Date(withdrawal.date).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-4 text-right text-white font-medium">
                          {formatCurrency(withdrawal.amount)}
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            {getStatusIcon(withdrawal.status)}
                            <span className={`text-xs font-medium ${
                              withdrawal.status === 'completed' ? 'text-green-400' :
                              withdrawal.status === 'processing' ? 'text-blue-400' :
                              withdrawal.status === 'pending' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {withdrawal.status === 'completed' ? 'Hoàn thành' :
                               withdrawal.status === 'processing' ? 'Đang xử lý' :
                               withdrawal.status === 'pending' ? 'Chờ duyệt' : 'Thất bại'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Fill empty rows to maintain consistent height */}
                    {withdrawalHistory.length > 0 && currentItems.length < itemsPerPage && 
                      [...Array(itemsPerPage - currentItems.length)].map((_, i) => (
                        <tr key={`empty-${i}`} className="opacity-0 pointer-events-none">
                          <td className="py-4 text-slate-300">01/01/2024</td>
                          <td className="py-4 text-right text-white font-medium">0 ₫</td>
                          <td className="py-4 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <div className="w-4 h-4"></div>
                              <span className="text-xs font-medium">Placeholder</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                
                {withdrawalHistory.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Chưa có giao dịch nào</p>
                    <p className="text-sm">Lịch sử rút tiền sẽ hiển thị tại đây</p>
                  </div>
                )}
              </div>

              {/* Pagination - always visible when there's data */}
              {withdrawalHistory.length > 0 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-600">
                  <div className="text-sm text-slate-400">
                    Hiển thị {startIndex + 1}-{Math.min(endIndex, withdrawalHistory.length)} / {withdrawalHistory.length}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex space-x-1">
                      {totalPages === 1 ? (
                        <button
                          className="px-3 py-2 text-sm rounded-lg bg-green-600 text-white cursor-default"
                        >
                          1
                        </button>
                      ) : (
                        [...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-green-600 text-white'
                                  : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })
                      )}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Status */}
          <div className="text-center mt-4">
            <div className="flex items-center justify-center space-x-2">
              <Activity className={`w-4 h-4 ${activityPercentage > 50 ? 'text-green-400' : activityPercentage > 20 ? 'text-yellow-400' : 'text-slate-500'}`} />
              <div className={`w-2 h-2 rounded-full animate-pulse ${activityPercentage > 50 ? 'bg-green-400' : activityPercentage > 20 ? 'bg-yellow-400' : 'bg-slate-500'}`}></div>
              <span className="text-sm text-slate-400">
                {activityPercentage > 50 ? 'Hoạt động cao' : activityPercentage > 20 ? 'Hoạt động vừa' : 'Hoạt động thấp'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Money Tank */}
      <div className="relative">
        {/* Background glow : <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl blur-lg opacity-30 scale-105"></div>*/}
        
        {/* Main container */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-600 h-full">
          
          {/* Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Bể Chứa Tiền</h3>
            </div>
            <p className="text-slate-400 text-sm">Số dư khả dụng</p>
          </div>

          {/* Money Container/Tank */}
          <div className="relative mb-8">
            {/* Tank body */}
            <div className="relative w-full h-48 bg-gradient-to-b from-slate-700 to-slate-800 rounded-2xl border-4 border-slate-600 overflow-hidden shadow-inner">
              
              {/* Water/Money level */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 via-green-400 to-cyan-300 transition-all duration-1000 ease-out"
                style={{ height: `${fillPercentage}%` }}
              >
                {/* Animated waves effect */}
                <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-cyan-200 to-transparent rounded-full animate-pulse opacity-60"></div>
                  <Waves className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 text-cyan-100 animate-bounce" />
                </div>
                
                {/* Floating coins */}
                <div className="absolute inset-0 overflow-hidden">
                  <Coins className="absolute top-4 left-4 w-8 h-8 text-yellow-300 animate-pulse" />
                  <Coins className="absolute top-8 right-6 w-6 h-6 text-yellow-400 animate-pulse delay-300" />
                  <Coins className="absolute top-12 left-1/2 w-7 h-7 text-yellow-200 animate-pulse delay-700" />
                  <DollarSign className="absolute top-16 right-4 w-9 h-9 text-green-200 animate-bounce delay-500" />
                  <DollarSign className="absolute top-20 left-8 w-5 h-5 text-green-300 animate-bounce delay-1000" />
                </div>
                
                {/* Sparkle effects */}
                <div className="absolute inset-0">
                  <div className="absolute top-6 right-8 w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <div className="absolute top-10 left-6 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-500"></div>
                  <div className="absolute top-14 right-12 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-ping delay-1000"></div>
                </div>
              </div>
              
              {/* Tank measurement lines */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-3 h-px bg-slate-500"></div>
                    <div className="w-1 h-px bg-slate-400 ml-1"></div>
                  </div>
                ))}
              </div>
              
              {/* Amount display inside tank */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-black bg-opacity-40 rounded-xl px-4 py-2 backdrop-blur-sm border border-white border-opacity-20">
                  <p className="text-2xl font-bold text-white">{formatCurrency(withdrawableAmount)}</p>
                  <p className="text-xs text-cyan-200 mt-1">Khả dụng</p>
                </div>
              </div>
            </div>
            
            {/* Tank stand/base */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full shadow-lg"></div>
            
            {/* Pipe/Valve at bottom */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-6 h-8 bg-gradient-to-b from-slate-600 to-slate-700 rounded-b-md border-2 border-slate-500"></div>
              <div className="w-4 h-2 bg-slate-700 mx-auto rounded-full"></div>
            </div>
          </div>

          {/* Withdraw Form */}
          <div className="mb-8">
            <div className="bg-slate-700 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 border border-slate-500">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Nhập số tiền muốn rút</h3>
              </div>
              
              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <input
                    type="text"
                    value={withdrawAmount ? formatInputValue(withdrawAmount) : ''}
                    onChange={handleInputChange}
                    placeholder="Nhập số tiền rút..."
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[0.25, 0.5, 0.75, 1].map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() => setQuickAmount(percentage)}
                      disabled={loading || withdrawableAmount <= 0}
                      className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {percentage === 1 ? 'Tất cả' : `${percentage * 100}%`}
                    </button>
                  ))}
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="bg-red-900 bg-opacity-70 border border-red-600 rounded-lg p-2">
                    <div className="flex items-center justify-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-300" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Withdraw Button */}
          <div className="flex justify-center">
            <button
              onClick={handleWithdraw}
              disabled={loading || !withdrawAmount || withdrawableAmount <= 0}
              className={`relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                loading || !withdrawAmount || withdrawableAmount <= 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/30 hover:shadow-emerald-500/50'
              }`}
            >
              <ArrowDownCircle className={`w-6 h-6 ${loading ? 'animate-spin' : 'animate-bounce'}`} />
              <span>{loading ? 'Đang rút tiền...' : 'Xác nhận rút tiền'}</span>
              
              {!loading && withdrawAmount && withdrawableAmount > 0 && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
          
          {/* Status indicator */}
          <div className="text-center mt-4">
            {withdrawableAmount > 0 ? (
              <div className="flex items-center justify-center space-x-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Sẵn sàng để rút</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-slate-500">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span className="text-sm">Chưa có tiền khả dụng</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.7);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 1);
        }
      `}</style>
    </div>
  );
};

export default WithdrawalDashboard;