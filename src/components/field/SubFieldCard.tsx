'use client';

import React from 'react';
import { SubField, Venue } from '../../types';
import {
  Edit,
  Users,
  Play,
  Pause,
  Calendar,
  Trash2,
} from 'lucide-react';

interface SubFieldCardProps {
  subField: SubField;
  venue: Venue;
  onEdit: () => void;
  onToggleStatus: () => void;
  onViewCalendar: () => void;
  onDelete: () => void;
}

const SubFieldCard: React.FC<SubFieldCardProps> = ({
  subField,
  venue,
  onEdit,
  onToggleStatus,
  onViewCalendar,
  onDelete,
}) => {

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow relative overflow-hidden ${
      !venue.isActive ? 'opacity-60' : ''
    }`}>
      {/* Diagonal stripes overlay when venue is inactive */}
      {!venue.isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #666 10px, #666 20px)',
            }}
          />
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900">{subField.name}</h3>
            {!venue.isActive && (
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                Sân lớn tạm dừng
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{venue.sport}</p>
          {subField.description && (
            <p className="text-xs text-gray-500 mt-1">{subField.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              subField.isActive
                ? 'bg-green-500/90 text-white shadow-sm'
                : 'bg-red-500/90 text-white shadow-sm'
            }`}
          >
            {subField.isActive ? 'Hoạt động' : 'Tạm dừng'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Users className="w-4 h-4" />
        <span>{subField.capacity} người</span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onViewCalendar}
          disabled={!venue.isActive}
          className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
            !venue.isActive 
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
              : 'text-white bg-gray-900 hover:bg-gray-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Lịch</span>
        </button>
        <button
          onClick={onEdit}
          disabled={!venue.isActive}
          className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
            !venue.isActive 
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
              : 'text-white bg-green-500/90 hover:bg-green-400'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm">Sửa</span>
        </button>
        <button
          onClick={onDelete}
          disabled={!venue.isActive}
          className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
            !venue.isActive 
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
              : 'text-white bg-red-500 hover:bg-red-600'
          }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SubFieldCard;