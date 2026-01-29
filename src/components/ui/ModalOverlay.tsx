import React, { ReactNode } from 'react';

type ModalOverlayProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * ModalOverlay – backdrop + panel for modals (e.g. SNOMED suggestions).
 * 
 * Figma design specifications:
 * - Modal background: white
 * - Border: 1px solid #d2d3d6
 * - Border radius: 8px
 * - Padding: 24px
 * - Close button: 24px × 24px at top right
 * - Title: 18px / 28px, regular weight, #4d4f5c
 * - Gap: 16px between sections
 */
export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  open,
  onClose,
  title,
  children,
  className = '',
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[600px] h-[85vh] max-h-[700px] rounded-[8px] border border-[#d2d3d6] bg-white shadow-lg flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - fixed */}
        <div className="flex-shrink-0 p-[24px] pb-0">
          {/* Close button */}
          <div className="flex items-center justify-end w-full mb-[16px]">
            <button
              type="button"
              onClick={onClose}
              className="w-[24px] h-[24px] flex items-center justify-center text-[#4d4f5c] hover:text-[#0055b7] focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Title */}
          {title && (
            <h3 id="modal-title" className="font-normal text-[18px] leading-[28px] text-[#4d4f5c] w-full">
              {title}
            </h3>
          )}
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-[24px] flex flex-col gap-[16px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;
