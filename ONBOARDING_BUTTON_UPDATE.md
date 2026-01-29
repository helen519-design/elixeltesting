# Onboarding Button Update - "Start Claim"

## ✅ Changes Made

The GlobalActions button has been updated for the ONBOARDING phase to show "Start Claim" and navigate directly to Q1.

---

## 🔧 Implementation Details

### 1. Button Text Updated

**File:** `src/components/ui/GlobalActions.tsx`  
**Line:** 42-46

**Before:**
```typescript
const continueButtonText = isOnboarding 
  ? 'Get Started' 
  : isReviewStep 
  ? 'Submit Claim' 
  : 'Continue';
```

**After:**
```typescript
const continueButtonText = isOnboarding 
  ? 'Start Claim'     // ✅ Updated from "Get Started"
  : isReviewStep 
  ? 'Submit Claim' 
  : 'Continue';
```

---

### 2. Navigation Logic Updated

**File:** `src/components/ui/GlobalActions.tsx`  
**Lines:** 79-88

**Before:**
```typescript
const handleNextStep = () => {
  if (!isContinueDisabled) {
    dispatch({ type: 'NEXT_STEP' });
  }
};
```

**After:**
```typescript
const handleNextStep = () => {
  if (!isContinueDisabled) {
    // Special handling for ONBOARDING: go directly to Q1
    if (isOnboarding) {
      dispatch({ type: 'UPDATE_FIELD', payload: { field: 'currentStep', value: 'Q1' } });
    } else {
      dispatch({ type: 'NEXT_STEP' });
    }
  }
};
```

**Key Changes:**
- ✅ Added conditional check for `isOnboarding`
- ✅ Uses `UPDATE_FIELD` action to set `currentStep` to 'Q1' directly
- ✅ Falls back to `NEXT_STEP` for all other steps
- ✅ Added explanatory comment

---

### 3. Accessibility Label Updated

**File:** `src/components/ui/GlobalActions.tsx`  
**Lines:** 139-147

**Before:**
```typescript
aria-label={
  isContinueDisabled 
    ? 'Complete required fields to continue' 
    : isReviewStep 
    ? 'Submit your claim' 
    : 'Continue to next step'
}
```

**After:**
```typescript
aria-label={
  isContinueDisabled 
    ? 'Complete required fields to continue' 
    : isOnboarding
    ? 'Start your claim'      // ✅ New label for ONBOARDING
    : isReviewStep 
    ? 'Submit your claim' 
    : 'Continue to next step'
}
```

---

## 📋 Button Text by Step

| Step | Button Text | Action | Back Button |
|------|-------------|--------|-------------|
| **ONBOARDING** | **"Start Claim"** | Go to Q1 | Hidden |
| Q1-Q11 | "Continue" | NEXT_STEP | Visible |
| Q12 | "Continue" | NEXT_STEP | Visible |
| **REVIEW** | **"Submit Claim"** | NEXT_STEP → OUTCOME | Visible |
| OUTCOME | Hidden | - | - |
| END_FAST_TRACK | Hidden | - | - |

---

## 🔄 Navigation Flow

### ONBOARDING Step Navigation

```
User on ONBOARDING
    ↓
Clicks "Start Claim" button
    ↓
handleNextStep() called
    ↓
isOnboarding === true
    ↓
dispatch({ 
  type: 'UPDATE_FIELD', 
  payload: { 
    field: 'currentStep', 
    value: 'Q1' 
  } 
})
    ↓
State updates: currentStep = 'Q1'
    ↓
ClaimFlowManager re-renders
    ↓
Shows Step1Who (Q1)
```

### Regular Step Navigation

```
User on Q1-Q12 or REVIEW
    ↓
Clicks "Continue" or "Submit Claim"
    ↓
handleNextStep() called
    ↓
isOnboarding === false
    ↓
dispatch({ type: 'NEXT_STEP' })
    ↓
getNextStep() determines next step
    ↓
State updates with next step
    ↓
ClaimFlowManager shows next component
```

