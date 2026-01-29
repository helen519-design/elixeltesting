# Typeform-Style Claim Flow System

A comprehensive TypeScript/React solution for building a complex insurance claim flow with 12 questions, branching logic, and SNOMED code integration.

## 📋 Overview

This system provides a complete state management solution for a multi-step claim form with:
- **12 Questions** with conditional branching logic
- **Type-safe state management** using TypeScript interfaces
- **React Context + Reducer pattern** for global state
- **JSON-based navigation logic** for dynamic flow control
- **SNOMED code lookup** for medical symptom classification
- **Comprehensive validation** at each step

## 🗂️ File Structure

```
├── claim-types.ts          # TypeScript interfaces for all claim data
├── navigation-logic.ts     # JSON logic map for question flow
├── ClaimProvider.tsx       # React Context Provider with reducer
├── snomed-service.ts       # Mock SNOMED API service
├── example-usage.tsx       # Example implementation components
└── README.md              # This file
```

## 🔧 Core Components

### 1. `claim-types.ts` - TypeScript Interfaces

Defines the complete `ClaimState` interface covering all 12 questions:

```typescript
interface ClaimState {
  // Q1: Who do you want to claim for?
  claimant: PolicyHolder | null;
  
  // Q2: Do you have other medical insurance?
  hasOtherInsurance: boolean | null;
  
  // Q2.1: Other medical cover details
  otherMedicalCover: OtherMedicalCover | null;
  
  // Q3: Do you know what condition you have?
  knowsCondition: boolean | null;
  
  // Q4: Symptom information (with SNOMED)
  symptom: SymptomData;
  
  // Q5: When did symptoms start?
  symptomStartDate: DateSelection;
  
  // Q6: Previous symptoms?
  hasPreviousSymptoms: boolean | null;
  previousSymptomDate: DateSelection | null;
  
  // Q7: How did this happen?
  injuryDetails: InjuryDetails;
  
  // Q8: Legal responsibility?
  hasLegalResponsibility: boolean | null;
  solicitorDetails: SolicitorDetails | null;
  
  // Q9: GP consultation type
  gpConsultationType: GPConsultationType;
  
  // Q10: Referral date
  referralDate: DateSelection;
  
  // Q11: Service referral
  referralServiceType: ReferralServiceType;
  specialistDetails: SpecialistDetails | null;
  
  // Q12: Hospital or clinic
  hospitalClinic: string;
  
  // Flow control
  currentStep: string;
  completedSteps: string[];
  outcome: 'awaiting_provider' | 'awaiting_form' | null;
}
```

### 2. `navigation-logic.ts` - JSON Logic Map

Defines the navigation rules for each question:

```typescript
export const NAVIGATION_MAP: Record<string, NavigationRule> = {
  Q2: {
    step: 'Q2',
    label: 'Do you have other medical insurance?',
    nextStep: (state: ClaimState) => {
      return state.hasOtherInsurance === true ? 'Q2_1' : 'Q3';
    },
  },
  
  Q3: {
    step: 'Q3',
    label: 'Do you know what condition you have?',
    nextStep: (state: ClaimState) => {
      return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
    },
  },
  
  // ... more navigation rules
};
```

**Key Functions:**
- `getNextStep(currentStep, state)` - Determines next question based on answers
- `getPreviousStep(currentStep, state)` - Handles back navigation
- `canProceedFromStep(step, state)` - Validates if user can continue
- `determineOutcome(state)` - Calculates final claim outcome

### 3. `ClaimProvider.tsx` - React Context Provider

Provides global state management with reducer pattern:

```typescript
// Available actions
type ClaimAction =
  | { type: 'UPDATE_FIELD'; field: string; value: any }
  | { type: 'UPDATE_NESTED_FIELD'; parentField: string; field: string; value: any }
  | { type: 'GO_TO_STEP'; step: string }
  | { type: 'GO_TO_NEXT_STEP' }
  | { type: 'GO_TO_PREVIOUS_STEP' }
  | { type: 'UPDATE_SYMPTOM'; updates: Partial<ClaimState['symptom']> }
  | { type: 'SUBMIT_CLAIM' }
  | { type: 'RESET_CLAIM' };
```

