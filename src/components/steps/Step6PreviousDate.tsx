import React, { useState } from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import { DatePicker } from '../ui/DatePicker';
import OptionChipGroup from '../ui/OptionChipGroup';
import { useClaim } from '@/context/ClaimContext';

export const Step6PreviousDate: React.FC = () => {
  const { state, dispatch } = useClaim();
  const previousSymptomDate = (state.responses.previousSymptomDate as any) || {};
  const [mode, setMode] = useState<'exact' | 'approximate' | null>(
    previousSymptomDate.mode ?? null
  );

  const dateOptions = [
    { label: 'I know the exact date', value: 'exact' as const },
    { label: 'I roughly remember', value: 'approximate' as const },
  ];

  const handleModeChange = (value: 'exact' | 'approximate') => {
    setMode(value);
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'previousSymptomDate',
        value: {
          mode: value,
          isConfirmed: false,
        },
      },
    });
  };

  const handleExactDateChange = (value: string) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'previousSymptomDate',
        value: {
          mode: 'exact',
          exactDate: value || null,
          estimatedStartDate: null,
          approximateMonth: null,
          isConfirmed: !!value,
        },
      },
    });
  };

  const handleApproxMonthChange = (value: string) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'previousSymptomDate',
        value: {
          mode: 'approximate',
          approximateMonth: value || null,
          estimatedStartDate: value ? `${value}-01` : null,
          exactDate: null,
          isConfirmed: false,
        },
      },
    });
  };

  const handleConfirmEstimatedDate = () => {
    const month = previousSymptomDate.approximateMonth;
    if (!month) return;
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'previousSymptomDate',
        value: {
          ...previousSymptomDate,
          isConfirmed: true,
          estimatedStartDate: `${month}-01`,
        },
      },
    });
  };

  const approximateMonth = previousSymptomDate.approximateMonth;
  const estimatedDateLabel = approximateMonth
    ? (() => {
        const [y, m] = approximateMonth.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[parseInt(m, 10) - 1] || m;
        return `1 ${monthName} ${y}`;
      })()
    : null;

  return (
    <QuestionLayout
      partLabel="Symptoms & condition"
      currentIndex={6}
      total={6}
      question="When did you have this symptom previously?"
    >
      <OptionChipGroup
        options={dateOptions}
        value={mode}
        onChange={handleModeChange}
      />

      {mode === 'exact' && (
        <div className="mt-3">
          <DatePicker
            id="previous-exact-date"
            label="Exact date"
            value={previousSymptomDate.exactDate ?? ''}
            onChange={(value) => handleExactDateChange(value)}
            placeholder="dd/mm/yyyy"
            className="w-full"
          />
        </div>
      )}

      {mode === 'approximate' && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-[14px] leading-[24px] text-[#4d4f5c] mb-1">
              Roughly when was this?
            </label>
            <input
              type="month"
              value={previousSymptomDate.approximateMonth ?? ''}
              onChange={(e) => handleApproxMonthChange(e.target.value)}
              className="w-full rounded-lg border border-[#d2d3d6] px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none"
            />
          </div>
          {approximateMonth && !previousSymptomDate.isConfirmed && (
            <div className="rounded-lg border border-[#cce9fb] bg-[#cce9fb]/30 p-3">
              <p className="text-[14px] leading-[24px] text-[#4d4f5c] mb-2">
                Estimated start date: <strong>{estimatedDateLabel}</strong>
              </p>
              <button
                type="button"
                onClick={handleConfirmEstimatedDate}
                className="rounded-lg bg-[#0055b7] px-4 py-2 text-[14px] leading-[24px] font-medium text-white hover:bg-[#1276c0]"
              >
                Confirm estimated date
              </button>
            </div>
          )}
        </div>
      )}
    </QuestionLayout>
  );
};

export default Step6PreviousDate;

