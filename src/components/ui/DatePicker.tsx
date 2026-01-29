import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  label: string;
  id: string;
  placeholder?: string;
  className?: string;
};

/**
 * DatePicker
 * 
 * Custom datepicker styled to match Figma design:
 * - Blue header with selected date
 * - Calendar grid with day/month/year views
 * - Current date: light blue circle outline
 * - Selected date: solid blue background
 * - Hover: light background
 * - Bottom actions: Clear, Cancel, OK
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  id,
  placeholder = 'dd/mm/yyyy',
  className = '',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      // Format as YYYY-MM-DD for consistency
      const formatted = date.toISOString().split('T')[0];
      onChange(formatted);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9999]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`flex flex-col gap-[8px] w-[360px] ${className}`}>
        {label && (
          <label 
            htmlFor={id} 
            className="font-medium text-[16px] leading-[24px] text-[#4d4f5c] tracking-[0.4px]"
          >
            {label}
          </label>
        )}
        
        <div className="relative w-full custom-datepicker-wrapper">
          <ReactDatePicker
            id={id}
            selected={selectedDate}
            onChange={handleChange}
            open={isOpen}
            onClickOutside={() => setIsOpen(false)}
            onInputClick={() => setIsOpen(true)}
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholder}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7] cursor-pointer"
            wrapperClassName="w-full"
            calendarClassName="custom-datepicker"
            popperClassName="datepicker-popper-centered"
            popperPlacement="bottom-start"
            portalId="root-portal"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between px-4 py-3 bg-[#0055b7] text-white rounded-t-[8px]">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                type="button"
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="text-[16px] leading-[28px] font-medium">
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                type="button"
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={handleClear}
              className="text-[14px] leading-[24px] font-medium text-[#0055b7] hover:text-[#1276c0] uppercase"
            >
              Clear
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[14px] leading-[24px] font-medium text-[#0055b7] hover:text-[#1276c0] uppercase px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[14px] leading-[24px] font-medium text-[#0055b7] hover:text-[#1276c0] uppercase px-3"
              >
                OK
              </button>
            </div>
          </div>
        </ReactDatePicker>
        
        {!selectedDate && (
          <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
            <img 
              src="/icons/calendar.svg" 
              alt="" 
              width="24" 
              height="24"
              className="w-[24px] h-[24px]"
            />
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default DatePicker;
