import React from 'react';

export interface SpecialistCardItem {
  id: string;
  name: string;
  specialty?: string;
  secondarySpecialty?: string;
  gpHospital?: string;
  distance?: string;
}

type SpecialistCardProps = {
  specialist: SpecialistCardItem;
  selected: boolean;
  onSelect: () => void;
};

/** Doctify-style specialist card – clicking populates Name of Specialist */
export const SpecialistCard: React.FC<SpecialistCardProps> = ({
  specialist,
  selected,
  onSelect,
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`bg-white border border-[#d2d3d6] rounded-[8px] p-[16px] flex gap-[8px] min-w-[280px] max-w-[600px] flex-1 text-left transition hover:border-[#0055b7] hover:bg-[#f6f6f7] ${
      selected ? 'border-[#0055b7] bg-[#cce9fb]' : ''
    }`}
  >
    {/* Icon */}
    <div className="shrink-0 w-[24px] h-[24px]">
      <img src="/icons/person.svg" alt="" className="w-full h-full" />
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col gap-[8px] min-w-0">
      {/* Heading */}
      <p className="font-medium text-[18px] leading-[32px] text-[#4d4f5c] truncate">
        {specialist.name}
      </p>

      {/* Description rows */}
      <div className="flex flex-col gap-[12px] text-[16px] leading-[28px] text-[#8a8c95]">
        {specialist.gpHospital && (
          <p className="truncate">
            {specialist.gpHospital}
          </p>
        )}
        {specialist.distance && (
          <p>
            {specialist.distance}
          </p>
        )}
      </div>

      {/* Specialty tags */}
      {(specialist.specialty || specialist.secondarySpecialty) && (
        <div className="flex gap-[8px] pt-[8px] flex-wrap">
          {specialist.specialty && (
            <span className="bg-[#e5f4fd] px-[16px] py-[8px] rounded-[8px] text-[14px] leading-[24px] font-medium text-[#1276c0]">
              {specialist.specialty}
            </span>
          )}
          {specialist.secondarySpecialty && (
            <span className="bg-[#e5f4fd] px-[16px] py-[8px] rounded-[8px] text-[14px] leading-[24px] font-medium text-[#1276c0]">
              {specialist.secondarySpecialty}
            </span>
          )}
        </div>
      )}
    </div>
  </button>
);

export default SpecialistCard;
