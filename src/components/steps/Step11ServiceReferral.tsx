import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import OptionChipGroup from '../ui/OptionChipGroup';
import MiniFormSpecialist from '../ui/MiniFormSpecialist';
import { useClaim } from '@/context/ClaimContext';
import type { ReferralServiceType } from '../../types/claim';

const REFERRAL_OPTIONS: { label: string; value: ReferralServiceType; description: string; icon: string }[] = [
  { 
    label: 'Specialist', 
    value: 'specialist',
    description: 'Performs surgeries, investigates confusing symptoms, and manages serious illnesses.',
    icon: '/icons/stethoscope.svg'
  },
  { 
    label: 'Mental Health Specialist', 
    value: 'mental_health_specialist',
    description: 'Diagnoses complex psychiatric conditions (like Bipolar or Schizophrenia) and can prescribe medication.',
    icon: '/icons/mentalHealthSpecialist.svg'
  },
  { 
    label: 'Therapist', 
    value: 'therapist',
    description: 'Provides hands-on treatment like manipulation, massage, or exercises (e.g. Physiotherapist, Chiropractor).',
    icon: '/icons/Therapist.svg'
  },
  { 
    label: 'Mental Health Therapist', 
    value: 'mental_health_therapist',
    description: 'Helps you manage thoughts and behaviours through conversation (e.g. CBT, counselling).',
    icon: '/icons/mentalHealthTherapist.svg'
  },
  { 
    label: 'Direct Referral for Test', 
    value: 'direct_test',
    description: 'Allows you to call your insurer to get a scan or specialist appointment authorised immediately, without going to a GP first.',
    icon: '/icons/DirectReferral.svg'
  },
];

export const Step11ServiceReferral: React.FC = () => {
  const { state, dispatch } = useClaim();

  const handleSelect = (value: ReferralServiceType) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'referralServiceType',
        value,
      },
    });
    if ((value === 'specialist' || value === 'mental_health_specialist' || value === 'mental_health_therapist' || value === 'therapist' || value === 'direct_test') && !state.responses.specialistDetails) {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {
          field: 'specialistDetails',
          value: { name: '' },
        },
      });
    }
  };

  const handleReselect = () => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'referralServiceType',
        value: null,
      },
    });
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'specialistDetails',
        value: null,
      },
    });
  };

  const handleSpecialistChange = (updates: Partial<any>) => {
    const current = (state.responses.specialistDetails as any) ?? { name: '' };
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'specialistDetails',
        value: { ...current, ...updates },
      },
    });
  };

  const referralServiceType = state.responses.referralServiceType as ReferralServiceType;
  const showSpecialistForm =
    referralServiceType === 'specialist' || 
    referralServiceType === 'mental_health_specialist' || 
    referralServiceType === 'mental_health_therapist' ||
    referralServiceType === 'therapist' ||
    referralServiceType === 'direct_test';
  
  let type: 'specialist' | 'mental specialist' | 'mental therapist' | 'therapist' | 'direct referral' = 'specialist';
  if (referralServiceType === 'mental_health_specialist') {
    type = 'mental specialist';
  } else if (referralServiceType === 'mental_health_therapist') {
    type = 'mental therapist';
  } else if (referralServiceType === 'therapist') {
    type = 'therapist';
  } else if (referralServiceType === 'direct_test') {
    type = 'direct referral';
  }

  return (
    <QuestionLayout
      partLabel="Referral"
      currentIndex={3}
      total={4}
      question="What kind of service are you referred to?"
    >
      {!showSpecialistForm && (
        <OptionChipGroup
          options={REFERRAL_OPTIONS}
          value={referralServiceType}
          onChange={handleSelect}
          layout="grid"
        />
      )}

      {showSpecialistForm && (
        <MiniFormSpecialist
          question={11}
          type={type}
          value={state.responses.specialistDetails as any}
          onChange={handleSpecialistChange}
          onReselect={handleReselect}
        />
      )}
    </QuestionLayout>
  );
};

export default Step11ServiceReferral;
