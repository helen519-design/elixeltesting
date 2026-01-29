# Review Screen Documentation

## Overview

Comprehensive review screen using ReviewRow components from Figma that displays all user answers with edit functionality.

---

## 🎨 Components Created

### 1. ReviewRow Component (`src/components/ui/ReviewRow.tsx`)

Reusable component for displaying question/answer pairs in the review screen.

**Props:**
```typescript
type ReviewRowProps = {
  label: string;                    // Question label
  value: string | null | undefined; // Answer value
  onEdit?: () => void;              // Edit button callback
  showEditButton?: boolean;         // Show/hide edit button (default: true)
};
```

**Figma Specifications:**
- Container: `p-3` (12px), `w-[260px]`, `h-[172px]`, `rounded-lg`
- Label: `text-lg` (18px), `font-medium`, `text-[#4d4f5c]`, border-bottom
- Answer: `text-lg` (18px), `font-medium`, `text-[#1e1e1e]`
- Not provided: `text-gray-400 italic`
- Edit button: `text-sm font-semibold text-[#0055b7] underline`

---

## 📋 Data Mapping

### Question → State → Display

| Question | Step | State Field | Formatter | Display |
|----------|------|-------------|-----------|---------|
| **Claiming for** | Q1 | `responses.claimant` | `getClaimantValue()` | Myself / My partner / A dependent |
| **Symptom** | Q4_1/Q4_2 | `responses.symptom` | `getSymptomValue()` | Symptom description |
| **Symptom start date** | Q5 | `responses.symptomStartDate` | `getSymptomStartDate()` | Exact date or "Approximately [month]" |
| **Cause** | Q7 | `responses.injuryDetails.type` | `getCauseValue()` | Sporting injury / Trip or fall / etc. |
| **Legal responsibility** | Q8 | `responses.hasLegalResponsibility` | `getLegalResponsibilityValue()` | Yes / No |
| **GP referral on** | Q10 | `responses.referralDate` | `getReferralDateValue()` | Date or "Approximately [month]" |
| **Type of referral** | Q11 | `responses.referralServiceType` | `getReferralTypeValue()` | Specialist / Therapist / etc. |
| **Name of specialist** | Q11 | `responses.specialistDetails.name` | `getSpecialistNameValue()` | Specialist name or "Not provided" |
| **Hospital or clinic** | Q12 | `responses.hospitalClinic` | `getHospitalClinicValue()` | Hospital name or "Not provided" |

---

## 🔄 Edit Functionality

### How It Works

Each ReviewRow has an Edit button that dispatches an action to navigate back to the specific question:

```typescript
const editStep = (step: string) => {
  dispatch({
    type: 'UPDATE_FIELD',
    payload: {
      field: 'currentStep',
      value: step,
    },
  });
};

// Usage in ReviewRow
<ReviewRow
  label="Claiming for"
  value={getClaimantValue()}
  onEdit={() => editStep('Q1')}
/>
```

### Edit Button Visibility

- **Shown**: When field has a value and `showEditButton !== false`
- **Hidden**: 
  - When field is empty ("Not provided")
  - When `showEditButton={false}` (e.g., specialist name - edit via referral type)

---

## 🎯 Conditional Logic

### Optional Fields

| Field | Required? | Behavior |
|-------|-----------|----------|
| Specialist name (Q11) | ❌ Optional | Shows "Not provided" if empty, no edit button |
| Hospital/clinic (Q12) | ❌ Optional | Shows "Not provided" if empty, has edit button |

### Conditional Navigation

```typescript
// Symptom: Navigate to Q4_1 or Q4_2 based on knowsCondition
onEdit={() => {
  const knowsCondition = responses.knowsCondition;
  editStep(knowsCondition === true ? 'Q4_1' : 'Q4_2');
}}
```

---

## 🔘 Submit Claim Button

### GlobalActions Updates

The Continue button changes to "Submit Claim" on the REVIEW step:

```typescript
// In GlobalActions.tsx
const isReviewStep = state.currentStep === 'REVIEW';
const continueButtonText = isReviewStep ? 'Submit Claim' : 'Continue';

<button ...>
  {continueButtonText}
</button>
```

**Button States:**

| State | Text | Behavior |
|-------|------|----------|
| Q1-Q12 | "Continue" | Navigate to next question |
| REVIEW | "Submit Claim" | Navigate to OUTCOME |
| Disabled | Grayed out | Cannot proceed |

---

## 📐 Layout Structure

### Figma Layout

