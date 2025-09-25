'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fieldService } from '../../services/fieldService';
import { X, CreditCard, Hash, Building, ChevronDown, User, Mail, Lock, Wallet } from 'lucide-react';

interface CreateOwnerFormProps {
  onCancel: () => void;
  onOwnerCreated: () => void;
}

const CreateOwnerForm: React.FC<CreateOwnerFormProps> = ({ onCancel, onOwnerCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    bankNo: '',
    accountNo: '',
    bankName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const bankDropdownRef = useRef<HTMLDivElement>(null);
  const bankButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  // Bank options data (same as in ProfileSettings)
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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bankDropdownRef.current &&
        bankButtonRef.current &&
        !bankDropdownRef.current.contains(event.target as Node) &&
        !bankButtonRef.current.contains(event.target as Node)
      ) {
        setIsBankDropdownOpen(false);
      }
    };

    if (isBankDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBankDropdownOpen]);

  // Calculate dropdown position to prevent clipping
  useEffect(() => {
    const calculatePosition = () => {
      if (bankButtonRef.current && isBankDropdownOpen) {
        const buttonRect = bankButtonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        
        // If there's not enough space below, show dropdown above
        if (spaceBelow < 300 && spaceAbove > spaceBelow) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    };

    calculatePosition();
    
    const handleScroll = () => {
      calculatePosition();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isBankDropdownOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle bank selection
  const handleBankSelect = (bankName: string, bankNumber: string) => {
    setFormData(prev => ({
      ...prev,
      bankName: bankName,
      bankNo: bankNumber
    }));
    setIsBankDropdownOpen(false);
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.email || 
        !formData.bankNo || !formData.accountNo || !formData.bankName) {
      setError('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await fieldService.createOwner(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        username: '',
        password: '',
        email: '',
        bankNo: '',
        accountNo: '',
        bankName: ''
      });
      // Notify parent component
      onOwnerCreated();
    } catch (err: any) {
      setError(err.message || 'Không thể tạo tài khoản chủ sân');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">Tạo Tài Khoản Chủ Sân</h2>
                <p className="text-green-100 mt-1">Tạo tài khoản mới cho chủ sân bóng đá</p>
              </div>
              <button 
                onClick={onCancel}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-xl shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-green-800 font-semibold">Thành công!</h4>
                    <p className="text-green-700">Tài khoản chủ sân đã được tạo thành công!</p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-r-xl shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-red-800 font-semibold">Có lỗi xảy ra!</h4>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* User Information Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Nhập username"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Information Section */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-green-600" />
                  Thông tin ngân hàng
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tên ngân hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        ref={bankButtonRef}
                        type="button"
                        onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 text-left group ${
                          isBankDropdownOpen
                            ? "border-green-600 ring-4 ring-green-500/20"
                            : "border-gray-200 hover:border-green-400"
                        }`}
                      >
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus:text-green-600">
                          <Building className="w-5 h-5" />
                        </div>
                        <span className={formData.bankName ? "text-gray-800" : "text-gray-400"}>
                          {formData.bankName ? `${formData.bankName} (${formData.bankNo})` : "Chọn ngân hàng"}
                        </span>
                        <ChevronDown
                          className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            isBankDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown options */}
                      {isBankDropdownOpen && (
                        <div
                          ref={bankDropdownRef}
                          className={`absolute mt-2 w-full bg-white border-2 border-green-500 rounded-xl shadow-2xl max-h-64 overflow-hidden ${
                            dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full'
                          }`}
                          style={{ zIndex: 1000 }}
                        >
                          <div className="max-h-64 overflow-y-auto">
                            {bankOptions.map((bank, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleBankSelect(bank.BankName, bank.bankNumber)}
                                className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors duration-150 text-gray-800 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium">{bank.BankName}</div>
                                <div className="text-sm text-gray-500">{bank.bankNumber}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Mã ngân hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="bankNo"
                        value={formData.bankNo}
                        onChange={handleChange}
                        className="w-full pl-12 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                        placeholder="Mã ngân hàng (tự động)"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Số tài khoản <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <Hash className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="accountNo"
                        value={formData.accountNo}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Nhập số tài khoản"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  disabled={loading}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[140px]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang tạo...
                    </div>
                  ) : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOwnerForm