import { OptionChip } from './OptionChip';

type OptionChipOption<T = unknown> = {
  label: string;
  description?: string;
  icon?: string; // Path to icon image
  value: T;
};

type OptionChipGroupProps<T = unknown> = {
  options: OptionChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal' | 'grid'; // Layout direction
  className?: string;
};

/**
 * OptionChipGroup
 *
 * Simple wrapper to render a vertical stack of OptionChips with single selection.
 */
export const OptionChipGroup = <T,>({
  options,
  value,
  onChange,
  disabled = false,
  layout = 'vertical',
  className = '',
}: OptionChipGroupProps<T>) => {
  const layoutClasses = 
    layout === 'horizontal' 
      ? 'flex flex-row gap-4' 
      : layout === 'grid'
      ? 'grid grid-cols-2 gap-4'
      : 'flex flex-col gap-3';
  
  return (
    <div className={`${layoutClasses} ${className}`}>
      {options.map((opt) => (
        <OptionChip
          key={String(opt.label)}
          label={opt.label}
          description={opt.description}
          icon={opt.icon}
          selected={value === opt.value}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          variant={layout === 'grid' ? 'large' : 'default'}
        />
      ))}
    </div>
  );
};

export default OptionChipGroup;

