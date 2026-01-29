import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import OptionChipGroup from '../ui/OptionChipGroup';
import MiniFormSolicitor from '../ui/MiniFormSolicitor';
import { useClaim } from '@/context/ClaimContext';

const EMPTY_SOLICITOR = {
  dateOfIncident: null as string | null,
  solicitorName: '',
  caseHandler: '',
  solicitorAddress: '',
  solicitorPhone: '',
  solicitorEmail: '',
  caseReference: '',
};

export const Step8Responsibility: React.FC = () => {
  const { state, dispatch } = useClaim();

  const options = [
    { 
      label: 'Yes', 
      value: true,
      description: "Someone else's involved in this legally."
    },
    { 
      label: 'No', 
      value: false,
      description: "There's no legal responsibility involved."
    },
  ];

  const handleSelect = (value: boolean) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'hasLegalResponsibility',
        value,
      },
    });
    if (value && !state.responses.solicitorDetails) {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {
          field: 'solicitorDetails',
          value: { ...EMPTY_SOLICITOR },
        },
      });
    }
  };

  const handleSolicitorChange = (updates: Partial<any>) => {
    const current = (state.responses.solicitorDetails as any) ?? { ...EMPTY_SOLICITOR };
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'solicitorDetails',
        value: { ...current, ...updates },
      },
    });
  };

  const handleReselect = () => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'hasLegalResponsibility',
        value: null,
      },
    });
  };

  return (
    <QuestionLayout
      partLabel="Background details"
      currentIndex={2}
      total={2}
      question="Is another person or company legally responsible for this condition?"
      description={
        <>
          If this condition is related to an accident or medical mistake, you may consider a{' '}
          <span className="underline decoration-solid">personal injury or medical negligence claim</span>
        </>
      }
    >
      {(state.responses.hasLegalResponsibility === null || state.responses.hasLegalResponsibility === undefined || state.responses.hasLegalResponsibility === false) && (
        <OptionChipGroup
          options={options}
          value={state.responses.hasLegalResponsibility as boolean}
          onChange={handleSelect}
          layout="horizontal"
        />
      )}

      {state.responses.hasLegalResponsibility === true && (
        <MiniFormSolicitor
          value={state.responses.solicitorDetails as any}
          onChange={handleSolicitorChange}
          onReselect={handleReselect}
        />
      )}
    </QuestionLayout>
  );
};

export default Step8Responsibility;
