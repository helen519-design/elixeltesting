'use client';

import React, { useState } from 'react';

type ReviewRowProps = {
  label: string;
  value: string | null | undefined;
  onEdit?: () => void;
  showEditButton?: boolean;
};

/**
 * ReviewRow Component
 * 
 * Display a question label and answer value in the review screen.
 * Matches Figma specifications with hover state:
 * - Default: Label and answer, no background
 * - Hover: #f6f6f7 background, edit button appears with icon
 * - Label: text-[18px], font-medium, text-[#4d4f5c], border-bottom
 * - Answer: text-[18px], font-medium, text-[#1e1e1e]
 * - Container: p-[12px], w-[260px], h-[172px], rounded-[8px]
 */
export const ReviewRow: React.FC<ReviewRowProps> = ({ 
  label, 
  value, 
  onEdit,
  showEditButton = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const displayValue = value || '–';
  const isNotProvided = !value;

  return (
    <div 
      className={`flex flex-col gap-[16px] h-[172px] min-w-[200px] w-[260px] p-[12px] rounded-[8px] relative shrink-0 transition-colors ${
        isHovered ? 'bg-[#f6f6f7]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Question Label with border */}
      <div className="border-b border-[#d2d3d6] border-solid flex h-[48px] items-center justify-between w-full shrink-0">
        <div className="flex flex-1 items-center min-h-px min-w-px">
          <p className="font-medium leading-[32px] text-[#4d4f5c] text-[18px] shrink-0">
            {label}
          </p>
        </div>
        
        {/* Edit Button - only visible on hover */}
        {showEditButton && onEdit && value && isHovered && (
          <button
            type="button"
            onClick={onEdit}
            className="flex gap-[2px] items-center justify-center h-[48px] py-[16px] transition-colors hover:opacity-80"
            aria-label={`Edit ${label}`}
          >
            {/* Edit Icon */}
            <svg 
              className="w-[16px] h-[16px]" 
              viewBox="0 0 16 16" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44763 12.6667 1.44763C12.9142 1.44763 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8249 1.82491 14 2.00001C14.1751 2.17511 14.314 2.383 14.4087 2.6118C14.5035 2.8406 14.5524 3.08578 14.5524 3.33334C14.5524 3.58091 14.5035 3.82609 14.4087 4.05489C14.314 4.28369 14.1751 4.49158 14 4.66668L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 2.00001Z" 
                stroke="#0055b7" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            
            {/* Edit Text */}
            <span className="font-semibold text-[16px] leading-[28px] text-[#0055b7] tracking-[0.1px]">
              Edit
            </span>
          </button>
        )}
      </div>

      {/* Answer Value */}
      <div className="flex flex-col h-[44px] items-start w-full shrink-0">
        <div className="flex gap-0 items-center min-w-[120px] w-full shrink-0">
          <p className={`flex-1 font-medium leading-[32px] text-[18px] min-h-px min-w-px ${
            isNotProvided ? 'text-gray-400 italic' : 'text-[#1e1e1e]'
          }`}>
            {displayValue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewRow;
