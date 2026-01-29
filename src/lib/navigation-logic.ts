/**
 * Navigation Logic for 12-Step Claim Flow
 * 
 * Full Flow Structure:
 * Part 1 - Claim Details (Steps 1-2)
 *   Q1: Step1Who.tsx - Who is the claim for?
 *   Q2: Step2Insurance.tsx - Other medical insurance?
 *   Q2_1: Step2OtherCoverDetails.tsx - Insurance details (conditional)
 * 
 * Part 2 - Symptoms & Condition (Steps 3-6)
 *   Q3: Step3KnowCondition.tsx - Know your condition?
 *   Q4_1: Step4SymptomKnown.tsx - Symptom with diagnosis (conditional)
 *   Q4_2: Step4SymptomDescribe.tsx - Describe symptom (conditional)
 *   Q5: Step5SymptomStart.tsx - When did symptoms start?
 *   Q6: Step6PreviousSymptoms.tsx - Previous symptoms?
 * 
 * Part 3 - Background Details (Steps 7-8)
 *   Q7: Step7HowHappened.tsx - How did this happen?
 *   Q8: Step8Responsibility.tsx - Legal responsibility?
 * 
 * Part 4 - Referral (Steps 9-12)
 *   Q9: Step9GPConsultation.tsx - GP consultation?
 *   Q10: Step10ReferralDate.tsx - Referral date
 *   Q11: Step11ServiceReferral.tsx - Service type
 *   Q12: Step12HospitalClinic.tsx - Hospital/clinic details
 * 
 * Part 5 - Review & Submit
 *   REVIEW: StepReviewSummary.tsx - Review all answers
 *   OUTCOME: StepOutcome.tsx - Submission confirmation
 */

import type { ClaimState } from '../types/claim';

export type NextStep = string | ((state: ClaimState) => string);

export interface NavigationRule {
  step: string;
  label: string;
  nextStep: NextStep;
  component: string; // Component filename for reference
}

/**
 * Claim Stages for Progress Tracker
 * Groups steps into 5 major stages displayed in the StageTrackerBar
 */
export const CLAIM_STAGES = [
  { 
    id: 'DETAILS', 
    label: 'Claim details', 
    steps: ['Q1', 'Q2'] 
  },
  { 
    id: 'SYMPTOMS', 
    label: 'Symptoms & condition', 
    steps: ['Q3', 'Q4_1', 'Q4_2', 'Q5', 'Q6'] 
  },
  { 
    id: 'BACKGROUND', 
    label: 'Background details', 
    steps: ['Q7', 'Q8'] 
  },
  { 
    id: 'REFERRAL', 
    label: 'Referral', 
    steps: ['Q9', 'Q10', 'Q11', 'Q12'] 
  },
  { 
    id: 'REVIEW', 
    label: 'Review', 
    steps: ['REVIEW', 'OUTCOME'] 
  }
];

/**
 * Complete Navigation Map for 12-Step Claim Flow
 * Maps step IDs to their navigation rules and component files
 */
