'use client';

import React from 'react';
import { Venue } from '../../types';
import {
  Edit,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Settings,
  Trophy,
} from 'lucide-react';
import ImageCarousel from './ImageCarousel';

interface VenueCardProps {
  venue: Venue;
  subFieldsCount: number;
  onEdit: () => void;
  onViewReviews: () => void;
  formatCurrency: (amount: number) => string;
}

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  subFieldsCount,
  onEdit,
  onViewReviews,
  formatCurrency,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <ImageCarousel
          images={venue.images}
          alt={venue.name}
          className="w-full h-full"
        />
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
              venue.isActive
                ? 'bg-green-500/90 text-white shadow-sm'
                : 'bg-red-500/90 text-white shadow-sm'
            }`}
          >
            {venue.isActive ? 'Hoạt động' : 'Tạm dừng'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{venue.name}</h2>
            <p className="text-gray-600 text-sm">{venue.description}</p>
          </div>
          <div className="flex items-center space-x-1 ml-4">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{venue.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4" />
              <span className="font-medium text-green-600">{venue.sport}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{venue.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{venue.openTime} - {venue.closeTime}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>{formatCurrency(venue.hourlyRate)}/giờ</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Settings className="w-4 h-4" />
              <span>{subFieldsCount} sân nhỏ</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Đánh giá:</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.round(venue.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({venue.reviews.length} đánh giá)</span>
            </div>
            <button
              onClick={onViewReviews}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Xem tất cả
            </button>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Chỉnh sửa thông tin sân lớn</span>
        </button>
      </div>
    </div>
  );
};

export default VenueCard;