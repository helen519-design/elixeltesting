/**
 * Claim Flow TypeScript Interfaces
 * Comprehensive type definitions for a 12-question claim flow with branching logic
 */

// Step ID Type - All valid step identifiers in the claim flow
export type StepID = 
  // Initial selection
  | 'CLAIM_TYPE' // Select claim type
  | 'ONBOARDING' // Initial onboarding (if used)
  // Part 1: Claim Details
  | 'Q1'      // Who do you want to claim for?
  | 'Q2'      // Do you have other medical insurance?
  | 'Q2_1'    // Insurance details (conditional)
  // Part 2: Symptoms & Condition
  | 'Q3'      // Do you know what condition you have?
  | 'Q4_1'    // Symptom with diagnosis (conditional)
  | 'Q4_2'    // Describe symptom (conditional)
  | 'Q5'      // When did symptoms start?
  | 'Q6'      // Previous symptoms?
  // Part 3: Background Details
  | 'Q7'      // How did this happen?
  | 'Q8'      // Legal responsibility?
  // Part 4: Referral
  | 'Q9'      // GP consultation?
  | 'Q10'     // Referral date
  | 'Q11'     // Service type
  | 'Q12'     // Hospital/clinic
  // Part 5: Review & Submit
  | 'REVIEW'  // Review all answers
  | 'OUTCOME' // Submission confirmation
  // Special States
  | 'END_FAST_TRACK' // Fast-track exit path
  | 'END_MAJOR_INCIDENT' // Major incident exit path (sporting injury, accident, etc.)
  | 'NAVIGATION_OVERVIEW'; // Navigation overview page with links to all steps

// SNOMED Data Types
export interface SnomedCode {
  code: string;
  name: string;
  description?: string;
}

export type BodySide = 'left' | 'right' | 'both' | null;

// Question 1 Types
export interface PolicyHolder {
  id: string;
  name: string;
  relationship: string;
}

// Question 2.1 Types
export type SubscriberType = 'subscriber' | 'dependant';
export type PolicyType = 'PMI' | 'Cash Plan';

export interface OtherMedicalCover {
  subscriberType: SubscriberType | null;
  policyType: PolicyType | null;
  insurerName: string;
  policyNumber: string;
  hasAdvisedInsurer: boolean | null;
}

// Question 4 Types
export interface SymptomData {
  snomedCode: SnomedCode | null;
  userInput: string;
  bodySide: BodySide;
  isConfirmed: boolean;
}

// Question 5 & 6 Date Types
export type DatePickerMode = 'exact' | 'approximate' | null;

export interface DateSelection {
  mode: DatePickerMode;
  exactDate: string | null; // ISO date string
  approximateMonth: string | null; // e.g., "January 2025"
  isConfirmed: boolean;
  estimatedStartDate: string | null; // ISO date string
}

// Question 7 Types - How did this happen
export type InjuryType = 'sporting' | 'trip_fall' | 'traffic' | 'attack' | 'other' | null;

export interface SportingInjuryDetails {
  sport: string;
  country: string;
  receivedDonation: boolean | null;
}

export interface TripFallDetails {
  cause: string;
  country: string;
  wasWinterSport: boolean | null;
  winterSportActivity?: string;
}

export type TrafficAccidentRole = 'motorcycle_bicycle' | 'motor_vehicle' | 'pedestrian' | null;

export interface TrafficAccidentDetails {
  role: TrafficAccidentRole;
  hadProtection?: boolean | null; // helmet for motorcycle/bicycle
  hadSeatbelt?: boolean | null; // for motor vehicle
  incidentDescription: string;
  criminalProceedings: boolean | null;
  country: string;
}

export interface AttackAssaultDetails {
  cause: string;
  country: string;
}

export interface InjuryDetails {
  type: InjuryType;
  sporting?: SportingInjuryDetails;
  tripFall?: TripFallDetails;
  traffic?: TrafficAccidentDetails;
  attack?: AttackAssaultDetails;
  other?: string;
}

// Question 8 Types - Legal Responsibility
export interface SolicitorDetails {
  dateOfIncident: string | null; // ISO date string
  solicitorName: string;
  caseHandler: string;
  solicitorAddress: string;
  solicitorPhone: string;
  solicitorEmail: string;
  caseReference: string;
}

// Question 9 Types - GP Consultation
export type GPConsultationType = 'nhs_gp' | 'private_gp' | 'self_referral' | 'other' | 'fast_track' | null;

// Question 11 Types - Service Referral
export type ReferralServiceType = 
  | 'specialist' 
  | 'mental_health_specialist' 
  | 'therapist' 
  | 'mental_health_therapist' 
  | 'direct_test' 
  | null;

export interface SpecialistDetails {
  name: string;
  gpHospital?: string;
  specialties?: string[];
}

// Claim Type Selection
export type ClaimType = 'newMedical' | 'routineHealthcare' | 'fastTrackPhysio' | 'fastTrackSkin' | null;

