'use client';

import React from 'react';
import { TopBar } from '@/components/ui/TopBar';
import { useClaim } from '@/context/ClaimContext';
import type { StepID } from '@/types/claim';

interface StepLink {
  id: StepID;
  label: string;
  description: string;
  category: string;
}

const STEP_LINKS: StepLink[] = [
  // Initial Selection
  { id: 'CLAIM_TYPE', label: 'Select Claim Type', description: 'Choose the type of claim', category: 'Start' },
  { id: 'ONBOARDING', label: 'Onboarding', description: 'Welcome and introduction', category: 'Start' },
  
  // Part 1: Claim Details
  { id: 'Q1', label: 'Who are you claiming for?', description: 'Select policy holder', category: 'Claim Details' },
  { id: 'Q2', label: 'Other medical insurance', description: 'Do you have other insurance?', category: 'Claim Details' },
  { id: 'Q2_1', label: 'Insurance details', description: 'Provide insurance information', category: 'Claim Details' },
  
  // Part 2: Symptoms & Condition
  { id: 'Q3', label: 'Do you know your condition?', description: 'Know what condition you have?', category: 'Symptoms & Condition' },
  { id: 'Q4_1', label: 'Symptom (with diagnosis)', description: 'Search for your condition', category: 'Symptoms & Condition' },
  { id: 'Q4_2', label: 'Describe symptom', description: 'Describe your symptoms', category: 'Symptoms & Condition' },
  { id: 'Q5', label: 'Symptom start date', description: 'When did symptoms start?', category: 'Symptoms & Condition' },
  { id: 'Q6', label: 'Previous symptoms', description: 'Had symptoms before?', category: 'Symptoms & Condition' },
  
  // Part 3: Background Details
  { id: 'Q7', label: 'How did this happen?', description: 'Sporting injury or accident?', category: 'Background Details' },
  { id: 'Q8', label: 'Legal responsibility', description: 'Is someone legally responsible?', category: 'Background Details' },
  
  // Part 4: Referral
  { id: 'Q9', label: 'GP consultation', description: 'Consulted your GP?', category: 'Referral' },
  { id: 'Q10', label: 'Referral date', description: 'When were you referred?', category: 'Referral' },
  { id: 'Q11', label: 'Service type', description: 'Who were you referred to?', category: 'Referral' },
  { id: 'Q12', label: 'Hospital or clinic', description: 'Which hospital or clinic?', category: 'Referral' },
  
  // Part 5: Review & Submit
  { id: 'REVIEW', label: 'Review answers', description: 'Review all your answers', category: 'Review & Submit' },
  { id: 'OUTCOME', label: 'Submission confirmation', description: 'Claim submitted successfully', category: 'Review & Submit' },
  
  // Special End States
  { id: 'END_FAST_TRACK', label: 'Fast-track exit', description: 'Fast-track consultation path', category: 'Special Paths' },
  { id: 'END_MAJOR_INCIDENT', label: 'Major incident exit', description: 'Call required for incidents', category: 'Special Paths' },
];

/**
 * NavigationOverview
 * 
 * A page that lists all steps/pages in the claim flow with quick access links.
 * Accessible from the Exit button on the TopBar.
 */
export const NavigationOverview: React.FC = () => {
  const { dispatch } = useClaim();

  const navigateToStep = (stepId: StepID) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'currentStep',
        value: stepId,
      },
    });
  };

  // Group steps by category
  const stepsByCategory = STEP_LINKS.reduce((acc, step) => {
    if (!acc[step.category]) {
      acc[step.category] = [];
    }
    acc[step.category].push(step);
    return acc;
  }, {} as Record<string, StepLink[]>);

  return (
    <div className="w-full bg-[#fafbfb] min-h-screen">
      {/* TopBar */}
      <header className="bg-white border-b border-[#d2d3d6] w-full">
        <div className="mx-auto max-w-[1440px] px-[30px] py-[12px]">
          <TopBar />
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-[1200px] mx-auto px-24 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[36px] leading-[48px] font-semibold text-[#4d4f5c] mb-4">
            Claim Flow Navigation
          </h1>
          <p className="text-[16px] leading-[28px] text-[#4d4f5c]">
            Quick access to all steps and pages in the claim flow. Click on any step to navigate directly to it.
          </p>
        </div>

        {/* Steps organized by category */}
        <div className="flex flex-col gap-8">
          {Object.entries(stepsByCategory).map(([category, steps]) => (
            <div key={category} className="bg-white rounded-[16px] border border-[#d2d3d6] p-6">
              {/* Category Header */}
              <h2 className="text-[24px] font-semibold text-[#4d4f5c] mb-4 pb-3 border-b border-[#d2d3d6]">
                {category}
              </h2>
              
              {/* Step Links Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => navigateToStep(step.id)}
                    className="flex flex-col items-start gap-1 p-4 rounded-[8px] border border-[#d2d3d6] bg-white hover:bg-[#f5fbff] hover:border-[#0055b7] transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {/* Step ID Badge */}
                      <span className="text-[12px] font-semibold text-[#8a8c95] uppercase tracking-wide">
                        {step.id}
                      </span>
                      
                      {/* Arrow Icon - shows on hover */}
                      <svg 
                        className="w-[16px] h-[16px] text-[#0055b7] opacity-0 group-hover:opacity-100 transition-opacity ml-auto" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M6 12L10 8L6 4" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    
                    {/* Step Label */}
                    <h3 className="text-[18px] font-semibold text-[#1e1e1e] group-hover:text-[#0055b7] transition-colors">
                      {step.label}
                    </h3>
                    
                    {/* Step Description */}
                    <p className="text-[14px] text-[#8a8c95] leading-[20px]">
                      {step.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationOverview;
