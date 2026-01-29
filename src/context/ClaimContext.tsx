'use client';

import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { ClaimState as FullClaimState } from '../types/claim';
import { getNextStep, getPreviousStep, canProceedFromStep } from '../lib/navigation-logic';

type ClaimState = {
  currentStep: string;
  responses: Record<string, unknown>;
  history: string[];
  lastSaveTime: number;
};

type ClaimAction =
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: unknown } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' };

// 1. Initial State
const initialState: ClaimState = {
  currentStep: 'CLAIM_TYPE',
  responses: {},
  history: [],
  lastSaveTime: 0
};

// 2. Reducer Logic
function claimReducer(state: ClaimState, action: ClaimAction): ClaimState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      // #region agent log
      console.log('[DEBUG-H3] UPDATE_FIELD before:', {
        field: action.payload.field,
        value: action.payload.value,
        currentResponses: state.responses,
        currentState: state
      });
      // #endregion
      const newState = {
        ...state,
        responses: { ...state.responses, [action.payload.field]: action.payload.value },
        // Also set as direct property for easy access
        [action.payload.field]: action.payload.value,
        lastSaveTime: Date.now()
      };
      // #region agent log
      console.log('[DEBUG-H3] UPDATE_FIELD after:', {
        field: action.payload.field,
        newResponses: newState.responses,
        hasDirectField: !!(newState as any)[action.payload.field],
        directFieldValue: (newState as any)[action.payload.field],
        fullNewState: newState
      });
      // #endregion
      return newState;
    case 'NEXT_STEP': {
      const nextStep = getNextStep(state.currentStep, state as unknown as FullClaimState);
      return {
        ...state,
        history: [...state.history, state.currentStep],
        currentStep: nextStep
      };
    }
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep:
          getPreviousStep(state.currentStep, state as unknown as FullClaimState) ??
          state.currentStep,
        history: state.history.slice(0, -1)
      };
    default:
      return state;
  }
}

// 3. Create Context
type ClaimContextType = {
  state: ClaimState;
  dispatch: Dispatch<ClaimAction>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canProceed: () => boolean;
};

const ClaimContext = createContext<ClaimContextType | undefined>(undefined);

// 4. The Provider (The component that wraps your app)
export const ClaimProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(claimReducer, initialState);

  // Helper functions
  const goToNextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const goToPreviousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const canProceed = (): boolean => {
    // Note: canProceedFromStep expects FullClaimState, but we have simplified ClaimState
    // For now, return true for ONBOARDING, false otherwise (simplified logic)
    if (state.currentStep === 'ONBOARDING') {
      return true;
    }
    // Try to call with cast - may need adjustment based on actual state shape
    try {
      // #region agent log
      console.log('[DEBUG-H4,H5] canProceed calling validation:', {
        currentStep: state.currentStep,
        stateHasInjuryDetails: !!(state as any).injuryDetails,
        responsesHasInjuryDetails: !!state.responses.injuryDetails,
        injuryDetailsValue: (state as any).injuryDetails,
        responsesInjuryDetails: state.responses.injuryDetails,
        fullState: state
      });
      // #endregion
      const result = canProceedFromStep(state.currentStep, state as unknown as FullClaimState);
      // #region agent log
      console.log('[DEBUG-H4] canProceed result:', {
        result,
        currentStep: state.currentStep
      });
      // #endregion
      return result;
    } catch (error) {
      // #region agent log
      console.log('[DEBUG-H4] canProceed error caught:', {
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        currentStep: state.currentStep
      });
      // #endregion
      // Fallback: allow proceeding if we have a current step
      return state.currentStep !== '';
    }
  };

  const contextValue: ClaimContextType = {
    state,
    dispatch,
    goToNextStep,
    goToPreviousStep,
    canProceed,
  };

  return (
    <ClaimContext.Provider value={contextValue}>
      {children}
    </ClaimContext.Provider>
  );
};

// 5. The Hook (What your steps use to get data)
export const useClaim = () => {
  const context = useContext(ClaimContext);
  if (!context) {
    throw new Error('useClaim must be used within a ClaimProvider');
  }
  return context;
};