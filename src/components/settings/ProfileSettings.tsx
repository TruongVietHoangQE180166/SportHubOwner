'use client';

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import { User, Mail, Phone, Building, Save, X, Edit2, Camera } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileSettingsProps {
  user: UserProfile;
  loading: boolean;
  error: string | null;
  onUpdateUser: (updates: Partial<UserProfile>) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<void>;
  clearError: () => void;
}

interface InlineInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
}

const InlineInput: React.FC<InlineInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  icon,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  placeholder = ""
}) => {
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(tempValue);
    onSave();
  };

  const handleCancel = () => {
    setTempValue(value);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="group">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        {!isEditing ? (
          <div 
            className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:bg-green-50/30 transition-all duration-200 group"
            onClick={onEdit}
          >
            {icon && <span className="text-gray-500">{icon}</span>}
            <span className="text-gray-900 font-medium flex-1">{value || placeholder}</span>
            <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              {icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {icon}
                </div>
              )}
              <input
                ref={inputRef}
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-3 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 ${icon ? 'pl-10' : ''}`}
                placeholder={placeholder}
              />
            </div>
            <button
              onClick={handleSave}
              className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  user, 
  error,
  onUpdateUser,
  onUploadAvatar,
  clearError
}) => {
  const [profileData, setProfileData] = useState<Partial<UserProfile>>(user);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatar);
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    setProfileData(user);
    setAvatarPreview(user.avatar);
  }, [user]);

  const handleFieldUpdate = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    onUpdateUser({ [field]: value });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      onUploadAvatar(file).catch(() => {
        setAvatarPreview(user.avatar);
      });
    }
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
            {error}
            <button 
              onClick={clearError} 
              className="float-right text-red-800 font-medium"
            >
              Đóng
            </button>
          </div>
        )}

        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-36 h-36 overflow-hidden border-4 border-gray-100 rounded-full bg-white flex items-center justify-center shadow-lg">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt="avatar" width={144} height={144} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-18 h-18 text-gray-400" />
                  )}
                </div>
                <label htmlFor="avatar-upload" className="absolute -right-2 -bottom-2 bg-green-600 border-4 border-white shadow-lg rounded-full p-3 cursor-pointer flex items-center justify-center transition-all hover:bg-green-700 hover:scale-105 duration-200">
                  <Camera className="w-5 h-5 text-white" />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                  />
                </label>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-6">
                {profileData.name || 'User Name'}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
                <Mail className="w-4 h-4" />
                <span>{profileData.email || 'No email'}</span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InlineInput
                label="Full Name"
                value={profileData.name || ''}
                onChange={(value) => handleFieldUpdate('name', value)}
                isEditing={editingField === 'name'}
                onEdit={() => setEditingField('name')}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter your name"
              />
              <InlineInput
                label="Email Address"
                value={profileData.email || ''}
                onChange={(value) => handleFieldUpdate('email', value)}
                type="email"
                icon={<Mail className="w-4 h-4" />}
                isEditing={editingField === 'email'}
                onEdit={() => setEditingField('email')}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter email address"
              />
              <InlineInput
                label="Phone Number"
                value={profileData.phone || ''}
                onChange={(value) => handleFieldUpdate('phone', value)}
                type="tel"
                icon={<Phone className="w-4 h-4" />}
                isEditing={editingField === 'phone'}
                onEdit={() => setEditingField('phone')}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter phone number"
              />
              <InlineInput
                label="Business Name"
                value={profileData.businessName || ''}
                onChange={(value) => handleFieldUpdate('businessName', value)}
                icon={<Building className="w-4 h-4" />}
                isEditing={editingField === 'businessName'}
                onEdit={() => setEditingField('businessName')}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter business name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
