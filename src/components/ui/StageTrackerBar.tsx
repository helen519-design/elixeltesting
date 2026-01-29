'use client';

import React from 'react';
import { useClaim } from '@/context/ClaimContext';
import { CLAIM_STAGES } from '../../lib/navigation-logic';

/**
 * StageTrackerBar
 * 
 * Full-width progress indicator showing the current stage in the claim flow.
 * Displays 5 stages with connecting lines and labels spanning 100vw.
 * 
 * Design specifications:
 * - Dot size: 14px
 * - Connector lines: 2.5px height
 * - Label spacing: 10px below dots
 * - Label text: 14px, medium weight, #4d4f5c
 * - Active/completed color: #1276c0 (blue)
 * - Inactive color: #d2d3d6 (grey)
 * - Full-width: 100vw
 */
export const StageTrackerBar: React.FC = () => {
  const { state } = useClaim();

  const activeIndex = CLAIM_STAGES.findIndex((stage) =>
    stage.steps.includes(state.currentStep)
  );

  return (
    <nav 
      aria-label="Claim progress" 
      className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-12 pt-10 pb-6"
    >
      <div className="flex items-start w-full">
        {CLAIM_STAGES.map((stage, index) => {
          const isActive = index === activeIndex;
          const isCompleted = activeIndex > index;
          const isDotActive = isActive || isCompleted;
          const isLeftLineActive = activeIndex >= index; // Line TO this stage is blue if reached
          const isRightLineActive = activeIndex > index; // Line FROM this stage is blue if completed

          return (
            <div 
              key={stage.id}
              className="flex flex-col items-center flex-1"
            >
              {/* Dot and Line Row */}
              <div className="flex items-center w-full">
                {/* Left Line */}
                <div 
                  className={`h-[2.5px] flex-1 -mr-[2px] transition-colors ${
                    index === 0 
                      ? 'bg-transparent' 
                      : isLeftLineActive 
                      ? 'bg-[#1276c0]' 
                      : 'bg-[#d2d3d6]'
                  }`}
                />
                
                {/* Dot */}
                <div 
                  className={`w-[14px] h-[14px] rounded-full shrink-0 transition-colors relative z-10 ${
                    isDotActive ? 'bg-[#1276c0]' : 'bg-[#d2d3d6]'
                  }`}
                />
                
                {/* Right Line */}
                <div 
                  className={`h-[2.5px] flex-1 -ml-[2px] transition-colors ${
                    index === CLAIM_STAGES.length - 1
                      ? 'bg-transparent'
                      : isRightLineActive 
                      ? 'bg-[#1276c0]' 
                      : 'bg-[#d2d3d6]'
                  }`}
                />
              </div>
              
              {/* Label */}
              <span className="mt-[10px] text-[14px] leading-[24px] font-medium text-[#4d4f5c] text-center w-full px-2">
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default StageTrackerBar;
