/**
 * JSON Logic Map for Claim Flow Navigation
 * Defines the next step for every question based on user input and branching logic
 */

import type { ClaimState } from '../types/claim';

export type NextStep = string | ((state: ClaimState) => string);

export interface NavigationRule {
  step: string;
  label: string;
  nextStep: NextStep;
  conditions?: {
    field: keyof ClaimState;
    value: any;
    nextStep: string;
  }[];
}

export const CLAIM_STAGES = [
  { id: 'DETAILS', label: 'Claim details', steps: ['Q1', 'Q2', 'Q2_1'] },
  { id: 'SYMPTOMS', label: 'Symptoms & condition', steps: ['Q3', 'Q4_1', 'Q4_2', 'Q5', 'Q6', 'Q6_1'] },
  { id: 'BACKGROUND', label: 'Background details', steps: ['Q7', 'Q8'] },
  { id: 'REFERRAL', label: 'Referral', steps: ['Q9', 'Q10', 'Q11', 'Q12'] },
  { id: 'REVIEW', label: 'Review', steps: ['REVIEW_SUMMARY'] }
];

/**
 * Navigation Logic Map
 * Defines conditional navigation based on user answers
 */
export const NAVIGATION_MAP: Record<string, NavigationRule> = {
  // Part 1 - Claim Details
  Q1: {
    step: 'Q1',
    label: 'Who do you want to claim for?',
    nextStep: 'Q2',
  },

  Q2: {
    step: 'Q2',
    label: 'Do you have other medical insurance?',
    nextStep: (state: ClaimState) => {
      return state.hasOtherInsurance === true ? 'Q2_1' : 'Q3';
    },
  },

  Q2_1: {
    step: 'Q2_1',
    label: 'Please tell us about your medical cover details',
    nextStep: 'Q3',
  },

  // Part 2 - Symptoms & Condition
  Q3: {
    step: 'Q3',
    label: 'Do you know what condition you have?',
    nextStep: (state: ClaimState) => {
      return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
    },
  },

  Q4_1: {
    step: 'Q4_1',
    label: 'Please enter your main symptom based on your diagnosis',
    nextStep: 'Q5',
  },

  Q4_2: {
    step: 'Q4_2',
    label: 'How would you describe your main symptom?',
    nextStep: 'Q5',
  },

  Q5: {
    step: 'Q5',
    label: 'When did you first start feeling unwell or notice this symptom?',
    nextStep: 'Q6',
  },

  Q6: {
    step: 'Q6',
    label: 'Have you ever dealt with this, or very similar symptoms in the past?',
    nextStep: (state: ClaimState) => {
      return state.hasPreviousSymptoms === true ? 'Q6_1' : 'Q7';
    },
  },

  Q6_1: {
    step: 'Q6_1',
    label: 'When did you have this symptom previously?',
    nextStep: 'Q7',
  },

  // Part 3 - Background Details
  Q7: {
    step: 'Q7',
    label: 'How did this happen?',
    nextStep: 'Q8',
  },

  Q8: {
    step: 'Q8',
    label: 'Is another person or company legally responsible for this condition?',
    nextStep: 'Q9',
  },

  // Part 4 - Referral
  Q9: {
    step: 'Q9',
    label: 'Have you consulted your GP about this?',
    nextStep: (state: ClaimState) => {
      return state.gpConsultationType === 'fast_track' ? 'END_FAST_TRACK' : 'Q10';
    },
  },

  Q10: {
    step: 'Q10',
    label: 'When were you referred by your GP?',
    nextStep: 'Q11',
  },

  Q11: {
    step: 'Q11',
    label: 'For which service were you referred?',
    nextStep: 'Q12',
  },

  Q12: {
    step: 'Q12',
    label: 'Which hospital or clinic will you be attending?',
    nextStep: 'REVIEW',
  },

  REVIEW: {
    step: 'REVIEW',
    label: 'Review all your answers',
    nextStep: 'OUTCOME',
  },

  OUTCOME: {
    step: 'OUTCOME',
    label: 'Claim submitted',
    nextStep: 'END',
  },

  END_FAST_TRACK: {
    step: 'END_FAST_TRACK',
    label: 'Fast-track consultation',
    nextStep: 'END',
  },
};

/**
 * Get the next step based on current state
 */
export const getNextStep = (currentStep: string, state: ClaimState): string => {
  const rule = NAVIGATION_MAP[currentStep];
  
  if (!rule) {
    console.warn(`No navigation rule found for step: ${currentStep}`);
    return 'END';
  }

  if (typeof rule.nextStep === 'function') {
    return rule.nextStep(state);
  }

  return rule.nextStep;
};

/**
 * Check if a step is a sub-step (e.g., Q2_1, Q4_1, Q4_2)
 */
const isSubStep = (step: string): boolean => {
  return step.includes('_') || step === 'END_FAST_TRACK';
};

/**
 * Get the parent step for a sub-step
 * Sub-steps jump back to the parent step that triggered the branch
 */
const getParentStep = (subStep: string, _state: ClaimState): string | null => {
  // Q2_1 is a sub-step of Q2
  if (subStep === 'Q2_1') {
    return 'Q2';
  }

  // Q4_1 and Q4_2 are sub-steps of Q3
  if (subStep === 'Q4_1' || subStep === 'Q4_2') {
    return 'Q3';
  }

  // Q6_1 is a sub-step of Q6
  if (subStep === 'Q6_1') {
    return 'Q6';
  }

  // END_FAST_TRACK is a sub-step of Q9
  if (subStep === 'END_FAST_TRACK') {
    return 'Q9';
  }

  return null;
};

