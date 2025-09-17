import React from 'react';
import { 
  Save,
  X
} from 'lucide-react';
import { Venue as Field } from '../../types';

interface FieldFormProps {
  field?: Field;
  onSubmit: (fieldData: Omit<Field, 'id' | 'rating' | 'totalBookings' | 'reviews' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
}

const sportTypes = ['Football', 'Tennis', 'Badminton', 'Basketball', 'Volleyball'];
const availableAmenities = ['Parking', 'Lighting', 'Changing Room', 'Shower', 'Water', 'Air Conditioning', 'Sound System', 'Equipment Rental', 'Seating'];

const FieldForm: React.FC<FieldFormProps> = ({ field, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: field?.name || '',
    sport: field?.sport || '',
    description: field?.description || '',
    images: field?.images || [''],
    amenities: field?.amenities || [],
    hourlyRate: field?.hourlyRate || 0,
    peakRate: field?.peakRate || 0,
    openTime: field?.openTime || '06:00',
    closeTime: field?.closeTime || '22:00',
    location: field?.location || '',
    capacity: field?.capacity || 0,
    isActive: field?.isActive ?? true
  });

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {field ? 'Chỉnh Sửa Sân' : 'Thêm Sân Mới'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Sân
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên sân"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại Thể Thao
              </label>
              <select
                value={formData.sport}
                onChange={(e) => setFormData(prev => ({ ...prev, sport: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              >
                <option value="">Chọn loại thể thao</option>
                {sportTypes.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô Tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về sân"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá Thường (VNĐ/giờ)
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá Cao Điểm (VNĐ/giờ)
              </label>
              <input
                type="number"
                value={formData.peakRate}
                onChange={(e) => setFormData(prev => ({ ...prev, peakRate: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sức Chứa
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ Mở Cửa
              </label>
              <input
                type="time"
                value={formData.openTime}
                onChange={(e) => setFormData(prev => ({ ...prev, openTime: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ Đóng Cửa
              </label>
              <input
                type="time"
                value={formData.closeTime}
                onChange={(e) => setFormData(prev => ({ ...prev, closeTime: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa Chỉ
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Địa chỉ sân"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tiện Ích
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FieldForm;