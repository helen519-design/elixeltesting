import React, { useMemo } from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import OptionChipGroup from '../ui/OptionChipGroup';
import { useClaim } from '@/context/ClaimContext';

export const Step1Who: React.FC = () => {
  const { state, dispatch } = useClaim();

  const options = useMemo(
    () => [
      {
        label: 'Dr Isidoro Banhurst',
        icon: '/icons/person.svg',
        value: 'self' as const,
      },
      {
        label: 'Miss Kolton Herne',
        icon: '/icons/person.svg',
        value: 'other' as const,
      },
    ],
    []
  );

  const claimant = state.responses.claimant as any;
  const selectedValue = claimant ? (claimant.relationship === 'Self' ? 'self' : 'other') : null;

  const handleSelect = (value: 'self' | 'other') => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'claimant',
        value: {
          id: value,
          name: value === 'self' ? 'Dr Isidoro Banhurst' : 'Miss Kolton Herne',
          relationship: value === 'self' ? 'Self' : 'Dependant',
        },
      },
    });
  };

  return (
    <QuestionLayout
      partLabel="Claim details"
      currentIndex={1}
      total={2}
      question="Who do you want to claim for?"
      description="Didn't see the person you want to claim for?"
    >
      <OptionChipGroup
        options={options}
        value={selectedValue}
        onChange={handleSelect}
        layout="horizontal"
      />
    </QuestionLayout>
  );
};

export default Step1Who;

