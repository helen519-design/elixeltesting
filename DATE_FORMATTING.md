# Date Formatting Utilities

## Overview

User-friendly date formatting utilities for the Review screen and throughout the application.

---

## 📦 Functions

### 1. `formatReviewDate()`

Formats a date string to user-friendly format.

**Location:** `src/types/claim.ts`

**Signature:**
```typescript
formatReviewDate(
  dateString: string | null | undefined,
  isEstimate?: boolean
): string | null
```

**Parameters:**
- `dateString` - ISO date string (e.g., `"2026-01-28"`) or month string (e.g., `"2026-01"`)
- `isEstimate` - Optional. Set to `true` for estimated dates (shows month/year only)

**Returns:**
- Formatted date string (e.g., `"28 Jan 2026"` or `"Jan 2026"`)
- `null` if input is null/undefined

**Examples:**
```typescript
formatReviewDate("2026-01-28")        // "28 Jan 2026"
formatReviewDate("2026-01-28", false) // "28 Jan 2026"
formatReviewDate("2026-01", true)     // "Jan 2026"
formatReviewDate("2026-01")           // "Jan 2026" (auto-detected)
formatReviewDate(null)                // null
formatReviewDate(undefined)           // null
```

---

### 2. `formatDateSelection()`

Formats a `DateSelection` object from the claim state.

**Location:** `src/types/claim.ts`

**Signature:**
```typescript
formatDateSelection(
  dateSelection: DateSelection | null | undefined
): string | null
```

**Parameters:**
- `dateSelection` - DateSelection object from `state.responses`

**Returns:**
- Formatted date string
- `null` if input is null/undefined or has no valid date

**Examples:**
```typescript
// Exact date
formatDateSelection({ 
  mode: 'exact', 
  exactDate: '2026-01-28',
  isConfirmed: true,
  estimatedStartDate: null,
  approximateMonth: null
})
// Returns: "28 Jan 2026"

// Estimated date
formatDateSelection({ 
  mode: 'approximate', 
  exactDate: null,
  estimatedStartDate: '2026-01',
  isConfirmed: true,
  approximateMonth: null
})
// Returns: "Jan 2026"

// Legacy approximate month
formatDateSelection({ 
  mode: 'approximate', 
  exactDate: null,
  estimatedStartDate: null,
  approximateMonth: 'January 2026',
  isConfirmed: true
})
// Returns: "January 2026"

// No date provided
formatDateSelection(null)
// Returns: null
```

---

## 📅 Date Format Specifications

### Exact Dates

**Input Format:** ISO 8601 (`YYYY-MM-DD`)
```
"2026-01-28"
```

**Output Format:** `D MMM YYYY`
```
"28 Jan 2026"
```

**Features:**
- Day without leading zero (28, not 28)
- 3-letter month abbreviation (Jan, not January)
- Full 4-digit year (2026)

### Estimated Dates

**Input Format:** Year-Month (`YYYY-MM`)
```
"2026-01"
```

**Output Format:** `MMM YYYY`
```
"Jan 2026"
```

**Features:**
- No day shown
- 3-letter month abbreviation
- Full 4-digit year

---

## 🎨 Month Abbreviations

```typescript
const months = [
  'Jan',  // January
  'Feb',  // February
  'Mar',  // March
  'Apr',  // April
  'May',  // May
  'Jun',  // June
  'Jul',  // July
  'Aug',  // August
  'Sep',  // September
  'Oct',  // October
  'Nov',  // November
  'Dec'   // December
];
```

---

## 🔧 Usage in Review Screen

### Before (Manual Formatting)

```typescript
const getSymptomStartDate = (): string | null => {
  const startDate = responses.symptomStartDate as any;
  if (!startDate) return null;
  if (startDate.exactDate) return startDate.exactDate;
  if (startDate.estimatedStartDate) return `Approximately ${startDate.estimatedStartDate}`;
  return null;
};
```

**Output:**
- `"2026-01-28"` (not user-friendly)
- `"Approximately 2026-01"` (verbose)

### After (Using Utility)

```typescript
import { formatDateSelection } from '@/types/claim';

const getSymptomStartDate = (): string | null => {
  const startDate = responses.symptomStartDate as any;
  return formatDateSelection(startDate);
};
```

**Output:**
- `"28 Jan 2026"` ✅ User-friendly
- `"Jan 2026"` ✅ Clean estimated date

---

## 📊 Date Formatting Examples

| Input Type | Input Value | Output |
|------------|-------------|--------|
| **Exact Date** | `"2026-01-28"` | `"28 Jan 2026"` |
| **Exact Date** | `"2025-12-31"` | `"31 Dec 2025"` |
| **Exact Date** | `"2024-03-05"` | `"5 Mar 2024"` |
| **Estimated** | `"2026-01"` | `"Jan 2026"` |
| **Estimated** | `"2025-12"` | `"Dec 2025"` |
| **Legacy** | `"January 2026"` | `"January 2026"` (unchanged) |
| **Invalid** | `""` | `null` |
| **Invalid** | `null` | `null` |
| **Invalid** | `undefined` | `null` |

