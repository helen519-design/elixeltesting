'use client';

import React from 'react';
import { TopBar } from '@/components/ui/TopBar';

/**
 * Major Incident End Step
 * 
 * Shown when user indicates their condition is from a sporting injury,
 * traffic accident, trip/fall, or attack/assault.
 * Asks them to call WPA instead of continuing with the form.
 */
export const MajorIncidentEndStep: React.FC = () => {
  const handleBackToDashboard = () => {
    // TODO: Navigate to dashboard
    window.location.href = '/';
  };

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
          <div className="flex flex-col gap-6 w-full text-[#4d4f5c]">
            {/* Main Heading */}
            <h1 className="text-[36px] leading-[48px] font-semibold">
              We&apos;re here to help you
              <br />
              through this.
            </h1>
            
            {/* Body Text */}
            <div className="text-[16px] leading-[28px] font-normal">
              <p className="mb-0">
                Because your condition involves a specific incident like a sporting injury or accident, we want to make sure your claim is handled with extra care. These situations often have unique details that are much easier to explain over the phone than in a form.
              </p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0 font-bold">
                Please give the WPA team a call:
              </p>
              <ul className="list-disc pl-6 mb-0">
                <li className="mb-0">
                  Phone: <a href="tel:01823625329" className="text-[#0055b7] underline">01823 625329</a>
                </li>
                <li>
                  Hours: Monday – Friday, 9am – 5pm
                </li>
              </ul>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">
                We&apos;re ready to help you take the next step. Just give us a call and we&apos;ll get everything moving for you.
              </p>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <button
            type="button"
            onClick={handleBackToDashboard}
            className="bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] text-white h-[56px] px-6 py-4 rounded-lg flex items-center justify-center transition-all duration-200 self-start"
          >
            <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
              Back to dashboard
            </span>
          </button>
        </div>

        {/* Right: Action Card */}
        <div className="bg-white border border-[#d2d3d6] rounded-2xl flex flex-col shrink-0 w-[430px]">
          {/* Claim Reference Section */}
          <div className="border-b border-[#d2d3d6] px-9 pt-9 pb-4 flex flex-col gap-3">
            <p className="text-[14px] leading-[24px] font-semibold text-[#8a8c95] uppercase">
              Claim reference
            </p>
            <p className="text-[24px] leading-[40px] font-normal text-[#4d4f5c]">
              MLJNBX
            </p>
          </div>

          {/* Action Required Section */}
          <div className="px-9 py-6 flex flex-col gap-3">
            <p className="text-[14px] leading-[24px] font-semibold text-[#8a8c95] uppercase">
              Action required
            </p>
            <div className="flex gap-4 items-start">
              {/* Phone Icon */}
              <div className="bg-[#e5f4fd] rounded-lg p-2 shrink-0">
                <svg 
                  className="w-9 h-9" 
                  viewBox="0 0 36 36" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M33 25.92V30.42C33.0011 30.8549 32.9058 31.2845 32.7208 31.6786C32.5359 32.0728 32.2659 32.4216 31.9298 32.7011C31.5938 32.9805 31.1999 33.1839 30.7771 33.2973C30.3543 33.4107 29.9126 33.4314 29.4812 33.3581C24.8356 32.6109 20.4289 30.7878 16.6125 28.0331C13.0824 25.5284 10.1465 22.2925 7.99999 18.5456C5.24997 14.5139 3.48121 9.86716 2.84249 5.01562C2.77028 4.56389 2.79034 4.10172 2.90116 3.65869C3.01198 3.21565 3.21072 2.80192 3.48404 2.44654C3.75737 2.09116 4.09893 1.80281 4.48634 1.60217C4.87375 1.40153 5.29761 1.29318 5.72749 1.28437H9.90624C10.6447 1.27681 11.3604 1.54524 11.9169 2.03936C12.4735 2.53348 12.8318 3.21969 12.925 3.96562C13.0984 5.45582 13.4433 6.92205 13.9531 8.33437C14.1542 8.90981 14.1865 9.53413 14.0459 10.1283C13.9052 10.7225 13.5982 11.2595 13.1625 11.6756L11.4937 13.4606C13.8441 17.3752 17.25 21.0352 20.925 23.5481L22.5937 21.7631C22.9815 21.2987 23.4829 20.9696 24.0361 20.8183C24.5893 20.6669 25.1709 20.7007 25.7062 20.9156C27.0139 21.4608 28.3728 21.8281 29.7562 22.0106C30.4762 22.1069 31.1392 22.4832 31.6212 23.0676C32.1032 23.6519 32.3695 24.4024 32.3687 25.1781L33 25.92Z" 
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
                <p className="text-[18px] leading-[32px] font-medium text-[#1276c0]">
                  01823 625329
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