/**
 * Get previous step (for back navigation)
 * Sub-steps jump back to their parent step
 * Returns null for Q1 (first onboarding page - back button should be hidden)
 */
export const getPreviousStep = (currentStep: string, state: ClaimState): string | null => {
  // Hide back button on the very first onboarding page
  if (currentStep === 'Q1') {
    return null;
  }

  // If current step is a sub-step, jump back to the parent step
  if (isSubStep(currentStep)) {
    const parentStep = getParentStep(currentStep, state);
    if (parentStep) {
      return parentStep;
    }
  }

  // Special cases based on branching logic
  if (currentStep === 'Q3') {
    return state.hasOtherInsurance === true ? 'Q2_1' : 'Q2';
  }

  if (currentStep === 'Q5') {
    return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
  }

  if (currentStep === 'Q10') {
    return 'Q9';
  }

  if (currentStep === 'REVIEW') {
    return 'Q12';
  }

  if (currentStep === 'OUTCOME') {
    return 'REVIEW';
  }

  // Standard backwards navigation
  const stepOrder = [
    'Q1', 'Q2', 'Q2_1', 'Q3', 'Q4_1', 'Q4_2', 'Q5', 'Q6', 'Q6_1',
    'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'REVIEW', 'OUTCOME'
  ] as const;

  const currentIndex = stepOrder.indexOf(currentStep as any);
  
  if (currentIndex > 0) {
    // Find the last step that was actually visited
    for (let i = currentIndex - 1; i >= 0; i--) {
      const step = stepOrder[i] as string;
      if (state.completedSteps.includes(step as any)) {
        return step;
      }
    }
    // If no completed steps found, return the immediate previous step
    return stepOrder[currentIndex - 1] as string;
  }

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
    case 'Q1':
      return state.claimant !== null;

    case 'Q2':
      if (state.hasOtherInsurance === false) return true;
      if (state.hasOtherInsurance === true) {
        return !!(
          state.otherMedicalCover &&
          state.otherMedicalCover.subscriberType &&
          state.otherMedicalCover.policyType &&
          state.otherMedicalCover.insurerName &&
          state.otherMedicalCover.policyNumber &&
          state.otherMedicalCover.hasAdvisedInsurer !== null
        );
      }
      return false;

    case 'Q2_1':
      return !!(
        state.otherMedicalCover &&
        state.otherMedicalCover.subscriberType &&
        state.otherMedicalCover.policyType &&
        state.otherMedicalCover.insurerName &&
        state.otherMedicalCover.policyNumber &&
        state.otherMedicalCover.hasAdvisedInsurer !== null
      );

    case 'Q3':
      return state.knowsCondition !== null;

    case 'Q4_1':
    case 'Q4_2':
      return !!(
        state.symptom.snomedCode &&
        state.symptom.isConfirmed &&
        state.symptom.bodySide
      );

    case 'Q5':
      return !!(
        state.symptomStartDate.mode &&
        state.symptomStartDate.isConfirmed &&
        (state.symptomStartDate.exactDate || state.symptomStartDate.estimatedStartDate)
      );

    case 'Q6':
      return state.hasPreviousSymptoms !== null;

    case 'Q6_1':
      return !!(
        state.hasPreviousSymptoms === true &&
        state.previousSymptomDate &&
        state.previousSymptomDate.isConfirmed
      );

    case 'Q7': {
      const t = state.injuryDetails.type;
      if (t === null) return false;
      if (t === 'sporting') {
        const s = state.injuryDetails.sporting;
        return !!(s?.sport?.trim() && s?.country?.trim() && s.receivedDonation !== null);
      }
      if (t === 'trip_fall') {
        const s = state.injuryDetails.tripFall;
        return !!(s?.cause?.trim() && s?.country?.trim() && s.wasWinterSport !== null);
      }
      if (t === 'traffic') {
        const s = state.injuryDetails.traffic;
        return !!(s?.role && s?.country?.trim() && s?.incidentDescription?.trim());
      }
      if (t === 'attack') {
        const s = state.injuryDetails.attack;
        return !!(s?.cause?.trim() && s?.country?.trim());
      }
      if (t === 'other') {
        return !!state.injuryDetails.other?.trim();
      }
      return false;
    }

    case 'Q8':
      if (state.hasLegalResponsibility === false) {
        return true;
      }
      return !!(
        state.hasLegalResponsibility === true &&
        state.solicitorDetails &&
        state.solicitorDetails.dateOfIncident &&
        state.solicitorDetails.solicitorName
      );

    case 'Q9':
      return state.gpConsultationType !== null;

    case 'Q10':
      return !!(
        state.referralDate.mode &&
        state.referralDate.isConfirmed &&
        (state.referralDate.exactDate || state.referralDate.estimatedStartDate)
      );

    case 'Q11': {
      if (state.referralServiceType === null) return false;
      if (state.referralServiceType === 'specialist' || state.referralServiceType === 'mental_health_specialist') {
        return !!state.specialistDetails?.name?.trim();
      }
      return true;
    }

    case 'Q12':
      return !!state.hospitalClinic?.trim();

    case 'REVIEW':
      return true;

    default:
      return true;
  }
};
