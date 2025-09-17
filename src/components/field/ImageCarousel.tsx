import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={currentIndex === 0}
        />
        
        {/* Image Counter */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1}/{images.length}
        </div>
      </div>

      {/* Navigation Arrows - Only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;