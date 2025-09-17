'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react';
import VenueForm from '../field/VenueForm';
import VenueCard from '../field/VenueCard';
import SubFieldForm from '../field/SubFieldForm';
import SubFieldCard from '../field/SubFieldCard';
import Reviews from '../field/Reviews';
import Pagination from '../field/Pagination';
import FieldCalendar from '../field/FieldCalendar';
import { useFieldStore } from '../../stores/fieldStore';
import { useAuthStore } from '../../stores/authStore';
import { Plus, Building2, Map } from 'lucide-react';
import { Venue, SubField } from '../../types';
import { mockVenues } from '../../data/mockVenues';
import { mockSubFields } from '../../data/mockSubFields';

const ManageFieldPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    loading 
  } = useFieldStore();
  
  // Mock venue data - in real app, this would come from a venue store
  const [venue, setVenue] = useState<Venue | null>(null);
  const [subFields, setSubFields] = useState<SubField[]>([]);
  
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

  useEffect(() => {
    // Load venue data based on user
    if (user) {
      // Simulate different users having different venues
      const userVenueMap: { [key: string]: string | null } = {
        'admin@santhethao.com': '1', // Has Quy Nhon Center
        'an.nguyen@example.com': '2', // Has SportHub Binh Dinh
        'demo@santhethao.com': null  // No venue yet
      };
      
      const venueId = userVenueMap[user.email];
      if (venueId) {
        const userVenue = mockVenues.find(v => v.id === venueId);
        const userSubFields = mockSubFields.filter(sf => sf.venueId === venueId);
        
        setVenue(userVenue || null);
        setSubFields(userSubFields);
      } else {
        // User has no venue
        setVenue(null);
        setSubFields([]);
      }
    }
  }, [user]);

  const handleCreateVenue = useCallback(async (venueData: Omit<Venue, 'id' | 'rating' | 'totalBookings' | 'createdAt' | 'reviews'>) => {
    if (submitInProgress.current) {
      console.log('Submit already in progress, ignoring...');
      return;
    }
    
    submitInProgress.current = true;
    
    try {
      // In real app, call venue service
      const newVenue: Venue = {
        ...venueData,
        id: Date.now().toString(),
        rating: 0,
        totalBookings: 0,
        reviews: [],
        createdAt: new Date().toISOString()
      };
      setVenue(newVenue);
      setShowVenueForm(false);
    } catch (error) {
      console.error('Error creating venue:', error);
    } finally {
      submitInProgress.current = false;
    }
  }, []);

  const handleUpdateVenue = useCallback(async (venueData: Omit<Venue, 'id' | 'rating' | 'totalBookings' | 'createdAt' | 'reviews'>) => {
    if (!editingVenue || submitInProgress.current) {
      return;
    }
    
    submitInProgress.current = true;
    
    try {
      const updatedVenue: Venue = {
        ...editingVenue,
        ...venueData
      };
      setVenue(updatedVenue);
      setEditingVenue(null);
    } catch (error) {
      console.error('Error updating venue:', error);
    } finally {
      submitInProgress.current = false;
    }
  }, [editingVenue]);

  const handleCreateSubField = useCallback(async (subFieldData: Omit<SubField, 'id' | 'totalBookings'>) => {
    if (submitInProgress.current) {
      return;
    }
    
    submitInProgress.current = true;
    
    try {
      const newSubField: SubField = {
        ...subFieldData,
        id: Date.now().toString(),
        totalBookings: 0
      };
      setSubFields(prev => [...prev, newSubField]);
      setShowSubFieldForm(false);
    } catch (error) {
      console.error('Error creating sub-field:', error);
    } finally {
      submitInProgress.current = false;
    }
  }, []);

  const handleUpdateSubField = useCallback(async (subFieldData: Omit<SubField, 'id' | 'totalBookings'>) => {
    if (!editingSubField || submitInProgress.current) {
      return;
    }
    
    submitInProgress.current = true;
    
    try {
      const updatedSubField: SubField = {
        ...editingSubField,
        ...subFieldData
      };
      setSubFields(prev => prev.map(sf => sf.id === editingSubField.id ? updatedSubField : sf));
      setEditingSubField(null);
    } catch (error) {
      console.error('Error updating sub-field:', error);
    } finally {
      submitInProgress.current = false;
    }
  }, [editingSubField]);

  const handleToggleSubFieldStatus = useCallback((subFieldId: string) => {
    setSubFields(prev => prev.map(sf => 
      sf.id === subFieldId ? { ...sf, isActive: !sf.isActive } : sf
    ));
  }, []);

  const handleViewCalendar = useCallback((subField: SubField) => {
    setSelectedSubField(subField);
    setShowCalendar(true);
  }, []);

  const handleCancelForm = useCallback(() => {
    if (submitInProgress.current) return;
    setShowVenueForm(false);
    setShowSubFieldForm(false);
    setShowReviews(false);
    setShowCalendar(false);
    setSelectedSubField(null);
    setEditingVenue(null);
    setEditingSubField(null);
  }, []);

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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // No venue created yet - show create venue form
  if (!venue && !showVenueForm && !editingVenue) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến hệ thống quản lý sân!</h1>
            <p className="text-gray-600 mb-6">
              Để bắt đầu, bạn cần tạo sân lớn trước. Sân lớn sẽ chứa tất cả thông tin chung như địa chỉ, giạ, giờ hoạt động.
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
          {/* Venue Card */}
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
            totalReviews={venue.reviews.length}
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
          />
        </div>
      )}
    </div>
  );
};

export default ManageFieldPage;