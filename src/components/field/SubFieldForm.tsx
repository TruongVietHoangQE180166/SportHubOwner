import React from 'react';
import { Save, X } from 'lucide-react';
import { SubField } from '../../types';
import { fieldService } from '../../services/fieldService';

interface SubFieldFormProps {
  subField?: SubField;
  venueId: string;
  onSubmit: (subFieldData: Omit<SubField, 'id' | 'totalBookings'>) => Promise<void>;
  onCancel: () => void;
}

const SubFieldForm: React.FC<SubFieldFormProps> = ({ subField, venueId, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    venueId,
    name: subField?.name || '',
    capacity: subField?.capacity || 0,
    isActive: subField?.isActive ?? true,
    description: subField?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // If we're creating a new sub-field, call the createSmallField API
      if (!subField) {
        // Prepare data for the small field API
        const smallFieldData = {
          smallFiledName: formData.name,
          description: formData.description,
          capacity: formData.capacity.toString(), // API expects string
          fieldId: venueId,
          available: formData.isActive
        };
        
        // Call the new createSmallField API
        await fieldService.createSmallField(smallFieldData);
      } 
      // If we're updating an existing sub-field, call the updateSmallField API
      else {
        // Prepare data for the update small field API
        const updateSmallFieldData = {
          smallFieldId: subField.id,
          smallFiledName: formData.name,
          description: formData.description,
          capacity: formData.capacity.toString(), // API expects string
          available: formData.isActive
        };
        
        // Call the new updateSmallField API
        await fieldService.updateSmallField(updateSmallFieldData);
      }
      
      // Only call the original onSubmit function after successful API call
      // This will update the UI state without making another API call
      await onSubmit({
        venueId: venueId,
        name: formData.name,
        capacity: formData.capacity,
        isActive: formData.isActive,
        description: formData.description
      });
    } catch (error: any) {
      console.error('Error submitting sub-field form:', error);
      // Show error message to user
      alert(error.message || 'Không thể tạo/cập nhật sân nhỏ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {subField ? 'Chỉnh Sửa Sân Nhỏ' : 'Thêm Sân Nhỏ'}
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
          Sân nhỏ kế thừa thông tin chung từ sân lớn (giá, giờ, địa chỉ)
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Sân Nhỏ
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="VD: Sân A, Sân B, Sân 1, Sân 2"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="VD: Sân chính cỡ tiêu chuẩn 11 người, Sân VIP với tiện nghi cao cấp"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sức Chứa
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                min="0"
                disabled={isSubmitting}
              />
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

export default SubFieldForm;