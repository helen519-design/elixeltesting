import React from 'react';
import { AnimatePresence } from 'framer-motion';

import AppShell from './AppShell';
import { useClaim } from '@/context/ClaimContext';

// Claim Type Selection
import { ClaimTypeStep } from './steps/ClaimTypeStep';

// Onboarding
import { OnboardingStep } from './steps/OnboardingStep';

// Part 1: Claim Details (Q1-Q2)
import { Step1Who } from './steps/Step1Who';
import { Step2Insurance } from './steps/Step2Insurance';
// Step2OtherCoverDetails removed - form is now inline in Step2Insurance

// Part 2: Symptoms & Condition (Q3-Q6)
import { Step3KnowCondition } from './steps/Step3KnowCondition';
import { Step4SymptomKnown } from './steps/Step4SymptomKnown';
import { Step4SymptomDescribe } from './steps/Step4SymptomDescribe';
import { Step5SymptomStart } from './steps/Step5SymptomStart';
import { Step6PreviousSymptoms } from './steps/Step6PreviousSymptoms';

// Part 3: Background Details (Q7-Q8)
import { Step7HowHappened } from './steps/Step7HowHappened';
import { Step8Responsibility } from './steps/Step8Responsibility';

// Part 4: Referral (Q9-Q12)
import { Step9GPConsultation } from './steps/Step9GPConsultation';
import { Step10ReferralDate } from './steps/Step10ReferralDate';
import { Step11ServiceReferral } from './steps/Step11ServiceReferral';
import { Step12HospitalClinic } from './steps/Step12HospitalClinic';

// Part 5: Review & Submit
import { StepReviewSummary } from './steps/StepReviewSummary';
import { SuccessStep } from './steps/SuccessStep';
import { FastTrackEndStep } from './steps/FastTrackEndStep';
import { MajorIncidentEndStep } from './steps/MajorIncidentEndStep';
import { NavigationOverview } from './steps/NavigationOverview';

/**
 * ClaimFlowManager
 * 
 * Central component that renders the correct step based on currentStep from context.
 * Maps all 12 question steps plus review/outcome screens.
 * 
 * Navigation flow is controlled by src/lib/navigation-logic.ts
 */
const ClaimFlowManager: React.FC = () => {
  const { state } = useClaim();

  const renderStep = () => {
    switch (state.currentStep) {
      // ========================================
      // CLAIM TYPE SELECTION
      // ========================================
      case 'CLAIM_TYPE':
        return <ClaimTypeStep />;

      // ========================================
      // ONBOARDING
      // ========================================
      case 'ONBOARDING':
        return <OnboardingStep />;

      // ========================================
      // PART 1: CLAIM DETAILS (Q1-Q2)
      // ========================================
      case 'Q1':
        return <Step1Who />;
      
      case 'Q2':
        return <Step2Insurance />;
      
      // Q2_1 removed - insurance details form is now inline in Q2

      // ========================================
      // PART 2: SYMPTOMS & CONDITION (Q3-Q6)
      // ========================================
      case 'Q3':
        return <Step3KnowCondition />;
      
      case 'Q4_1':
        return <Step4SymptomKnown />;
      
      case 'Q4_2':
        return <Step4SymptomDescribe />;
      
      case 'Q5':
        return <Step5SymptomStart />;
      
      case 'Q6':
        return <Step6PreviousSymptoms />;

      // ========================================
      // PART 3: BACKGROUND DETAILS (Q7-Q8)
      // ========================================
      case 'Q7':
        return <Step7HowHappened />;
      
      case 'Q8':
        return <Step8Responsibility />;

      // ========================================
      // PART 4: REFERRAL (Q9-Q12)
      // ========================================
      case 'Q9':
        return <Step9GPConsultation />;
      
      case 'Q10':
        return <Step10ReferralDate />;
      
      case 'Q11':
        return <Step11ServiceReferral />;
      
      case 'Q12':
        return <Step12HospitalClinic />;

      // ========================================
      // PART 5: REVIEW & SUBMIT
      // ========================================
      case 'REVIEW':
        return <StepReviewSummary />;
      
      case 'OUTCOME':
        return <SuccessStep />;
      
      case 'END_FAST_TRACK':
        return <FastTrackEndStep />;
      
      case 'END_MAJOR_INCIDENT':
        return <MajorIncidentEndStep />;
      
      case 'NAVIGATION_OVERVIEW':
        return <NavigationOverview />;

      // ========================================
      // DEFAULT / ERROR STATE
      // ========================================
      default:
        console.error(`[ClaimFlowManager] Unknown step: "${state.currentStep}". Valid steps: CLAIM_TYPE, ONBOARDING, Q1-Q12, Q4_1, Q4_2, REVIEW, OUTCOME, END_FAST_TRACK, END_MAJOR_INCIDENT, NAVIGATION_OVERVIEW`);
        // Attempt to recover by showing CLAIM_TYPE (start of flow)
        return <ClaimTypeStep />;
    }
  };

  return (
    <AppShell>
      <AnimatePresence initial={false} mode="wait">
        
        {renderStep()}
      </AnimatePresence>
    </AppShell>
  );
};

export default ClaimFlowManager;

