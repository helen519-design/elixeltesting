import React from 'react';

type QuestionTagProps = {
  partLabel: string; // e.g. "Part 1 – Claim details"
  currentIndex: number; // 1-based
  total: number;
  className?: string;
};

/**
 * QuestionTag
 *
 * Small pill that shows [Part] – [X]/[Y]
 *
 * Figma variable mapping (approx):
 * - Background: #cce9fb (bg-brand-secondary-default)
 * - Text: #0055b7 (text-brand-primary-default)
 * - Radius: 8px (radius-sm)
 */
export const QuestionTag: React.FC<QuestionTagProps> = ({
  partLabel,
  currentIndex,
  total,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center self-start rounded-lg bg-[#cce9fb] px-4 py-2 text-sm font-medium text-[#0055b7] ${className}`}
    >
      <span className="truncate">
        {partLabel} &ndash; {currentIndex}/{total}
      </span>
    </div>
  );
};

export default QuestionTag;