---

## 🛡️ Error Handling

The utilities include robust error handling:

```typescript
formatReviewDate("invalid-date")  // Returns: "invalid-date" (fallback)
formatReviewDate("2026")          // Returns: "2026" (fallback)
formatReviewDate("2026-99-99")    // Returns: "2026-99-99" (fallback)
```

**Error Strategy:**
1. Try to parse the date
2. If parsing fails, return the original string
3. Log a warning to console for debugging
4. Never throw an error (graceful degradation)

---

## 🔄 Integration Points

### Review Screen (StepReviewSummary.tsx)

```typescript
import { formatDateSelection } from '@/types/claim';

// Q5: Symptom start date
const getSymptomStartDate = (): string | null => {
  return formatDateSelection(responses.symptomStartDate as any);
};

// Q10: GP referral date
const getReferralDateValue = (): string | null => {
  return formatDateSelection(responses.referralDate as any);
};
```

### Outcome Screen (StepOutcome.tsx)

```typescript
import { formatReviewDate } from '@/types/claim';

// Display submission date
const submissionDate = formatReviewDate(new Date().toISOString().split('T')[0]);
// "28 Jan 2026"
```

### Any Component

```typescript
import { formatReviewDate, formatDateSelection } from '@/types/claim';

// Direct date formatting
const formattedDate = formatReviewDate("2026-01-28");

// DateSelection object formatting
const formattedSelection = formatDateSelection(state.symptomStartDate);
```

---

## 🧪 Testing Examples

### Manual Test Cases

```typescript
// Test exact dates
console.log(formatReviewDate("2026-01-28"));  // "28 Jan 2026" ✅
console.log(formatReviewDate("2025-12-01"));  // "1 Dec 2025" ✅
console.log(formatReviewDate("2024-07-15"));  // "15 Jul 2024" ✅

// Test estimated dates
console.log(formatReviewDate("2026-01", true));  // "Jan 2026" ✅
console.log(formatReviewDate("2025-12", true));  // "Dec 2025" ✅

// Test auto-detection
console.log(formatReviewDate("2026-01"));  // "Jan 2026" ✅ (auto-detected as estimate)

// Test edge cases
console.log(formatReviewDate(null));       // null ✅
console.log(formatReviewDate(undefined));  // null ✅
console.log(formatReviewDate(""));         // null ✅

// Test DateSelection objects
const exactDateSelection = {
  mode: 'exact',
  exactDate: '2026-01-28',
  isConfirmed: true,
  estimatedStartDate: null,
  approximateMonth: null
};
console.log(formatDateSelection(exactDateSelection));  // "28 Jan 2026" ✅

const estimatedDateSelection = {
  mode: 'approximate',
  exactDate: null,
  estimatedStartDate: '2026-01',
  isConfirmed: true,
  approximateMonth: null
};
console.log(formatDateSelection(estimatedDateSelection));  // "Jan 2026" ✅
```

---

## 🚀 Future Enhancements

Potential improvements:

1. **Localization** - Support different date formats for different locales
   ```typescript
   formatReviewDate("2026-01-28", false, "en-GB")  // "28 Jan 2026"
   formatReviewDate("2026-01-28", false, "en-US")  // "Jan 28, 2026"
   formatReviewDate("2026-01-28", false, "fr-FR")  // "28 janv. 2026"
   ```

2. **Relative Dates** - Show "Today", "Yesterday", etc. for recent dates
   ```typescript
   formatReviewDate("2026-01-28", false, { relative: true })  // "Today"
   ```

3. **Custom Formats** - Allow format string parameter
   ```typescript
   formatReviewDate("2026-01-28", false, { format: "DD/MM/YYYY" })  // "28/01/2026"
   ```

4. **Time Support** - Handle timestamps
   ```typescript
   formatReviewDate("2026-01-28T14:30:00Z")  // "28 Jan 2026 at 2:30 PM"
   ```

---

## ✅ Summary

| Feature | Status |
|---------|--------|
| Exact date formatting | ✅ `"28 Jan 2026"` |
| Estimated date formatting | ✅ `"Jan 2026"` |
| DateSelection helper | ✅ Auto-detects exact/estimate |
| Error handling | ✅ Graceful fallback |
| Review screen integration | ✅ Q5 and Q10 dates |
| TypeScript support | ✅ Full type safety |
| Build status | ✅ Compiles successfully |

All date formatting utilities are production-ready and integrated into the review screen!
