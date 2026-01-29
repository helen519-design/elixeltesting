import React from 'react';

type RecommendationChipProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

/**
 * RecommendationChip
 *
 * Figma design specifications:
 * - Background: #fafbfb (Alias/Background/bg-general-secondary-default)
 * - Border: 1px solid #86b1e2 (Alias/Border/border-brand-secondary-default)
 * - Border radius: 8px (Alias/Radius/radius-sm)
 * - Padding: 16px horizontal, 8px vertical
 * - Text: 14px / 24px line-height, medium weight
 * - Text color: #1276c0 (Alias/Text/text-brand-secondary-default)
 */
export const RecommendationChip: React.FC<RecommendationChipProps> = ({
  label,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center px-[16px] py-[8px] bg-[#fafbfb] border border-[#86b1e2] rounded-[8px] shrink-0 transition-colors hover:bg-[#e6f2fb] ${className}`}
    >
      <span className="font-medium text-[14px] leading-[24px] text-[#1276c0]">
        {label}
      </span>
    </button>
  );
};

export default RecommendationChip;
