import React from 'react';
import { Save, X, ChevronDown, Clock } from 'lucide-react';
import { Venue } from '../../types';
import ImageUpload from './ImageUpload';

interface VenueFormProps {
  venue?: Venue;
  onSubmit: (venueData: Omit<Venue, 'id' | 'rating' | 'totalBookings' | 'createdAt' | 'reviews'>) => Promise<void>;
  onCancel: () => void;
}

const sportTypes = ['Bóng đá', 'Tennis', 'Cầu lông', 'Bóng rổ', 'Bóng chuyền', 'Bóng bàn'];

const VenueForm: React.FC<VenueFormProps> = ({ venue, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSportDropdown, setShowSportDropdown] = React.useState(false);
  const [timeErrors, setTimeErrors] = React.useState({ openTime: '', closeTime: '' });
  const sportDropdownRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = React.useState({
    name: venue?.name || '',
    description: venue?.description || '',
    sport: venue?.sport || '',
    images: venue?.images || [],
    hourlyRate: venue?.hourlyRate || 0,
    peakRate: venue?.peakRate || 0,
    openTime: venue?.openTime || '06:00',
    closeTime: venue?.closeTime || '22:00',
    location: venue?.location || '',
    isActive: venue?.isActive ?? true
  });

  // Validate time format (HH:mm)
  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Format time input (auto-add colon)
  const formatTimeInput = (value: string): string => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as HH:mm
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }
  };

  // Handle time input change
  const handleTimeChange = (field: 'openTime' | 'closeTime', value: string) => {
    const formattedValue = formatTimeInput(value);
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (timeErrors[field]) {
      setTimeErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate time on blur
  const handleTimeBlur = (field: 'openTime' | 'closeTime', value: string) => {
    if (value && !validateTimeFormat(value)) {
      setTimeErrors(prev => ({ 
        ...prev, 
        [field]: 'Định dạng thời gian không hợp lệ (HH:mm)' 
      }));
    } else {
      setTimeErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target as Node)) {
        setShowSportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate time formats before submitting
    const openTimeValid = validateTimeFormat(formData.openTime);
    const closeTimeValid = validateTimeFormat(formData.closeTime);
    
    if (!openTimeValid || !closeTimeValid) {
      setTimeErrors({
        openTime: !openTimeValid ? 'Định dạng thời gian không hợp lệ (HH:mm)' : '',
        closeTime: !closeTimeValid ? 'Định dạng thời gian không hợp lệ (HH:mm)' : ''
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting venue form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {venue ? 'Chỉnh Sửa Sân Lớn' : 'Tạo Sân Lớn'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Sân lớn chứa thông tin chung cho tất cả các sân nhỏ bên trong
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div>
            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData(prev => ({ ...prev, images }))}
              maxImages={5}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Sân Lớn
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="VD: Sân Thể Thao ABC"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô Tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Mô tả tổng quan về sân thể thao"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={sportDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại Thể Thao
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSportDropdown(!showSportDropdown)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-left flex items-center justify-between"
                  disabled={isSubmitting}
                >
                  <span className={formData.sport ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.sport || 'Chọn loại thể thao'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    showSportDropdown ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {showSportDropdown && (
                  <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {sportTypes.map((sport, index) => (
                        <button
                          key={sport}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, sport }));
                            setShowSportDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                            formData.sport === sport ? 'bg-gray-100 font-medium' : ''
                          } ${
                            index === 0 ? 'rounded-t-lg' : ''
                          } ${
                            index === sportTypes.length - 1 ? 'rounded-b-lg' : ''
                          }`}
                          disabled={isSubmitting}
                        >
                          {sport}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa Chỉ
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Địa chỉ đầy đủ của sân thể thao"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá Thường (VNĐ/giờ)
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ Mở Cửa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.openTime}
                  onChange={(e) => handleTimeChange('openTime', e.target.value)}
                  onBlur={(e) => handleTimeBlur('openTime', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    timeErrors.openTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="06:00"
                  maxLength={5}
                  required
                  disabled={isSubmitting}
                />
              </div>
              {timeErrors.openTime && (
                <p className="mt-1 text-sm text-red-600">{timeErrors.openTime}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Định dạng: HH:mm (VD: 06:00, 08:30)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ Đóng Cửa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.closeTime}
                  onChange={(e) => handleTimeChange('closeTime', e.target.value)}
                  onBlur={(e) => handleTimeBlur('closeTime', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    timeErrors.closeTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="22:00"
                  maxLength={5}
                  required
                  disabled={isSubmitting}
                />
              </div>
              {timeErrors.closeTime && (
                <p className="mt-1 text-sm text-red-600">{timeErrors.closeTime}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Định dạng: HH:mm (VD: 22:00, 23:30)</p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:outline-none focus:ring-green-500"
              disabled={isSubmitting}
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Sân đang hoạt động
            </label>
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
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default VenueForm;