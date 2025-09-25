// components/admin/UserManagementTable.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Users, Crown, ChevronLeft, Plus } from 'lucide-react';
import { fieldService } from '../../services/fieldService';
import UserTable from './UserTable';
import UserDetail from './UserDetail'; // Import UserDetail component
import CreateOwnerForm from './CreateOwnerForm'; // Import CreateOwnerForm component

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

const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ user: User; profile: UserProfile | null } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // State for showing create form
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [ownerCurrentPage, setOwnerCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, profilesRes] = await Promise.all([
        fieldService.getUsers(1, 1000, 'createdDate', 'desc'),
        fieldService.getUserProfiles(1, 1000, 'createdDate', 'desc'),
      ]);
      setUsers(usersRes.data.content);
      setUserProfiles(profilesRes.data.content);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to update user status
  const handleUpdateStatus = async (username: string, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      // Find the user profile to get the userId
      const userProfile = userProfiles.find(profile => profile.username === username);
      const userId = userProfile?.userId || username;
      
      await fieldService.updateUserStatus(userId, status);
      
      // Update the local state to reflect the status change
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.username === username ? { ...user, status } : user
        )
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to update user status');
    }
  };

  // Function to handle owner creation
  const handleOwnerCreated = () => {
    // Refresh the user list
    fetchData();
    // Close the form
    setShowCreateForm(false);
  };

  const combinedData = useMemo(
    () => users.map((u) => ({ user: u, profile: userProfiles.find((p) => p.username === u.username) ?? null })),
    [users, userProfiles]
  );

  const filteredRegularUsers = useMemo(() => {
    const list = combinedData.filter((i) => i.user.role === 'USER');
    if (!userSearchTerm) return list;
    const t = userSearchTerm.toLowerCase();
    return list.filter((i) => i.user.email.toLowerCase().includes(t) || i.user.username.toLowerCase().includes(t) || i.profile?.fullName?.toLowerCase().includes(t));
  }, [combinedData, userSearchTerm]);

  const filteredOwners = useMemo(() => {
    const list = combinedData.filter((i) => i.user.role === 'OWNER');
    if (!ownerSearchTerm) return list;
    const t = ownerSearchTerm.toLowerCase();
    return list.filter((i) => i.user.email.toLowerCase().includes(t) || i.user.username.toLowerCase().includes(t) || i.profile?.fullName?.toLowerCase().includes(t));
  }, [combinedData, ownerSearchTerm]);

  const userTotalPages = Math.ceil(filteredRegularUsers.length / itemsPerPage);
  const ownerTotalPages = Math.ceil(filteredOwners.length / itemsPerPage);

  const getUserPaginatedData = () => {
    const start = (userCurrentPage - 1) * itemsPerPage;
    return filteredRegularUsers.slice(start, start + itemsPerPage);
  };
  const getOwnerPaginatedData = () => {
    const start = (ownerCurrentPage - 1) * itemsPerPage;
    return filteredOwners.slice(start, start + itemsPerPage);
  };

  const handleViewDetails = (user: User, profile: UserProfile | null) => setSelectedUser({ user, profile });
  const handleBackToList = () => setSelectedUser(null);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-6 text-gray-800 shadow-xl relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6" />
            </div>
            <div className="relative z-10">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-48" />
            </div>
          </div>
        ))}
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

  // Show CreateOwnerForm when needed
  if (showCreateForm) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-gray-800 shadow-xl relative overflow-hidden">
        <CreateOwnerForm 
          onCancel={() => setShowCreateForm(false)} 
          onOwnerCreated={handleOwnerCreated}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
      </div>
    );
  }

  // Show UserDetail component when a user is selected
  if (selectedUser) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-gray-800 shadow-xl relative overflow-hidden">
        <UserDetail 
          user={selectedUser.user} 
          profile={selectedUser.profile} 
          onBack={handleBackToList} 
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Create Owner Button - Using WelcomeHeader Style */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl lg:text-2xl font-bold mb-2">
              Quản lý người dùng
            </h3>
            <p className="text-gray-300 text-sm lg:text-base font-medium">
              Tạo và quản lý tài khoản người dùng
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-green-500/30"
          >
            <Plus className="w-5 h-5" />
            Tạo Chủ Sân
          </button>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
      </div>
      
      <UserTable
        title="Users"
        data={getUserPaginatedData()}
        currentPage={userCurrentPage}
        totalPages={userTotalPages}
        onPageChange={setUserCurrentPage}
        searchTerm={userSearchTerm}
        onSearchChange={setUserSearchTerm}
        icon={Users}
        totalCount={filteredRegularUsers.length}
        onView={handleViewDetails}
        onUpdateStatus={handleUpdateStatus} // Pass the status update function
      />
      <UserTable
        title="Owners"
        data={getOwnerPaginatedData()}
        currentPage={ownerCurrentPage}
        totalPages={ownerTotalPages}
        onPageChange={setOwnerCurrentPage}
        searchTerm={ownerSearchTerm}
        onSearchChange={setOwnerSearchTerm}
        icon={Crown}
        totalCount={filteredOwners.length}
        onView={handleViewDetails}
        onUpdateStatus={handleUpdateStatus} // Pass the status update function
      />
    </div>
  );
};

export default UserManagementTable;