export const NAVIGATION_MAP: Record<string, NavigationRule> = {
  // ========================================
  // CLAIM TYPE SELECTION
  // ========================================
  
  CLAIM_TYPE: {
    step: 'CLAIM_TYPE',
    label: 'Select claim type',
    component: 'ClaimTypeStep.tsx',
    nextStep: 'ONBOARDING',
  },

  // ========================================
  // ONBOARDING
  // ========================================
  
  ONBOARDING: {
    step: 'ONBOARDING',
    label: 'Welcome to your new claim',
    component: 'OnboardingStep.tsx',
    nextStep: 'Q1',
  },

  // ========================================
  // PART 1: CLAIM DETAILS (Steps 1-2)
  // ========================================
  
  Q1: {
    step: 'Q1',
    label: 'Who do you want to claim for?',
    component: 'Step1Who.tsx',
    nextStep: 'Q2',
  },

  Q2: {
    step: 'Q2',
    label: 'Do you have other medical insurance?',
    component: 'Step2Insurance.tsx',
    // Form is inline in Q2, goes directly to Q3
    nextStep: 'Q3',
  },

  // Q2_1 removed - insurance details form is now inline in Q2

  // ========================================
  // PART 2: SYMPTOMS & CONDITION (Steps 3-6)
  // ========================================

  Q3: {
    step: 'Q3',
    label: 'Do you know what condition you have?',
    component: 'Step3KnowCondition.tsx',
    nextStep: (state: ClaimState) => {
      return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
    },
  },

  Q4_1: {
    step: 'Q4_1',
    label: 'Please enter your main symptom based on your diagnosis',
    component: 'Step4SymptomKnown.tsx',
    nextStep: 'Q5',
  },

  Q4_2: {
    step: 'Q4_2',
    label: 'How would you describe your main symptom?',
    component: 'Step4SymptomDescribe.tsx',
    nextStep: 'Q5',
  },

  Q5: {
    step: 'Q5',
    label: 'When did you first start feeling unwell or notice this symptom?',
    component: 'Step5SymptomStart.tsx',
    nextStep: 'Q6',
  },

  Q6: {
    step: 'Q6',
    label: 'Have you ever dealt with this, or very similar symptoms in the past?',
    component: 'Step6PreviousSymptoms.tsx',
    nextStep: 'Q7',
  },

  // ========================================
  // PART 3: BACKGROUND DETAILS (Steps 7-8)
  // ========================================

  Q7: {
    step: 'Q7',
    label: 'How did this happen?',
    component: 'Step7HowHappened.tsx',
    nextStep: (state: ClaimState) => {
      // If user selected 'sporting' (Yes - one of these applies), go to END_MAJOR_INCIDENT
      if (state.injuryDetails?.type === 'sporting') return 'END_MAJOR_INCIDENT';
      // Otherwise continue to Q8
      return 'Q8';
    },
  },

  Q8: {
    step: 'Q8',
    label: 'Is another person or company legally responsible for this condition?',
    component: 'Step8Responsibility.tsx',
    nextStep: 'Q9',
  },

  // ========================================
  // PART 4: REFERRAL (Steps 9-12)
  // ========================================

  Q9: {
    step: 'Q9',
    label: 'Who have you been referred by?',
    component: 'Step9GPConsultation.tsx',
    nextStep: (state: ClaimState) => {
      // Fast-track path exits early
      if (state.gpConsultationType === 'fast_track') return 'END_FAST_TRACK';
      // Self-referral and Other skip Q10 (referral date)
      if (state.gpConsultationType === 'self_referral' || state.gpConsultationType === 'other') return 'Q11';
      // NHS GP and Private GP go to Q10
      return 'Q10';
    },
  },

  Q10: {
    step: 'Q10',
    label: 'When were you referred by your GP?',
    component: 'Step10ReferralDate.tsx',
    nextStep: 'Q11',
  },

  Q11: {
    step: 'Q11',
    label: 'What kind of service are you referred to?',
    component: 'Step11ServiceReferral.tsx',
    nextStep: 'Q12',
  },

  Q12: {
    step: 'Q12',
    label: 'Which hospital or clinic will you be attending?',
    component: 'Step12HospitalClinic.tsx',
    nextStep: 'REVIEW',
  },

  // ========================================
  // PART 5: REVIEW & SUBMIT
  // ========================================

  REVIEW: {
    step: 'REVIEW',
    label: 'Review all your answers',
    component: 'StepReviewSummary.tsx',
    nextStep: 'OUTCOME',
  },

  OUTCOME: {
    step: 'OUTCOME',
    label: 'Claim submitted',
    component: 'StepOutcome.tsx',
    nextStep: 'END',
  },

  // ========================================
  // SPECIAL EXITS
  // ========================================

  END_FAST_TRACK: {
    step: 'END_FAST_TRACK',
    label: 'Fast-track consultation',
    component: 'FastTrackEndStep.tsx',
    nextStep: 'END',
  },

  END_MAJOR_INCIDENT: {
    step: 'END_MAJOR_INCIDENT',
    label: 'Major incident - call required',
    component: 'MajorIncidentEndStep.tsx',
    nextStep: 'END',
  },
};

