import React from 'react';
import { DatePicker } from './DatePicker';
import type { SolicitorDetails } from '../../types/claim';

type MiniFormSolicitorProps = {
  value: SolicitorDetails | null;
  onChange: (updates: Partial<SolicitorDetails>) => void;
  onReselect: () => void;
  className?: string;
};

/** question=8, type=legal responsibility – solicitor details */
export const MiniFormSolicitor: React.FC<MiniFormSolicitorProps> = ({
  value,
  onChange,
  onReselect,
  className = '',
}) => {
  const d = value ?? {
    dateOfIncident: null,
    solicitorName: '',
    caseHandler: '',
    solicitorAddress: '',
    solicitorPhone: '',
    solicitorEmail: '',
    caseReference: '',
  };

  return (
    <div className={`flex flex-col gap-[24px] ${className}`} data-variant="q8-legal-responsibility">
      {/* Reselect button */}
      <button
        type="button"
        onClick={onReselect}
        className="flex items-center gap-[2px] h-[48px] py-[16px] text-[#0055b7] hover:text-[#1276c0] self-start"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
          <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
          Reselect
        </span>
      </button>

      {/* Heading */}
      <h3 className="text-[18px] leading-[32px] font-medium text-[#4d4f5c]">
        Please provide some additional details so we can assist you more effectively.
      </h3>

      {/* 2-column grid for form fields */}
      <div className="grid grid-cols-2 gap-x-[48px] gap-y-[36px]">
        {/* Row 1, Col 1: When did the incident happen */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            When did the incident happen?
          </p>
          <div className="w-[360px]">
            <DatePicker
              id="incident-date"
              label=""
              value={d.dateOfIncident ?? ''}
              onChange={(value) => onChange({ dateOfIncident: value || null })}
              placeholder="dd/mm/yyyy"
              className="w-full"
            />
          </div>
        </div>

        {/* Row 1, Col 2: What's the name of your solicitor */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            What's the name of your solicitor?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <input
              type="text"
              value={d.solicitorName}
              onChange={(e) => onChange({ solicitorName: e.target.value })}
              placeholder="Enter name of solicitor"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Row 2, Col 1: Who's your case handler */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Who's your case handler?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <input
              type="text"
              value={d.caseHandler}
              onChange={(e) => onChange({ caseHandler: e.target.value })}
              placeholder="Enter name of case handler"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Row 2, Col 2: Address of solicitor */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Address of solicitor
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <input
              type="text"
              value={d.solicitorAddress}
              onChange={(e) => onChange({ solicitorAddress: e.target.value })}
              placeholder="Enter address"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Row 3, Col 1: Case reference number */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Case reference number
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <input
              type="text"
              value={d.caseReference}
              onChange={(e) => onChange({ caseReference: e.target.value })}
              placeholder="Enter case reference number"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Row 3, Col 2: Solicitor's phone number */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Solicitor's phone number
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <input
              type="tel"
              value={d.solicitorPhone}
              onChange={(e) => onChange({ solicitorPhone: e.target.value })}
              placeholder="Enter number"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Row 4, Col 2: Solicitor's email */}
        <div className="col-start-2 flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Solicitor's email
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <input
              type="email"
              value={d.solicitorEmail}
              onChange={(e) => onChange({ solicitorEmail: e.target.value })}
              placeholder="Enter email"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniFormSolicitor;
