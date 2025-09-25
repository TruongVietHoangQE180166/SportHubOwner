'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react';
import VenueForm from '../field/VenueForm';
import VenueCard from '../field/VenueCard';
import SubFieldForm from '../field/SubFieldForm';
import SubFieldCard from '../field/SubFieldCard';
import Reviews from '../field/Reviews';
import Pagination from '../field/Pagination';
import FieldCalendar from '../field/FieldCalendar';
import { useAuthStore } from '../../stores/authStore';
import { Plus, Building2, Map, Loader2 } from 'lucide-react';
import { Venue, SubField, Review } from '../../types';
import { fieldService } from '../../services/fieldService';

const ManageFieldPage: React.FC = () => {
  const { user } = useAuthStore();
  
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [subFields, setSubFields] = useState<SubField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [showSubFieldForm, setShowSubFieldForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSubField, setSelectedSubField] = useState<SubField | null>(null);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [editingSubField, setEditingSubField] = useState<SubField | null>(null);
  
  // Pagination state for sub-fields
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Sử dụng ref để track submit requests
  const submitInProgress = useRef(false);

  // Fetch sub-fields for a venue
  const fetchSubFields = useCallback(async (venueId: string) => {
    try {
      const subFieldsResponse = await fieldService.getSmallFields(
        1,     // page
        100,   // size
        'createdDate',
        'desc',
        venueId
      );
      
      // Handle response data
      if (subFieldsResponse && subFieldsResponse.data) {
        // Check if response has content property (paginated response)
        let subFieldsData = [];
        if (subFieldsResponse.data.content) {
          subFieldsData = Array.isArray(subFieldsResponse.data.content) 
            ? subFieldsResponse.data.content 
            : [subFieldsResponse.data.content];
        } else {
          subFieldsData = Array.isArray(subFieldsResponse.data) 
            ? subFieldsResponse.data 
            : [subFieldsResponse.data];
        }
        
        // Map API response to SubField format if needed
        const mappedSubFields: SubField[] = subFieldsData.map((sf: any) => ({
          id: sf.id,
          venueId: sf.fieldId,
          name: sf.smallFiledName,
          capacity: parseInt(sf.capacity) || 0,
          isActive: sf.available,
          totalBookings: sf.totalBookings || 0,
          description: sf.description || ''
        }));
        
        setSubFields(mappedSubFields);
      } else {
        setSubFields([]);
      }
    } catch (subFieldError) {
      console.error('Error fetching sub-fields:', subFieldError);
      setSubFields([]);
    }
  }, []);

  // Helper function to format time data to ensure consistent HH:mm format
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '06:00'; // default value
    // If time is in HH:mm:ss format, extract only HH:mm
    if (timeString.length > 5 && timeString.includes(':')) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  // Helper function to map rate responses to reviews
  const mapRateResponsesToReviews = (rateResponses: any[]): Review[] => {
    return rateResponses.map((rateResponse: any) => ({
      id: rateResponse.id || '',
      userId: rateResponse.userId || rateResponse.id || '',
      userName: rateResponse.email || 'Người dùng',
      rating: rateResponse.rating || 5, // Use provided rating or default to 5 stars
      comment: rateResponse.comment || '',
      date: rateResponse.createdDate || new Date().toISOString(),
      userAvatar: rateResponse.avatar || ''
    }));
  };

  // Fetch venues data
  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get userId from auth store
      if (!user || !user.id) {
        throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      }

      // Call getFieldDetail function
      const response = await fieldService.getFieldDetail(
        1,    // page
        100,  // size - get all venues for this user
        'createdDate',
        'desc',
        user.id
      );

      // Handle response data
      if (response && response.data) {
        // Check if response has content property (paginated response)
        let venuesData = [];
        if (response.data.content) {
          venuesData = Array.isArray(response.data.content) ? response.data.content : [response.data.content];
        } else {
          venuesData = Array.isArray(response.data) ? response.data : [response.data];
        }
        
        // Map API response properties to Venue properties for all venues
          const mappedVenues: Venue[] = venuesData.map((venueData: any) => ({
            ...venueData,
            name: venueData.fieldName || venueData.name || '',
            sport: venueData.typeFieldName || venueData.sport || '',
            hourlyRate: venueData.normalPricePerHour || venueData.hourlyRate || 0,
            peakRate: venueData.peakPricePerHour || venueData.peakRate || 0,
            isActive: venueData.available !== undefined ? venueData.available : (venueData.isActive ?? true),
            rating: venueData.averageRating || venueData.rating || 0,
            totalBookings: venueData.totalBookings || 0,
            reviews: mapRateResponsesToReviews(venueData.rateResponses || venueData.reviews || []),
            createdAt: venueData.createdDate || venueData.createdAt || '',
            ownerPhone: venueData.numberPhone || venueData.ownerPhone || '',
            openTime: formatTime(venueData.openTime),
            closeTime: formatTime(venueData.closeTime)
          }));
          setVenues(mappedVenues);
        
        // Set the first venue as current venue, or null if no venues
        if (venuesData.length > 0) {
          // Map API response to Venue format if needed
          const venueData = venuesData[0];
          // Map API response properties to Venue properties
          const venue: Venue = {
            ...venueData,
            name: venueData.fieldName || venueData.name || '',
            sport: venueData.typeFieldName || venueData.sport || '',
            hourlyRate: venueData.normalPricePerHour || venueData.hourlyRate || 0,
            peakRate: venueData.peakPricePerHour || venueData.peakRate || 0,
            isActive: venueData.available !== undefined ? venueData.available : (venueData.isActive ?? true),
            rating: venueData.averageRating || venueData.rating || 0,
            totalBookings: venueData.totalBookings || 0,
            reviews: mapRateResponsesToReviews(venueData.rateResponses || venueData.reviews || []),
            createdAt: venueData.createdDate || venueData.createdAt || '',
            ownerPhone: venueData.numberPhone || venueData.ownerPhone || '',
            openTime: formatTime(venueData.openTime),
            closeTime: formatTime(venueData.closeTime)
          };
          setVenue(venue);
          // Fetch sub-fields for this venue
          await fetchSubFields(venue.id);
        } else {
          setVenue(null);
          setSubFields([]);
        }
      } else {
        setVenues([]);
        setVenue(null);
        setSubFields([]);
      }

    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin sân');
      console.error('Error fetching venues:', err);
      setVenues([]);
      setVenue(null);
      setSubFields([]);
    } finally {
      setLoading(false);
    }
  }, [user, venue?.id]);

  useEffect(() => {
    if (user) {
      fetchVenues();
    } else {
      setLoading(false);
      setError('Vui lòng đăng nhập để xem thông tin sân');
    }
  }, [user, fetchVenues]);

  useEffect(() => {
    if (venue) {
      fetchSubFields(venue.id);
    } else {
      setSubFields([]);
    }
  }, [venue, fetchSubFields]);

  const handleCreateVenue = useCallback(async (venueData: Omit<Venue, 'id' | 'rating' | 'totalBookings' | 'createdAt' | 'reviews'>) => {
    if (submitInProgress.current) {
      console.log('Submit already in progress, ignoring...');
      return;
    }
    
    submitInProgress.current = true;
    
    try {
      // TODO: Call API to create venue
      // const newVenue = await fieldService.createField(venueData);
      
      // For now, simulate API call
      // Type assertion to access API response properties
      const venueDataAny = venueData as any;
      const newVenue: Venue = {
        ...venueData,
        id: Date.now().toString(),
        rating: 0,
        totalBookings: 0,
        reviews: [],
        createdAt: new Date().toISOString(),
        name: venueDataAny.fieldName || venueDataAny.name || '',
        sport: venueDataAny.typeFieldName || venueDataAny.sport || '',
        hourlyRate: venueDataAny.normalPricePerHour || venueDataAny.hourlyRate || 0,
        peakRate: venueDataAny.peakPricePerHour || venueDataAny.peakRate || 0,
        isActive: venueDataAny.available !== undefined ? venueDataAny.available : (venueDataAny.isActive ?? true),
        openTime: formatTime(venueDataAny.openTime),
        closeTime: formatTime(venueDataAny.closeTime)
      };
      
      setVenues(prev => [...prev, newVenue]);
      setVenue(newVenue);
      setShowVenueForm(false);
      
      // Refresh data after creating
      await fetchVenues();
    } catch (error) {
      console.error('Error creating venue:', error);
      setError('Không thể tạo sân mới. Vui lòng thử lại.');
    } finally {
      submitInProgress.current = false;
    }
  }, [fetchVenues]);

  const handleUpdateVenue = useCallback(async (venueData: Omit<Venue, 'id' | 'rating' | 'totalBookings' | 'createdAt' | 'reviews'>) => {
    if (!editingVenue || submitInProgress.current) {
      return;
    }
    
    submitInProgress.current = true;
    
    try {
      // TODO: Call API to update venue
      // const updatedVenue = await fieldService.updateField(editingVenue.id, venueData);
      
      // For now, simulate API call
      // Type assertion to access API response properties
      const venueDataAny = venueData as any;
      const updatedVenue: Venue = {
        ...editingVenue,
        ...venueData,
        name: venueDataAny.fieldName || venueDataAny.name || '',
        sport: venueDataAny.typeFieldName || venueDataAny.sport || '',
        hourlyRate: venueDataAny.normalPricePerHour || venueDataAny.hourlyRate || 0,
        peakRate: venueDataAny.peakPricePerHour || venueDataAny.peakRate || 0,
        isActive: venueDataAny.available !== undefined ? venueDataAny.available : (venueDataAny.isActive ?? true),
        // Preserve rating and totalBookings from the existing venue
        rating: editingVenue.rating || 0,
        totalBookings: editingVenue.totalBookings || 0,
        reviews: editingVenue.reviews || [],
        openTime: formatTime(venueDataAny.openTime),
        closeTime: formatTime(venueDataAny.closeTime)
      };
      
      setVenues(prev => prev.map(v => v.id === editingVenue.id ? updatedVenue : v));
      setVenue(updatedVenue);
      setEditingVenue(null);
      
      // Refresh data after updating
      await fetchVenues();
    } catch (error) {
      console.error('Error updating venue:', error);
      setError('Không thể cập nhật sân. Vui lòng thử lại.');
    } finally {
      submitInProgress.current = false;
    }
  }, [editingVenue, fetchVenues]);

  const handleCreateSubField = useCallback(async (subFieldData: Omit<SubField, 'id' | 'totalBookings'>) => {
    if (submitInProgress.current || !venue) {
      return;
    }
    
    // Since the API call is now handled in SubFieldForm, we just need to update the UI
    try {
      // Create the new sub-field object for UI update
      const newSubField: SubField = {
        id: Date.now().toString(), // This will be replaced with actual ID from API response
        venueId: venue.id,
        name: subFieldData.name,
        capacity: subFieldData.capacity,
        isActive: subFieldData.isActive,
        totalBookings: 0,
        description: subFieldData.description || ''
      };
      
      setSubFields(prev => [...prev, newSubField]);
      setShowSubFieldForm(false);
      
      // Refresh sub-fields after creating a new one
      await fetchSubFields(venue.id);
    } catch (error: any) {
      console.error('Error updating UI after creating sub-field:', error);
      setError(error.message || 'Không thể tạo sân nhỏ. Vui lòng thử lại.');
    } finally {
      submitInProgress.current = false;
    }
  }, [venue, fetchSubFields]);

  const handleUpdateSubField = useCallback(async (subFieldData: Omit<SubField, 'id' | 'totalBookings'>) => {
    if (!editingSubField || submitInProgress.current) {
      return;
    }
    
    submitInProgress.current = true;
    
    try {
      // The API call is now handled in SubFieldForm, we just need to update the UI
      const updatedSubField: SubField = {
        ...editingSubField,
        ...subFieldData
      };
      
      setSubFields(prev => prev.map(sf => sf.id === editingSubField.id ? updatedSubField : sf));
      setEditingSubField(null);
      
      // Refresh sub-fields to get updated data from API
      if (venue) {
        await fetchSubFields(venue.id);
      }
    } catch (error) {
      console.error('Error updating sub-field:', error);
      setError('Không thể cập nhật sân nhỏ. Vui lòng thử lại.');
    } finally {
      submitInProgress.current = false;
    }
  }, [editingSubField, venue, fetchSubFields]);

  const handleToggleSubFieldStatus = useCallback((subFieldId: string) => {
    setSubFields(prev => prev.map(sf => 
      sf.id === subFieldId ? { ...sf, isActive: !sf.isActive } : sf
    ));
  }, []);

  const handleViewCalendar = useCallback((subField: SubField) => {
    setSelectedSubField(subField);
    setShowCalendar(true);
  }, []);

  const handleDeleteSubField = useCallback(async (subFieldId: string) => {
    if (submitInProgress.current || !venue) {
      return;
    }
    
    // Confirm deletion with user
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sân nhỏ này không?');
    if (!confirmDelete) {
      return;
    }
    
    submitInProgress.current = true;
    setError(null); // Clear any existing errors before starting
    
    try {
      // Call API to delete sub-field
      await fieldService.deleteSmallField(subFieldId);
      
      // Update UI by removing the deleted sub-field
      setSubFields(prev => prev.filter(sf => sf.id !== subFieldId));
      
      // Show success message
      setSuccessMessage('Đã xóa sân nhỏ thành công');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error deleting sub-field:', error);
      setError(error.message || 'Không thể xóa sân nhỏ. Vui lòng thử lại.');
    } finally {
      submitInProgress.current = false;
    }
  }, [venue]);

  const handleCancelForm = useCallback(() => {
    if (submitInProgress.current) return;
    setShowVenueForm(false);
    setShowSubFieldForm(false);
    setShowReviews(false);
    setShowCalendar(false);
    setSelectedSubField(null);
    setEditingVenue(null);
    setEditingSubField(null);
    setError(null); // Clear error when canceling
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    fetchVenues();
  }, [fetchVenues]);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Pagination logic
  const totalPages = Math.ceil(subFields.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubFields = subFields.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải thông tin sân...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !showVenueForm && !editingVenue && !successMessage) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-red-900 mb-2">Có lỗi xảy ra</h2>
              <p className="text-red-700 text-sm mb-4">{error}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setShowVenueForm(true);
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tạo sân mới
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No venue created yet - show create venue form
  if (!venue && !showVenueForm && !editingVenue && !loading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến hệ thống quản lý sân!</h1>
            <p className="text-gray-600 mb-6">
              Để bắt đầu, bạn cần tạo sân lớn trước. Sân lớn sẽ chứa tất cả thông tin chung như địa chỉ, giá, giờ hoạt động.
              Sau đó bạn có thể thêm các sân nhỏ bên trong sân lớn.
            </p>
          </div>
          
          <button
            onClick={() => setShowVenueForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all mx-auto"
          >
            <Building2 className="w-5 h-5" />
            <span>Tạo Sân Lớn</span>
          </button>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Sân Lớn là gì?</h3>
              <p className="text-green-700 text-sm">
                Sân lớn là đơn vị quản lý chính chứa thông tin chung như tên, địa chỉ, giờ mở cửa, bảng giá, tiện ích.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Sân Nhỏ là gì?</h3>
              <p className="text-blue-700 text-sm">
                Sân nhỏ là các khu vực cụ thể trong sân lớn, mỗi sân nhỏ có thể có loại thể thao và sức chứa khác nhau.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Error banner - show at top if there's an error while content is loaded */}
      {error && (venue || showVenueForm || editingVenue) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      
      {/* Success banner - show at top if there's a success message */}
      {successMessage && (venue || showVenueForm || editingVenue) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-green-700 text-sm">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Header - Only show when not editing */}
      {!showVenueForm && !editingVenue && !showSubFieldForm && !editingSubField && !showReviews && !showCalendar && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sân</h1>
            <p className="text-gray-600">Quản lý thông tin sân lớn và các sân nhỏ</p>
          </div>
          {venue && (
            <button
              onClick={() => setShowSubFieldForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all disabled:opacity-50"
              disabled={showSubFieldForm || editingSubField !== null || submitInProgress.current}
            >
              <Plus className="w-5 h-5" />
              <span>Thêm Sân Nhỏ</span>
            </button>
          )}
        </div>
      )}

      {/* Venue Form */}
      {(showVenueForm || editingVenue) && (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {editingVenue ? 'Chỉnh Sửa Sân Lớn' : 'Tạo Sân Lớn Mới'}
            </h1>
            <p className="text-gray-600">
              {editingVenue ? 'Cập nhật thông tin sân lớn của bạn' : 'Nhập thông tin để tạo sân lớn mới'}
            </p>
          </div>
          <VenueForm
            venue={editingVenue || undefined}
            onSubmit={editingVenue ? handleUpdateVenue : handleCreateVenue}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Sub-field Form */}
      {venue && (showSubFieldForm || editingSubField) && (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {editingSubField ? 'Chỉnh Sửa Sân Nhỏ' : 'Thêm Sân Nhỏ Mới'}
            </h1>
            <p className="text-gray-600">
              {editingSubField ? 'Cập nhật thông tin sân nhỏ' : 'Thêm sân nhỏ mới vào ' + venue.name}
            </p>
          </div>
          <SubFieldForm
            subField={editingSubField || undefined}
            venueId={venue.id}
            onSubmit={editingSubField ? handleUpdateSubField : handleCreateSubField}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Venue Information and Sub-fields - Only show when not editing anything */}
      {venue && !showVenueForm && !editingVenue && !showSubFieldForm && !editingSubField && !showReviews && !showCalendar && (
        <div className="space-y-6">
          {/* Venue Card - Pass venue prop directly */}
          <VenueCard
            venue={venue}
            subFieldsCount={subFields.length}
            onEdit={() => setEditingVenue(venue)}
            onViewReviews={() => setShowReviews(true)}
            formatCurrency={formatCurrency}
          />
          
          {/* Sub-fields Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Các Sân Nhỏ</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{subFields.length} sân</span>
                <button
                  onClick={() => setShowSubFieldForm(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Sân</span>
                </button>
              </div>
            </div>
            
            {subFields.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có sân nhỏ nào</h4>
                <p className="text-gray-600 mb-4">
                  Hãy thêm sân nhỏ đầu tiên để bắt đầu nhận đặt sân
                </p>
                <button
                  onClick={() => setShowSubFieldForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
                >
                  Thêm Sân Nhỏ
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {paginatedSubFields.map((subField) => (
                    <SubFieldCard
                      key={subField.id}
                      subField={subField}
                      venue={venue}
                      onEdit={() => setEditingSubField(subField)}
                      onToggleStatus={() => handleToggleSubFieldStatus(subField.id)}
                      onViewCalendar={() => handleViewCalendar(subField)}
                      onDelete={() => handleDeleteSubField(subField.id)}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={subFields.length}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews Display */}
      {venue && showReviews && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Đánh Giá Của {venue.name}</h2>
            <button
              onClick={() => setShowReviews(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Quay lại
            </button>
          </div>
          <Reviews
            reviews={venue.reviews}
            averageRating={venue.rating}
            totalReviews={venue.totalBookings}
          />
        </div>
      )}

      {/* Field Calendar Display */}
      {venue && showCalendar && selectedSubField && (
        <div>
          <FieldCalendar
            subFieldName={selectedSubField.name}
            venueOpenTime={venue.openTime}
            venueCloseTime={venue.closeTime}
            onClose={() => setShowCalendar(false)}
            smallFieldId={selectedSubField.id}
          />
        </div>
      )}
    </div>
  );
};

export default ManageFieldPage;