'use client'

import React, { useState } from 'react';
import { Shield, Lock, AlertCircle, Eye, EyeOff, Save, X, Moon, Sun } from 'lucide-react';

// Password strength indicator
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  return (
    <div className="mt-3">
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
              i < strength ? strengthColors[Math.min(strength - 1, 4)] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 font-medium">
        {password ? strengthLabels[Math.min(strength - 1, 4)] : 'Enter a password'}
      </p>
    </div>
  );
};

const SecuritySettings: React.FC = () => {
  const [editingPassword, setEditingPassword] = useState(false);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    darkMode: false,
    lastPasswordChange: "2 months ago"
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("Please fill in all password fields!");
      return;
    }
    // Here you would call your password change API
    alert('Password changed successfully!');
    setEditingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setSecuritySettings(prev => ({
      ...prev,
      lastPasswordChange: "Just now"
    }));
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">

          {/* Password & Authentication */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              Password & Authentication
            </h3>
            
            {!editingPassword ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                      <Lock className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Password</p>
                      <p className="text-sm text-gray-500">Last changed {securitySettings.lastPasswordChange}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <PasswordStrengthIndicator password={passwordData.newPassword} />
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <div className="flex items-center gap-2 mt-3">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">Passwords do not match</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePasswordChange}
                    disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setEditingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}
                    className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* App Settings*/}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              App Settings
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                    {securitySettings.darkMode ? (
                      <Moon className="w-6 h-6 text-gray-500" />
                    ) : (
                      <Sun className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">Theme Mode</p>
                    <p className="text-sm text-gray-500">
                      {securitySettings.darkMode ? 'Dark mode enabled' : 'Light mode enabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSecuritySettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${securitySettings.darkMode ? 'bg-green-600' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${securitySettings.darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;