// Main Claim State Interface
export interface ClaimState {
  // Claim Type Selection (before Q1)
  claimType: ClaimType;

  // Q1: Who do you want to claim for?
  claimant: PolicyHolder | null;

  // Q2: Do you have other medical insurance?
  hasOtherInsurance: boolean | null;

  // Q2.1: Other medical cover details (conditional on Q2)
  otherMedicalCover: OtherMedicalCover | null;

  // Q3: Do you know what condition you have?
  knowsCondition: boolean | null;

  // Q4.1 / Q4.2: Symptom information
  symptom: SymptomData;

  // Q5: When did you first start feeling unwell?
  symptomStartDate: DateSelection;

  // Q6: Have you dealt with this before?
  hasPreviousSymptoms: boolean | null;
  previousSymptomDate: DateSelection | null;

  // Q7: How did this happen?
  injuryDetails: InjuryDetails;

  // Q8: Legal responsibility
  hasLegalResponsibility: boolean | null;
  solicitorDetails: SolicitorDetails | null;

  // Q9: GP consultation type
  gpConsultationType: GPConsultationType;

  // Q10: Referral date
  referralDate: DateSelection;

  // Q11: Service referral type and specialist
  referralServiceType: ReferralServiceType;
  specialistDetails: SpecialistDetails | null;

  // Q12: Hospital or clinic
  hospitalClinic: string;

  // Flow control
  currentStep: StepID;
  completedSteps: StepID[];
  
  // Final outcome
  outcome: 'awaiting_provider' | 'awaiting_form' | null;
}

// Initial state factory
export const createInitialClaimState = (): ClaimState => ({
  claimType: null,
  claimant: null,
  hasOtherInsurance: null,
  otherMedicalCover: null,
  knowsCondition: null,
  symptom: {
    snomedCode: null,
    userInput: '',
    bodySide: null,
    isConfirmed: false,
  },
  symptomStartDate: {
    mode: null,
    exactDate: null,
    approximateMonth: null,
    isConfirmed: false,
    estimatedStartDate: null,
  },
  hasPreviousSymptoms: null,
  previousSymptomDate: null,
  injuryDetails: {
    type: null,
  },
  hasLegalResponsibility: null,
  solicitorDetails: null,
  gpConsultationType: null,
  referralDate: {
    mode: null,
    exactDate: null,
    approximateMonth: null,
    isConfirmed: false,
    estimatedStartDate: null,
  },
  referralServiceType: null,
  specialistDetails: null,
  hospitalClinic: '',
  currentStep: 'CLAIM_TYPE',
  completedSteps: [],
  outcome: null,
});

/**
 * Format a date string to user-friendly format
 * 
 * @param dateString - ISO date string (e.g., "2026-01-28") or estimated date (e.g., "2026-01")
 * @param isEstimate - Whether this is an estimated date (shows month/year only)
 * @returns Formatted date string (e.g., "28 Jan 2026" or "Jan 2026")
 * 
 * @example
 * formatReviewDate("2026-01-28") // "28 Jan 2026"
 * formatReviewDate("2026-01", true) // "Jan 2026"
 * formatReviewDate(null) // null
 */
export const formatReviewDate = (
  dateString: string | null | undefined,
  isEstimate: boolean = false
): string | null => {
  if (!dateString) return null;

  try {
    // Month abbreviations
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Parse the date string
    const parts = dateString.split('-');
    
    if (parts.length < 2) {
      // Invalid format
      return dateString;
    }

    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1; // 0-indexed
    const monthName = months[monthIndex] || parts[1];

    // Estimated date: show "Jan 2026"
    if (isEstimate || parts.length === 2) {
      return `${monthName} ${year}`;
    }

    // Exact date: show "28 Jan 2026"
    const day = parseInt(parts[2], 10); // Remove leading zero
    return `${day} ${monthName} ${year}`;
  } catch (error) {
    // If parsing fails, return original string
    console.warn('Failed to format date:', dateString, error);
    return dateString;
  }
};

/**
 * Format a DateSelection object to user-friendly format
 * Helper function specifically for DateSelection type from the claim state
 * 
 * @param dateSelection - DateSelection object from claim state
 * @returns Formatted date string or null
 * 
 * @example
 * formatDateSelection({ mode: 'exact', exactDate: '2026-01-28', ... }) // "28 Jan 2026"
 * formatDateSelection({ mode: 'approximate', estimatedStartDate: '2026-01', ... }) // "Jan 2026"
 */
export const formatDateSelection = (
  dateSelection: DateSelection | null | undefined
): string | null => {
  if (!dateSelection) return null;

  // Try exact date first
  if (dateSelection.exactDate) {
    return formatReviewDate(dateSelection.exactDate, false);
  }

  // Try estimated date
  if (dateSelection.estimatedStartDate) {
    return formatReviewDate(dateSelection.estimatedStartDate, true);
  }

  // Try approximate month (legacy field)
  if (dateSelection.approximateMonth) {
    return dateSelection.approximateMonth; // Already formatted as "January 2025"
  }

  return null;
};