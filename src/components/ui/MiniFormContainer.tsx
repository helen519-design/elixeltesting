import React from 'react';
import type { OtherMedicalCover, SubscriberType, PolicyType } from '../../types/claim';

export const UK_INSURERS = [
  'Bupa',
  'AXA PPP Healthcare',
  'Vitality Health',
  'Aviva',
  'WPA',
  'Simplyhealth',
  'CS Healthcare',
  'Exeter Family Friendly',
  'Freedom Health Insurance',
  'The Exeter',
  'Health-on-Line',
  'Other',
] as const;

type MiniFormContainerProps = {
  question: number;
  type: string;
  value: OtherMedicalCover | null;
  onChange: (updates: Partial<OtherMedicalCover>) => void;
  className?: string;
};

/**
 * MiniFormContainer
 * variant question=2, type=medical coverage details
 * Subscriber status, Policy Type, Insurer Name (dropdown), Policy Number, Has advised insurer
 * Figma: border #d2d3d6, radius 8px, padding 16–24px, label/body text #4d4f5c
 */
export const MiniFormContainer: React.FC<MiniFormContainerProps> = ({
  question,
  type,
  value,
  onChange,
  className = '',
}) => {
  if (question !== 2 || type !== 'medical coverage details') {
    return null;
  }

  const cover = value || {
    subscriberType: null,
    policyType: null,
    insurerName: '',
    policyNumber: '',
    hasAdvisedInsurer: null,
  };

  return (
    <div
      className={`rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`}
      data-variant="question-2-medical-coverage"
    >
      <div>
        <label className="block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1">
          Subscriber status
        </label>
        <div className="flex gap-3 flex-wrap">
          {(['subscriber', 'dependant'] as SubscriberType[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ subscriberType: opt })}
              className={`rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${
                cover.subscriberType === opt
                  ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]'
                  : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'
              }`}
            >
              {opt === 'subscriber' ? 'Subscriber' : 'Dependant'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1">
          Policy type
        </label>
        <div className="flex gap-3 flex-wrap">
          {(['PMI', 'Cash Plan'] as PolicyType[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ policyType: opt })}
              className={`rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${
                cover.policyType === opt
                  ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]'
                  : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1">
          Insurer name
        </label>
        <select
          value={cover.insurerName || ''}
          onChange={(e) => onChange({ insurerName: e.target.value })}
          className="w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none focus:border-[#0055b7]"
        >
          <option value="">Select insurer</option>
          {UK_INSURERS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1">
          Policy number
        </label>
        <input
          type="text"
          value={cover.policyNumber || ''}
          onChange={(e) => onChange({ policyNumber: e.target.value })}
          placeholder="Enter policy number"
          className="w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#949494] focus:outline-none focus:border-[#0055b7]"
        />
      </div>

      <div>
        <label className="block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1">
          Have you advised your insurer about this claim?
        </label>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => onChange({ hasAdvisedInsurer: true })}
            className={`rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${
              cover.hasAdvisedInsurer === true
                ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]'
                : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onChange({ hasAdvisedInsurer: false })}
            className={`rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${
              cover.hasAdvisedInsurer === false
                ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]'
                : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'
            }`}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniFormContainer;
