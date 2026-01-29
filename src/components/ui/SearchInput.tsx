import React from 'react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
};

/**
 * SearchInput
 *
 * Figma design specifications:
 * - Border: 1px solid #d2d3d6 (Alias/Border/border-general-default)
 * - Border radius: 8px (Alias/Radius/radius-sm)
 * - Background: white (Alias/Background/bg-general-primary-default)
 * - Padding: 16px (Alias/Spacing/padding-xs)
 * - Text: 16px / 28px line-height
 * - Placeholder color: #8a8c95 (Alias/Text/text-placeholder-default)
 * - Text color: #4d4f5c (Alias/Text/text-label-default)
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Please enter your diagnosis',
  autoFocus,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-[576px] ${className}`}>
      <div className="flex w-full items-center gap-[8px] overflow-clip rounded-[8px] border border-[#d2d3d6] bg-white p-[16px]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 border-none bg-transparent font-normal text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none"
        />
      </div>
    </div>
  );
};

export default SearchInput;