/**
 * Get the next step based on current state
 * Handles both static and conditional navigation
 * 
 * @param currentStep - Current step ID (e.g., 'Q1', 'Q2', etc.)
 * @param state - Current claim state containing user responses
 * @returns Next step ID
 */
export const getNextStep = (currentStep: string, state: ClaimState): string => {
  const rule = NAVIGATION_MAP[currentStep];
  
  if (!rule) {
    console.warn(`No navigation rule found for step: ${currentStep}`);
    return 'END';
  }

  // Handle conditional navigation (function-based)
  if (typeof rule.nextStep === 'function') {
    return rule.nextStep(state);
  }

  // Handle static navigation (string-based)
  return rule.nextStep;
};

/**
 * Get previous step for back navigation
 * Handles reverse navigation with conditional branching logic
 * 
 * @param currentStep - Current step ID
 * @param state - Current claim state to determine which branch was taken
 * @returns Previous step ID, or null if at the start
 */
export const getPreviousStep = (currentStep: string, state: ClaimState): string | null => {
  // ========================================
  // CONDITIONAL BRANCH RETURNS
  // ========================================
  
  // After Q2, go back to Q2
  if (currentStep === 'Q3') {
    return 'Q2';
  }

  // After Q4_1 or Q4_2, go back based on which path was taken
  if (currentStep === 'Q5') {
    return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
  }

  // ========================================
  // LINEAR NAVIGATION RETURNS
  // ========================================

  // Claim type and onboarding
  if (currentStep === 'ONBOARDING') return 'CLAIM_TYPE';
  if (currentStep === 'Q1') return 'ONBOARDING';

  // Part 1: Claim Details
  if (currentStep === 'Q2') return 'Q1';

  // Part 2: Symptoms & Condition
  if (currentStep === 'Q4_1') return 'Q3';
  if (currentStep === 'Q4_2') return 'Q3';
  if (currentStep === 'Q6') return 'Q5';

  // Part 3: Background Details
  if (currentStep === 'Q7') return 'Q6';
  if (currentStep === 'Q8') return 'Q7';

  // Part 4: Referral
  if (currentStep === 'Q9') return 'Q8';
  if (currentStep === 'Q10') return 'Q9';
  // Q11 goes back to Q9 if self-referral or other (Q10 was skipped), otherwise Q10
  if (currentStep === 'Q11') {
    return (state.gpConsultationType === 'self_referral' || state.gpConsultationType === 'other') ? 'Q9' : 'Q10';
  }
  if (currentStep === 'Q12') return 'Q11';

  // Part 5: Review & Submit
  if (currentStep === 'REVIEW') return 'Q12';
  if (currentStep === 'OUTCOME') return 'REVIEW';

  // Special exits
  if (currentStep === 'END_FAST_TRACK') return 'Q9';

  // ========================================
  // FALLBACK: No previous step (at start)
  // ========================================
  
  if (currentStep === 'ONBOARDING') return null;

  // Unknown step - warn and return null
  console.warn(`getPreviousStep: Unknown step "${currentStep}"`);
  return null;
};

/**
 * Determine final outcome based on completed answers
 */
export const determineOutcome = (state: ClaimState): 'awaiting_provider' | 'awaiting_form' => {
  const hasSpecialistName = state.specialistDetails?.name && state.specialistDetails.name.trim() !== '';
  const hasHospitalClinic = state.hospitalClinic && state.hospitalClinic.trim() !== '';

  if (!hasSpecialistName && !hasHospitalClinic) {
    return 'awaiting_provider';
  }

  return 'awaiting_form';
};

/**
 * Validate if a step can be proceeded from (all required fields filled)
 */
