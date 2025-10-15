import React from 'react';
import { Save, X, ChevronDown, Clock } from 'lucide-react';
import { Venue } from '../../types';
import ImageUpload from './ImageUpload';
import { fieldService } from '../../services/fieldService';

interface VenueFormProps {
  venue?: Venue;
  onSubmit: (venueData: Omit<Venue, 'id' | 'rating' | 'totalBookings' | 'createdAt' | 'reviews'>) => Promise<void>;
  onCancel: () => void;
}

// Define SportType interface to match API response
interface SportType {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  lastModifiedDate: string;
  status: boolean;
}

const VenueForm: React.FC<VenueFormProps> = ({ venue, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [showSportDropdown, setShowSportDropdown] = React.useState(false);
  const [timeErrors, setTimeErrors] = React.useState({ openTime: '', closeTime: '' });
  const [sportTypes, setSportTypes] = React.useState<SportType[]>([]);
  const [loadingSportTypes, setLoadingSportTypes] = React.useState(true);
  const sportDropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Format time data to ensure consistent HH:mm format
  const formatTimeForForm = (timeString: string | undefined) => {
    if (!timeString) return '06:00'; // default value
    // If time is in HH:mm:ss format, extract only HH:mm
    if (timeString.length > 5 && timeString.includes(':')) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  // Store selected sport type ID
  const [selectedSportTypeId, setSelectedSportTypeId] = React.useState<string>('');

  // Initialize form data with venue data if available - FIX: Initialize properly with venue data
  const [formData, setFormData] = React.useState(() => {
    if (venue) {
      console.log('Initializing form data with venue:', venue);
      // Type assertion to access API response properties
      const venueData = venue as any;
      return {
        name: venueData.fieldName || venueData.name || '',
        description: venueData.description || '',
        sport: venueData.typeFieldName || venueData.sport || '',
        images: venueData.images || [],
        hourlyRate: venueData.normalPricePerHour || venueData.hourlyRate || 0,
        openTime: formatTimeForForm(venueData.openTime),
        closeTime: formatTimeForForm(venueData.closeTime),
        location: venueData.location || '',
        isActive: venueData.available !== undefined ? venueData.available : (venueData.isActive ?? true)
      };
    }
    return {
      name: '',
      description: '',
      sport: '',
      images: [] as string[],
      hourlyRate: 0,
      openTime: '06:00',
      closeTime: '22:00',
      location: '',
      isActive: true
    };
  });

  // Update form data when venue prop changes (for when switching between edit modes)
  React.useEffect(() => {
    if (venue) {
      console.log('Updating form data with venue:', venue); // Debug log
      // Type assertion to access API response properties
      const venueData = venue as any;
      setFormData({
        name: venueData.fieldName || venueData.name || '',
        description: venueData.description || '',
        sport: venueData.typeFieldName || venueData.sport || '',
        images: venueData.images || [],
        hourlyRate: venueData.normalPricePerHour || venueData.hourlyRate || 0,
        openTime: formatTimeForForm(venueData.openTime),
        closeTime: formatTimeForForm(venueData.closeTime),
        location: venueData.location || '',
        isActive: venueData.available !== undefined ? venueData.available : (venueData.isActive ?? true)
      });
    }
  }, [venue]);

  // Fetch sport types from API and set selected sport type
  React.useEffect(() => {
    const fetchSportTypes = async () => {
      try {
        const data = await fieldService.getTypeFields();
        console.log('Fetched sport types:', data); // Debug log
        
        let sportsData: SportType[] = [];
        
        if (Array.isArray(data)) {
          sportsData = data;
        } else {
          // Fallback to default sport types if API response is not as expected
          sportsData = [
            { id: '1', name: 'Bóng đá', description: '', createdDate: '', lastModifiedDate: '', status: true },
            { id: '2', name: 'Tennis', description: '', createdDate: '', lastModifiedDate: '', status: true },
            { id: '3', name: 'Cầu lông', description: '', createdDate: '', lastModifiedDate: '', status: true },
            { id: '4', name: 'Bóng rổ', description: '', createdDate: '', lastModifiedDate: '', status: true },
            { id: '5', name: 'Bóng chuyền', description: '', createdDate: '', lastModifiedDate: '', status: true },
            { id: '6', name: 'Bóng bàn', description: '', createdDate: '', lastModifiedDate: '', status: true }
          ];
        }
        
        setSportTypes(sportsData);
        
        // IMPORTANT: Set selectedSportTypeId AFTER setting sport types
        // This ensures we don't overwrite form data
        if (venue) {
          // Type assertion to access API response properties
          const venueData = venue as any;
          const sportName = venueData.typeFieldName || venueData.sport;
          if (sportName) {
            const matchingSport = sportsData.find((sport: SportType) => sport.name === sportName);
            if (matchingSport) {
              console.log('Found matching sport for venue:', matchingSport); // Debug log
              setSelectedSportTypeId(matchingSport.id);
            }
          }
        }

      } catch (error) {
        console.error('Error fetching sport types:', error);
        // Fallback to default sport types in case of error
        const defaultSports = [
          { id: '1', name: 'Bóng đá', description: '', createdDate: '', lastModifiedDate: '', status: true },
          { id: '2', name: 'Tennis', description: '', createdDate: '', lastModifiedDate: '', status: true },
          { id: '3', name: 'Cầu lông', description: '', createdDate: '', lastModifiedDate: '', status: true },
          { id: '4', name: 'Bóng rổ', description: '', createdDate: '', lastModifiedDate: '', status: true },
          { id: '5', name: 'Bóng chuyền', description: '', createdDate: '', lastModifiedDate: '', status: true },
          { id: '6', name: 'Bóng bàn', description: '', createdDate: '', lastModifiedDate: '', status: true }
        ];
        setSportTypes(defaultSports);
        
        // Find matching sport in default list
        if (venue) {
          // Type assertion to access API response properties
          const venueData = venue as any;
          const sportName = venueData.typeFieldName || venueData.sport;
          if (sportName) {
            const matchingSport = defaultSports.find(sport => sport.name === sportName);
            if (matchingSport) {
              console.log('Found matching sport in fallback:', matchingSport);
              setSelectedSportTypeId(matchingSport.id);
            }
          }
        }
      } finally {
        setLoadingSportTypes(false);
      }
    };

    fetchSportTypes();
  }, [venue]); // Keep venue as dependency to re-fetch when venue changes

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

  // Format price data for display
  const formatPriceForDisplay = (price: number) => {
    return price === 0 ? '' : price.toString();
  };

  // Handle price input change with leading zero prevention
  const handlePriceChange = (value: string) => {
    // Remove any non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    // Prevent leading zeros (except for the case where the value is just "0")
    let formattedValue = numericValue;
    if (numericValue.length > 1 && numericValue[0] === '0') {
      formattedValue = numericValue.replace(/^0+/, '') || '0';
    }
    
    // Convert to number and update state
    const numberValue = formattedValue === '' ? 0 : Number(formattedValue);
    setFormData(prev => ({ ...prev, hourlyRate: numberValue }));
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
    
    // Clear any previous submit error
    setSubmitError(null);
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên sân');
      return;
    }
    
    if (!formData.location.trim()) {
      alert('Vui lòng nhập địa chỉ');
      return;
    }
    
    // Updated validation for price fields
    if (formData.hourlyRate <= 0 || isNaN(formData.hourlyRate)) {
      alert('Giá thường phải lớn hơn 0');
      return;
    }
    
    // Validate that at least one image is provided
    if (formData.images.length === 0) {
      alert('Vui lòng tải lên ít nhất một hình ảnh');
      return;
    }
    
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
    
    // Validate that a sport type is selected
    if (!selectedSportTypeId) {
      alert('Vui lòng chọn loại thể thao');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Calculate peak rate as hourly rate + 20%
      const peakRate = Math.round(formData.hourlyRate * 1.2);
      
      // Format time as HH:mm:ss strings
      const openTime = `${formData.openTime}:00`;
      const closeTime = `${formData.closeTime}:00`;
      
      // Get owner ID from sessionStorage or use a default
      const ownerId = sessionStorage.getItem('userId') || '2654c1af-0500-4170-b365-bf395e8a67de';
      
      // If editing an existing venue, call updateFieldAPI
      if (venue) {
        // Prepare data for update API call - using the correct format
        const updateData = {
          fieldId: venue.id,
          typeFieldId: selectedSportTypeId, // Use the selected sport type ID
          fieldName: formData.name.trim(),
          location: formData.location.trim(),
          normalPricePerHour: Number(formData.hourlyRate),
          peakPricePerHour: peakRate, // Automatically calculated peak rate
          openTime: openTime, // Send as string in HH:mm:ss format
          closeTime: closeTime, // Send as string in HH:mm:ss format
          description: formData.description.trim(),
          images: formData.images,
          available: formData.isActive
        };
        
        console.log('Sending update data:', updateData);
        
        // Call the fieldService.updateFieldAPI method
        await fieldService.updateFieldAPI(updateData);
      } 
      // If creating a new venue, call fieldService.createField
      else {
        // Prepare data for create API call - using the correct format
        const createData = {
          fieldName: formData.name.trim(),
          typeFieldId: selectedSportTypeId, // Use the selected sport type ID
          location: formData.location.trim(),
          normalPricePerHour: Number(formData.hourlyRate),
          peakPricePerHour: peakRate, // Automatically calculated peak rate
          openTime: openTime, // Send as string in HH:mm:ss format
          closeTime: closeTime, // Send as string in HH:mm:ss format
          description: formData.description.trim(),
          ownerId: ownerId,
          images: formData.images,
          available: formData.isActive
        };
        
        console.log('Sending create data:', createData);
        
        // Call the fieldService.createField method
        await fieldService.createField(createData);
      }
      
      // For both create and update, still call the onSubmit callback for UI updates
      // Create a new object with peakRate for onSubmit callback
      const venueDataWithPeakRate = {
        ...formData,
        peakRate: peakRate
      };
      await onSubmit(venueDataWithPeakRate);
      
      // Show success message
      alert('Sân đã được lưu thành công!');
    } catch (error: any) {
      console.error('Error submitting venue form:', error);
      const errorMessage = error.message || 'Có lỗi xảy ra khi lưu sân. Vui lòng thử lại.';
      setSubmitError(errorMessage);
      alert(`Lỗi khi lưu sân: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Force update form data after sport types are loaded
  React.useEffect(() => {
    // Only run this after sport types are loaded and we have venue data
    if (!loadingSportTypes && venue && sportTypes.length > 0) {
      console.log('Force updating form data after sport types loaded:', venue);
      
      // Type assertion to access API response properties
      const venueData = venue as any;
      setFormData(prev => ({
        ...prev,
        name: venueData.fieldName || venueData.name || '',
        description: venueData.description || '',
        sport: venueData.typeFieldName || venueData.sport || '',
        images: venueData.images || [],
        hourlyRate: venueData.normalPricePerHour || venueData.hourlyRate || 0,
        openTime: formatTimeForForm(venueData.openTime),
        closeTime: formatTimeForForm(venueData.closeTime),
        location: venueData.location || '',
        isActive: venueData.available !== undefined ? venueData.available : (venueData.isActive ?? true)
      }));
      
      // Also update selected sport type ID
      const sportName = venueData.typeFieldName || venueData.sport;
      if (sportName) {
        const matchingSport = sportTypes.find(sport => sport.name === sportName);
        if (matchingSport) {
          console.log('Setting selected sport type after load:', matchingSport);
          setSelectedSportTypeId(matchingSport.id);
        }
      }
    }
  }, [loadingSportTypes, venue, sportTypes]); // Dependencies: when sport types finish loading, venue changes, or sport types change

  // Debug: Log current form data and venue
  React.useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('Current venue prop:', venue);
    console.log('Current form data:', formData);
    console.log('Selected sport type ID:', selectedSportTypeId);
    console.log('Sport types loaded:', !loadingSportTypes);
    console.log('Sport types count:', sportTypes.length);
  }, [venue, formData, selectedSportTypeId, loadingSportTypes, sportTypes]);

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
          {/* Submit error message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{submitError}</p>
            </div>
          )}
          
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
                  disabled={isSubmitting || loadingSportTypes}
                >
                  <span className={formData.sport ? 'text-gray-900' : 'text-gray-500'}>
                    {loadingSportTypes ? 'Đang tải...' : (formData.sport || 'Chọn loại thể thao')}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    showSportDropdown ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {showSportDropdown && !loadingSportTypes && (
                  <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {sportTypes.map((sport, index) => (
                        <button
                          key={sport.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, sport: sport.name }));
                            setSelectedSportTypeId(sport.id);
                            setShowSportDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                            formData.sport === sport.name ? 'bg-gray-100 font-medium' : ''
                          } ${
                            index === 0 ? 'rounded-t-lg' : ''
                          } ${
                            index === sportTypes.length - 1 ? 'rounded-b-lg' : ''
                          }`}
                          disabled={isSubmitting}
                        >
                          {sport.name}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá Thường (VNĐ/giờ)
            </label>
            <input
              type="text"
              value={formatPriceForDisplay(formData.hourlyRate)}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nhập giá thường"
              required
              disabled={isSubmitting}
            />
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