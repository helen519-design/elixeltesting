'use client';

import React, { useEffect, useState } from 'react';

type AutoSaveIndicatorProps = {
  show: boolean;
};

/**
 * AutoSaveIndicator
 * 
 * Small indicator that appears in the top right when auto-saving.
 * Shows "Saving..." briefly, then "Saved" with a checkmark.
 */
export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ show }) => {
  const [status, setStatus] = useState<'saving' | 'saved' | 'hidden'>('hidden');

  useEffect(() => {
    if (show) {
      setStatus('saving');
      
      // After 500ms, switch to "saved"
      const timer = setTimeout(() => {
        setStatus('saved');
        
        // After another 2s, hide
        setTimeout(() => {
          setStatus('hidden');
        }, 2000);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (status === 'hidden') return null;

  return (
    <div className="fixed top-[120px] right-8 z-50 flex items-center gap-2 bg-white border border-[#d2d3d6] rounded-lg px-4 py-2 shadow-lg transition-all duration-300">
      {status === 'saving' ? (
        <>
          {/* Spinner */}
          <svg 
            className="animate-spin h-4 w-4 text-[#0055b7]" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-medium text-[#4d4f5c]">Saving...</span>
        </>
      ) : (
        <>
          {/* Checkmark */}
          <svg 
            className="h-4 w-4 text-green-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <span className="text-sm font-medium text-green-600">Saved</span>
        </>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
