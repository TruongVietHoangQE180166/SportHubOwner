"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  Phone,
  Building,
  Save,
  X,
  Edit2,
  Camera,
  Calendar,
  UserCircle,
  CreditCard,
  Hash,
  QrCode,
  ChevronDown,
} from "lucide-react";
import { UserProfile } from "../../types";

interface ProfileSettingsProps {
  user: UserProfile;
  loading: boolean;
  error: string | null;
  onUpdateUser: (updates: Partial<UserProfile>) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<string>; // Updated return type
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
  options?: string[]; // Add options for select dropdown
  bankOptions?: Array<{ BankName: string; bankNumber: string }>; // Add bank options
  disabled?: boolean; // Add disabled property
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
  placeholder = "",
  options,
  bankOptions,
  disabled = false, // Destructure disabled property
}) => {
  const [tempValue, setTempValue] = useState(value);
  const [tempBankData, setTempBankData] = useState<{
    bankName: string;
    bankNumber: string;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
    setTempBankData(null); // Reset bank data when value changes
  }, [value]);

  useEffect(() => {
    if (isEditing && !disabled) {
      // Only focus if not disabled
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, disabled]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSave = () => {
    if (disabled) return; // Don't save if disabled
    // If we have bank data, pass it to the parent component
    if (tempBankData) {
      onChange(JSON.stringify(tempBankData));
    } else {
      onChange(tempValue);
    }
    onSave();
  };

  const handleCancel = () => {
    if (disabled) return; // Don't cancel if disabled
    setTempValue(value);
    setTempBankData(null); // Reset bank data on cancel
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return; // Don't handle keys if disabled
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Bank selection handler
  const handleBankSelect = (bankName: string, bankNumber: string) => {
    if (disabled) return; // Don't select if disabled
    setTempValue(`${bankName} (${bankNumber})`);
    setIsDropdownOpen(false);
    // Store the selected bank data temporarily
    // We'll pass both values to the parent component only when save is clicked
    setTempBankData({ bankName, bankNumber });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {!isEditing ? (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border ${
            disabled
              ? "bg-gray-100 border-gray-300"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {icon && <div className="text-gray-500">{icon}</div>}
            <span className={disabled ? "text-gray-500" : "text-gray-900"}>
              {value || "Chưa cập nhật"}
            </span>
          </div>
          {!disabled && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            {options || bankOptions ? (
              <div className="relative">
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={() =>
                    !disabled && setIsDropdownOpen(!isDropdownOpen)
                  } // Only open if not disabled
                  disabled={disabled}
                  className={`w-full ${
                    icon ? "pl-10" : "pl-4"
                  } pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-left ${
                    disabled
                      ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                      : isDropdownOpen
                      ? "border-green-600 ring-2 ring-green-500/20"
                      : "border-green-500 hover:border-green-600 bg-white text-gray-900"
                  }`}
                >
                  {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {icon}
                    </div>
                  )}
                  <span>
                    {tempValue ||
                      (bankOptions ? "Chọn ngân hàng" : "Chọn giới tính")}
                  </span>
                </button>
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 pointer-events-none ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />

                {/* Dropdown options */}
                {!disabled && isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-1 w-full bg-white border-2 border-green-500 rounded-xl shadow-lg max-h-60 overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto">
                      {bankOptions
                        ? bankOptions.map((bank, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handleBankSelect(bank.BankName, bank.bankNumber)
                              }
                              className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors duration-150 text-gray-900 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {bank.BankName} ({bank.bankNumber})
                            </button>
                          ))
                        : options
                        ? options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setTempValue(option);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors duration-150 text-gray-900 ${
                                tempValue === option ? "bg-green-100" : ""
                              } first:rounded-t-lg last:rounded-b-lg`}
                            >
                              {option}
                            </button>
                          ))
                        : null}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                {icon && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {icon}
                  </div>
                )}
                <input
                  ref={inputRef}
                  type={type}
                  value={tempValue}
                  onChange={(e) => !disabled && setTempValue(e.target.value)} // Only change if not disabled
                  onKeyDown={handleKeyDown}
                  disabled={disabled}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 ${
                    icon ? "pl-10" : ""
                  } ${
                    disabled
                      ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                      : "border-green-500 bg-white text-gray-900"
                  }`}
                  placeholder={placeholder}
                />
              </div>
            )}
          </div>
          {!disabled && (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  loading,
  error,
  onUpdateUser,
  onUploadAvatar,
  clearError,
}) => {
  const [profileData, setProfileData] = useState<Partial<UserProfile>>(user);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user.avatar
  );
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null); // Local error state for avatar upload

  // Bank options data
  const bankOptions = [
    { BankName: "SaigonBank", bankNumber: "970400" },
    { BankName: "Sacombank", bankNumber: "970403" },
    { BankName: "Agribank", bankNumber: "970405" },
    { BankName: "DongABank", bankNumber: "970406" },
    { BankName: "Techcombank", bankNumber: "970407" },
    { BankName: "GPBank", bankNumber: "970408" },
    { BankName: "BacABank", bankNumber: "970409" },
    { BankName: "StandardChartered", bankNumber: "970410" },
    { BankName: "PVcomBank", bankNumber: "970412" },
    { BankName: "OceanBank", bankNumber: "970414" },
    { BankName: "VietinBank", bankNumber: "970415" },
    { BankName: "ACB", bankNumber: "970416" },
    { BankName: "NCB", bankNumber: "970419" },
    { BankName: "ShinhanBank", bankNumber: "970424" },
    { BankName: "ABBANK", bankNumber: "970425" },
    { BankName: "VietABank", bankNumber: "970427" },
    { BankName: "NamABank", bankNumber: "970428" },
    { BankName: "SCB", bankNumber: "970429" },
    { BankName: "PGBank", bankNumber: "970430" },
    { BankName: "VietBank", bankNumber: "970433" },
    { BankName: "Vietcombank", bankNumber: "970436" },
    { BankName: "MSB", bankNumber: "970437" },
    { BankName: "BaoVietBank", bankNumber: "970438" },
    { BankName: "VIB", bankNumber: "970441" },
    { BankName: "SeABank", bankNumber: "970440" },
    { BankName: "OCB", bankNumber: "970442" },
    { BankName: "SHB", bankNumber: "970443" },
    { BankName: "TPBank", bankNumber: "970423" },
    { BankName: "MB", bankNumber: "970421" },
    { BankName: "VPBank", bankNumber: "970422" },
    { BankName: "HDBank", bankNumber: "970444" },
    { BankName: "LienVietPostBank", bankNumber: "970449" },
    { BankName: "KienLongBank", bankNumber: "970452" },
    { BankName: "VietCapitalBank", bankNumber: "970454" },
    { BankName: "Co-opBank", bankNumber: "970446" },
  ];

  useEffect(() => {
    // Format gender value for display
    // Format date of birth for display (convert from API format to HTML date input format)
    const formattedUser = {
      ...user,
      gender:
        user.gender === "MALE"
          ? "Nam"
          : user.gender === "FEMALE"
          ? "Nữ"
          : user.gender,
      dateOfBirth: user.dateOfBirth ? formatDateForInput(user.dateOfBirth) : "",
    };
    setProfileData(formattedUser);
    setAvatarPreview(user.avatar);
  }, [user]);

  // Format date from API format (e.g., "2000-01-01T00:00:00") to input format (e.g., "2000-01-01")
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    // If it's already in the correct format (YYYY-MM-DD), return as is
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    // Otherwise, try to parse and format
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  // Format date from input format (YYYY-MM-DD) to API format
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";
    // Return as is since API likely expects YYYY-MM-DD format
    return dateString;
  };

  const handleFieldUpdate = async (field: string, value: string) => {
    // Convert display values back to API values
    let updatedValue = value;
    let originalValue = profileData[field as keyof UserProfile];

    if (field === "gender") {
      if (value === "Nam") updatedValue = "MALE";
      else if (value === "Nữ") updatedValue = "FEMALE";
    } else if (field === "dateOfBirth") {
      // Format date for API
      updatedValue = formatDateForAPI(value);
    } else if (field === "bankName") {
      // Handle bank selection
      try {
        const bankData = JSON.parse(value);
        updatedValue = bankData.bankName;
        // Also update bankNo automatically
        setProfileData((prev) => ({ ...prev, bankNo: bankData.bankNumber }));
        await onUpdateUser({
          bankNo: bankData.bankNumber,
          bankName: bankData.bankName,
        } as Partial<UserProfile>);
        return; // Exit early since we've already handled the update
      } catch (e) {
        // If parsing fails, use the value as is
        updatedValue = value;
      }
    }

    setIsSaving(true);

    try {
      // Optimistically update the UI
      setProfileData((prev) => ({ ...prev, [field]: value }));
      await onUpdateUser({ [field]: updatedValue } as Partial<UserProfile>);
    } catch (err) {
      // Revert the local change if API call fails
      setProfileData((prev) => ({ ...prev, [field]: originalValue }));
      // Error will be handled by the existing error prop
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show saving state
        setIsSaving(true);
        setLocalError(null);

        // Upload the image first and get the URL
        const imageUrl = await onUploadAvatar(file);

        // Update preview with the new avatar URL
        setAvatarPreview(imageUrl);

        // Also update the profile data with the new avatar URL
        setProfileData((prev) => ({ ...prev, avatar: imageUrl }));

        // Update the user profile with the new avatar URL
        await onUpdateUser({ avatar: imageUrl });
      } catch (err: any) {
        // Revert to original avatar on error
        setAvatarPreview(user.avatar);

        // Set error message
        const errorMessage = err.message || "Tải ảnh lên thất bại";
        setLocalError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Error Modal for avatar upload errors */}
        {localError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-600">Lỗi</h3>
                <button
                  onClick={() => setLocalError(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-700 mb-6">{localError}</p>
              <button
                onClick={() => setLocalError(null)}
                className="w-full bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Error Modal for profile update errors */}
        {error && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-600">Lỗi</h3>
                <button
                  onClick={clearError}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-700 mb-6">{error}</p>
              <button
                onClick={clearError}
                className="w-full bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isSaving && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-700">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-36 h-36 overflow-hidden border-4 border-gray-100 rounded-full bg-white flex items-center justify-center shadow-lg">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="avatar"
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-18 h-18 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -right-2 -bottom-2 bg-green-600 border-4 border-white shadow-lg rounded-full w-10 h-10 p-2 cursor-pointer flex items-center justify-center transition-all hover:bg-green-700 hover:scale-105 duration-200"
                >
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
                {profileData.fullName || "User Name"}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>{profileData.nickName || "No nickname"}</span>
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
                value={profileData.fullName || ""}
                onChange={(value) => handleFieldUpdate("fullName", value)}
                icon={<User className="w-4 h-4" />}
                isEditing={editingField === "fullName"}
                onEdit={() => setEditingField("fullName")}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter your name"
              />
              <InlineInput
                label="Nickname"
                value={profileData.nickName || ""}
                onChange={(value) => handleFieldUpdate("nickName", value)}
                icon={<UserCircle className="w-4 h-4" />}
                isEditing={editingField === "nickName"}
                onEdit={() => setEditingField("nickName")}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter nickname"
              />
              <InlineInput
                label="Phone Number"
                value={profileData.phoneNumber || ""}
                onChange={(value) => handleFieldUpdate("phoneNumber", value)}
                type="tel"
                icon={<Phone className="w-4 h-4" />}
                isEditing={editingField === "phoneNumber"}
                onEdit={() => setEditingField("phoneNumber")}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter phone number"
              />
              <InlineInput
                label="Date of Birth"
                value={profileData.dateOfBirth || ""}
                onChange={(value) => handleFieldUpdate("dateOfBirth", value)}
                type="date"
                icon={<Calendar className="w-4 h-4" />}
                isEditing={editingField === "dateOfBirth"}
                onEdit={() => setEditingField("dateOfBirth")}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
              />
              <InlineInput
                label="Gender"
                value={profileData.gender || ""}
                onChange={(value) => handleFieldUpdate("gender", value)}
                icon={<User className="w-4 h-4" />}
                isEditing={editingField === "gender"}
                onEdit={() => setEditingField("gender")}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                options={["Nam", "Nữ"]} // Add gender options
              />
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InlineInput
                label="Bank Name"
                value={profileData.bankName || ""}
                onChange={(value) => handleFieldUpdate("bankName", value)}
                icon={<Building className="w-4 h-4" />}
                isEditing={editingField === "bankName"}
                onEdit={() => setEditingField("bankName")}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Select bank"
                bankOptions={bankOptions}
              />
              <InlineInput
                label="Account Number"
                value={profileData.accountNo || ""}
                onChange={(value) => handleFieldUpdate("accountNo", value)}
                icon={<Hash className="w-4 h-4" />}
                isEditing={editingField === "accountNo"}
                onEdit={() => setEditingField("accountNo")}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter account number"
              />
              <InlineInput
                label="Bank Number"
                value={profileData.bankNo || ""}
                onChange={(value) => handleFieldUpdate("bankNo", value)}
                icon={<CreditCard className="w-4 h-4" />}
                isEditing={false}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                placeholder="Bank number (auto-filled)"
                type="text"
                disabled={true}
              />
            </div>
          </div>

          {/* QR Code Section */}
          {profileData.bankName &&
            profileData.accountNo &&
            profileData.bankNo && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-green-600" />
                  </div>
                  Payment QR Code
                </h3>
                <div className="flex flex-col items-center">
                  {profileData.qrCode ? (
                    <div className="border-4 border-gray-200 rounded-xl p-4 bg-white">
                      <Image
                        src={profileData.qrCode}
                        alt="Payment QR Code"
                        width={200}
                        height={200}
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No QR code available
                    </div>
                  )}
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Use this QR code for receiving payments
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
