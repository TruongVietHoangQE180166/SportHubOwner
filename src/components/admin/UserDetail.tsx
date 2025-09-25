// components/admin/UserDetail.tsx
'use client';

import React from 'react';
import { ChevronLeft, User, Mail, Shield, Activity, Calendar, Phone, CreditCard, QrCode } from 'lucide-react';

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

interface UserDetailProps {
  user: User;
  profile: UserProfile | null;
  onBack: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, profile, onBack }) => {
  // Check if the current user is NOT a regular user (i.e., is admin or owner)
  const isNotRegularUser = user.role === 'ADMIN' || user.role === 'OWNER';

  const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; className?: string; truncate?: boolean }> = 
    ({ icon, label, value, className = "", truncate = true }) => (
      <div className={`flex items-start space-x-3 ${className}`}>
        <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
          <div className={`text-gray-900 ${truncate ? 'truncate' : ''}`} title={typeof value === 'string' ? value : ''}>
            {value}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                <p className="text-sm text-gray-600 mt-1">Comprehensive user information and profile data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  {profile?.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt="User Avatar" 
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto border-4 border-gray-200 shadow-sm">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white ${
                    user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-900 truncate" title={profile?.fullName || user.username}>
                    {profile?.fullName || user.username}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 truncate" title={`@${user.username}`}>@{user.username}</p>
                  
                  <div className="flex justify-center mt-3">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'OWNER' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-xs text-gray-600">Status</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {user.deleted ? 'Yes' : 'No'}
                      </div>
                      <div className="text-xs text-gray-600">Deleted</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {profile?.createdDate ? new Date(profile.createdDate).getFullYear() : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">Joined</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-indigo-500" />
                  Account Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    icon={<User />}
                    label="Username"
                    value={<span className="font-medium">{user.username}</span>}
                  />
                  <InfoItem
                    icon={<Mail />}
                    label="Email Address"
                    value={user.email}
                  />
                  <InfoItem
                    icon={<Activity />}
                    label="Account Status"
                    value={
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    }
                  />
                  <InfoItem
                    icon={<Shield />}
                    label="User Role"
                    value={
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'OWNER' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Profile Information */}
            {profile && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Personal Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                      icon={<User />}
                      label="Full Name"
                      value={profile.fullName || 'Not provided'}
                    />
                    <InfoItem
                      icon={<User />}
                      label="Nickname"
                      value={profile.nickName || 'Not provided'}
                    />
                    <InfoItem
                      icon={<Phone />}
                      label="Phone Number"
                      value={profile.phoneNumber || 'Not provided'}
                    />
                    <InfoItem
                      icon={<User />}
                      label="Gender"
                      value={profile.gender || 'Not specified'}
                      truncate={false}
                    />
                    <InfoItem
                      icon={<Calendar />}
                      label="Date of Birth"
                      value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      truncate={false}
                    />
                    <InfoItem
                      icon={<Calendar />}
                      label="Last Updated"
                      value={profile.updatedDate ? new Date(profile.updatedDate).toLocaleDateString() : 'N/A'}
                      truncate={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bank Information - Only for Admin/Owner */}
            {isNotRegularUser && profile && (profile.bankName || profile.accountNo || profile.bankNo || profile.qrCode) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                    Banking Information
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Sensitive financial information</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InfoItem
                      icon={<CreditCard />}
                      label="Bank Name"
                      value={profile.bankName || 'Not provided'}
                      truncate={true}
                    />
                    <InfoItem
                      icon={<CreditCard />}
                      label="Account Number"
                      value={profile.accountNo ? 
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded truncate">{profile.accountNo}</span> 
                        : 'Not provided'
                      }
                    />
                    <InfoItem
                      icon={<CreditCard />}
                      label="Bank Code"
                      value={profile.bankNo ? 
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{profile.bankNo}</span> 
                        : 'Not provided'
                      }
                    />
                  </div>
                  
                  {profile.qrCode && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="text-center">
                        <InfoItem
                          icon={<QrCode />}
                          label="Payment QR Code"
                          value={
                            <div className="flex justify-center mt-2">
                              <img 
                                src={profile.qrCode} 
                                alt="Payment QR Code" 
                                className="w-32 h-32 object-contain border border-gray-200 rounded-lg shadow-sm"
                              />
                            </div>
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!profile && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-12 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Information</h3>
                  <p className="text-gray-600">This user hasn't completed their profile information yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;