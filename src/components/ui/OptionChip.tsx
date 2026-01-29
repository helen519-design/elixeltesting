import React from 'react';

type OptionChipProps = {
  label: string;
  description?: string;
  icon?: string; // Path to icon image
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'large'; // Large variant for grid layouts
};

/**
 * OptionChip
 *
 * Figma variable mapping (approx):
 * - Min width / max width: 280–600px (Alias/Size/OptionChip)
 * - Radius: 8px (Alias/Radius/radius-sm → rounded-lg)
 * - Border: #d2d3d6 (Alias/Border/border-general-default)
 * - Selected border: #0055b7 (Alias/Border/border-brand-primary-default)
 * - Background selected: #cce9fb (Alias/Background/bg-brand-secondary-default)
 * - Label text: #4d4f5c (Alias/Text/text-label-default)
 */
export const OptionChip: React.FC<OptionChipProps> = ({
  label,
  description,
  icon,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  variant = 'default',
}) => {
  const baseClasses =
    variant === 'large'
      ? 'w-full min-w-[280px] max-w-[600px] text-left rounded-[8px] transition flex items-start gap-2'
      : 'w-full min-w-[280px] max-w-[600px] text-left rounded-lg transition flex items-start gap-2';

  const stateClasses = selected
    ? variant === 'large'
      ? 'border-[2px] border-[#0055b7] bg-white px-[15px] py-[15px]'
      : 'border-[2px] border-[#0055b7] bg-white px-[15px] py-[11px]'
    : variant === 'large'
    ? 'border-[1px] border-[#d2d3d6] bg-white px-[16px] py-[16px] hover:border-[#0055b7]/60 hover:bg-gray-50'
    : 'border-[1px] border-[#d2d3d6] bg-white px-4 py-3 hover:border-[#0055b7]/60 hover:bg-gray-50';

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed hover:border-[#d2d3d6] hover:bg-white'
    : 'cursor-pointer';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
    >
      {icon && (
        <img 
          src={icon} 
          alt="" 
          className="w-9 h-9 flex-shrink-0" 
          aria-hidden="true"
        />
      )}
      <span className="flex flex-col flex-1">
        <span className="text-[18px] leading-[32px] font-medium text-[#4d4f5c]">{label}</span>
        {description && (
          <span className="text-[16px] leading-[28px] font-normal text-[#8a8c95]">
            {description}
          </span>
        )}
      </span>
    </button>
  );
};

export default OptionChip;

