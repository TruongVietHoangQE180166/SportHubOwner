import React, { useState, useEffect } from 'react';
import { Venue } from '../../types'; // Import the Venue type
import {
  Edit,
  MapPin,
  Clock,
  DollarSign,
  Settings,
  Trophy,
  Loader2,
  MessageSquare,
  Star,
  Calendar,
} from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import { fieldService } from '../../services/fieldService';
import { Review } from '../../types'; // Added Review import

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

interface VenueCardProps {
  venue?: Venue; // Use the Venue type directly
  subFieldsCount?: number;
  onEdit: () => void;
  onViewReviews: () => void;
  formatCurrency: (amount: number) => string;
}

const VenueCard: React.FC<VenueCardProps> = ({
  venue: initialVenue,
  subFieldsCount = 0,
  onEdit,
  onViewReviews,
  formatCurrency,
}) => {
  const [venues, setVenues] = useState<Venue[]>([]); // Use Venue[] type
  const [loading, setLoading] = useState(false); // Default to false since we're passing data directly
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If venue is passed directly, use it
    if (initialVenue) {
      setVenues([initialVenue]);
      setLoading(false);
    } else {
      // Only fetch if no initial venue provided
      const fetchVenues = async () => {
        try {
          setLoading(true);
          setError(null);

          // Get userId from sessionStorage
          const userId = sessionStorage.getItem('userId');
          if (!userId) {
            throw new Error('Không tìm thấy thông tin người dùng');
          }

          // Call getFieldDetail function
          const response = await fieldService.getFieldDetail(
            1,    // page
            1,    // size
            'createdDate',
            'desc',
            userId
          );

          // Handle API response structure
          if (response && response.data && response.data.content && response.data.content.length > 0) {
            const fieldData = response.data.content[0];
            
            // Map API response to Venue format
            const venue: Venue = {
              id: fieldData.id,
              name: fieldData.fieldName || fieldData.name || '',
              sport: fieldData.typeFieldName || fieldData.sport || '',
              location: fieldData.location || '',
              hourlyRate: fieldData.normalPricePerHour || fieldData.hourlyRate || 0,
              peakRate: fieldData.peakPricePerHour || fieldData.peakRate || 0,
              openTime: formatTime(fieldData.openTime),
              closeTime: formatTime(fieldData.closeTime),
              description: fieldData.description || '',
              images: fieldData.images || [],
              isActive: fieldData.available !== undefined ? fieldData.available : (fieldData.isActive || false),
              rating: fieldData.averageRating || fieldData.rating || 0,
              totalBookings: fieldData.totalBookings || 0,
              reviews: mapRateResponsesToReviews(fieldData.rateResponses || fieldData.reviews || []),
              createdAt: fieldData.createdDate || fieldData.createdAt || '',
              ownerPhone: fieldData.numberPhone || fieldData.ownerPhone || ''
            };
            
            setVenues([venue]);
          } else {
            setVenues([]);
          }

        } catch (err: any) {
          setError(err.message || 'Không thể tải thông tin sân');
          console.error('Error fetching venues:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchVenues();
    }
  }, [initialVenue]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Không có sân nào để hiển thị</p>
        </div>
      </div>
    );
  }

  // Render venues
  return (
    <div className="space-y-6">
      {venues.map((venue, index) => (
        <div key={venue.id || index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="aspect-video bg-gray-200 relative overflow-hidden">
            <ImageCarousel
              images={venue.images || []}
              alt={venue.name || 'Sân thể thao'}
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
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {venue.name || 'Tên sân'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {venue.description || 'Không có mô tả'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium text-green-600">
                    {venue.sport || 'Thể thao'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">
                    {venue.location || 'Chưa có địa chỉ'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {venue.openTime || '00:00'} - {venue.closeTime || '23:59'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCurrency(venue.hourlyRate || 0)}/giờ</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-orange-600 font-medium">
                    {formatCurrency(venue.peakRate || 0)}/giờ (giờ cao điểm)
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>
                    {venue.rating?.toFixed(1) || '0.0'} sao ({venue.totalBookings || 0} đặt sân)
                  </span>
                </div>
              </div>
            </div>

            {/* Reviews button only - no rating display */}
            <div className="mb-4">
              <button
                onClick={onViewReviews}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Xem đánh giá của khách hàng</span>
              </button>
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
      ))}
    </div>
  );
};

export default VenueCard;