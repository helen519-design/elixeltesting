# Claim Flow Navigation - 12 Steps

## Overview
Complete navigation logic for the WPA Health Claim flow, with conditional branching and 5 progress stages.

---

## 🗺️ Complete Step Flow

### Part 1: Claim Details (Steps 1-2)
| Step | File | Question | Next Step |
|------|------|----------|-----------|
| **Q1** | `Step1Who.tsx` | Who do you want to claim for? | Q2 |
| **Q2** | `Step2Insurance.tsx` | Do you have other medical insurance? | Q2_1 (if yes) or Q3 (if no) |
| **Q2_1** | `Step2OtherCoverDetails.tsx` | Tell us about your medical cover | Q3 |

### Part 2: Symptoms & Condition (Steps 3-6)
| Step | File | Question | Next Step |
|------|------|----------|-----------|
| **Q3** | `Step3KnowCondition.tsx` | Do you know what condition you have? | Q4_1 (if yes) or Q4_2 (if no) |
| **Q4_1** | `Step4SymptomKnown.tsx` | Enter your main symptom (with diagnosis) | Q5 |
| **Q4_2** | `Step4SymptomDescribe.tsx` | Describe your main symptom | Q5 |
| **Q5** | `Step5SymptomStart.tsx` | When did symptoms start? | Q6 |
| **Q6** | `Step6PreviousSymptoms.tsx` | Have you had this before? | Q7 |

### Part 3: Background Details (Steps 7-8)
| Step | File | Question | Next Step |
|------|------|----------|-----------|
| **Q7** | `Step7HowHappened.tsx` | How did this happen? | Q8 |
| **Q8** | `Step8Responsibility.tsx` | Is someone legally responsible? | Q9 |

### Part 4: Referral (Steps 9-12)
| Step | File | Question | Next Step |
|------|------|----------|-----------|
| **Q9** | `Step9GPConsultation.tsx` | Have you consulted your GP? | Q10 (normal) or END_FAST_TRACK |
| **Q10** | `Step10ReferralDate.tsx` | When were you referred? | Q11 |
| **Q11** | `Step11ServiceReferral.tsx` | Which service were you referred for? | Q12 |
| **Q12** | `Step12HospitalClinic.tsx` | Which hospital/clinic? | REVIEW |

### Part 5: Review & Submit
| Step | File | Question | Next Step |
|------|------|----------|-----------|
| **REVIEW** | `StepReviewSummary.tsx` | Review all your answers | OUTCOME |
| **OUTCOME** | `StepOutcome.tsx` | Claim submitted confirmation | END |

---

## 🔀 Conditional Branching Logic

### Branch Points:

1. **Q2 → Q2_1 or Q3**
   - If `hasOtherInsurance === true` → Go to Q2_1 (insurance details)
   - If `hasOtherInsurance === false` → Skip to Q3

2. **Q3 → Q4_1 or Q4_2**
   - If `knowsCondition === true` → Go to Q4_1 (symptom with diagnosis)
   - If `knowsCondition === false` → Go to Q4_2 (describe symptom)

3. **Q9 → Q10 or END_FAST_TRACK**
   - If `gpConsultationType === 'fast_track'` → Exit to fast-track path
   - Otherwise → Continue to Q10

---

## 📊 Progress Stages (StageTrackerBar)

The 12 steps are grouped into 5 visual stages:

| Stage | Label | Steps Included |
|-------|-------|----------------|
| **1** | Claim details | Q1, Q2, Q2_1 |
| **2** | Symptoms & condition | Q3, Q4_1, Q4_2, Q5, Q6 |
| **3** | Background details | Q7, Q8 |
| **4** | Referral | Q9, Q10, Q11, Q12 |
| **5** | Review | REVIEW, OUTCOME |

---

## ⬅️ Back Navigation

### Linear Back Navigation:
- Q2 → Q1
- Q6 → Q5
- Q7 → Q6
- Q8 → Q7
- Q9 → Q8
- Q10 → Q9
- Q11 → Q10
- Q12 → Q11
- REVIEW → Q12
- OUTCOME → REVIEW

### Conditional Back Navigation:
- **Q3** → Goes back to Q2_1 (if insurance path) or Q2 (if no insurance)
- **Q5** → Goes back to Q4_1 (if knew condition) or Q4_2 (if didn't know)
- **Q2_1** → Goes back to Q2
- **Q4_1/Q4_2** → Goes back to Q3

### Special Cases:
- **Q1** → No back button (first step)
- **END_FAST_TRACK** → Goes back to Q9

---

## 📁 File Structure

```
src/
├── lib/
│   └── navigation-logic.ts         ← MAIN navigation logic (use this)
├── context/
│   ├── navigation-logic.ts         ← OLD duplicate (can be deleted)
│   └── ClaimContext.tsx
├── components/
│   ├── steps/
│   │   ├── Step1Who.tsx            → Q1
│   │   ├── Step2Insurance.tsx      → Q2
│   │   ├── Step2OtherCoverDetails.tsx → Q2_1
│   │   ├── Step3KnowCondition.tsx  → Q3
│   │   ├── Step4SymptomKnown.tsx   → Q4_1
│   │   ├── Step4SymptomDescribe.tsx → Q4_2
│   │   ├── Step5SymptomStart.tsx   → Q5
│   │   ├── Step6PreviousSymptoms.tsx → Q6
│   │   ├── Step7HowHappened.tsx    → Q7
│   │   ├── Step8Responsibility.tsx → Q8
│   │   ├── Step9GPConsultation.tsx → Q9
│   │   ├── Step10ReferralDate.tsx  → Q10
│   │   ├── Step11ServiceReferral.tsx → Q11
│   │   ├── Step12HospitalClinic.tsx → Q12
│   │   ├── StepReviewSummary.tsx   → REVIEW
│   │   └── StepOutcome.tsx         → OUTCOME
│   └── ClaimFlowManager.tsx
```

---

## ⚠️ Important Note

There's a **duplicate navigation file** at `src/context/navigation-logic.ts` that is no longer used. The canonical navigation logic is now in `src/lib/navigation-logic.ts`.

**You can safely delete:** `src/context/navigation-logic.ts`

All imports now point to the correct location:
- `ClaimContext.tsx` → imports from `../lib/navigation-logic`
- `StageTrackerBar.tsx` → imports from `../../lib/navigation-logic`

---

## 🚀 Key Functions

### In `src/lib/navigation-logic.ts`:

1. **`NAVIGATION_MAP`** - Complete step definitions
2. **`CLAIM_STAGES`** - 5 visual progress stages
3. **`getNextStep(currentStep, state)`** - Forward navigation with branching
4. **`getPreviousStep(currentStep, state)`** - Backward navigation with branching
5. **`canProceedFromStep(step, state)`** - Validation for each step
6. **`determineOutcome(state)`** - Final outcome logic

---

## ✅ Status

- ✅ All 12 main steps mapped
- ✅ Conditional branching implemented (Q2_1, Q4_1/Q4_2, fast-track)
- ✅ Back navigation handles all branches
- ✅ Progress tracker shows 5 stages
- ✅ All step IDs match component filenames
- ✅ Build verified successfully