**Usage in components:**

```typescript
const { 
  state,                    // Current claim state
  updateField,              // Update any field
  updateSymptom,            // Update symptom data
  goToNextStep,            // Navigate forward
  goToPreviousStep,        // Navigate backward
  canProceed,              // Check if can continue
  submitClaim,             // Submit final claim
} = useClaim();
```

### 4. `snomed-service.ts` - Mock SNOMED API

Simulates SNOMED code lookup with 1-second delay:

```typescript
// Fetch single SNOMED code
const result = await fetchSnomed('knee pain');
// Returns: { code: '30989003', name: 'Knee pain', description: '...' }

// Fetch multiple suggestions
const suggestions = await fetchSnomedSuggestions('back pain', 4);
// Returns: Array of 4 closest matches

// Verify code exists
const exists = await verifySnomedCode('30989003');
```

## 🚀 Getting Started

### Installation

```bash
# Copy all files to your project
# Install dependencies (assuming you have React already)
npm install
```

### Basic Usage

```typescript
import React from 'react';
import { ClaimProvider, useClaim } from './ClaimProvider';

// Wrap your app with the provider
function App() {
  return (
    <ClaimProvider>
      <YourClaimFlow />
    </ClaimProvider>
  );
}

// Use the hook in any component
function QuestionComponent() {
  const { state, updateField, goToNextStep } = useClaim();
  
  return (
    <div>
      <h2>Question 1</h2>
      {/* Your question UI */}
      <button onClick={goToNextStep}>Continue</button>
    </div>
  );
}
```

## 📝 Question Flow Map

```
Q1 (Claimant) 
  → Q2 (Other Insurance?)
      → YES: Q2.1 (Insurance Details) → Q3
      → NO: Q3

Q3 (Know Condition?)
  → YES: Q4.1 (Enter Symptom) → Q5
  → NO: Q4.2 (Describe Symptom) → Q5

Q5 (Symptom Start Date) 
  → Q6 (Previous Symptoms?)

Q6 (Previous Symptoms?)
  → Q7 (How Did This Happen?)

Q7 (Injury Type)
  → Q8 (Legal Responsibility?)

Q8 (Legal Responsibility?)
  → Q9 (GP Consultation Type?)

Q9 (GP Consultation)
  → Fast-track: END_FAST_TRACK (Call Support)
  → Other: Q10 (Referral Date)

Q10 (Referral Date)
  → Q11 (Service Type)

Q11 (Service Type)
  → Q12 (Hospital/Clinic)

Q12 (Hospital/Clinic)
  → REVIEW (Review Answers)

REVIEW
  → OUTCOME (Submit)
      → Awaiting Provider (no specialist/hospital)
      → Awaiting Form (has specialist/hospital)
```

## 🎯 Key Features

### Branching Logic
Questions automatically route based on answers:
- Q2 → Q2.1 if "Yes" to other insurance
- Q3 → Q4.1 if knows condition, Q4.2 if doesn't
- Q9 → Fast-track end screen OR Q10

### SNOMED Integration
- Real-time symptom search with 1-second simulated delay
- Mock database with 40+ common conditions
- Suggestion matching with scoring algorithm
- Body side selection (left/right/both)

### Validation
- Each step validates required fields before allowing continuation
- `canProceedFromStep()` checks completion status
- Continue button disabled until validation passes

### State Persistence
- All answers stored in central state
- Navigate back/forward without losing data
- Review page shows all answers with edit capability

### Outcome Determination
Automatically determines outcome based on final answers:
- **Awaiting Provider**: No specialist name + no hospital
- **Awaiting Form**: Has specialist name OR hospital

## 🔨 Implementation Guide

### Creating a Question Component

```typescript
import React from 'react';
import { useClaim } from './ClaimProvider';

const QuestionX: React.FC = () => {
  const { state, updateField, goToNextStep, canProceed } = useClaim();

  const handleAnswer = (value: any) => {
    updateField('fieldName', value);
  };

  return (
    <div className="question-container">
      <h2>Your Question Title</h2>
      
      {/* Your question UI */}
      <button onClick={() => handleAnswer('answer1')}>
        Option 1
      </button>
      
      <button 
        onClick={goToNextStep} 
        disabled={!canProceed()}
      >
        Continue
      </button>
    </div>
  );
};
```

