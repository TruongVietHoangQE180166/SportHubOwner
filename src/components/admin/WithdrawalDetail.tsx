// components/admin/WithdrawalDetail.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Building, Hash, QrCode, DollarSign, Clock, Mail, User, TrendingDown, Calendar, CheckCircle, XCircle, AlertCircle, Save } from 'lucide-react';
import { fieldService } from '../../services/fieldService';

interface Withdrawal {
  id: string;
  userId: string;
  email: string;
  role: string;
  description: string;
  amount: number;
  status: string;
  createdDate: string;
}

interface UserProfile {
  id: string;
  createdDate: string;
  updatedDate: string;
  nickName: string | null;
  fullName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  avatar: string;
  gender: string;
  addresses: any[];
  information: any | null;
  bankNo: string | null;
  accountNo: string | null;
  bankName: string | null;
  qrCode: string | null;
  userId: string;
  username: string;
}

interface WithdrawalDetailProps {
  withdrawal: Withdrawal;
  userProfile: UserProfile | null;
  onBack: () => void;
  onUpdate?: () => void; // Add this callback function
}

const WithdrawalDetail: React.FC<WithdrawalDetailProps> = ({ withdrawal, userProfile, onBack, onUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState(withdrawal.status);
  const [newStatus, setNewStatus] = useState(withdrawal.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'APPROVED' | 'REJECTED' | null>(null);

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

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: AlertCircle,
          bgGradient: 'from-yellow-50 to-yellow-100'
        };
      case 'APPROVED':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle,
          bgGradient: 'from-green-50 to-green-100'
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: XCircle,
          bgGradient: 'from-red-50 to-red-100'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertCircle,
          bgGradient: 'from-gray-50 to-gray-100'
        };
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!pendingAction || pendingAction === currentStatus) return;
    
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    setShowConfirmModal(false);
    
    try {
      await fieldService.updateWithdrawalStatus(withdrawal.id, pendingAction);
      setCurrentStatus(pendingAction);
      setUpdateSuccess(true);
      
      // Notify parent component to refresh data
      if (onUpdate) {
        onUpdate();
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update withdrawal status');
    } finally {
      setIsUpdating(false);
      setPendingAction(null);
    }
  };

  const openConfirmModal = (action: 'APPROVED' | 'REJECTED') => {
    setPendingAction(action);
    setNewStatus(action);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const statusConfig = getStatusConfig(currentStatus);
  const StatusIcon = statusConfig.icon;

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
                      <TrendingDown className="w-5 h-5 text-green-300" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                        Chi tiết yêu cầu rút tiền
                      </h1>
                      <p className="text-gray-300 text-base font-medium mt-1">
                        Thông tin chi tiết về yêu cầu rút tiền của người dùng
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
                    <Mail className="w-4 h-4 text-gray-400 mt-1 group-hover/item:text-red-500 transition-colors duration-200" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-900 break-all text-sm">{withdrawal.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="group/item hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200">
                  <div className="flex items-start gap-3">
                    <Hash className="w-4 h-4 text-gray-400 mt-1 group-hover/item:text-red-500 transition-colors duration-200" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">User ID</p>
                      <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-800 break-all">
                        {withdrawal.userId}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group/item hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400 group-hover/item:text-black transition-colors duration-200" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">Vai trò</p>
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getRoleColor(withdrawal.role)}`}>
                        {withdrawal.role}
                      </span>
                    </div>
                  </div>
                </div>

                {userProfile?.fullName && (
                  <div className="group/item hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-gray-400 mt-1 group-hover/item:text-red-500 transition-colors duration-200" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Họ tên</p>
                        <p className="font-semibold text-gray-900 text-sm">{userProfile.fullName}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Information Cards */}
          <div className="xl:col-span-2 space-y-4">
            {/* Amount Card */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 shadow-xl border border-red-200/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Số tiền rút</h3>
                    <p className="text-xs text-gray-600">Withdrawal Amount</p>
                  </div>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-red-700 mb-1">
                  {formatCurrency(withdrawal.amount)}
                </p>
                <p className="text-xs text-gray-600">Số tiền yêu cầu rút</p>
              </div>
            </div>

            {/* Status Card */}
            <div className={`bg-gradient-to-br ${statusConfig.bgGradient} rounded-2xl p-5 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/80 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <StatusIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Trạng thái</h3>
                    <p className="text-xs text-gray-600">Transaction Status</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full border ${statusConfig.color}`}>
                  {currentStatus}
                </span>
                <p className="text-xs text-gray-600 mt-2">Trạng thái hiện tại</p>
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
                    <h3 className="text-base font-bold text-gray-900">Ngày tạo yêu cầu</h3>
                    <p className="text-xs text-gray-600">Request Creation Date</p>
                  </div>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800 mb-1">
                  {new Date(withdrawal.createdDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(withdrawal.createdDate).toLocaleTimeString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {withdrawal.description && (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-200/50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Mô tả yêu cầu</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">
                {withdrawal.description}
              </p>
            </div>
          </div>
        )}

        {/* Payment Information Section */}
        {userProfile && (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Thông tin thanh toán</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="group bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                    <Building className="w-4 h-4 text-green-600" />
                  </div>
                  <h5 className="font-bold text-gray-900">Ngân hàng</h5>
                </div>
                <p className="text-gray-700 font-medium">
                  {userProfile.bankName || 'Chưa cập nhật'}
                </p>
              </div>
              
              <div className="group bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                    <Hash className="w-4 h-4 text-green-600" />
                  </div>
                  <h5 className="font-bold text-gray-900">Số tài khoản</h5>
                </div>
                <p className="text-gray-700 font-medium font-mono text-sm">
                  {userProfile.accountNo || 'Chưa cập nhật'}
                </p>
              </div>
              
              <div className="group bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                    <QrCode className="w-4 h-4 text-green-600" />
                  </div>
                  <h5 className="font-bold text-gray-900">Mã ngân hàng</h5>
                </div>
                <p className="text-gray-700 font-medium font-mono text-sm">
                  {userProfile.bankNo || 'Chưa cập nhật'}
                </p>
              </div>
            </div>
            
            {/* QR Code Section */}
            {userProfile.qrCode && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center border border-green-200/50">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Mã QR thanh toán</h4>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="bg-white border-4 border-green-200 rounded-3xl p-6 shadow-xl">
                    <img 
                      src={userProfile.qrCode} 
                      alt="Payment QR Code" 
                      className="w-48 h-48 object-contain rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold">Hướng dẫn thanh toán:</span><br />
                    Quét mã QR trên và chuyển đúng số tiền{' '}
                    <span className="font-bold text-green-700">{formatCurrency(withdrawal.amount)}</span>{' '}
                    để thanh toán cho khách hàng
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Statistics */}
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-200/50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt yêu cầu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200/50">
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(withdrawal.amount)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Số tiền rút</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200/50">
              <div className={`text-xl font-bold ${
                currentStatus === 'APPROVED' ? 'text-green-600' : 
                currentStatus === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {currentStatus}
              </div>
              <p className="text-xs text-gray-600 mt-1">Trạng thái</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200/50">
              <div className="text-xl font-bold text-gray-800">
                {Math.floor((Date.now() - new Date(withdrawal.createdDate).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <p className="text-xs text-gray-600 mt-1">Ngày chờ</p>
            </div>
          </div>
        </div>

        {/* Status Update Section - Moved to the bottom */}
        <div className="bg-gray-100 rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cập nhật trạng thái yêu cầu</h3>
              <p className="text-gray-600">Chọn hành động để cập nhật trạng thái rút tiền</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Trạng thái hiện tại:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentStatus === 'APPROVED' ? 'bg-green-100 text-green-800 border border-green-200' :
                currentStatus === 'REJECTED' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {currentStatus}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => openConfirmModal('REJECTED')}
              disabled={isUpdating || currentStatus === 'REJECTED'}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                isUpdating || currentStatus === 'REJECTED'
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl active:scale-95 border border-red-300'
              }`}
            >
              {isUpdating && newStatus === 'REJECTED' ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                  Đang từ chối...
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6" />
                  Từ chối yêu cầu
                </>
              )}
            </button>
            
            <button
              onClick={() => openConfirmModal('APPROVED')}
              disabled={isUpdating || currentStatus === 'APPROVED'}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                isUpdating || currentStatus === 'APPROVED'
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl active:scale-95 border border-green-300'
              }`}
            >
              {isUpdating && newStatus === 'APPROVED' ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                  Đang chấp thuận...
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Chấp thuận yêu cầu
                </>
              )}
            </button>
          </div>
          
          {/* Status Update Feedback */}
          {updateSuccess && (
            <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-xl border border-green-200 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Cập nhật trạng thái thành công!</span>
            </div>
          )}
          
          {updateError && (
            <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-xl border border-red-200 flex items-center gap-3">
              <XCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">{updateError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                pendingAction === 'APPROVED' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {pendingAction === 'APPROVED' ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {pendingAction === 'APPROVED' ? 'Xác nhận chấp thuận' : 'Xác nhận từ chối'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {pendingAction === 'APPROVED' 
                  ? 'Bạn có chắc chắn muốn chấp thuận yêu cầu rút tiền này?' 
                  : 'Bạn có chắc chắn muốn từ chối yêu cầu rút tiền này?'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeConfirmModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </button>
                
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors duration-200 ${
                    pendingAction === 'APPROVED'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    pendingAction === 'APPROVED' ? 'Chấp thuận' : 'Từ chối'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalDetail;