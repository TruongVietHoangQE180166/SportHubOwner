import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface BookingFilterProps {
  searchTerm: string;
  statusFilter: string;
  selectedDate: string;
  onSearchTermChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSelectedDateChange: (date: string) => void;
  onClearFilters: () => void;
}

const BookingFilter: React.FC<BookingFilterProps> = ({
  searchTerm,
  statusFilter,
  selectedDate,
  onSearchTermChange,
  onStatusFilterChange,
  onSelectedDateChange,
  onClearFilters
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const getCurrentStatusLabel = () => {
    return statusOptions.find(option => option.value === statusFilter)?.label || 'Tất cả';
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!buttonRef.current) return {};
    
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 200; // Estimated dropdown height
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // If not enough space below but enough above, show dropdown above
    const showAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
    
    return {
      position: 'fixed' as const,
      left: rect.left,
      top: showAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
      width: rect.width,
      zIndex: 9999
    };
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-green-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400 rounded-full translate-y-6 -translate-x-6"></div>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5 z-10" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Tên khách hàng hoặc sân..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:ring-0 focus:border-gray-500 focus:bg-gray-800/90 transition-all duration-200 hover:bg-gray-800/90 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Trạng thái
          </label>
          <div className="relative">
            <div className="relative">
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full pl-4 pr-10 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg focus:ring-0 focus:border-gray-500 focus:bg-gray-800/90 transition-all duration-200 hover:bg-gray-800/90 cursor-pointer outline-none text-left"
              >
                <span className="text-white">
                  {getCurrentStatusLabel()}
                </span>
              </button>
              <ChevronDown 
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 pointer-events-none ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Ngày
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectedDateChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg focus:ring-0 focus:border-gray-500 focus:bg-gray-800/90 transition-all duration-200 hover:bg-gray-800/90 cursor-pointer outline-none
            [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:mr-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2.5 text-white bg-gray-700/70 backdrop-blur-sm border border-gray-600/50 hover:bg-gray-600/80 hover:border-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

      {/* Portal dropdown - rendered outside container */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          style={getDropdownPosition()}
          className="bg-gray-800 border border-gray-600/50 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm"
        >
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onStatusFilterChange(option.value);
                setIsDropdownOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-700/80 transition-colors duration-150 text-white ${
                statusFilter === option.value ? 'bg-gray-700/50' : ''
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingFilter;