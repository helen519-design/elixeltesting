'use client';

import React from 'react';
import { useClaim } from '@/context/ClaimContext';

/**
 * TopBar
 * 
 * Header component with WPA logo, title, and exit button.
 * Logo specifications:
 * - Logo container: h-[64px], px-[10px], bg-[#0055b7]
 * - Logo image: w-[65px], h-[48px]
 * - Separator: h-[48px], 1px width, bg-[#d2d3d6]
 * - Title: text-[18px], font-normal, text-[#4d4f5c]
 * - Exit button: h-[48px], px-[24px], py-[16px], rounded-[8px], border-[#0055b7]
 */
export const TopBar: React.FC = () => {
  const { dispatch } = useClaim();
  
  const handleExit = () => {
    // Navigate to navigation overview page
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'currentStep',
        value: 'NAVIGATION_OVERVIEW',
      },
    });
  };

  return (
    <div className="flex items-center justify-between w-full h-[56px] m-0">
      {/* Left side: Logo + Separator + Title */}
      <div className="flex items-center gap-[12px]">
        {/* WPA Logo - 65px width, 48px height */}
        <div className="bg-[#0055b7] flex items-center justify-center h-[64px] px-[10px]">
          <img 
            src="/assets/wpaLogo.svg" 
            alt="WPA Logo" 
            className="w-[65px] h-[48px]"
          />
        </div>
        
        {/* Separator */}
        <div className="h-[48px] w-px bg-[#d2d3d6]" />
        
        {/* Title */}
        <div className="flex items-center justify-center">
          <p className="text-[18px] font-normal leading-normal text-[#4d4f5c]">
            New Claim
          </p>
        </div>
      </div>

      {/* Right side: Exit button */}
      <button
        type="button"
        onClick={handleExit}
        className="flex items-center justify-center gap-[2px] h-[48px] px-[24px] py-[16px] bg-white border-[1px] border-solid border-[#0055b7] rounded-[8px] text-[16px] font-semibold text-[#0055b7] leading-[28px] tracking-[0.1px] hover:bg-gray-50 transition"
      >
        {/* Exit icon */}
        <svg 
          className="w-[20px] h-[20px]" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M7.5 15L12.5 10L7.5 5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        Exit
      </button>
    </div>
  );
};

export default TopBar;
