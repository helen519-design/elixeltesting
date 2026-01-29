import React from 'react';
import Image from 'next/image';
import { TopBar } from '../ui/TopBar';

/**
 * Success/Outcome Screen
 * 
 * Static confirmation page shown after claim submission.
 * Layout matches Figma design exactly with:
 * - Main content area on the left
 * - Placeholder graphic on the right
 * - No GlobalActions bar (hidden for this step)
 */
export const SuccessStep: React.FC = () => {
  return (
    <div className="w-full bg-[#fafbfb] min-h-screen">
      {/* TopBar */}
      <header className="bg-white border-b border-[#d2d3d6] w-full">
        <div className="mx-auto max-w-[1440px] px-[30px] py-[12px]">
          <TopBar />
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto px-24 py-12 flex gap-24 items-start justify-center pb-24">
        {/* Left: Main Content */}
        <div className="flex flex-col gap-12 max-w-[720px] min-w-[360px] w-[600px]">
          {/* Heading and Body Text */}
          <div className="flex flex-col gap-6 w-full">
            {/* Main Heading */}
            <h1 className="text-[36px] leading-[48px] font-semibold text-[#4d4f5c]">
              We're on it!
            </h1>
            
            {/* Body Text */}
            <div className="text-[16px] leading-[28px] font-normal text-[#4d4f5c]">
              <p className="mb-0">
                Your claim has been submitted. While we're getting your confirmation and reference number ready, you can jump-start your recovery right now.
              </p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">
                Go to <span className="font-bold">Doctify</span> with our link below to find a WPA-registered provider and book your appointment. We'll send a follow-up to your inbox shortly, but if you have questions, our support page is always here for you.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-start">
            {/* Primary Button: Book now on Doctify */}
            <button
              type="button"
              className="bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] text-white h-[56px] px-6 py-4 rounded-lg flex gap-2 items-center justify-center transition-all duration-200"
            >
              <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
                Book now on Doctify
              </span>
              <Image
                src="/icons/external-link.svg"
                alt=""
                width={20}
                height={20}
                className="flex-shrink-0"
              />
            </button>

            {/* Secondary Button: Back to dashboard */}
            <button
              type="button"
              className="bg-white border border-[#0055b7] text-[#0055b7] hover:bg-[#f0f7ff] active:bg-[#e0efff] h-[56px] px-6 py-4 rounded-lg flex gap-0 items-center justify-center transition-all duration-200"
            >
              <div className="flex gap-0.5 items-center justify-center">
                <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
                  Back to dashboard
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Placeholder Graphic */}
        <div className="flex-shrink-0 w-[462px] h-[555px] relative">
          <Image
            src="/assets/PlaceholderGraphic.png"
            alt="Claim process illustration"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
