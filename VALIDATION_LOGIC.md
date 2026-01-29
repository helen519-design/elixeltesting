# Continue Button Validation Logic

## Overview

The **Continue button** in the GlobalActions component uses smart validation to ensure users complete required fields before proceeding to the next step.

---

## 🔍 How It Works

### Core Function: `canProceed()`

The validation is handled by the `canProceed()` function from the ClaimContext, which internally calls `canProceedFromStep()` from `src/lib/navigation-logic.ts`.

```typescript
const isContinueDisabled = !canProceed();
```

### Flow

1. **User fills out form** on current step
2. **Data is saved** to `state.responses` via `dispatch({ type: 'UPDATE_FIELD', ... })`
3. **Validation runs** automatically when component re-renders
4. **Button state updates**:
   - ✅ **Enabled** → All required fields filled
   - ❌ **Disabled** → Missing required fields

---

## 📋 Validation Rules by Step

### Part 1: Claim Details

| Step | Fields Required | Validation Logic |
|------|----------------|------------------|
| **Q1** | Claimant selection | `state.claimant !== null` |
| **Q2** | Insurance question (Yes/No) | `state.hasOtherInsurance !== null` |
| **Q2_1** | All insurance details | Policy holder, type, insurer name, policy number, advised insurer |

### Part 2: Symptoms & Condition

| Step | Fields Required | Validation Logic |
|------|----------------|------------------|
| **Q3** | Know condition (Yes/No) | `state.knowsCondition !== null` |
| **Q4_1** | Symptom with diagnosis | SNOMED code, confirmation, body side |
| **Q4_2** | Symptom description | SNOMED code, confirmation, body side |
| **Q5** | Symptom start date | Mode selected, date provided, confirmation checked |
| **Q6** | Previous symptoms | Answer required; if Yes, date details required |

### Part 3: Background Details

| Step | Fields Required | Validation Logic |
|------|----------------|------------------|
| **Q7** | How it happened | Injury type + type-specific details |
| **Q8** | Legal responsibility | Answer required; if Yes, solicitor details required |

### Part 4: Referral

| Step | Fields Required | Validation Logic |
|------|----------------|------------------|
| **Q9** | GP consultation type | Must select: Yes/No/Fast-track |
| **Q10** | Referral date | Mode selected, date provided, confirmation checked |
| **Q11** | Service type | **Service type required**<br>⚠️ Specialist name is **optional** |
| **Q12** | Hospital/clinic | ✅ **Always enabled** (field is optional) |

### Part 5: Review & Submit

| Step | Validation | Notes |
|------|-----------|-------|
| **REVIEW** | ✅ Always enabled | User can review and go back to edit |
| **OUTCOME** | ✅ Always enabled | Final confirmation screen |

---

## 🎨 Visual Feedback

