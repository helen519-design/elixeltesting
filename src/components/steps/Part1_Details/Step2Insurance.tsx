import React from 'react';
import QuestionLayout from '../../ui/QuestionLayout';
import OptionChipGroup from '../../ui/OptionChipGroup';
import MiniFormContainer from '../../ui/MiniFormContainer';
import { useClaim } from '@/context/ClaimContext';

/**
 * Step 2 – Do you have other medical insurance?
 * - No: Continue enabled immediately.
 * - Yes: Show MiniFormContainer (variant question=2, type=medical coverage details).
 *   Continue enabled only when Subscriber status, Policy Type, Insurer Name, Policy Number, and Has advised insurer are populated.
 * Figma: question layout + OptionChip + MiniFormContainer styling.
 */
export const Step2Insurance: React.FC = () => {
  const { state, dispatch } = useClaim();

  const options = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const handleSelect = (value: boolean) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'hasOtherInsurance',
        value,
      },
    });
    if (value && !state.responses.otherMedicalCover) {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {
          field: 'otherMedicalCover',
          value: {
            subscriberType: null,
            policyType: null,
            insurerName: '',
            policyNumber: '',
            hasAdvisedInsurer: null,
          },
        },
      });
    }
  };

  const handleCoverChange = (updates: Partial<any>) => {
    const current = (state.responses.otherMedicalCover as any) ?? {
      subscriberType: null,
      policyType: null,
      insurerName: '',
      policyNumber: '',
      hasAdvisedInsurer: null,
    };
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'otherMedicalCover',
        value: { ...current, ...updates },
      },
    });
  };

  return (
    <QuestionLayout
      partLabel="Claim details"
      currentIndex={2}
      total={2}
      question="Do you have other medical insurance?"
    >
      <OptionChipGroup
        options={options}
        value={state.responses.hasOtherInsurance as boolean}
        onChange={handleSelect}
      />

      {state.responses.hasOtherInsurance === true && (
        <div className="mt-4">
          <MiniFormContainer
            question={2}
            type="medical coverage details"
            value={state.responses.otherMedicalCover as any}
            onChange={handleCoverChange}
          />
        </div>
      )}
    </QuestionLayout>
  );
};

export default Step2Insurance;
