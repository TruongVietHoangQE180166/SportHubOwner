'use client';

import React from 'react';
import Image from 'next/image';
import { Venue as Field } from '../../types'; // Note: Using Venue as Field due to missing Field type definition
import { X } from 'lucide-react';

interface FieldDetailModalProps {
  field: Field;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
}

const FieldDetailModal: React.FC<FieldDetailModalProps> = ({
  field,
  onClose,
  formatCurrency,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{field.name}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {field.images && field.images[0] && (
            <div className="w-full h-48 relative rounded-lg overflow-hidden">
              <Image
                src={field.images[0]}
                alt={field.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            </div>
          )}

          {/* Thông tin cơ bản + giờ & giá */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Thông Tin Cơ Bản</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Loại:</span> {field.sport}</p>
                {field.capacity && (
                  <p><span className="text-gray-600">Sức chứa:</span> {field.capacity} người</p>
                )}
                <p><span className="text-gray-600">Đánh giá:</span> {field.rating}/5</p>
                <p><span className="text-gray-600">Tổng đặt:</span> {field.totalBookings}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Giờ & Giá</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Giờ mở:</span> {field.openTime} - {field.closeTime}</p>
                <p><span className="text-gray-600">Giá thường:</span> {formatCurrency(field.hourlyRate)}</p>
                <p><span className="text-gray-600">Giá cao điểm:</span> {formatCurrency(field.peakRate)}</p>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Mô Tả</h4>
            <p className="text-gray-600 text-sm">{field.description}</p>
          </div>

          {/* Tiện ích */}
          {field.amenities && field.amenities.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tiện Ích</h4>
              <div className="flex flex-wrap gap-2">
                {field.amenities.map((amenity: string) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldDetailModal;