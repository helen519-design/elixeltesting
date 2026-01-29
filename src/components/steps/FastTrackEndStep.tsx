import React from 'react';

/**
 * Fast Track End Screen
 * 
 * Static information page shown when user selects "Fast-track consultation" in Q9.
 * Layout matches Figma design with:
 * - Custom TopBar with logo and exit button
 * - Main content area on the left with instructions
 * - Claim reference card on the right with action required
 * - No GlobalActions bar (static page)
 * - Full-width layout (breaks out of AppShell constraints)
 */
export const FastTrackEndStep: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafbfb] flex flex-col">
      {/* Custom TopBar for this page */}
      <div className="bg-white border-b border-[#d2d3d6] w-full">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3">
            {/* WPA Logo */}
            <div className="bg-[#0055b7] h-[48px] w-[65.652px] flex items-center justify-center px-[10px] py-[14px]">
              <img 
                src="/assets/wpaLogo.svg" 
                alt="WPA" 
                className="h-[19.833px] w-[46.242px]"
              />
            </div>
            
            {/* Separator */}
            <div className="h-[48px] w-px bg-[#d2d3d6]" />
            
            {/* Title */}
            <p className="text-[18px] leading-normal font-normal text-[#4d4f5c]">
              New Claim
            </p>
          </div>
          
          {/* Right: Exit Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-0.5 h-[48px] px-6 py-4 border border-[#0055b7] rounded-[8px] bg-white hover:bg-gray-50 transition-colors"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            {/* Exit Icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" 
                stroke="#0055b7" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M13.3333 14.1667L17.5 10L13.3333 5.83334" 
                stroke="#0055b7" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M17.5 10H7.5" 
                stroke="#0055b7" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[16px] leading-[28px] font-semibold text-[#0055b7] tracking-[0.1px]">
              Exit
            </span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 py-12 flex flex-col lg:flex-row gap-12 lg:gap-24 items-start justify-center flex-1">
        {/* Left: Main Content */}
        <div className="flex flex-col gap-12 w-full lg:max-w-[720px] lg:min-w-[360px] lg:w-[600px]">
          {/* Heading and Body Text */}
          <div className="flex flex-col gap-6 w-full">
            {/* Main Heading */}
            <h1 className="text-[36px] leading-[48px] font-semibold text-[#4d4f5c]">
              We've got your back with Fast Track Physiotherapy.
            </h1>
            
            {/* Body Text */}
            <div className="text-[16px] leading-[28px] font-normal text-[#4d4f5c]">
              <p className="mb-0">
                Don't worry about a thing! We're here to make getting started as easy as possible.
              </p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">
                Just have your <span className="font-bold">CRN</span> handy and give our claims team a quick ring at{' '}
                <a 
                  href="tel:01823625329" 
                  className="text-[#0055b7] underline decoration-solid hover:text-[#1276c0]"
                >
                  01823 625329
                </a>
                . We'll take care of the rest for you.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] text-white h-[56px] px-6 py-4 rounded-[8px] flex items-center justify-center transition-all duration-200 self-start"
            onClick={() => {
              // Navigate back to dashboard
              window.location.href = '/';
            }}
          >
            <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
              Back to dashboard
            </span>
          </button>
        </div>

        {/* Right: Claim Reference Card */}
        <div className="bg-white border border-[#d2d3d6] rounded-[16px] flex flex-col w-full lg:w-[430px] shrink-0">
          {/* Claim Reference Section */}
          <div className="border-b border-[#d2d3d6] px-9 pt-9 pb-4 flex flex-col gap-[11px]">
            <p className="text-[14px] leading-[24px] font-semibold text-[#8a8c95] uppercase">
              Claim Reference
            </p>
            <p className="text-[24px] leading-[40px] font-normal text-[#4d4f5c]">
              MLJNBX
            </p>
          </div>

          {/* Action Required Section */}
          <div className="px-9 pt-6 pb-9 flex flex-col gap-[11px]">
            <p className="text-[14px] leading-[24px] font-semibold text-[#8a8c95] uppercase">
              Action Required
            </p>
            
            {/* Contact Info Row */}
            <div className="flex gap-4 items-start">
              {/* Phone Icon */}
              <div className="bg-[#e5f4fd] rounded-[8px] p-2 flex items-center justify-center shrink-0">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path 
                    d="M33 25.38V29.88C33.0011 30.3185 32.9146 30.7522 32.746 31.1556C32.5773 31.5591 32.3298 31.9237 32.0187 32.2276C31.7077 32.5314 31.3395 32.7682 30.9365 32.9238C30.5336 33.0793 30.1044 33.1505 29.675 33.1325C25.0428 32.6565 20.5905 31.1028 16.69 28.6025C13.1036 26.3516 10.0484 23.2964 7.7975 19.71C5.29251 15.7963 3.73873 11.329 3.2675 6.68251C3.24962 6.25436 3.32052 5.82644 3.47543 5.42449C3.63034 5.02254 3.86603 4.65496 4.16853 4.34419C4.47102 4.03342 4.83406 3.78568 5.23599 3.6161C5.63792 3.44653 6.07018 3.35843 6.5075 3.35751H11.0075C11.7533 3.34995 12.4772 3.61673 13.0453 4.10771C13.6133 4.59869 13.9886 5.28103 14.1 6.02001C14.3087 7.49686 14.6897 8.94454 15.235 10.3325C15.4377 10.8757 15.4735 11.4686 15.3376 12.0322C15.2017 12.5958 14.9001 13.1046 14.4725 13.4925L12.5525 15.4125C14.6869 19.1821 17.8179 22.3131 21.5875 24.4475L23.5075 22.5275C23.8954 22.0999 24.4042 21.7983 24.9678 21.6624C25.5314 21.5265 26.1243 21.5623 26.6675 21.765C28.0555 22.3103 29.5031 22.6913 30.98 22.9C31.7277 23.0126 32.4172 23.3973 32.9092 23.9764C33.4012 24.5556 33.6614 25.2913 33.64 26.045L33 25.38Z" 
                    stroke="#0055b7" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              
              {/* Contact Text */}
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-[16px] leading-[28px] font-normal text-[#4d4f5c]">
                  Please contact the WPA help line
                </p>
                <a 
                  href="tel:01823625329"
                  className="text-[18px] leading-[32px] font-medium text-[#1276c0] hover:text-[#0055b7]"
                >
                  01823 625329
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