```
┌─────────────────────────────────────────────────┐
│ Part 5 – Review                                 │
│ Review all your answers                         │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌──────────────┐                               │
│ │ Claiming for │                               │ Row 1
│ │ Myself       │                               │
│ └──────────────┘                               │
│                                                 │
│ ┌─────────┐ ┌─────────────┐ ┌───────┐ ┌──────┐│
│ │ Symptom │ │ Start date  │ │ Cause │ │Legal?││ Row 2
│ │ ...     │ │ ...         │ │ ...   │ │ ...  ││
│ └─────────┘ └─────────────┘ └───────┘ └──────┘│
│                                                 │
│ ┌────────┐ ┌────────────┐ ┌─────────┐ ┌──────┐│
│ │GP date │ │ Referral   │ │Spec name│ │Hosp. ││ Row 3
│ │ ...    │ │ type       │ │ ...     │ │ ...  ││
│ └────────┘ └────────────┘ └─────────┘ └──────┘│
│                                                 │
│ ┌────────────────────────────────────────────┐ │
│ │ ℹ️ Please review carefully before submit   │ │
│ └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Responsive Design

```typescript
// Rows wrap on smaller screens
<div className="flex gap-4 items-start w-full flex-wrap">
  <ReviewRow ... />
  <ReviewRow ... />
  <ReviewRow ... />
  <ReviewRow ... />
</div>
```

---

## 🧪 Testing Guide

### Manual Testing Steps

1. **Complete all questions** (Q1-Q12)
2. **Navigate to REVIEW step**
3. **Verify all data** is displayed correctly
4. **Test Edit button** on each row:
   - Click Edit
   - Verify navigation to correct step
   - Make changes
   - Navigate back to REVIEW
   - Verify changes reflected
5. **Test optional fields**:
   - Leave Q11 specialist name empty → Shows "Not provided"
   - Leave Q12 hospital empty → Shows "Not provided"
6. **Test Submit button**:
   - Verify button says "Submit Claim"
   - Click Submit → Navigate to OUTCOME

### Edge Cases

✅ **Empty optional fields** → Show "Not provided" (gray, italic)  
✅ **Edit from review** → Navigate to correct step  
✅ **Conditional symptom edit** → Navigate to Q4_1 or Q4_2 based on Q3  
✅ **Date formats** → Show exact or approximate dates correctly  
✅ **Enum values** → Map technical values to user-friendly labels  

---

## 📊 Formatter Functions

### Claimant
```typescript
'self' → 'Myself'
'partner' → 'My partner'
'dependent' → 'A dependent'
```

### Injury Type (Cause)
```typescript
'sporting' → 'Sporting injury'
'trip_fall' → 'Trip or fall'
'traffic' → 'Traffic accident'
'attack' → 'Attack or assault'
'other' → 'Other'
```

### Referral Type
```typescript
'specialist' → 'Specialist'
'mental_health_specialist' → 'Mental health specialist'
'therapist' → 'Therapist'
'mental_health_therapist' → 'Mental health therapist'
'direct_test' → 'Direct test'
```

### Date Formats
```typescript
// Exact date
exactDate: '2024-01-15' → '2024-01-15'

// Estimated date
estimatedStartDate: '2024-01' → 'Approximately 2024-01'
```

---

## 🎯 File Structure

```
src/
├── components/
│   ├── steps/
│   │   └── StepReviewSummary.tsx    ← Main review screen
│   └── ui/
│       └── ReviewRow.tsx             ← Reusable review row component
└── lib/
    └── navigation-logic.ts           ← Navigation logic
```

---

## ✅ Checklist

- ✅ ReviewRow component created with Figma specs
- ✅ Data mapping for all questions (Q1, Q4, Q5, Q7, Q8, Q10, Q11, Q12)
- ✅ Edit functionality for each row
- ✅ Conditional logic for optional fields (Q11 specialist, Q12 hospital)
- ✅ Submit Claim button on REVIEW step
- ✅ Proper formatting for all data types
- ✅ Responsive layout with flexbox
- ✅ Build successful

---

## 🚀 Next Steps

If you want to enhance the review screen:

1. **Add section grouping** → Group by Part 1, Part 2, etc.
2. **Add expand/collapse** → Collapsible sections for large forms
3. **Add inline editing** → Edit fields without navigating away
4. **Add validation warnings** → Highlight incomplete sections
5. **Add print functionality** → Print review for user records
6. **Add email preview** → Show what will be emailed
7. **Add comparison view** → Show before/after for edited fields

All review logic is in `src/components/steps/StepReviewSummary.tsx` for easy maintenance!
