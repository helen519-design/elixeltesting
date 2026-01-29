import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import { DatePicker } from '../ui/DatePicker';
import { useClaim } from '@/context/ClaimContext';

export const Step5SymptomStart: React.FC = () => {
  const { state, dispatch } = useClaim();
  const symptomStartDate = (state as any).symptomStartDate || {};

  const handleDateChange = (value: string) => {
    if (value) {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {
          field: 'symptomStartDate',
          value: {
            mode: 'exact',
            exactDate: value,
            approximateMonth: null,
            isConfirmed: true,
            estimatedStartDate: null,
          },
        },
      });
    }
  };

  return (
    <QuestionLayout
      partLabel="Symptoms & condition"
      currentIndex={3}
      total={4}
      question="When did you first start feeling unwell or notice this symptom?"
      description="If you couldn't remember the exact date, try to pick the closest option."
    >
      <DatePicker
        id="symptom-date"
        label="Symptom start date"
        value={symptomStartDate.exactDate || ''}
        onChange={handleDateChange}
        placeholder="dd/mm/yyyy"
      />
    </QuestionLayout>
  );
};

export default Step5SymptomStart;
