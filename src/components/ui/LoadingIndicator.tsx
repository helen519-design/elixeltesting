import React from 'react';

type LoadingIndicatorProps = {
  label?: string;
  className?: string;
};

/**
 * LoadingIndicator
 *
 * Figma variable mapping (approx):
 * - Spinner size: 24px (derived from generic size scale)
 * - Border color: #0055b7 (brand primary) on top, #d2d3d6 background
 * - Text: #4d4f5c (body)
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  label = 'Loading…',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 text-[#4d4f5c] ${className}`}>
      <span
        className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#d2d3d6] border-t-[#0055b7]"
        aria-hidden="true"
      />
      <span className="text-[16px] leading-[28px]">{label}</span>
    </div>
  );
};

export default LoadingIndicator;

