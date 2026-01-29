import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import { useClaim } from '@/context/ClaimContext';

/** Previous hospital – clicking it populates the hospital/clinic input */
const PREVIOUS_HOSPITAL = 'Plymouth Nuffield Hospital';

export const Step12HospitalClinic: React.FC = () => {
  const { state, dispatch } = useClaim();

  const value = (state.responses.hospitalClinic as string) ?? '';

  const handleInputChange = (v: string) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'hospitalClinic',
        value: v,
      },
    });
  };

  return (
    <QuestionLayout
      partLabel="Referral"
      currentIndex={4}
      total={4}
      question="Which hospital or clinic will you be attending?"
    >
      <div className="flex flex-col gap-4">
        {/* Input field */}
        <div className="flex flex-col gap-[8px] w-[360px]">
          <label 
            htmlFor="hospital-clinic-input"
            className="font-medium text-[16px] leading-[24px] text-[#4d4f5c] tracking-[0.4px]"
          >
            Hospital or clinic to visit
          </label>
          <input
            id="hospital-clinic-input"
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter hospital or clinic name"
            className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
          />
        </div>

        {/* Previous hospital recommendation */}
        <div className="flex flex-col gap-[10px]">
          <p className="font-medium text-[16px] leading-[32px] text-[#4d4f5c]">
            Your previous hospital
          </p>
          <button
            type="button"
            onClick={() => handleInputChange(PREVIOUS_HOSPITAL)}
            className="bg-[#fafbfb] border border-[#86b1e2] rounded-[8px] px-[16px] py-[8px] inline-flex items-center justify-center self-start hover:bg-[#e5f4fd] transition-colors"
          >
            <span className="font-medium text-[14px] leading-[24px] text-[#1276c0]">
              {PREVIOUS_HOSPITAL}
            </span>
          </button>
        </div>
      </div>
    </QuestionLayout>
  );
};

export default Step12HospitalClinic;