### Handling Complex Updates

```typescript
// Update nested fields
updateNestedField('otherMedicalCover', 'insurerName', 'Aviva');

// Update symptom data
updateSymptom({
  snomedCode: result,
  userInput: 'knee pain',
  bodySide: 'left',
  isConfirmed: true,
});

// Update injury details
updateInjuryDetails({
  type: 'sporting',
  sporting: {
    sport: 'Football',
    country: 'UK',
    receivedDonation: false,
  },
});
```

### Custom Navigation

```typescript
// Jump to specific step
goToStep('Q5');

// Go back one step
goToPreviousStep();

// Check current step
if (state.currentStep === 'Q11') {
  // Do something specific
}

// Check completed steps
const hasCompletedQ5 = state.completedSteps.includes('Q5');
```

## 🧪 Testing

### Test Navigation Logic

```typescript
import { getNextStep, getPreviousStep } from './navigation-logic';
import { createInitialClaimState } from './claim-types';

const state = createInitialClaimState();
state.hasOtherInsurance = true;

const next = getNextStep('Q2', state);
console.log(next); // 'Q2_1'
```

### Test SNOMED Lookup

```typescript
import { fetchSnomed, fetchSnomedSuggestions } from './snomed-service';

async function testSnomed() {
  const result = await fetchSnomed('knee pain');
  console.log(result);
  // { code: '30989003', name: 'Knee pain', ... }
  
  const suggestions = await fetchSnomedSuggestions('back', 3);
  console.log(suggestions.length); // 3
}
```

## 📚 TypeScript Types Reference

### Main Types
- `ClaimState` - Complete state interface
- `SnomedCode` - SNOMED medical code
- `PolicyHolder` - Person covered by policy
- `SymptomData` - Symptom with SNOMED data
- `DateSelection` - Date picker state
- `InjuryDetails` - Injury cause information
- `SolicitorDetails` - Legal representation info
- `SpecialistDetails` - Healthcare provider info

### Enums / Literal Types
- `BodySide`: `'left' | 'right' | 'both' | null`
- `PolicyType`: `'PMI' | 'Cash Plan'`
- `InjuryType`: `'sporting' | 'trip_fall' | 'traffic' | 'attack' | 'other'`
- `GPConsultationType`: `'nhs_gp' | 'private_gp' | 'self_referral' | 'other' | 'fast_track'`
- `ReferralServiceType`: `'specialist' | 'mental_health_specialist' | 'therapist' | ...`

## 🎨 Styling Tips

The system is UI-agnostic. Add your own styling:

```css
.question-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.continue-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loader {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 🔍 Troubleshooting

### State not updating?
Ensure you're using the hook inside a component wrapped by `ClaimProvider`:
```typescript
<ClaimProvider>
  <YourComponent />  {/* ✓ Can use useClaim() */}
</ClaimProvider>
<YourComponent />  {/* ✗ Cannot use useClaim() */}
```

### Navigation not working?
Check that validation passes:
```typescript
const canContinue = canProceed();
console.log('Can proceed:', canContinue);
console.log('Current step:', state.currentStep);
```

### SNOMED not returning results?
The mock service has limited data. Extend `MOCK_SNOMED_DATABASE` in `snomed-service.ts` or integrate a real API.

## 📄 License

This is example code for demonstration purposes. Adapt as needed for your project.

## 🤝 Contributing

This is a standalone implementation. Feel free to extend or modify for your needs:
- Add more SNOMED codes to the mock database
- Implement real API integration
- Add persistence (localStorage, API)
- Enhance validation rules
- Add analytics/tracking
- Implement autosave

## 📞 Support

For questions about implementation:
1. Check the example usage in `example-usage.tsx`
2. Review type definitions in `claim-types.ts`
3. Examine navigation logic in `navigation-logic.ts`
4. Test with the mock SNOMED service

---

**Built with TypeScript, React, and ❤️**
