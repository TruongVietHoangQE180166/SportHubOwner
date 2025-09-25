import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { fieldService } from '../../services/fieldService';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 5,
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    if (validFiles.length === 0) {
      setError('Vui lòng chọn file ảnh hợp lệ (tối đa 10MB)');
      return;
    }

    // Check if adding these files would exceed the limit
    if (images.length + validFiles.length > maxImages) {
      setError(`Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload each file and get the URL
      const uploadPromises = validFiles.map(file => fieldService.uploadImage(file));
      const responses = await Promise.all(uploadPromises);
      
      // Extract URLs from responses (data field contains the URL)
      const newImageUrls = responses.map(response => response.data);
      
      // Add new URLs to existing images
      onChange([...images, ...newImageUrls]);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err instanceof Error ? err.message : 'Không thể upload hình ảnh. Vui lòng thử lại sau.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || uploading) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const openFileDialog = () => {
    if (fileInputRef.current && !disabled && !uploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Hình Ảnh Sân ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <button
            type="button"
            onClick={openFileDialog}
            disabled={disabled || uploading}
            className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
          >
            Thêm ảnh
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`Venue image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              disabled={disabled || uploading}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Upload Area */}
        {images.length < maxImages && (
          <div
            className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
            } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="text-center">
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-green-500 mx-auto mb-2 animate-spin" />
                  <p className="text-sm text-gray-600">Đang tải lên...</p>
                </>
              ) : dragActive ? (
                <>
                  <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Thả ảnh vào đây</p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Kéo thả hoặc click để chọn</p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG tối đa 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Tải lên tối đa {maxImages} hình ảnh để giới thiệu sân của bạn. Ảnh đầu tiên sẽ được dùng làm ảnh đại diện.
      </p>
    </div>
  );
};

export default ImageUpload;