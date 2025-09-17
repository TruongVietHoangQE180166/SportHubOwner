import React from 'react';
import { Star, User } from 'lucide-react';
import { Review } from '../../types';

interface ReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews?: number;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, averageRating, totalReviews }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });
    return distribution.reverse(); // 5 stars first
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh Giá Từ Khách Hàng</h3>
        
        {/* Overall Rating */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center space-x-1 mb-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-600">{totalReviews || reviews.length} đánh giá</div>
          </div>
          
          {/* Rating Distribution */}
          <div className="flex-1 max-w-sm">
            {ratingDistribution.map((count, index) => {
              const starCount = 5 - index;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={starCount} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600 w-8">{starCount}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Nhận xét chi tiết</h4>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có đánh giá nào</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed ml-11">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;