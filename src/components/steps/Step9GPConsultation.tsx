import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import OptionChipGroup from '../ui/OptionChipGroup';
import { useClaim } from '@/context/ClaimContext';
import type { GPConsultationType } from '@/types/claim';

export const Step9GPConsultation: React.FC = () => {
  const { state, dispatch } = useClaim();

  const options: { label: string; value: GPConsultationType; description: string }[] = [
    { 
      label: 'NHS GP', 
      value: 'nhs_gp',
      description: 'I have consulted an NHS GP'
    },
    { 
      label: 'Private GP', 
      value: 'private_gp',
      description: 'I have consulted a private GP'
    },
    { 
      label: 'Self-referral', 
      value: 'self_referral',
      description: 'I intend to do a self-referral'
    },
    { 
      label: 'Fast-track consultation', 
      value: 'fast_track',
      description: 'I have consulted the Fast Track service'
    },
    { 
      label: 'Other', 
      value: 'other',
      description: 'None of the above'
    },
  ];

  const handleSelect = (value: GPConsultationType) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'gpConsultationType',
        value,
      },
    });
  };

  return (
    <QuestionLayout
      partLabel="Referral"
      currentIndex={1}
      total={4}
      question="Who have you been referred by?"
    >
      <OptionChipGroup
        options={options}
        value={(state as any).gpConsultationType as GPConsultationType}
        onChange={handleSelect}
        layout="grid"
      />
    </QuestionLayout>
  );
};

export default Step9GPConsultation;

