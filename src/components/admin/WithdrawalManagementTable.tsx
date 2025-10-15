// components/admin/WithdrawalManagementTable.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Wallet, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { fieldService } from '../../services/fieldService';
import WithdrawalDetail from './WithdrawalDetail';

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

const WithdrawalManagementTable: React.FC<{ onDetailToggle?: (show: boolean) => void }> = ({ onDetailToggle }) => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [withdrawalResponse, profileResponse] = await Promise.all([
        fieldService.getAllWithdrawal(1, 1000, 'createdDate', 'desc'),
        fieldService.getUserProfiles(1, 1000, 'createdDate', 'desc')
      ]);
      
      setWithdrawals(withdrawalResponse.data.content);
      setUserProfiles(profileResponse.data.content);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Notify parent when detail view is shown or hidden
  useEffect(() => {
    if (onDetailToggle) {
      onDetailToggle(!!selectedWithdrawal);
    }
  }, [selectedWithdrawal, onDetailToggle]);

  const filteredWithdrawals = useMemo(() => {
    if (!searchTerm) return withdrawals;
    const t = searchTerm.toLowerCase();
    return withdrawals.filter((w) => 
      w.email.toLowerCase().includes(t) || 
      w.description.toLowerCase().includes(t) ||
      w.userId.toLowerCase().includes(t)
    );
  }, [withdrawals, searchTerm]);

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);

  const getPaginatedData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWithdrawals.slice(start, start + itemsPerPage);
  };

  const handleViewDetails = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    // Find the user profile for this withdrawal
    const userProfile = userProfiles.find(profile => profile.userId === withdrawal.userId) || null;
    setSelectedUserProfile(userProfile);
  };

  const handleBackToList = () => {
    setSelectedWithdrawal(null);
    setSelectedUserProfile(null);
  };

  // Callback function to refresh data after status update
  const handleWithdrawalUpdate = () => {
    // Refresh the data
    fetchData();
  };

  // Show withdrawal detail view when a withdrawal is selected
  if (selectedWithdrawal) {
    return (
      <WithdrawalDetail 
        withdrawal={selectedWithdrawal} 
        userProfile={selectedUserProfile} 
        onBack={handleBackToList} 
        onUpdate={handleWithdrawalUpdate} // Pass the callback function
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-100 rounded-xl p-6 text-gray-800 shadow-xl relative overflow-hidden animate-pulse">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6" />
          </div>
          <div className="relative z-10">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-100 rounded-xl p-6 text-gray-800 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Error</h2>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl lg:text-2xl font-bold mb-2">
              Quản lý yêu cầu rút tiền
            </h3>
            <p className="text-gray-300 text-sm lg:text-base font-medium">
              Theo dõi và xử lý các yêu cầu rút tiền từ người dùng
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
      </div>

      {/* Withdrawal Table */}
      <div className="bg-gray-100 rounded-xl p-6 text-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Yêu cầu rút tiền</h2>
                <p className="text-sm text-gray-600">{filteredWithdrawals.length} total records</p>
              </div>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Tìm kiếm theo email..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Số tiền</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getPaginatedData().length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-400" />
                        <p>No data found</p>
                        {searchTerm && <p className="text-sm">Try adjusting your search term</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  getPaginatedData().map((withdrawal, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-[200px] truncate" title={withdrawal.email}>
                        {withdrawal.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(withdrawal.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            withdrawal.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : withdrawal.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(withdrawal.createdDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewDetails(withdrawal)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-md transition-all duration-200 text-xs font-medium shadow hover:shadow-md active:scale-95"
                        >
                          <Eye className="w-3 h-3" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === page ? 'bg-gray-800 text-white shadow border border-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 py-2 text-gray-500 text-sm">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow hover:shadow-md'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
      </div>
    </div>
  );
};

export default WithdrawalManagementTable;