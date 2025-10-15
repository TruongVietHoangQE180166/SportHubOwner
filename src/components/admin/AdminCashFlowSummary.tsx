'use client';

import React, { useMemo } from 'react';
import { Wallet, DollarSign, Activity, TrendingUp, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { CashFlow, Withdrawal } from '../../types/payment';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import WithdrawalHistoryChart from './WithdrawalHistoryChart';

interface AdminCashFlowSummaryProps {
  cashFlows: CashFlow[];
  withdrawals: Withdrawal[];
}

const COLORS = {
  pending: '#fbbf24',
  approved: '#4ade80',
  rejected: '#ef4444',
  total: '#6366f1'
};

const AdminCashFlowSummary: React.FC<AdminCashFlowSummaryProps> = ({ cashFlows, withdrawals }) => {
  const adminCashFlow = useMemo(() => {
    return cashFlows.find(cashFlow => cashFlow.role.toLowerCase() === 'admin') || null;
  }, [cashFlows]);

  const stats = useMemo(() => {
    if (!adminCashFlow) return null;

    const userCashFlows = cashFlows.filter(c => c.role.toLowerCase() !== 'admin');
    const totalFieldOwners = cashFlows.filter(c => c.role.toLowerCase() === 'owner').length;

    const totalBalance = userCashFlows.reduce((sum, c) => sum + c.balance, 0);
    const totalAvailable = userCashFlows.reduce((sum, c) => sum + c.amountAvailable, 0);

    const totalWithdrawals = withdrawals.length;
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING').length;
    const approvedWithdrawals = withdrawals.filter(w => w.status === 'APPROVED').length;
    const rejectedWithdrawals = withdrawals.filter(w => w.status === 'REJECTED').length;

    const totalWithdrawalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const pendingWithdrawalAmount = withdrawals
      .filter(w => w.status === 'PENDING')
      .reduce((sum, w) => sum + w.amount, 0);
    const approvedWithdrawalAmount = withdrawals
      .filter(w => w.status === 'APPROVED')
      .reduce((sum, w) => sum + w.amount, 0);
    const rejectedWithdrawalAmount = withdrawals
      .filter(w => w.status === 'REJECTED')
      .reduce((sum, w) => sum + w.amount, 0);

    const statusData = [
      { name: 'Đang chờ', value: pendingWithdrawals, amount: pendingWithdrawalAmount, color: COLORS.pending },
      { name: 'Đã duyệt', value: approvedWithdrawals, amount: approvedWithdrawalAmount, color: COLORS.approved },
      { name: 'Từ chối', value: rejectedWithdrawals, amount: rejectedWithdrawalAmount, color: COLORS.rejected }
    ];

    const amountData = [
      { name: 'Đang chờ', amount: pendingWithdrawalAmount, color: COLORS.pending },
      { name: 'Đã duyệt', amount: approvedWithdrawalAmount, color: COLORS.approved },
      { name: 'Từ chối', amount: rejectedWithdrawalAmount, color: COLORS.rejected }
    ];

    return {
      totalFieldOwners,
      totalBalance,
      totalAvailable,
      totalWithdrawals,
      pendingWithdrawals,
      approvedWithdrawals,
      rejectedWithdrawals,
      totalWithdrawalAmount,
      pendingWithdrawalAmount,
      approvedWithdrawalAmount,
      rejectedWithdrawalAmount,
      statusData,
      amountData
    };
  }, [cashFlows, adminCashFlow, withdrawals]);

  if (!adminCashFlow || !stats) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <Wallet className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Tổng quan dòng tiền Admin</h3>
        </div>
        <p className="text-gray-500">Không tìm thấy dữ liệu dòng tiền cho tài khoản admin</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-black via-gray-900 to-black rounded-xl p-8 shadow-2xl border border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-400 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Tổng quan dòng tiền</h1>
              <p className="text-gray-400 text-sm">Thống kê và phân tích tài chính hệ thống</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">TỔNG SỐ</span>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-sm font-medium mb-1">Chủ sân</p>
            <p className="text-3xl font-bold text-black">{stats.totalFieldOwners}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-400 rounded-lg">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">DOANH THU</span>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-sm font-medium mb-1">Tổng hệ thống</p>
            <p className="text-2xl font-bold text-black">{formatCurrency(stats.totalBalance)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Wallet className="w-6 h-6 text-gray-700" />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">KHẢ DỤNG</span>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-sm font-medium mb-1">Số dư khả dụng</p>
            <p className="text-2xl font-bold text-black">{formatCurrency(stats.totalAvailable)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-black">Tài chính Admin</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Số tiền khả dụng</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-black">{formatCurrency(adminCashFlow.amountAvailable)}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tổng doanh thu</span>
                <TrendingUp className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-black">{formatCurrency(adminCashFlow.balance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Wallet className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-black">Yêu cầu rút tiền</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-black">{stats.pendingWithdrawals}</p>
              <p className="text-xs text-gray-600 mt-1">Đang chờ</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-black">{stats.approvedWithdrawals}</p>
              <p className="text-xs text-gray-600 mt-1">Đã duyệt</p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-black">{stats.rejectedWithdrawals}</p>
              <p className="text-xs text-gray-600 mt-1">Từ chối</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-sm font-medium text-gray-700">Đang chờ</span>
              <span className="text-sm font-bold text-black">{formatCurrency(stats.pendingWithdrawalAmount)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-gray-700">Đã duyệt (Tiền ra)</span>
              <span className="text-sm font-bold text-black">{formatCurrency(stats.approvedWithdrawalAmount)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Tổng giá trị</span>
              <span className="text-sm font-bold text-black">{formatCurrency(stats.totalWithdrawalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal History Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <WithdrawalHistoryChart withdrawals={withdrawals} formatCurrency={formatCurrency} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="text-base font-bold text-black mb-6">Phân bố theo trạng thái</h4>
          <div className="flex items-center gap-6">
            <div className="flex-1 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={stats.statusData.filter(item => item.value > 0).length > 1 ? 3 : 0}
                    strokeWidth={2}
                    stroke="#ffffff"
                    startAngle={90}
                    endAngle={450}
                  >
                    {stats.statusData.filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'Số lượng']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3">
              {stats.statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.value} yêu cầu</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="text-base font-bold text-black mb-4">Phân bố theo giá trị</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.amountData}
                margin={{
                  top: 40,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('₫', '')} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Số tiền']}
                  labelFormatter={(label) => `Trạng thái: ${label}`}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="amount" name="Số tiền" radius={[8, 8, 0, 0]}>
                  {stats.amountData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList dataKey="amount" content={(props) => {
                    const { x, y, width, value } = props;
                    if (value === undefined) return null;
                    return (
                      <text
                        x={Number(x) + Number(width) / 2}
                        y={Number(y) - 10}
                        fill="#000"
                        textAnchor="middle"
                        dy={-6}
                        fontSize={11}
                        fontWeight="600"
                      >
                        {formatCurrency(typeof value === 'number' ? value : Number(value))}
                      </text>
                    );
                  }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCashFlowSummary;
