import React from 'react';
import { useClaim } from '@/context/ClaimContext';

/**
 * OnboardingStep
 * 
 * Welcome screen that introduces users to the claim submission process.
 * Two-column layout with main content on the left and video walkthrough on the right.
 * 
 * Navigation:
 * - The "Start Claim" button is included directly in this component below the checklist
 * - This component is purely informational (no form inputs)
 */
export const OnboardingStep: React.FC = () => {
  const { dispatch } = useClaim();

  const handleStartClaim = () => {
    dispatch({ type: 'NEXT_STEP' });
  };
  return (
    <div className="w-full max-w-[1440px] mx-auto px-24 py-12 flex gap-24 items-start">
      {/* Left Column: Main Content */}
      <div className="flex flex-col gap-12 max-w-[720px] min-w-[360px] w-[600px]">
        {/* Heading and Description */}
        <div className="flex flex-col gap-6">
          <h1 className="text-[36px] leading-[48px] font-semibold text-[#4d4f5c]">
            Let's get your claim started
          </h1>
          
          <div className="text-[16px] leading-[24px] text-[#2e2f37]">
            <p className="mb-0">
              We've designed this process to be as simple as possible.
            </p>
            <p className="mb-0">
              It usually takes about <span className="font-semibold">5–10 minutes</span> to complete. To make things even easier, we recommend getting some of these information ready:
            </p>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="flex flex-col gap-6">
          {/* Item 1 */}
          <div className="flex gap-3 items-start">
            <div className="bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0">
              <svg 
                className="w-[15px] h-[15px]" 
                viewBox="0 0 15 15" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z" 
                  stroke="#4d4f5c" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
                <path 
                  d="M5.625 1.875V13.125M8.625 2.8125V12.1875" 
                  stroke="#4d4f5c" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[16px] leading-[20px] font-medium text-[#4d4f5c]">
              When you first experienced symptom
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex gap-3 items-start">
            <div className="bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0">
              <svg 
                className="w-[15px] h-[15px]" 
                viewBox="0 0 15 15" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z" 
                  stroke="#4d4f5c" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
                <path 
                  d="M5.625 1.875V13.125M8.625 2.8125V12.1875" 
                  stroke="#4d4f5c" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[16px] leading-[20px] font-medium text-[#4d4f5c] flex-1">
              If you have had any previous or ongoing treatment for the same or similar condition
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex gap-3 items-start">
            <div className="bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0">
              <svg 
                className="w-[15px] h-[15px]" 
                viewBox="0 0 15 15" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z" 
                  stroke="#4d4f5c" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
                <path 
                  d="M5.625 1.875V13.125M8.625 2.8125V12.1875" 
                  stroke="#4d4f5c" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[16px] leading-[20px] font-medium text-[#4d4f5c]">
              When did you get your GP referral
            </p>
          </div>
        </div>

        {/* Start Claim Button */}
        <button
          type="button"
          onClick={handleStartClaim}
          className="bg-[#0055b7] text-white h-[64px] min-w-[280px] px-[24px] py-[16px] rounded-[8px] flex items-center justify-center transition-all duration-200 hover:bg-[#1276c0] active:bg-[#004494] self-start"
          aria-label="Start your claim"
        >
          <span className="font-semibold text-[16px] leading-[28px] tracking-[0.1px]">
            Start Claim
          </span>
        </button>
      </div>

      {/* Right Column: Video Card */}
      <div className="bg-white border border-[#d2d3d6] rounded-2xl p-8 flex flex-col gap-6 w-[559px] flex-shrink-0">
        {/* Video Title and Description */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] leading-normal font-semibold text-[#4d4f5c]">
            New to this? Watch a quick walkthrough
          </h3>
          <p className="text-[16px] leading-[24px] text-[#4d4f5c]">
            If you'd like to see exactly how the process works before you dive in, our 90-second video guides you through every step.
          </p>
        </div>

        {/* Video Thumbnail */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#f0f0f0]">
          {/* Placeholder image - you can replace with actual video thumbnail */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffd271] to-[#ffb347]" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              className="w-[82.6px] h-[82.6px] rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 shadow-lg"
              aria-label="Play video"
            >
              <svg 
                className="w-[47.2px] h-[47.2px] ml-1" 
                viewBox="0 0 48 48" 
                fill="none"
              >
                <path 
                  d="M17 12L35 24L17 36V12Z" 
                  fill="#0055b7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Transcript Link Section */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[18px] leading-normal font-semibold text-[#4d4f5c]">
            Prefer reading instead?
          </h4>
          <button 
            className="flex items-center gap-0.5 py-4 text-[#0055b7] hover:text-[#1276c0] transition-colors duration-200"
            aria-label="Read video transcript"
          >
            <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
              Read video transcript
            </span>
            <svg 
              className="w-4 h-4" 
              viewBox="0 0 16 16" 
              fill="none"
            >
              <path 
                d="M6 12L10 8L6 4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