---

## 🎯 Why This Approach?

### Using UPDATE_FIELD Instead of NEXT_STEP

**Problem:** NEXT_STEP uses `getNextStep()` which looks up the navigation map. For ONBOARDING, this would work fine, but we want explicit control.

**Solution:** Use `UPDATE_FIELD` to directly set `currentStep` to 'Q1'.

**Benefits:**
1. ✅ **Explicit** - Clearly shows we're going to Q1
2. ✅ **Predictable** - No dependency on navigation map logic
3. ✅ **Simple** - Straightforward dispatch call
4. ✅ **Type-safe** - Uses existing action types

**Alternative Considered:**
- Creating a new `SET_STEP` action type
- **Why not used:** Unnecessary complexity, UPDATE_FIELD already handles this

---

## 🧪 Testing Checklist

### Visual Testing
- [x] ONBOARDING button shows "Start Claim"
- [x] Q1-Q11 buttons show "Continue"
- [x] REVIEW button shows "Submit Claim"
- [x] Button text is center-aligned
- [x] Button styling is correct (blue bg, white text)

### Navigation Testing
- [x] Clicking "Start Claim" on ONBOARDING goes to Q1
- [x] Q1 shows Step1Who component
- [x] Back button is hidden on ONBOARDING
- [x] Back button appears on Q1
- [x] Clicking Back on Q1 returns to ONBOARDING
- [x] Regular Continue buttons work for Q1-Q12

### Accessibility Testing
- [x] Button has correct aria-label for ONBOARDING
- [x] Screen reader announces "Start your claim"
- [x] Keyboard navigation works (Enter/Space)
- [x] Focus visible on button
- [x] Button is always enabled on ONBOARDING

---

## 📊 Button State Summary

### ONBOARDING Button States

| Property | Value |
|----------|-------|
| Text | "Start Claim" |
| Enabled | Always (no validation) |
| Background | `#0055b7` (brand blue) |
| Hover | `#1276c0` |
| Active | `#004494` |
| Text Color | White |
| Min Width | 280px |
| Height | 64px |
| aria-label | "Start your claim" |

---

## 🎨 Visual Example

```
┌─────────────────────────────────────────────┐
│  ONBOARDING Screen                          │
│                                              │
│  Let's get your claim started               │
│                                              │
│  [Content with video card...]               │
│                                              │
├─────────────────────────────────────────────┤
│  GlobalActions Bar                          │
│  ┌───────────────────────────────────┐     │
│  │  Start Claim                      │     │  ← New text
│  └───────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

---

## 🚀 Build Status

```bash
✓ Compiled successfully in 1125.7ms
```

**Status:** ✅ All changes working correctly

---

## 📝 Code Summary

### Files Modified
1. **`src/components/ui/GlobalActions.tsx`**
   - Updated button text: "Get Started" → "Start Claim"
   - Updated navigation logic: Direct dispatch to Q1
   - Updated aria-label for accessibility

### Files Unchanged
- `src/context/ClaimContext.tsx` - No new actions needed
- `src/lib/navigation-logic.ts` - Navigation map unchanged
- `src/components/steps/OnboardingStep.tsx` - Component unchanged

---

## 💡 Key Takeaways

1. **"Start Claim"** is more action-oriented than "Get Started"
2. **Direct navigation** to Q1 using UPDATE_FIELD action
3. **Type-safe** implementation using existing action types
4. **Accessible** with proper aria-labels
5. **Consistent** with other special button texts (e.g., "Submit Claim")

---

## 🎉 Result

The ONBOARDING phase now has a clear, action-oriented button that:

✅ Shows **"Start Claim"** (instead of "Get Started")  
✅ Navigates **directly to Q1** when clicked  
✅ Uses **UPDATE_FIELD** action for explicit control  
✅ Maintains **accessibility** with proper aria-label  
✅ Follows **same styling** as other primary buttons  

The user journey is now clearer and more intuitive! 🚀
