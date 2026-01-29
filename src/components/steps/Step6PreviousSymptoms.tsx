import React, { useState, useEffect } from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import { DatePicker } from '../ui/DatePicker';
import OptionChipGroup from '../ui/OptionChipGroup';
import { useClaim } from '@/context/ClaimContext';

export const Step6PreviousSymptoms: React.FC = () => {
  const { state, dispatch } = useClaim();
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateValue, setDateValue] = useState('');

  const hasPreviousSymptoms = (state.responses.hasPreviousSymptoms as boolean | undefined) ?? null;
  const previousSymptomDate = (state.responses.previousSymptomDate as any) || {};

  // Show date input if user previously selected "Yes"
  useEffect(() => {
    if (hasPreviousSymptoms === true && previousSymptomDate.date) {
      setShowDateInput(true);
      setDateValue(previousSymptomDate.date);
    }
  }, []);

  const options = [
    { 
      label: 'Yes', 
      value: true,
      description: "I've had this or similar symptoms before"
    },
    { 
      label: 'No', 
      value: false,
      description: 'This is the first time I experience this'
    },
  ];

  const handleSelect = (value: boolean) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'hasPreviousSymptoms',
        value,
      },
    });

    if (value === true) {
      // Show date input for "Yes"
      setShowDateInput(true);
    } else {
      // Clear previous symptom date for "No"
      setShowDateInput(false);
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {
          field: 'previousSymptomDate',
          value: null,
        },
      });
    }
  };

  const handleDateChange = (value: string) => {
    setDateValue(value);
    
    if (value) {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {
          field: 'previousSymptomDate',
          value: {
            date: value,
            isConfirmed: true,
          },
        },
      });
    }
  };

  const handleReselect = () => {
    setShowDateInput(false);
    setDateValue('');
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'hasPreviousSymptoms',
        value: undefined,
      },
    });
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'previousSymptomDate',
        value: null,
      },
    });
  };

  // Show date input view when "Yes" is selected
  if (showDateInput) {
    return (
      <QuestionLayout
        partLabel="Symptoms & condition"
        currentIndex={4}
        total={4}
        question="When did you have this symptom previously?"
        description={
          <>
            We understand it might feel a bit far off.
            <br />
            No sweat! Just try to choose the nearest date to when you last experienced it.
          </>
        }
      >
        {/* Reselect button */}
        <button
          type="button"
          onClick={handleReselect}
          className="flex items-center justify-center gap-[2px] h-[48px] py-[16px] text-[#0055b7] hover:text-[#1276c0] transition -mt-6"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold text-[16px] leading-[28px] tracking-[0.1px]">
            Reselect
          </span>
        </button>

        {/* Date input */}
        <DatePicker
          id="previous-symptom-date"
          label="Previous symptom start date"
          value={dateValue}
          onChange={handleDateChange}
          placeholder="dd/mm/yyyy"
        />
      </QuestionLayout>
    );
  }

  // Default view: Show Yes/No options
  return (
    <QuestionLayout
      partLabel="Symptoms & condition"
      currentIndex={4}
      total={4}
      question="Have you ever dealt with this, or very similar symptoms in the past?"
      description="This helps us see if your condition is related to a previous claim so we can process it correctly."
    >
      <OptionChipGroup
        options={options}
        value={hasPreviousSymptoms}
        onChange={handleSelect}
        layout="horizontal"
      />
    </QuestionLayout>
  );
};

export default Step6PreviousSymptoms;

