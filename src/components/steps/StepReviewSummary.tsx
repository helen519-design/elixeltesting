import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import ReviewRow from '../ui/ReviewRow';
import { useClaim } from '@/context/ClaimContext';
import { formatDateSelection } from '@/types/claim';

/**
 * StepReviewSummary
 * 
 * Comprehensive review screen with ReviewRow components from Figma.
 * 
 * Data Mapping:
 * - Q1: Claimant (who claim is for)
 * - Q4: Symptom (from Q4_1 or Q4_2)
 * - Q5: Symptom start date
 * - Q8: Legal responsibility
 * - Q10: GP referral date
 * - Q11: Referral type
 * - Q11: Specialist name (optional)
 * - Q12: Hospital/clinic (optional)
 * 
 * Each row has an Edit button that navigates back to that specific question.
 */
export const StepReviewSummary: React.FC = () => {
  const { state, dispatch } = useClaim();

  // Helper function to navigate to a specific step
  const editStep = (step: string) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'currentStep',
        value: step,
      },
    });
  };

  // Format claimant value - show the name/title (e.g., "Dr Isidoro Banhurst")
  const getClaimantValue = (): string | null => {
    const claimant = (state as any).claimant;
    if (!claimant) return null;
    // Return the name from the PolicyHolder object
    return claimant.name || null;
  };

  // Format symptom value - show SNOMED name (from Q4_1 or Q4_2)
  const getSymptomValue = (): string | null => {
    const symptom = (state as any).symptom;
    if (!symptom) return null;
    // Return the SNOMED code name if available, otherwise userInput
    return symptom.snomedCode?.name || symptom.userInput || null;
  };

  // Format symptom start date (from Q5 - symptomStartDate)
  const getSymptomStartDate = (): string | null => {
    const startDate = (state as any).symptomStartDate;
    return formatDateSelection(startDate);
  };

  // Format legal responsibility value (from Q8)
  const getLegalResponsibilityValue = (): string | null => {
    const hasLegalResponsibility = (state as any).hasLegalResponsibility;
    if (hasLegalResponsibility === null || hasLegalResponsibility === undefined) return null;
    return hasLegalResponsibility === true ? 'Yes' : 'No';
  };

  // Format GP referral date (from Q10)
  const getReferralDateValue = (): string | null => {
    const referralDate = (state as any).referralDate;
    return formatDateSelection(referralDate);
  };

  // Format referral type (from Q11)
  const getReferralTypeValue = (): string | null => {
    const type = (state as any).referralServiceType;
    if (!type) return null;
    
    const typeMap: Record<string, string> = {
      'specialist': 'Specialist',
      'mental_health_specialist': 'Mental health specialist',
      'therapist': 'Therapist',
      'mental_health_therapist': 'Mental health therapist',
      'direct_test': 'Direct test'
    };
    
    return typeMap[type] || type;
  };

  // Format specialist name (from Q11 - optional)
  const getSpecialistNameValue = (): string | null => {
    const specialistDetails = (state as any).specialistDetails;
    if (!specialistDetails || !specialistDetails.name) return null;
    return specialistDetails.name;
  };

  // Format hospital/clinic (from Q12 - optional)
  const getHospitalClinicValue = (): string | null => {
    const hospital = (state as any).hospitalClinic;
    if (!hospital) return null;
    return String(hospital);
  };

  return (
    <QuestionLayout
      partLabel="Review"
      currentIndex={1}
      total={1}
      question="Almost there!"
      description={
        <>
          <p className="mb-0">You've entered all the details we need for your claim.</p>
          <p>Before completing your claim creation, please confirm all the details you've entered are correct.</p>
        </>
      }
      hideQuestionTag={true}
    >
      <div className="flex flex-col gap-[25px] py-6 w-full">
        {/* Row 1: Q1, Q4, Q5 */}
        <div className="flex gap-[16px] items-center w-full">
          <ReviewRow
            label="Claiming for"
            value={getClaimantValue()}
            onEdit={() => editStep('Q1')}
          />
          <ReviewRow
            label="Symptom"
            value={getSymptomValue()}
            onEdit={() => {
              // Navigate to Q4_1 or Q4_2 based on knowsCondition
              const knowsCondition = (state as any).knowsCondition;
              editStep(knowsCondition === true ? 'Q4_1' : 'Q4_2');
            }}
          />
          <ReviewRow
            label="Symptom start date"
            value={getSymptomStartDate()}
            onEdit={() => editStep('Q5')}
          />
        </div>

        {/* Row 2: Q8, Q10, Q11 */}
        <div className="flex gap-[16px] items-center w-full">
          <ReviewRow
            label="Legal responsibility"
            value={getLegalResponsibilityValue()}
            onEdit={() => editStep('Q8')}
          />
          <ReviewRow
            label="GP referral on"
            value={getReferralDateValue()}
            onEdit={() => editStep('Q10')}
          />
          <ReviewRow
            label="Type of referral"
            value={getReferralTypeValue()}
            onEdit={() => editStep('Q11')}
          />
        </div>

        {/* Row 3: Q11, Q12 */}
        <div className="flex gap-[16px] items-center w-full">
          <ReviewRow
            label="Name of specialist"
            value={getSpecialistNameValue()}
            onEdit={() => editStep('Q11')}
            showEditButton={false} // Optional field, edit via referral type
          />
          <ReviewRow
            label="Hospital or clinic"
            value={getHospitalClinicValue()}
            onEdit={() => editStep('Q12')}
          />
        </div>
      </div>
    </QuestionLayout>
  );
};

export default StepReviewSummary;

