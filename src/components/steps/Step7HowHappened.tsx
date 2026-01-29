import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import OptionChipGroup from '../ui/OptionChipGroup';
import { useClaim } from '@/context/ClaimContext';
import type { InjuryType } from '../../types/claim';

const INJURY_OPTIONS: { label: string; value: InjuryType; description: string }[] = [
  { label: 'Yes', value: 'sporting', description: 'one of these applies to me' },
  { label: 'No', value: 'other', description: 'none of these describe my situation' },
];

export const Step7HowHappened: React.FC = () => {
  const { state, dispatch } = useClaim();

  // #region agent log
  console.log('[DEBUG-H1,H2] Step7 render - state structure:', {
    hasResponses: !!state.responses,
    hasInjuryDetailsInResponses: !!(state.responses as any).injuryDetails,
    hasInjuryDetailsDirect: !!(state as any).injuryDetails,
    stateKeys: Object.keys(state),
    responsesKeys: state.responses ? Object.keys(state.responses) : [],
    fullState: state
  });
  // #endregion

  const handleSelect = (value: InjuryType) => {
    // #region agent log
    console.log('[DEBUG-H2] handleSelect called:', {
      value,
      currentStateBeforeUpdate: (state.responses as any).injuryDetails,
      stateBeforeDispatch: state
    });
    // #endregion
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'injuryDetails',
        value: { type: value },
      },
    });
  };

  const injuryDetails = (state.responses.injuryDetails as any) || { type: null };
  const type = injuryDetails.type;
  
  // #region agent log
  console.log('[DEBUG-H2] Extracted type from state:', {
    injuryDetails,
    type,
    fromResponses: true
  });
  // #endregion

  return (
    <QuestionLayout
      partLabel="Background details"
      currentIndex={1}
      total={2}
      question={
        <>
          Is your condition the result of a sporting injury, a traffic accident,
          <br />
          a trip/fall, or an attack/assault?
        </>
      }
    >
      {/* Show OptionChipGroup - both Yes and No can be selected and user continues */}
      <OptionChipGroup
        options={INJURY_OPTIONS}
        value={type}
        onChange={handleSelect}
        layout="grid"
      />
    </QuestionLayout>
  );
};

export default Step7HowHappened;
