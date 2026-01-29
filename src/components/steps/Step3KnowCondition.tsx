import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import OptionChipGroup from '../ui/OptionChipGroup';
import { useClaim } from '@/context/ClaimContext';

export const Step3KnowCondition: React.FC = () => {
  const { state, dispatch } = useClaim();

  const options = [
    { 
      label: 'Yes', 
      value: true,
      description: 'I have a diagnosis, and I know what I have'
    },
    { 
      label: 'No', 
      value: false,
      description: "I'll describe what I have the best I can"
    },
  ];

  const handleSelect = (value: boolean) => {
    // This drives the branch in navigation-logic:
    // true  -> Q4_1
    // false -> Q4_2
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'knowsCondition',
        value,
      },
    });
  };

  return (
    <QuestionLayout
      partLabel="Symptoms & condition"
      currentIndex={1}
      total={4}
      question="Do you know what condition you have?"
    >
      <OptionChipGroup
        options={options}
        value={state.responses.knowsCondition as boolean}
        onChange={handleSelect}
        layout="horizontal"
      />
    </QuestionLayout>
  );
};

export default Step3KnowCondition;

