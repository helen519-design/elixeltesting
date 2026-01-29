import React, { ReactNode, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useClaim } from '@/context/ClaimContext';
import { TopBar } from './ui/TopBar';
import { StageTrackerBar } from './ui/StageTrackerBar';
import { GlobalActions } from './ui/GlobalActions';
import { AutoSaveIndicator } from './ui/AutoSaveIndicator';

type AppShellProps = {
  children: ReactNode;
};

/**
 * AppShell
 * 
 * Main application layout with:
 * - Fixed TopBar + StageTrackerBar at the top (hidden on ONBOARDING)
 * - Scrollable main content area in the middle
 * - Fixed GlobalActions (Back/Continue) at the bottom
 * 
 * Uses Flexbox layout for proper positioning and scrolling behavior.
 */
const AppShellContent: React.FC<AppShellProps> = ({ children }) => {
  const { state } = useClaim();
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const isClaimType = state.currentStep === 'CLAIM_TYPE';
  const isOnboarding = state.currentStep === 'ONBOARDING';
  const isEndScreen = state.currentStep === 'OUTCOME' || state.currentStep === 'END_FAST_TRACK' || state.currentStep === 'END_MAJOR_INCIDENT' || state.currentStep === 'NAVIGATION_OVERVIEW';

  // Watch for changes in lastSaveTime to trigger the save indicator
  useEffect(() => {
    if (state.lastSaveTime > 0) {
      setShowSaveIndicator(true);
      // Reset after showing
      const timer = setTimeout(() => setShowSaveIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.lastSaveTime]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-700 flex flex-col">
      {/* Auto-save indicator */}
      <AutoSaveIndicator show={showSaveIndicator} />
      
      {/* Fixed TopBar - Hidden on CLAIM_TYPE and END screens */}
      {!isClaimType && !isEndScreen && (
        <>
          <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-[#d2d3d6]">
            <div className="mx-auto max-w-[1440px] px-[30px] py-[12px]">
              <TopBar />
            </div>
          </header>

          {/* Spacer for fixed TopBar */}
          <div className="h-[88px] flex-shrink-0" aria-hidden="true" />
        </>
      )}

      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto">
        {/* StageTrackerBar - Hidden on CLAIM_TYPE, ONBOARDING and END screens */}
        {!isClaimType && !isOnboarding && !isEndScreen && (
          <div className="bg-[#fafbfb]">
            <div className="mx-auto max-w-4xl px-6 py-8">
              <StageTrackerBar />
            </div>
          </div>
        )}

        {/* Main content area */}
        <main className={`w-full ${isClaimType || isOnboarding || isEndScreen ? '' : 'mx-auto max-w-4xl px-6 py-8'}`}>
          <AnimatedStepContainer>{children}</AnimatedStepContainer>
        </main>

        {/* GlobalActions at bottom of scrollable content */}
        <GlobalActions />
      </div>
    </div>
  );
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  // Don't create a new ClaimProvider here - use the one from page.tsx
  return <AppShellContent>{children}</AppShellContent>;
};

const AnimatedStepContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state } = useClaim();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={state.currentStep}
        initial={{ x: 32, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -32, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AppShell;

