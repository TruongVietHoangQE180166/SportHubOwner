'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lock, ChevronDown } from 'lucide-react';

interface TimeSlot {
  time: string;
  status: 'available' | 'booked' | 'locked';
}

interface FieldCalendarProps {
  subFieldName: string;
  venueOpenTime: string;
  venueCloseTime: string;
  onClose: () => void;
}

const FieldCalendar: React.FC<FieldCalendarProps> = ({ subFieldName, venueOpenTime, venueCloseTime, onClose }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  
  // Dropdown states
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);

  // Refs for click outside detection
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const weekDropdownRef = useRef<HTMLDivElement>(null);

  // Helper function - moved up to be available for other functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
      if (weekDropdownRef.current && !weekDropdownRef.current.contains(event.target as Node)) {
        setShowWeekDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate years (current year ± 5 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  // Vietnamese month names
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Generate weeks for selected month and year
  const generateWeeksInMonth = (year: number, month: number) => {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Find the Monday of the first week
    const startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    const currentWeekStart = new Date(startDate);
    
    while (currentWeekStart <= lastDay || currentWeekStart.getMonth() === month) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      // Only include weeks that have days in the selected month
      const weekStartInMonth = currentWeekStart.getMonth() === month || currentWeekStart > firstDay;
      const weekEndInMonth = weekEnd.getMonth() === month || weekEnd < lastDay;
      
      if (weekStartInMonth || weekEndInMonth) {
        weeks.push({
          start: new Date(currentWeekStart),
          end: new Date(weekEnd),
          label: `${formatDate(currentWeekStart)} - ${formatDate(weekEnd)}`
        });
      }
      
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      
      // Break if we've moved too far past the month
      if (currentWeekStart.getMonth() > month && currentWeekStart.getFullYear() >= year) {
        break;
      }
    }
    
    return weeks;
  };

  const years = generateYears();
  const weeksInMonth = generateWeeksInMonth(selectedYear, selectedMonth);

  // Update current week when filters change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedWeekIndex(0);
    setShowYearDropdown(false);
    if (weeksInMonth.length > 0) {
      setCurrentWeek(weeksInMonth[0].start);
    }
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setSelectedWeekIndex(0);
    setShowMonthDropdown(false);
    const newWeeks = generateWeeksInMonth(selectedYear, month);
    if (newWeeks.length > 0) {
      setCurrentWeek(newWeeks[0].start);
    }
  };

  const handleWeekChange = (weekIndex: number) => {
    setSelectedWeekIndex(weekIndex);
    setShowWeekDropdown(false);
    if (weeksInMonth[weekIndex]) {
      setCurrentWeek(weeksInMonth[weekIndex].start);
    }
  };
  // Generate time slots based on venue hours
  const generateTimeSlots = () => {
    const openHour = parseInt(venueOpenTime.split(':')[0]);
    const closeHour = parseInt(venueCloseTime.split(':')[0]);
    
    const timeSlots = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      const startTime = hour.toString().padStart(2, '0') + 'h';
      const endTime = (hour + 1).toString().padStart(2, '0') + 'h';
      timeSlots.push(`${startTime}-${endTime}`);
    }
    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  // Get the current week dates (Monday to Sunday)
  const getWeekDates = (date: Date) => {
    const monday = new Date(date);
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    monday.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(currentWeek);
  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Navigate weeks
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  // State for tracking manually locked slots
  const [lockedSlots, setLockedSlots] = useState<Set<string>>(new Set());
  
  // Generate stable demo bookings based on current week
  const generateDemoBookings = (weekDates: Date[]) => {
    const demoBookings = new Set<string>();
    
    // Add some demo bookings for the current week
    // Monday - 2 bookings
    demoBookings.add(`${weekDates[0].toDateString()}-08h-09h`);
    demoBookings.add(`${weekDates[0].toDateString()}-14h-15h`);
    
    // Tuesday - 1 booking
    demoBookings.add(`${weekDates[1].toDateString()}-10h-11h`);
    
    // Wednesday - 1 booking
    demoBookings.add(`${weekDates[2].toDateString()}-16h-17h`);
    
    // Thursday - 1 booking
    demoBookings.add(`${weekDates[3].toDateString()}-09h-10h`);
    
    // Friday - 1 booking
    demoBookings.add(`${weekDates[4].toDateString()}-15h-16h`);
    
    // Saturday - 1 booking
    demoBookings.add(`${weekDates[5].toDateString()}-11h-12h`);
    
    return demoBookings;
  };
  
  // Get demo bookings for current week
  const bookedSlots = generateDemoBookings(weekDates);

  // Mock booking data - now stable and consistent
  const getTimeSlotStatus = (date: Date, timeSlot: string): TimeSlot => {
    const slotKey = `${date.toDateString()}-${timeSlot}`;
    
    // Check if manually locked
    if (lockedSlots.has(slotKey)) {
      return {
        time: timeSlot,
        status: 'locked'
      };
    }
    
    // Check if already booked (stable data)
    if (bookedSlots.has(slotKey)) {
      return {
        time: timeSlot,
        status: 'booked'
        // No customer name needed
      };
    }
    
    return {
      time: timeSlot,
      status: 'available'
    };
  };

  // Handle slot click - toggle lock for available slots
  const handleSlotClick = (date: Date, timeSlot: string, currentStatus: TimeSlot['status']) => {
    const slotKey = `${date.toDateString()}-${timeSlot}`;
    
    if (currentStatus === 'available') {
      // Lock the slot
      setLockedSlots(prev => new Set(prev).add(slotKey));
    } else if (currentStatus === 'locked') {
      // Unlock the slot
      setLockedSlots(prev => {
        const newSet = new Set(prev);
        newSet.delete(slotKey);
        return newSet;
      });
    }
    // Do nothing for booked slots
  };

  const getWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Lịch sân: {subFieldName}</h2>
          <p className="text-sm text-gray-600">Tuần: {getWeekRange()}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-4 lg:p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Year Filter */}
          <div ref={yearDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Năm</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                  setShowWeekDropdown(false);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-left flex items-center justify-between"
              >
                <span>{selectedYear}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                  showYearDropdown ? 'rotate-180' : ''
                }`} />
              </button>
              
              {showYearDropdown && (
                <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {years.map((year, index) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearChange(year)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                          selectedYear === year ? 'bg-gray-100 font-medium' : ''
                        } ${
                          index === 0 ? 'rounded-t-lg' : ''
                        } ${
                          index === years.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Month Filter */}
          <div ref={monthDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tháng</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                  setShowWeekDropdown(false);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-left flex items-center justify-between"
              >
                <span>{monthNames[selectedMonth]}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                  showMonthDropdown ? 'rotate-180' : ''
                }`} />
              </button>
              
              {showMonthDropdown && (
                <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {monthNames.map((monthName, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleMonthChange(index)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                          selectedMonth === index ? 'bg-gray-100 font-medium' : ''
                        } ${
                          index === 0 ? 'rounded-t-lg' : ''
                        } ${
                          index === monthNames.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        {monthName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Week Filter */}
          <div ref={weekDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tuần</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowWeekDropdown(!showWeekDropdown);
                  setShowYearDropdown(false);
                  setShowMonthDropdown(false);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-left flex items-center justify-between"
              >
                <span className="truncate">
                  {weeksInMonth[selectedWeekIndex]?.label || 'Chọn tuần'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                  showWeekDropdown ? 'rotate-180' : ''
                }`} />
              </button>
              
              {showWeekDropdown && (
                <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {weeksInMonth.map((week, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleWeekChange(index)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                          selectedWeekIndex === index ? 'bg-gray-100 font-medium' : ''
                        } ${
                          index === 0 ? 'rounded-t-lg' : ''
                        } ${
                          index === weeksInMonth.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        <div className="text-sm">{week.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              <div className="p-3 text-sm font-medium text-gray-600 border-r border-gray-200">
                Giờ
              </div>
              {weekDates.map((date, index) => (
                <div key={date.toISOString()} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm font-medium text-gray-900">{dayNames[index]}</div>
                  <div className="text-xs text-gray-600">{formatDate(date)}</div>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="divide-y divide-gray-200">
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-8 min-h-[60px]">
                  {/* Time Slot Label */}
                  <div className="p-3 text-sm font-medium text-gray-600 border-r border-gray-200 bg-gray-50 flex items-center">
                    {timeSlot}
                  </div>
                  
                  {/* Time Slots for each day */}
                  {weekDates.map((date) => {
                    const slotStatus = getTimeSlotStatus(date, timeSlot);
                    const isClickable = slotStatus.status === 'available' || slotStatus.status === 'locked';
                    
                    let bgClass = 'bg-white';
                    let hoverClass = '';
                    let textColor = 'text-gray-400';
                    let title = 'Còn trống - Click để khóa';
                    
                    if (slotStatus.status === 'booked') {
                      bgClass = 'bg-red-100';
                      textColor = 'text-red-800';
                      title = 'Đã đặt';
                    } else if (slotStatus.status === 'locked') {
                      bgClass = 'bg-yellow-100';
                      hoverClass = 'hover:bg-yellow-200';
                      textColor = 'text-yellow-800';
                      title = 'Đã khóa - Click để mở khóa';
                    } else {
                      hoverClass = 'hover:bg-green-50';
                      title = 'Còn trống - Click để khóa';
                    }
                    
                    return (
                      <div
                        key={`${date.toISOString()}-${timeSlot}`}
                        className={`p-2 border-r border-gray-200 last:border-r-0 transition-colors ${
                          bgClass
                        } ${
                          isClickable ? `cursor-pointer ${hoverClass}` : 'cursor-not-allowed'
                        }`}
                        title={title}
                        onClick={() => isClickable && handleSlotClick(date, timeSlot, slotStatus.status)}
                      >
                        {slotStatus.status === 'booked' ? (
                          <div className="text-xs">
                            <div className={`font-medium ${textColor}`}>Đã đặt</div>
                          </div>
                        ) : slotStatus.status === 'locked' ? (
                          <div className="text-xs">
                            <div className={`font-medium ${textColor} flex items-center space-x-1`}>
                              <Lock className="w-3 h-3" />
                              <span>Đã khóa</span>
                            </div>
                            <div className="text-yellow-600 text-xs italic">Đặt trực tiếp</div>
                          </div>
                        ) : (
                          <div className={`text-xs ${textColor}`}>Còn trống</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded shadow-sm"></div>
              <span className="text-gray-700 font-medium">Còn trống</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded shadow-sm"></div>
              <span className="text-gray-700 font-medium">Đã đặt</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded shadow-sm flex items-center justify-center">
                <Lock className="w-2 h-2 text-yellow-600" />
              </div>
              <span className="text-gray-700 font-medium">Đã khóa (đặt trực tiếp)</span>
            </div>
          </div>
          <div className="mt-2 text-center text-xs text-gray-600">
            Click vào ô trống để khóa cho khách đặt trực tiếp. Click vào ô đã khóa để mở khóa.
          </div>
        </div>
    </div>
  );
};

export default FieldCalendar;