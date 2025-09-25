// components/admin/CashFlowDetail.tsx
'use client';

import React from 'react';
import { ChevronLeft, User, DollarSign, Clock, Mail, CreditCard, Calendar, TrendingUp } from 'lucide-react';

interface CashFlow {
  id: string;
  userId: string;
  email: string;
  role: string;
  amountAvailable: number;
  balance: number;
  createdDate: string;
  statisticalResponses: any | null;
}

interface CashFlowDetailProps {
  cashFlow: CashFlow;
  onBack: () => void;
}

const CashFlowDetail: React.FC<CashFlowDetailProps> = ({ cashFlow, onBack }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-black text-white border-gray-600';
      case 'user':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'premium':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 p-4 lg:p-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 rounded-2xl p-6 text-white shadow-2xl overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full blur-3xl -translate-y-32 translate-x-16 lg:translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-gray-500/20 to-gray-600/20 rounded-full blur-3xl translate-y-32 -translate-x-16 lg:-translate-x-32"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-300" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                        Chi tiết dòng tiền
                      </h1>
                      <p className="text-gray-300 text-base font-medium mt-1">
                        Thông tin chi tiết về tài khoản người dùng
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onBack}
                  className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  Quay lại danh sách
                </button>
              </div>
            </div>
            
            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          </div>
        </div>

        {/* Enhanced Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* User Information Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-gradient-to-r from-gray-800 to-black rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Thông tin người dùng</h3>
              </div>
              
              <div className="space-y-4">
                <div className="group/item hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-1 group-hover/item:text-green-500 transition-colors duration-200" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-900 break-all text-sm">{cashFlow.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="group/item hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-4 h-4 text-gray-400 mt-1 group-hover/item:text-green-500 transition-colors duration-200" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">User ID</p>
                      <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-800 break-all">
                        {cashFlow.userId}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group/item hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400 group-hover/item:text-black transition-colors duration-200" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">Vai trò</p>
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getRoleColor(cashFlow.role)}`}>
                        {cashFlow.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information Cards */}
          <div className="xl:col-span-2 space-y-4">
            {/* Amount Available Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Số tiền khả dụng</h3>
                    <p className="text-xs text-gray-600">Available Balance</p>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700 mb-1">
                  {formatCurrency(cashFlow.amountAvailable)}
                </p>
                <p className="text-xs text-gray-600">Có thể sử dụng ngay</p>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-gray-700 to-black rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Số dư tài khoản</h3>
                    <p className="text-xs text-gray-600">Account Balance</p>
                  </div>
                </div>
                <div className="p-2 bg-gray-200 rounded-lg">
                  <DollarSign className="w-4 h-4 text-gray-700" />
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {formatCurrency(cashFlow.balance)}
                </p>
                <p className="text-xs text-gray-600">Tổng số dư hiện tại</p>
              </div>
            </div>

            {/* Creation Date Card */}
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-gray-800 to-black rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Ngày tạo tài khoản</h3>
                    <p className="text-xs text-gray-600">Account Creation Date</p>
                  </div>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800 mb-1">
                  {new Date(cashFlow.createdDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(cashFlow.createdDate).toLocaleTimeString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-200/50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt thông tin</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(cashFlow.amountAvailable)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Khả dụng</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-gray-800">
                {formatCurrency(cashFlow.balance)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Tổng số dư</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-black">
                {Math.floor((Date.now() - new Date(cashFlow.createdDate).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <p className="text-xs text-gray-600 mt-1">Ngày hoạt động</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowDetail;
