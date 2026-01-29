import React, { useState, useEffect } from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import OptionChipGroup from '../ui/OptionChipGroup';
import { useClaim } from '@/context/ClaimContext';

export const Step2Insurance: React.FC = () => {
  const { state, dispatch } = useClaim();
  const hasOtherInsurance = (state.responses.hasOtherInsurance as boolean | undefined) ?? null;
  const coverDetails = (state.responses.otherMedicalCover as any) ?? {};
  
  // Automatically show form if user previously selected "Yes"
  const [showForm, setShowForm] = useState(hasOtherInsurance === true);

  // Update showForm when hasOtherInsurance changes or component mounts
  useEffect(() => {
    if (hasOtherInsurance === true) {
      setShowForm(true);
    }
  }, [hasOtherInsurance]);

  const options = [
    { 
      label: 'Yes', 
      description: 'I have coverage with another provider',
      value: true 
    },
    { 
      label: 'No', 
      description: 'WPA is my only provider',
      value: false 
    },
  ];

  const handleSelect = (value: boolean) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'hasOtherInsurance',
        value,
      },
    });
    
    // Show form if Yes is selected
    if (value === true) {
      setShowForm(true);
    } else {
      setShowForm(false);
      // Clear form data if No is selected
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {
          field: 'otherMedicalCover',
          value: {},
        },
      });
    }
  };

  const handleReselect = () => {
    setShowForm(false);
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'hasOtherInsurance',
        value: undefined,
      },
    });
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'otherMedicalCover',
        value: {},
      },
    });
  };

  const handleFieldChange = (field: string, value: any) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'otherMedicalCover',
        value: { ...coverDetails, [field]: value },
      },
    });
  };

  // If Yes is selected and form should be shown
  if (hasOtherInsurance === true && showForm) {
    return (
      <QuestionLayout
        partLabel="Claim details"
        currentIndex={2}
        total={2}
        question="Do you have other medical insurance with another company?"
      >
        <div className="space-y-6">
          {/* Reselect Button */}
          <button
            type="button"
            onClick={handleReselect}
            className="flex items-center gap-0.5 py-4 text-[#0055b7] hover:text-[#1276c0] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">Reselect</span>
          </button>

          {/* Form Heading */}
          <h3 className="text-[18px] leading-[32px] font-medium text-[#4d4f5c]">
            Please tell us more about your medical cover.
          </h3>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-12">
            {/* Subscriber or Dependant */}
            <div className="space-y-3.5">
              <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c]">
                Are you a subscriber or dependant?
              </p>
              <div className="flex flex-wrap gap-4">
                {['Subscriber', 'Dependant'].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="subscriberType"
                      checked={coverDetails.subscriberType === option}
                      onChange={() => handleFieldChange('subscriberType', option)}
                      className="w-[18px] h-[18px] border-2 border-[#d2d3d6] rounded-full checked:border-[#0055b7] checked:bg-[#0055b7] appearance-none cursor-pointer relative
                        before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:bg-white"
                    />
                    <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Policy Type */}
            <div className="space-y-3.5">
              <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c]">
                Which type does your policy belong to?
              </p>
              <div className="flex flex-wrap gap-4">
                {['PMI', 'Cash Plan'].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="policyType"
                      checked={coverDetails.policyType === option}
                      onChange={() => handleFieldChange('policyType', option)}
                      className="w-[18px] h-[18px] border-2 border-[#d2d3d6] rounded-full checked:border-[#0055b7] checked:bg-[#0055b7] appearance-none cursor-pointer relative
                        before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:bg-white"
                    />
                    <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Insurer Name */}
            <div className="space-y-6">
              <p className="text-[18px] leading-[1.4] font-normal text-[#1e1e1e]">
                Which insurer is your policy with?
              </p>
              <div className="relative w-[360px]">
                <select
                  value={coverDetails.insurerName ?? ''}
                  onChange={(e) => handleFieldChange('insurerName', e.target.value)}
                  className="w-full h-[60px] px-4 py-3 bg-white border border-[#d2d3d6] rounded-md text-[16px] leading-[28px] text-[#4d4f5c] appearance-none cursor-pointer
                    focus:outline-none focus:border-[#0055b7]"
                >
                  <option value="">Select your insurer</option>
                  <option value="Bupa">Bupa</option>
                  <option value="Aviva">Aviva</option>
                  <option value="AXA">AXA</option>
                  <option value="Vitality">Vitality</option>
                  <option value="Other">Other</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none" viewBox="0 0 24 24" fill="none">
                  <path d="M8.625 9.375L12 12.75L15.375 9.375" stroke="#4d4f5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Policy Number */}
            <div className="space-y-6">
              <p className="text-[18px] leading-[1.4] font-normal text-[#1e1e1e]">
                What's your policy or customer number?
              </p>
              <input
                type="text"
                value={coverDetails.policyNumber ?? ''}
                onChange={(e) => handleFieldChange('policyNumber', e.target.value)}
                placeholder="Enter policy number"
                className="w-[360px] h-[60px] px-4 py-3 bg-white border border-[#d2d3d6] rounded-lg text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95]
                  focus:outline-none focus:border-[#0055b7]"
              />
            </div>

            {/* Has Advised Insurer */}
            <div className="col-span-1 space-y-3.5">
              <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c]">
                Have you advised the other insurer of this claim?
              </p>
              <div className="flex flex-wrap gap-4">
                {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map((option) => (
                  <label key={option.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAdvisedInsurer"
                      checked={coverDetails.hasAdvisedInsurer === option.value}
                      onChange={() => handleFieldChange('hasAdvisedInsurer', option.value)}
                      className="w-[18px] h-[18px] border-2 border-[#d2d3d6] rounded-full checked:border-[#0055b7] checked:bg-[#0055b7] appearance-none cursor-pointer relative
                        before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:bg-white"
                    />
                    <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </QuestionLayout>
    );
  }

  // Default: Show Yes/No options
  return (
    <QuestionLayout
      partLabel="Claim details"
      currentIndex={2}
      total={2}
      question="Do you have other medical insurance with another company?"
    >
      <OptionChipGroup
        options={options}
        value={hasOtherInsurance}
        onChange={handleSelect}
        layout="horizontal"
      />
    </QuestionLayout>
  );
};

export default Step2Insurance;