export const canProceedFromStep = (step: string, state: ClaimState): boolean => {
  switch (step) {
    case 'CLAIM_TYPE':
      // Check if a claim type has been selected
      return !!state.claimType;

    case 'ONBOARDING':
      // Onboarding is informational only, always can proceed
      return true;

    case 'Q1':
      // Check for claimant selection
      return !!state.claimant;

    case 'Q2':
      // If user has other insurance, check if all form fields are filled
      if (state.hasOtherInsurance === true) {
        return !!(
          state.otherMedicalCover &&
          state.otherMedicalCover.subscriberType &&
          state.otherMedicalCover.policyType &&
          state.otherMedicalCover.insurerName &&
          state.otherMedicalCover.policyNumber &&
          state.otherMedicalCover.hasAdvisedInsurer !== null &&
          state.otherMedicalCover.hasAdvisedInsurer !== undefined
        );
      }
      // If user doesn't have other insurance, just need the answer
      return state.hasOtherInsurance === false;

    case 'Q3':
      return state.knowsCondition !== null && state.knowsCondition !== undefined;

    case 'Q4_1':
    case 'Q4_2':
      // Q4 steps only require SNOMED code selection and confirmation
      // bodySide is not collected in these steps
      return !!(
        state.symptom?.snomedCode &&
        state.symptom?.isConfirmed
      );

    case 'Q5':
      // Q5 requires a symptom start date
      const symptomDate = state.symptomStartDate;
      return !!(symptomDate && symptomDate.exactDate && symptomDate.isConfirmed);

    case 'Q6':
      // Q6 asks Yes/No - if Yes, user must also provide a previous symptom date
      const hasPreviousSymptoms = state.hasPreviousSymptoms;
      if (hasPreviousSymptoms === undefined || hasPreviousSymptoms === null) {
        return false;
      }
      // If No, that's sufficient
      if (hasPreviousSymptoms === false) {
        return true;
      }
      // If Yes, they must also provide a date
      const previousSymptomDate = (state.previousSymptomDate as any);
      return !!(previousSymptomDate && previousSymptomDate.date && previousSymptomDate.isConfirmed);

    case 'Q7':
      // Q7 now just requires Yes/No selection (sporting = Yes, other = No)
      // #region agent log
      console.log('[DEBUG-H5] Q7 validation check:', {
        stateHasInjuryDetails: !!(state as any).injuryDetails,
        injuryDetailsValue: (state as any).injuryDetails,
        responsesHasInjuryDetails: !!(state as any).responses?.injuryDetails,
        responsesInjuryDetailsValue: (state as any).responses?.injuryDetails,
        fullState: state
      });
      // #endregion
      const injury = state.injuryDetails;
      const result = !!(injury?.type);
      // #region agent log
      console.log('[DEBUG-H5] Q7 validation result:', {
        injury,
        injuryType: injury?.type,
        result
      });
      // #endregion
      return result;

    case 'Q8':
      if (state.hasLegalResponsibility === false) {
        return true;
      }
      return !!(
        state.hasLegalResponsibility === true &&
        state.solicitorDetails &&
        state.solicitorDetails.dateOfIncident &&
        state.solicitorDetails.solicitorName &&
        state.solicitorDetails.caseHandler &&
        state.solicitorDetails.solicitorAddress &&
        state.solicitorDetails.caseReference &&
        state.solicitorDetails.solicitorPhone &&
        state.solicitorDetails.solicitorEmail
      );

    case 'Q9':
      return state.gpConsultationType !== null && state.gpConsultationType !== undefined;

    case 'Q10':
      // Q10 requires a referral date
      return !!(state.referralDate?.exactDate);

    case 'Q11':
      // Service type is required, specialist name is optional
      return state.referralServiceType !== null && state.referralServiceType !== undefined;

    case 'Q12':
      return true; // Hospital/clinic is optional

    case 'REVIEW':
      return true;

    default:
      return true;
  }
};
