'use client';

import React from 'react';
import { useClaim } from '@/context/ClaimContext';

/**
 * GlobalActions
 * 
 * Fixed bottom bar with Back and Continue buttons.
 * 
 * Validation Logic:
 * - Q1-Q10: Continue button disabled if required fields are empty
 * - Q11: Service type required, but specialist name is optional
 * - Q12: Always enabled (hospital/clinic is optional)
 * - REVIEW, OUTCOME: Always enabled
 * 
 * Navigation Logic:
 * - Back button: Hidden on ONBOARDING and Q1 (first step)
 * - Back button: Triggers PREVIOUS_STEP action
 * - Continue button: Triggers NEXT_STEP action (disabled if validation fails)
 * 
 * Exact Figma layout specifications:
 * - Container: max-w-[1440px], px-[96px] (page margins desktop)
 * - ActionsWrapper: flex gap-[16px] items-center
 * - Back button: h-[64px], px-[24px], py-[16px], white bg, blue border, rounded-[8px]
 * - Continue button: h-[64px], min-w-[280px], px-[24px], py-[16px], blue bg, rounded-[8px]
 */
export const GlobalActions: React.FC = () => {
  const { state, dispatch, canProceed } = useClaim();

  // Hide GlobalActions on claim type, onboarding, navigation overview and final success/outcome screens
  if (state.currentStep === 'CLAIM_TYPE' || state.currentStep === 'ONBOARDING' || state.currentStep === 'OUTCOME' || state.currentStep === 'END_FAST_TRACK' || state.currentStep === 'END_MAJOR_INCIDENT' || state.currentStep === 'NAVIGATION_OVERVIEW') {
    return null;
  }

  // Determine current step state
  const isOnboarding = state.currentStep === 'ONBOARDING';
  const isFirstStep = state.currentStep === 'Q1' || isOnboarding;
  const isReviewStep = state.currentStep === 'REVIEW';
  
  // Button text changes based on step
  const continueButtonText = isOnboarding 
    ? 'Start Claim' 
    : isReviewStep 
    ? 'Submit Claim' 
    : 'Continue';
  
  /**
   * Step Validation
   * Uses canProceed() from context which internally calls canProceedFromStep()
   * 
   * Required steps (Q1-Q10):
   * - Q1: Claimant selection
   * - Q2: Insurance question
   * - Q2_1: Insurance details (if Q2 = Yes)
   * - Q3: Know condition question
   * - Q4_1/Q4_2: Symptom details
   * - Q5: Symptom start date
   * - Q6: Previous symptoms question
   * - Q7: How it happened
   * - Q8: Legal responsibility
   * - Q9: GP consultation
   * - Q10: Referral date
   * 
   * Optional steps:
   * - Q11: Service type required, specialist name optional
   * - Q12: Hospital/clinic optional
   * - REVIEW: Always can proceed
   * - OUTCOME: Always can proceed
   */
  const isContinueDisabled = !canProceed();

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      dispatch({ type: 'PREVIOUS_STEP' });
    }
  };

  const handleNextStep = () => {
    if (!isContinueDisabled) {
      // Use NEXT_STEP for all steps (including ONBOARDING)
      // The navigation map correctly defines ONBOARDING → Q1
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  return (
    <div className="w-full bg-[#F9FAFB]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-1 gap-[16px] items-center min-h-px min-w-px relative py-[24px]">
          
          {/* ========================================
              BACK BUTTON
              - Hidden on ONBOARDING and Q1 (first step)
              - Triggers PREVIOUS_STEP action
              ======================================== */}
          {!isFirstStep && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="bg-white border-[#0055b7] border-[1px] border-solid flex gap-0 h-[64px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0 transition hover:bg-gray-50 active:bg-gray-100"
              aria-label="Go back to previous step"
            >
              <div className="flex gap-[2px] items-center justify-center relative shrink-0">
                <div className="overflow-clip relative shrink-0 w-[20px] h-[20px]">
                  {/* Chevron-back icon */}
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 20 20" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12.5 15L7.5 10L12.5 5" 
                      stroke="#0055b7" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
          )}

          {/* ========================================
              CONTINUE BUTTON
              - Disabled if step validation fails
              - Visual feedback: Faded appearance when disabled
              - Triggers NEXT_STEP action
              ======================================== */}
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isContinueDisabled}
            className={`flex gap-0 h-[64px] items-center justify-center min-w-[280px] px-[24px] py-[16px] relative rounded-[8px] shrink-0 transition-all duration-200 ${
              isContinueDisabled
                ? 'bg-[#d2d3d6] text-[#949494] cursor-not-allowed opacity-60'
                : 'bg-[#0055b7] text-white hover:bg-[#1276c0] active:bg-[#004494] opacity-100'
            }`}
            aria-label={
              isContinueDisabled 
                ? 'Complete required fields to continue' 
                : isOnboarding
                ? 'Start your claim'
                : isReviewStep 
                ? 'Submit your claim' 
                : 'Continue to next step'
            }
            aria-disabled={isContinueDisabled}
          >
            <div className="flex gap-[2px] items-center justify-center relative shrink-0">
              <div className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center tracking-[0.1px]">
                <p className="leading-[28px]">{continueButtonText}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalActions;
