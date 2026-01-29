import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import OptionChipGroup from '../ui/OptionChipGroup';
import { useClaim } from '@/context/ClaimContext';

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-brand-primary';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export const Step2OtherCoverDetails: React.FC = () => {
  const { state, dispatch } = useClaim();

  const coverDetails = (state.responses.otherMedicalCover as any) ?? {};

  const handleFieldChange = (field: string, value: any) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'otherMedicalCover',
        value: { ...coverDetails, [field]: value },
      },
    });
  };

  const subscriberOptions = [
    { label: 'Myself', value: 'self' },
    { label: 'My partner', value: 'partner' },
    { label: 'My parent', value: 'parent' },
    { label: 'Other', value: 'other' },
  ];

  const policyOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Family', value: 'family' },
    { label: 'Corporate', value: 'corporate' },
  ];

  const advisedOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  return (
    <QuestionLayout
      partLabel="Claim details"
      currentIndex={3}
      total={2}
      question="Please tell us about your medical cover details"
    >
      <div className="space-y-6">
        {/* Subscriber Type */}
        <div>
          <label className={labelClass}>Who is the policy holder?</label>
          <OptionChipGroup
            options={subscriberOptions}
            value={coverDetails.subscriberType}
            onChange={(value) => handleFieldChange('subscriberType', value)}
          />
        </div>

        {/* Policy Type */}
        <div>
          <label className={labelClass}>Policy type</label>
          <OptionChipGroup
            options={policyOptions}
            value={coverDetails.policyType}
            onChange={(value) => handleFieldChange('policyType', value)}
          />
        </div>

        {/* Insurer Name */}
        <div>
          <label className={labelClass}>Insurance company name</label>
          <input
            type="text"
            value={coverDetails.insurerName ?? ''}
            onChange={(e) => handleFieldChange('insurerName', e.target.value)}
            placeholder="e.g. Bupa, Aviva, AXA"
            className={inputClass}
          />
        </div>

        {/* Policy Number */}
        <div>
          <label className={labelClass}>Policy number</label>
          <input
            type="text"
            value={coverDetails.policyNumber ?? ''}
            onChange={(e) => handleFieldChange('policyNumber', e.target.value)}
            placeholder="Enter your policy number"
            className={inputClass}
          />
        </div>

        {/* Has Advised Insurer */}
        <div>
          <label className={labelClass}>Have you advised your other insurer about this claim?</label>
          <OptionChipGroup
            options={advisedOptions}
            value={coverDetails.hasAdvisedInsurer}
            onChange={(value) => handleFieldChange('hasAdvisedInsurer', value)}
          />
        </div>
      </div>
    </QuestionLayout>
  );
};

export default Step2OtherCoverDetails;