### Enabled State (Valid)
```css
bg-[#0055b7] text-white 
hover:bg-[#1276c0] 
active:bg-[#004494] 
opacity-100
cursor-pointer
```
- **Background**: Brand blue (#0055b7)
- **Text**: White
- **Hover**: Lighter blue (#1276c0)
- **Active**: Darker blue (#004494)
- **Opacity**: 100%

### Disabled State (Invalid)
```css
bg-[#d2d3d6] text-[#949494] 
cursor-not-allowed 
opacity-60
```
- **Background**: Light gray (#d2d3d6)
- **Text**: Medium gray (#949494)
- **Cursor**: Not-allowed icon
- **Opacity**: 60% (faded appearance)
- **No hover effect**

---

## 🔙 Back Button Logic

### Visibility Rules

| Step | Back Button Visible? | Reason |
|------|---------------------|--------|
| **ONBOARDING** | ❌ No | First page in flow |
| **Q1** | ❌ No | First question step |
| **Q2-Q12** | ✅ Yes | Can navigate backwards |
| **REVIEW** | ✅ Yes | Can go back to edit |
| **OUTCOME** | ✅ Yes | Can review submission |

### Behavior

```typescript
const isFirstStep = state.currentStep === 'Q1' || state.currentStep === 'ONBOARDING';

{!isFirstStep && (
  <button onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}>
    Back
  </button>
)}
```

- Triggers `PREVIOUS_STEP` action
- Uses conditional branching logic from `getPreviousStep()` in navigation-logic.ts
- Intelligently returns to the correct previous step based on user's path

---

## 🔧 Implementation Details

### In GlobalActions.tsx

```typescript
export const GlobalActions: React.FC = () => {
  const { state, dispatch, canProceed } = useClaim();

  // Determine if we're on the first step
  const isOnboarding = state.currentStep === 'ONBOARDING';
  const isFirstStep = state.currentStep === 'Q1' || isOnboarding;
  
  // Check if current step is valid
  const isContinueDisabled = !canProceed();

  // Handlers with validation guards
  const handlePreviousStep = () => {
    if (!isFirstStep) {
      dispatch({ type: 'PREVIOUS_STEP' });
    }
  };

  const handleNextStep = () => {
    if (!isContinueDisabled) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  return (
    <>
      {/* Back button - hidden on first step */}
      {!isFirstStep && <BackButton onClick={handlePreviousStep} />}
      
      {/* Continue button - disabled if validation fails */}
      <ContinueButton 
        onClick={handleNextStep} 
        disabled={isContinueDisabled}
      />
    </>
  );
};
```

### In navigation-logic.ts

```typescript
export const canProceedFromStep = (step: string, state: ClaimState): boolean => {
  switch (step) {
    case 'Q1':
      return state.claimant !== null;
    
    case 'Q2':
      return state.hasOtherInsurance !== null;
    
    // ... validation for each step
    
    case 'Q11':
      return state.referralServiceType !== null;
      // Specialist name is optional!
    
    case 'Q12':
      return true; // Hospital/clinic is optional!
    
    case 'REVIEW':
      return true; // Can always proceed
    
    default:
      return true;
  }
};
```

---

## ✅ Accessibility

### ARIA Labels

```html
<!-- Continue button - enabled -->
<button aria-label="Continue to next step">
  Continue
</button>

<!-- Continue button - disabled -->
<button 
  aria-label="Complete required fields to continue"
  aria-disabled="true"
>
  Continue
</button>

<!-- Back button -->
<button aria-label="Go back to previous step">
  Back
</button>
```

### Keyboard Navigation

- ✅ Tab key navigates between buttons
- ✅ Enter/Space activates buttons
- ✅ Disabled buttons cannot be activated
- ✅ Focus visible indicator

---

## 🧪 Testing the Validation

### Manual Testing Steps

1. **Start at Q1** → Continue disabled until claimant selected
2. **Select claimant** → Continue enabled
3. **Click Continue** → Navigate to Q2
4. **Test Back button** → Returns to Q1 with data preserved
5. **Complete Q2** → Test conditional branching (Q2_1 vs Q3)
6. **Reach Q11** → Continue enabled even without specialist name
7. **Reach Q12** → Continue enabled even without hospital name
8. **Review page** → Continue always enabled

### Edge Cases

✅ **Empty required field** → Button disabled  
✅ **Partially filled multi-field** → Button disabled  
✅ **Optional field empty** → Button enabled (Q11, Q12)  
✅ **Fast-track path** → Skips to outcome  
✅ **Back from conditional branch** → Returns to correct step  

---

## 📊 Summary

| Aspect | Implementation |
|--------|---------------|
| **Validation Source** | `canProceedFromStep()` in navigation-logic.ts |
| **Hook Used** | `canProceed()` from ClaimContext |
| **Visual Feedback** | Opacity 60%, gray colors, cursor-not-allowed |
| **Back Button** | Hidden on Q1/ONBOARDING, always functional elsewhere |
| **Optional Steps** | Q11 (specialist name), Q12 (hospital), REVIEW, OUTCOME |
| **Accessibility** | ARIA labels, keyboard navigation, focus indicators |

---

## 🚀 Next Steps

If you want to enhance validation:

1. **Add field-level validation** → Show error messages on specific inputs
2. **Add progress indicator** → Show "3 of 12 fields completed"
3. **Add tooltips** → Explain why Continue is disabled
4. **Add animations** → Shake button if clicked while disabled
5. **Add save indicators** → Show when data is auto-saved

All validation logic is centralized in `src/lib/navigation-logic.ts` for easy maintenance!
