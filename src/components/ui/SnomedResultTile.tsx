import React from 'react';

type SnomedResultTileProps = {
  code: string;
  name: string;
  description?: string;
  onConfirm: () => void;
  onSomethingElse: () => void;
  className?: string;
};

/**
 * SnomedResultTile
 *
 * Figma design specifications:
 * - Card background: white (Alias/Background/bg-general-primary-default)
 * - Border: 1px solid #d2d3d6 (Alias/Border/border-general-default)
 * - Border radius: 8px (Alias/Radius/radius-sm)
 * - Padding: 24px (Alias/Spacing/padding-sm)
 * - Name: 18px / 32px line-height, medium weight, #4d4f5c
 * - Buttons: Equal width, flex layout with 16px gap
 * - Button padding: 16px (Alias/Spacing/padding-xs)
 * - Button text: 18px / 32px line-height, medium weight, center-aligned
 */
export const SnomedResultTile: React.FC<SnomedResultTileProps> = ({
  name,
  onConfirm,
  onSomethingElse,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-[8px] ${className}`}>
      <div
        className="flex flex-col gap-[14px] min-w-[360px] w-full max-w-[720px] rounded-[8px] border border-[#d2d3d6] bg-white px-[24px] py-[24px]"
        aria-label={`Search result ${name}`}
      >
        {/* Symptom name only - code hidden */}
        <h2 className="font-medium text-[18px] leading-[32px] text-[#4d4f5c] w-full">
          {name}
        </h2>

        {/* Button options - equal width */}
        <div className="flex flex-wrap gap-[16px] items-start w-full">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 min-w-0 flex items-center justify-center gap-[8px] p-[16px] rounded-[8px] border border-[#d2d3d6] bg-white transition hover:bg-[#f6f6f7]"
          >
            <span className="font-medium text-[18px] leading-[32px] text-[#4d4f5c] text-center">
              Sounds like it
            </span>
          </button>
          <button
            type="button"
            onClick={onSomethingElse}
            className="flex-1 min-w-0 flex items-center justify-center gap-[8px] p-[16px] rounded-[8px] border border-[#d2d3d6] bg-white transition hover:bg-[#f6f6f7]"
          >
            <span className="font-medium text-[18px] leading-[32px] text-[#4d4f5c] text-center">
              It&apos;s something else
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnomedResultTile;

