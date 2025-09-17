import React from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'confirm' | 'cancel';
  customerName?: string;
  fieldName?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type,
  customerName,
  fieldName
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                type === 'confirm' 
                  ? 'bg-green-100' 
                  : 'bg-orange-100'
              }`}>
                {type === 'confirm' ? (
                  <CheckCircle className={`w-6 h-6 ${
                    type === 'confirm' ? 'text-green-600' : 'text-orange-600'
                  }`} />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          
          {customerName && fieldName && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Khách hàng:</span>
                  <span className="text-sm font-medium text-gray-900">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sân:</span>
                  <span className="text-sm font-medium text-gray-900">{fieldName}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors font-medium ${
                type === 'confirm'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500'
                  : 'bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;