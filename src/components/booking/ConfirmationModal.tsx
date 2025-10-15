import React from 'react';
import UniversalModal from '../ui/UniversalModal';

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
  const modalType = type === 'confirm' ? 'confirm' : 'confirm'; // Both will use confirm type in UniversalModal
  
  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={message}
      type={modalType}
      confirmText={confirmText}
      cancelText={cancelText}
    >
      {customerName && fieldName && (
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
      )}
    </UniversalModal>
  );
};

export default ConfirmationModal;