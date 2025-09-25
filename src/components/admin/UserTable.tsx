// components/admin/UserTable.tsx
'use client';

import React from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, UserX, UserCheck } from 'lucide-react';

interface User {
  username: string;
  password: string;
  email: string;
  status: string;
  role: string;
  deleted: boolean;
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

type Combined = { user: User; profile: UserProfile | null };

interface Props {
  title: string;
  data: Combined[];
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  icon: React.ComponentType<any>;
  totalCount: number;
  onView: (u: User, p: UserProfile | null) => void;
  onUpdateStatus: (userId: string, status: 'ACTIVE' | 'INACTIVE') => void; // New prop for status update
}

const UserTable = React.memo<Props>(
  ({ title, data, currentPage, totalPages, onPageChange, searchTerm, onSearchChange, icon: Icon, totalCount, onView, onUpdateStatus }) => {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600">{totalCount} total records</p>
              </div>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                key={`search-${title}`} // ← giữ focus
                type="text"
                placeholder="Tên khách hàng, email hoặc username..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 outline-none"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.length === 0 ? (
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
                  data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-[150px] truncate font-medium" title={item.user.username}>
                        {item.user.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-[200px] truncate" title={item.user.email}>
                        {item.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.user.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {item.user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-[120px] truncate" title={item.profile?.phoneNumber || 'N/A'}>
                        {item.profile?.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onView(item.user, item.profile)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-md transition-all duration-200 text-xs font-medium shadow hover:shadow-md active:scale-95"
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>
                          <button
                            onClick={() => onUpdateStatus(item.user.username, item.user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md transition-all duration-200 text-xs font-medium shadow hover:shadow-md ${
                              item.user.status === 'ACTIVE'
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {item.user.status === 'ACTIVE' ? (
                              <>
                                <UserX className="w-3 h-3" />
                                Disable
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3" />
                                Enable
                              </>
                            )}
                          </button>
                        </div>
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
                  onClick={() => onPageChange(currentPage - 1)}
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
                          onClick={() => onPageChange(page)}
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
                  onClick={() => onPageChange(currentPage + 1)}
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
    );
  }
);

UserTable.displayName = 'UserTable';
export default UserTable;