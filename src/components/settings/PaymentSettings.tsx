'use client'

import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, CheckCircle, QrCode, Edit2, Save, X, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface PaymentAccount {
  id: string;
  type: "bank";
  accountName: string;
  accountNumber: string;
  bankName?: string;
  qrCode?: string;
  isVerified: boolean;
}

const BANKS = [
  { code: "VCB", name: "Vietcombank" },
  { code: "TCB", name: "Techcombank" },
  { code: "ACB", name: "ACB" },
  { code: "MB", name: "MB Bank" },
];

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
  options?: { value: string; label: string }[];
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
  options
}) => {
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

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
              {options ? (
                <select
                  ref={inputRef as React.RefObject<HTMLSelectElement>}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-4 py-3 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 ${icon ? 'pl-10' : ''}`}
                >
                  <option value="">{placeholder}</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={type}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-4 py-3 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200 ${icon ? 'pl-10' : ''}`}
                  placeholder={placeholder}
                />
              )}
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

const PaymentSettings: React.FC = () => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount | null>(
    null
  );
  const [editAccount, setEditAccount] = useState<Partial<PaymentAccount>>({
    type: "bank",
  });
  const [loading, setLoading] = useState(false);
  // Fake generate VietQR (thực tế sẽ gọi API bên thứ 3)
  const generateVietQR = (bankCode: string, accountNumber: string) => {
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png`;
  };

  const handleSaveBankAccount = async () => {
    if (!editAccount.accountName || !editAccount.bankName || !editAccount.accountNumber) return;
    setLoading(true);
    try {
      const qrCodeUrl = generateVietQR(editAccount.bankName, editAccount.accountNumber);

      const newAccount: PaymentAccount = {
        id: Date.now().toString(),
        type: "bank",
        accountName: editAccount.accountName,
        accountNumber: editAccount.accountNumber,
        bankName: editAccount.bankName,
        qrCode: qrCodeUrl,
        isVerified: true,
      };
      setPaymentAccount(newAccount);
      setEditAccount({ type: "bank" });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldUpdate = (field: string, value: string) => {
    setEditAccount(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">

        <div className="space-y-8">
          {/* Current Payment Method */}
          {paymentAccount && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                Current Payment Method
              </h3>
              
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center justify-center">
                    {paymentAccount.qrCode ? (
                      <Image 
                        src={paymentAccount.qrCode} 
                        alt="QR Code" 
                        width={60} 
                        height={60} 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <QrCode className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {paymentAccount.accountName}
                      {paymentAccount.isVerified && (
                        <CheckCircle className="w-5 h-5 inline ml-2 text-green-600" />
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {BANKS.find(b => b.code === paymentAccount.bankName)?.name || paymentAccount.bankName}
                    </p>
                    <p className="text-sm font-mono text-gray-500">
                      {paymentAccount.accountNumber}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setPaymentAccount(null)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Add/Edit Payment Method */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              {paymentAccount ? 'Update Payment Method' : 'Add Payment Method'}
            </h3>

            <div className="space-y-8">
              {/* Bank Selection */}
              <InlineInput
                label="Bank Name"
                value={editAccount.bankName || ""}
                onChange={(value) => handleFieldUpdate('bankName', value)}
                isEditing={editingField === 'bankName'}
                onEdit={() => setEditingField('bankName')}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Select bank"
                options={BANKS.map(bank => ({ value: bank.code, label: bank.name }))}
              />

              {/* Account Number */}
              <InlineInput
                label="Account Number"
                value={editAccount.accountNumber || ""}
                onChange={(value) => handleFieldUpdate('accountNumber', value)}
                isEditing={editingField === 'accountNumber'}
                onEdit={() => setEditingField('accountNumber')}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter account number"
              />

              {/* Account Holder Name */}
              <InlineInput
                label="Account Holder Name"
                value={editAccount.accountName || ""}
                onChange={(value) => handleFieldUpdate('accountName', value)}
                isEditing={editingField === 'accountName'}
                onEdit={() => setEditingField('accountName')}
                onSave={() => setEditingField(null)}
                onCancel={() => setEditingField(null)}
                placeholder="Enter account holder name"
              />

              {/* Save Button */}
              <div className="pt-6">
                <button
                  onClick={handleSaveBankAccount}
                  disabled={!editAccount.accountName || !editAccount.bankName || !editAccount.accountNumber || loading}
                  className="w-full px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {paymentAccount ? 'Update Payment Method' : 'Add Payment Method'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;