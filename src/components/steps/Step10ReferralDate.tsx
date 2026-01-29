import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import { DatePicker } from '../ui/DatePicker';
import { useClaim } from '@/context/ClaimContext';

export const Step10ReferralDate: React.FC = () => {
  const { state, dispatch } = useClaim();

  const referralDate = (state as any).referralDate ?? { 
    mode: null, 
    exactDate: null, 
    approximateMonth: null, 
    isConfirmed: false,
    estimatedStartDate: null
  };

  const handleDateChange = (value: string) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'referralDate',
        value: {
          mode: 'exact',
          exactDate: value,
          approximateMonth: null,
          isConfirmed: true,
          estimatedStartDate: null,
        },
      },
    });
  };

  return (
    <QuestionLayout
      partLabel="Referral"
      currentIndex={2}
      total={4}
      question="When were you referred by your GP?"
    >
      <DatePicker
        id="referral-date"
        label="Date of referral"
        value={referralDate.exactDate || ''}
        onChange={handleDateChange}
        placeholder="dd/mm/yyyy"
      />
    </QuestionLayout>
  );
};

export default Step10ReferralDate;

