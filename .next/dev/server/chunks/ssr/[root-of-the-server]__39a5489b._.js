module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/navigation-logic.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Navigation Logic for 12-Step Claim Flow
 * 
 * Full Flow Structure:
 * Part 1 - Claim Details (Steps 1-2)
 *   Q1: Step1Who.tsx - Who is the claim for?
 *   Q2: Step2Insurance.tsx - Other medical insurance?
 *   Q2_1: Step2OtherCoverDetails.tsx - Insurance details (conditional)
 * 
 * Part 2 - Symptoms & Condition (Steps 3-6)
 *   Q3: Step3KnowCondition.tsx - Know your condition?
 *   Q4_1: Step4SymptomKnown.tsx - Symptom with diagnosis (conditional)
 *   Q4_2: Step4SymptomDescribe.tsx - Describe symptom (conditional)
 *   Q5: Step5SymptomStart.tsx - When did symptoms start?
 *   Q6: Step6PreviousSymptoms.tsx - Previous symptoms?
 * 
 * Part 3 - Background Details (Steps 7-8)
 *   Q7: Step7HowHappened.tsx - How did this happen?
 *   Q8: Step8Responsibility.tsx - Legal responsibility?
 * 
 * Part 4 - Referral (Steps 9-12)
 *   Q9: Step9GPConsultation.tsx - GP consultation?
 *   Q10: Step10ReferralDate.tsx - Referral date
 *   Q11: Step11ServiceReferral.tsx - Service type
 *   Q12: Step12HospitalClinic.tsx - Hospital/clinic details
 * 
 * Part 5 - Review & Submit
 *   REVIEW: StepReviewSummary.tsx - Review all answers
 *   OUTCOME: StepOutcome.tsx - Submission confirmation
 */ __turbopack_context__.s([
    "CLAIM_STAGES",
    ()=>CLAIM_STAGES,
    "NAVIGATION_MAP",
    ()=>NAVIGATION_MAP,
    "canProceedFromStep",
    ()=>canProceedFromStep,
    "determineOutcome",
    ()=>determineOutcome,
    "getNextStep",
    ()=>getNextStep,
    "getPreviousStep",
    ()=>getPreviousStep
]);
const CLAIM_STAGES = [
    {
        id: 'DETAILS',
        label: 'Claim details',
        steps: [
            'Q1',
            'Q2'
        ]
    },
    {
        id: 'SYMPTOMS',
        label: 'Symptoms & condition',
        steps: [
            'Q3',
            'Q4_1',
            'Q4_2',
            'Q5',
            'Q6'
        ]
    },
    {
        id: 'BACKGROUND',
        label: 'Background details',
        steps: [
            'Q7',
            'Q8'
        ]
    },
    {
        id: 'REFERRAL',
        label: 'Referral',
        steps: [
            'Q9',
            'Q10',
            'Q11',
            'Q12'
        ]
    },
    {
        id: 'REVIEW',
        label: 'Review',
        steps: [
            'REVIEW',
            'OUTCOME'
        ]
    }
];
const NAVIGATION_MAP = {
    // ========================================
    // CLAIM TYPE SELECTION
    // ========================================
    CLAIM_TYPE: {
        step: 'CLAIM_TYPE',
        label: 'Select claim type',
        component: 'ClaimTypeStep.tsx',
        nextStep: 'ONBOARDING'
    },
    // ========================================
    // ONBOARDING
    // ========================================
    ONBOARDING: {
        step: 'ONBOARDING',
        label: 'Welcome to your new claim',
        component: 'OnboardingStep.tsx',
        nextStep: 'Q1'
    },
    // ========================================
    // PART 1: CLAIM DETAILS (Steps 1-2)
    // ========================================
    Q1: {
        step: 'Q1',
        label: 'Who do you want to claim for?',
        component: 'Step1Who.tsx',
        nextStep: 'Q2'
    },
    Q2: {
        step: 'Q2',
        label: 'Do you have other medical insurance?',
        component: 'Step2Insurance.tsx',
        // Form is inline in Q2, goes directly to Q3
        nextStep: 'Q3'
    },
    // Q2_1 removed - insurance details form is now inline in Q2
    // ========================================
    // PART 2: SYMPTOMS & CONDITION (Steps 3-6)
    // ========================================
    Q3: {
        step: 'Q3',
        label: 'Do you know what condition you have?',
        component: 'Step3KnowCondition.tsx',
        nextStep: (state)=>{
            return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
        }
    },
    Q4_1: {
        step: 'Q4_1',
        label: 'Please enter your main symptom based on your diagnosis',
        component: 'Step4SymptomKnown.tsx',
        nextStep: 'Q5'
    },
    Q4_2: {
        step: 'Q4_2',
        label: 'How would you describe your main symptom?',
        component: 'Step4SymptomDescribe.tsx',
        nextStep: 'Q5'
    },
    Q5: {
        step: 'Q5',
        label: 'When did you first start feeling unwell or notice this symptom?',
        component: 'Step5SymptomStart.tsx',
        nextStep: 'Q6'
    },
    Q6: {
        step: 'Q6',
        label: 'Have you ever dealt with this, or very similar symptoms in the past?',
        component: 'Step6PreviousSymptoms.tsx',
        nextStep: 'Q7'
    },
    // ========================================
    // PART 3: BACKGROUND DETAILS (Steps 7-8)
    // ========================================
    Q7: {
        step: 'Q7',
        label: 'How did this happen?',
        component: 'Step7HowHappened.tsx',
        nextStep: (state)=>{
            // If user selected 'sporting' (Yes - one of these applies), go to END_MAJOR_INCIDENT
            if (state.injuryDetails?.type === 'sporting') return 'END_MAJOR_INCIDENT';
            // Otherwise continue to Q8
            return 'Q8';
        }
    },
    Q8: {
        step: 'Q8',
        label: 'Is another person or company legally responsible for this condition?',
        component: 'Step8Responsibility.tsx',
        nextStep: 'Q9'
    },
    // ========================================
    // PART 4: REFERRAL (Steps 9-12)
    // ========================================
    Q9: {
        step: 'Q9',
        label: 'Who have you been referred by?',
        component: 'Step9GPConsultation.tsx',
        nextStep: (state)=>{
            // Fast-track path exits early
            if (state.gpConsultationType === 'fast_track') return 'END_FAST_TRACK';
            // Self-referral and Other skip Q10 (referral date)
            if (state.gpConsultationType === 'self_referral' || state.gpConsultationType === 'other') return 'Q11';
            // NHS GP and Private GP go to Q10
            return 'Q10';
        }
    },
    Q10: {
        step: 'Q10',
        label: 'When were you referred by your GP?',
        component: 'Step10ReferralDate.tsx',
        nextStep: 'Q11'
    },
    Q11: {
        step: 'Q11',
        label: 'What kind of service are you referred to?',
        component: 'Step11ServiceReferral.tsx',
        nextStep: 'Q12'
    },
    Q12: {
        step: 'Q12',
        label: 'Which hospital or clinic will you be attending?',
        component: 'Step12HospitalClinic.tsx',
        nextStep: 'REVIEW'
    },
    // ========================================
    // PART 5: REVIEW & SUBMIT
    // ========================================
    REVIEW: {
        step: 'REVIEW',
        label: 'Review all your answers',
        component: 'StepReviewSummary.tsx',
        nextStep: 'OUTCOME'
    },
    OUTCOME: {
        step: 'OUTCOME',
        label: 'Claim submitted',
        component: 'StepOutcome.tsx',
        nextStep: 'END'
    },
    // ========================================
    // SPECIAL EXITS
    // ========================================
    END_FAST_TRACK: {
        step: 'END_FAST_TRACK',
        label: 'Fast-track consultation',
        component: 'FastTrackEndStep.tsx',
        nextStep: 'END'
    },
    END_MAJOR_INCIDENT: {
        step: 'END_MAJOR_INCIDENT',
        label: 'Major incident - call required',
        component: 'MajorIncidentEndStep.tsx',
        nextStep: 'END'
    }
};
const getNextStep = (currentStep, state)=>{
    const rule = NAVIGATION_MAP[currentStep];
    if (!rule) {
        console.warn(`No navigation rule found for step: ${currentStep}`);
        return 'END';
    }
    // Handle conditional navigation (function-based)
    if (typeof rule.nextStep === 'function') {
        return rule.nextStep(state);
    }
    // Handle static navigation (string-based)
    return rule.nextStep;
};
const getPreviousStep = (currentStep, state)=>{
    // ========================================
    // CONDITIONAL BRANCH RETURNS
    // ========================================
    // After Q2, go back to Q2
    if (currentStep === 'Q3') {
        return 'Q2';
    }
    // After Q4_1 or Q4_2, go back based on which path was taken
    if (currentStep === 'Q5') {
        return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
    }
    // ========================================
    // LINEAR NAVIGATION RETURNS
    // ========================================
    // Claim type and onboarding
    if (currentStep === 'ONBOARDING') return 'CLAIM_TYPE';
    if (currentStep === 'Q1') return 'ONBOARDING';
    // Part 1: Claim Details
    if (currentStep === 'Q2') return 'Q1';
    // Part 2: Symptoms & Condition
    if (currentStep === 'Q4_1') return 'Q3';
    if (currentStep === 'Q4_2') return 'Q3';
    if (currentStep === 'Q6') return 'Q5';
    // Part 3: Background Details
    if (currentStep === 'Q7') return 'Q6';
    if (currentStep === 'Q8') return 'Q7';
    // Part 4: Referral
    if (currentStep === 'Q9') return 'Q8';
    if (currentStep === 'Q10') return 'Q9';
    // Q11 goes back to Q9 if self-referral or other (Q10 was skipped), otherwise Q10
    if (currentStep === 'Q11') {
        return state.gpConsultationType === 'self_referral' || state.gpConsultationType === 'other' ? 'Q9' : 'Q10';
    }
    if (currentStep === 'Q12') return 'Q11';
    // Part 5: Review & Submit
    if (currentStep === 'REVIEW') return 'Q12';
    if (currentStep === 'OUTCOME') return 'REVIEW';
    // Special exits
    if (currentStep === 'END_FAST_TRACK') return 'Q9';
    // ========================================
    // FALLBACK: No previous step (at start)
    // ========================================
    if (currentStep === 'ONBOARDING') return null;
    // Unknown step - warn and return null
    console.warn(`getPreviousStep: Unknown step "${currentStep}"`);
    return null;
};
const determineOutcome = (state)=>{
    const hasSpecialistName = state.specialistDetails?.name && state.specialistDetails.name.trim() !== '';
    const hasHospitalClinic = state.hospitalClinic && state.hospitalClinic.trim() !== '';
    if (!hasSpecialistName && !hasHospitalClinic) {
        return 'awaiting_provider';
    }
    return 'awaiting_form';
};
const canProceedFromStep = (step, state)=>{
    switch(step){
        case 'CLAIM_TYPE':
            // Check if a claim type has been selected
            return !!state.claimType;
        case 'ONBOARDING':
            // Onboarding is informational only, always can proceed
            return true;
        case 'Q1':
            // Check for claimant selection
            return !!state.claimant;
        case 'Q2':
            // If user has other insurance, check if all form fields are filled
            if (state.hasOtherInsurance === true) {
                return !!(state.otherMedicalCover && state.otherMedicalCover.subscriberType && state.otherMedicalCover.policyType && state.otherMedicalCover.insurerName && state.otherMedicalCover.policyNumber && state.otherMedicalCover.hasAdvisedInsurer !== null && state.otherMedicalCover.hasAdvisedInsurer !== undefined);
            }
            // If user doesn't have other insurance, just need the answer
            return state.hasOtherInsurance === false;
        case 'Q3':
            return state.knowsCondition !== null && state.knowsCondition !== undefined;
        case 'Q4_1':
        case 'Q4_2':
            // Q4 steps only require SNOMED code selection and confirmation
            // bodySide is not collected in these steps
            return !!(state.symptom?.snomedCode && state.symptom?.isConfirmed);
        case 'Q5':
            // Q5 requires a symptom start date
            const symptomDate = state.symptomStartDate;
            return !!(symptomDate && symptomDate.exactDate && symptomDate.isConfirmed);
        case 'Q6':
            // Q6 asks Yes/No - if Yes, user must also provide a previous symptom date
            const hasPreviousSymptoms = state.hasPreviousSymptoms;
            if (hasPreviousSymptoms === undefined || hasPreviousSymptoms === null) {
                return false;
            }
            // If No, that's sufficient
            if (hasPreviousSymptoms === false) {
                return true;
            }
            // If Yes, they must also provide a date
            const previousSymptomDate = state.previousSymptomDate;
            return !!(previousSymptomDate && previousSymptomDate.date && previousSymptomDate.isConfirmed);
        case 'Q7':
            // Q7 now just requires Yes/No selection (sporting = Yes, other = No)
            // #region agent log
            console.log('[DEBUG-H5] Q7 validation check:', {
                stateHasInjuryDetails: !!state.injuryDetails,
                injuryDetailsValue: state.injuryDetails,
                responsesHasInjuryDetails: !!state.responses?.injuryDetails,
                responsesInjuryDetailsValue: state.responses?.injuryDetails,
                fullState: state
            });
            // #endregion
            const injury = state.injuryDetails;
            const result = !!injury?.type;
            // #region agent log
            console.log('[DEBUG-H5] Q7 validation result:', {
                injury,
                injuryType: injury?.type,
                result
            });
            // #endregion
            return result;
        case 'Q8':
            if (state.hasLegalResponsibility === false) {
                return true;
            }
            return !!(state.hasLegalResponsibility === true && state.solicitorDetails && state.solicitorDetails.dateOfIncident && state.solicitorDetails.solicitorName && state.solicitorDetails.caseHandler && state.solicitorDetails.solicitorAddress && state.solicitorDetails.caseReference && state.solicitorDetails.solicitorPhone && state.solicitorDetails.solicitorEmail);
        case 'Q9':
            return state.gpConsultationType !== null && state.gpConsultationType !== undefined;
        case 'Q10':
            // Q10 requires a referral date
            return !!state.referralDate?.exactDate;
        case 'Q11':
            // Service type is required, specialist name is optional
            return state.referralServiceType !== null && state.referralServiceType !== undefined;
        case 'Q12':
            return true; // Hospital/clinic is optional
        case 'REVIEW':
            return true;
        default:
            return true;
    }
};
}),
"[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClaimProvider",
    ()=>ClaimProvider,
    "useClaim",
    ()=>useClaim
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/navigation-logic.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
// 1. Initial State
const initialState = {
    currentStep: 'CLAIM_TYPE',
    responses: {},
    history: [],
    lastSaveTime: 0
};
// 2. Reducer Logic
function claimReducer(state, action) {
    switch(action.type){
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
                responses: {
                    ...state.responses,
                    [action.payload.field]: action.payload.value
                },
                // Also set as direct property for easy access
                [action.payload.field]: action.payload.value,
                lastSaveTime: Date.now()
            };
            // #region agent log
            console.log('[DEBUG-H3] UPDATE_FIELD after:', {
                field: action.payload.field,
                newResponses: newState.responses,
                hasDirectField: !!newState[action.payload.field],
                directFieldValue: newState[action.payload.field],
                fullNewState: newState
            });
            // #endregion
            return newState;
        case 'NEXT_STEP':
            {
                const nextStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextStep"])(state.currentStep, state);
                return {
                    ...state,
                    history: [
                        ...state.history,
                        state.currentStep
                    ],
                    currentStep: nextStep
                };
            }
        case 'PREVIOUS_STEP':
            return {
                ...state,
                currentStep: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPreviousStep"])(state.currentStep, state) ?? state.currentStep,
                history: state.history.slice(0, -1)
            };
        default:
            return state;
    }
}
const ClaimContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ClaimProvider = ({ children })=>{
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(claimReducer, initialState);
    // Helper functions
    const goToNextStep = ()=>{
        dispatch({
            type: 'NEXT_STEP'
        });
    };
    const goToPreviousStep = ()=>{
        dispatch({
            type: 'PREVIOUS_STEP'
        });
    };
    const canProceed = ()=>{
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
                stateHasInjuryDetails: !!state.injuryDetails,
                responsesHasInjuryDetails: !!state.responses.injuryDetails,
                injuryDetailsValue: state.injuryDetails,
                responsesInjuryDetails: state.responses.injuryDetails,
                fullState: state
            });
            // #endregion
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canProceedFromStep"])(state.currentStep, state);
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
    const contextValue = {
        state,
        dispatch,
        goToNextStep,
        goToPreviousStep,
        canProceed
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ClaimContext.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useClaim = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ClaimContext);
    if (!context) {
        throw new Error('useClaim must be used within a ClaimProvider');
    }
    return context;
};
}),
"[project]/src/components/ui/TopBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopBar",
    ()=>TopBar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const TopBar = ()=>{
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const handleExit = ()=>{
        // Navigate to navigation overview page
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'currentStep',
                value: 'NAVIGATION_OVERVIEW'
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between w-full h-[56px] m-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-[12px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#0055b7] flex items-center justify-center h-[64px] px-[10px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/assets/wpaLogo.svg",
                            alt: "WPA Logo",
                            className: "w-[65px] h-[48px]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/TopBar.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[48px] w-px bg-[#d2d3d6]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[18px] font-normal leading-normal text-[#4d4f5c]",
                            children: "New Claim"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/TopBar.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/TopBar.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleExit,
                className: "flex items-center justify-center gap-[2px] h-[48px] px-[24px] py-[16px] bg-white border-[1px] border-solid border-[#0055b7] rounded-[8px] text-[16px] font-semibold text-[#0055b7] leading-[28px] tracking-[0.1px] hover:bg-gray-50 transition",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-[20px] h-[20px]",
                        viewBox: "0 0 20 20",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M7.5 15L12.5 10L7.5 5",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/TopBar.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Exit"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/TopBar.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/TopBar.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = TopBar;
}),
"[project]/src/components/ui/StageTrackerBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StageTrackerBar",
    ()=>StageTrackerBar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/navigation-logic.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const StageTrackerBar = ()=>{
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const activeIndex = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].findIndex((stage)=>stage.steps.includes(state.currentStep));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Claim progress",
        className: "w-screen relative left-1/2 right-1/2 -mx-[50vw] px-12 pt-10 pb-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start w-full",
            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].map((stage, index)=>{
                const isActive = index === activeIndex;
                const isCompleted = activeIndex > index;
                const isDotActive = isActive || isCompleted;
                const isLeftLineActive = activeIndex >= index; // Line TO this stage is blue if reached
                const isRightLineActive = activeIndex > index; // Line FROM this stage is blue if completed
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `h-[2.5px] flex-1 -mr-[2px] transition-colors ${index === 0 ? 'bg-transparent' : isLeftLineActive ? 'bg-[#1276c0]' : 'bg-[#d2d3d6]'}`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                                    lineNumber: 50,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-[14px] h-[14px] rounded-full shrink-0 transition-colors relative z-10 ${isDotActive ? 'bg-[#1276c0]' : 'bg-[#d2d3d6]'}`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                                    lineNumber: 61,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `h-[2.5px] flex-1 -ml-[2px] transition-colors ${index === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].length - 1 ? 'bg-transparent' : isRightLineActive ? 'bg-[#1276c0]' : 'bg-[#d2d3d6]'}`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                                    lineNumber: 68,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                            lineNumber: 48,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mt-[10px] text-[14px] leading-[24px] font-medium text-[#4d4f5c] text-center w-full px-2",
                            children: stage.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                            lineNumber: 80,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, stage.id, true, {
                    fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                    lineNumber: 43,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0));
            })
        }, void 0, false, {
            fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = StageTrackerBar;
}),
"[project]/src/components/ui/GlobalActions.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalActions",
    ()=>GlobalActions,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const GlobalActions = ()=>{
    const { state, dispatch, canProceed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    // Hide GlobalActions on claim type, onboarding, navigation overview and final success/outcome screens
    if (state.currentStep === 'CLAIM_TYPE' || state.currentStep === 'ONBOARDING' || state.currentStep === 'OUTCOME' || state.currentStep === 'END_FAST_TRACK' || state.currentStep === 'END_MAJOR_INCIDENT' || state.currentStep === 'NAVIGATION_OVERVIEW') {
        return null;
    }
    // Determine current step state
    const isOnboarding = state.currentStep === 'ONBOARDING';
    const isFirstStep = state.currentStep === 'Q1' || isOnboarding;
    const isReviewStep = state.currentStep === 'REVIEW';
    // Button text changes based on step
    const continueButtonText = isOnboarding ? 'Start Claim' : isReviewStep ? 'Submit Claim' : 'Continue';
    /**
   * Step Validation
   * Uses canProceed() from context which internally calls canProceedFromStep()
   * 
   * Required steps (Q1-Q10):
   * - Q1: Claimant selection
   * - Q2: Insurance question
   * - Q2_1: Insurance details (if Q2 = Yes)
   * - Q3: Know condition question
   * - Q4_1/Q4_2: Symptom details
   * - Q5: Symptom start date
   * - Q6: Previous symptoms question
   * - Q7: How it happened
   * - Q8: Legal responsibility
   * - Q9: GP consultation
   * - Q10: Referral date
   * 
   * Optional steps:
   * - Q11: Service type required, specialist name optional
   * - Q12: Hospital/clinic optional
   * - REVIEW: Always can proceed
   * - OUTCOME: Always can proceed
   */ const isContinueDisabled = !canProceed();
    const handlePreviousStep = ()=>{
        if (!isFirstStep) {
            dispatch({
                type: 'PREVIOUS_STEP'
            });
        }
    };
    const handleNextStep = ()=>{
        if (!isContinueDisabled) {
            // Use NEXT_STEP for all steps (including ONBOARDING)
            // The navigation map correctly defines ONBOARDING → Q1
            dispatch({
                type: 'NEXT_STEP'
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-[#F9FAFB]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-4xl px-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 gap-[16px] items-center min-h-px min-w-px relative py-[24px]",
                children: [
                    !isFirstStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handlePreviousStep,
                        className: "bg-white border-[#0055b7] border-[1px] border-solid flex gap-0 h-[64px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0 transition hover:bg-gray-50 active:bg-gray-100",
                        "aria-label": "Go back to previous step",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-[2px] items-center justify-center relative shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-clip relative shrink-0 w-[20px] h-[20px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-full h-full",
                                    viewBox: "0 0 20 20",
                                    fill: "none",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12.5 15L7.5 10L12.5 5",
                                        stroke: "#0055b7",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/GlobalActions.tsx",
                                        lineNumber: 113,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/GlobalActions.tsx",
                                    lineNumber: 107,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/GlobalActions.tsx",
                                lineNumber: 105,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/GlobalActions.tsx",
                            lineNumber: 104,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/GlobalActions.tsx",
                        lineNumber: 98,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleNextStep,
                        disabled: isContinueDisabled,
                        className: `flex gap-0 h-[64px] items-center justify-center min-w-[280px] px-[24px] py-[16px] relative rounded-[8px] shrink-0 transition-all duration-200 ${isContinueDisabled ? 'bg-[#d2d3d6] text-[#949494] cursor-not-allowed opacity-60' : 'bg-[#0055b7] text-white hover:bg-[#1276c0] active:bg-[#004494] opacity-100'}`,
                        "aria-label": isContinueDisabled ? 'Complete required fields to continue' : isOnboarding ? 'Start your claim' : isReviewStep ? 'Submit your claim' : 'Continue to next step',
                        "aria-disabled": isContinueDisabled,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-[2px] items-center justify-center relative shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center tracking-[0.1px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "leading-[28px]",
                                    children: continueButtonText
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/GlobalActions.tsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/GlobalActions.tsx",
                                lineNumber: 153,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/GlobalActions.tsx",
                            lineNumber: 152,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/GlobalActions.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/GlobalActions.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/ui/GlobalActions.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/GlobalActions.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = GlobalActions;
}),
"[project]/src/components/ui/AutoSaveIndicator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AutoSaveIndicator",
    ()=>AutoSaveIndicator,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const AutoSaveIndicator = ({ show })=>{
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('hidden');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (show) {
            setStatus('saving');
            // After 500ms, switch to "saved"
            const timer = setTimeout(()=>{
                setStatus('saved');
                // After another 2s, hide
                setTimeout(()=>{
                    setStatus('hidden');
                }, 2000);
            }, 500);
            return ()=>clearTimeout(timer);
        }
    }, [
        show
    ]);
    if (status === 'hidden') return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-[120px] right-8 z-50 flex items-center gap-2 bg-white border border-[#d2d3d6] rounded-lg px-4 py-2 shadow-lg transition-all duration-300",
        children: status === 'saving' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "animate-spin h-4 w-4 text-[#0055b7]",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/AutoSaveIndicator.tsx",
                            lineNumber: 49,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/AutoSaveIndicator.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/AutoSaveIndicator.tsx",
                    lineNumber: 43,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-medium text-[#4d4f5c]",
                    children: "Saving..."
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/AutoSaveIndicator.tsx",
                    lineNumber: 63,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "h-4 w-4 text-green-600",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M5 13l4 4L19 7"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/AutoSaveIndicator.tsx",
                        lineNumber: 74,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/AutoSaveIndicator.tsx",
                    lineNumber: 68,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-medium text-green-600",
                    children: "Saved"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/AutoSaveIndicator.tsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/AutoSaveIndicator.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AutoSaveIndicator;
}),
"[project]/src/components/AppShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/TopBar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StageTrackerBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/StageTrackerBar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$GlobalActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/GlobalActions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AutoSaveIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/AutoSaveIndicator.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
/**
 * AppShell
 * 
 * Main application layout with:
 * - Fixed TopBar + StageTrackerBar at the top (hidden on ONBOARDING)
 * - Scrollable main content area in the middle
 * - Fixed GlobalActions (Back/Continue) at the bottom
 * 
 * Uses Flexbox layout for proper positioning and scrolling behavior.
 */ const AppShellContent = ({ children })=>{
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const [showSaveIndicator, setShowSaveIndicator] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isClaimType = state.currentStep === 'CLAIM_TYPE';
    const isOnboarding = state.currentStep === 'ONBOARDING';
    const isEndScreen = state.currentStep === 'OUTCOME' || state.currentStep === 'END_FAST_TRACK' || state.currentStep === 'END_MAJOR_INCIDENT' || state.currentStep === 'NAVIGATION_OVERVIEW';
    // Watch for changes in lastSaveTime to trigger the save indicator
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (state.lastSaveTime > 0) {
            setShowSaveIndicator(true);
            // Reset after showing
            const timer = setTimeout(()=>setShowSaveIndicator(false), 3000);
            return ()=>clearTimeout(timer);
        }
    }, [
        state.lastSaveTime
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#F9FAFB] text-gray-700 flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AutoSaveIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoSaveIndicator"], {
                show: showSaveIndicator
            }, void 0, false, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            !isClaimType && !isEndScreen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "fixed inset-x-0 top-0 z-50 bg-white border-b border-[#d2d3d6]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-[1440px] px-[30px] py-[12px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                                fileName: "[project]/src/components/AppShell.tsx",
                                lineNumber: 51,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppShell.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[88px] flex-shrink-0",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: [
                    !isClaimType && !isOnboarding && !isEndScreen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#fafbfb]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-4xl px-6 py-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StageTrackerBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StageTrackerBar"], {}, void 0, false, {
                                fileName: "[project]/src/components/AppShell.tsx",
                                lineNumber: 66,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppShell.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: `w-full ${isClaimType || isOnboarding || isEndScreen ? '' : 'mx-auto max-w-4xl px-6 py-8'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedStepContainer, {
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppShell.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$GlobalActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlobalActions"], {}, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const AppShell = ({ children })=>{
    // Don't create a new ClaimProvider here - use the one from page.tsx
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppShellContent, {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 85,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const AnimatedStepContainer = ({ children })=>{
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        initial: false,
        mode: "wait",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                x: 32,
                opacity: 0
            },
            animate: {
                x: 0,
                opacity: 1
            },
            exit: {
                x: -32,
                opacity: 0
            },
            transition: {
                duration: 0.25,
                ease: 'easeOut'
            },
            className: "h-full",
            children: children
        }, state.currentStep, false, {
            fileName: "[project]/src/components/AppShell.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AppShell;
}),
"[project]/src/components/steps/ClaimTypeStep.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClaimTypeStep",
    ()=>ClaimTypeStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/TopBar.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const claimCards = [
    {
        id: 'newMedical',
        title: 'New Medical Condition',
        icon: '/icons/newMedicalClaim.svg',
        section: 'specialized',
        description: [
            'Have a new condition or symptoms',
            'Need to see a therapist or specialist',
            'Need a scan or test',
            'Need a medical procedure or treatment'
        ]
    },
    {
        id: 'routineHealthcare',
        title: 'Routine Healthcare',
        icon: '/icons/routineHealthCare.svg',
        section: 'routine',
        description: [
            'Sight tests, prescribed glasses or contact lenses',
            'Dentist charges',
            'Therapy',
            'Specialist consultations & tests',
            'GP charges',
            'NHS attendance, stays or car parking'
        ]
    },
    {
        id: 'fastTrackPhysio',
        title: 'Fast Track Physiotherapy',
        icon: '/icons/fastTrackPhysio.svg',
        section: 'fastTrack',
        description: [
            'Backache',
            'Joint pain',
            'Sporting injuries',
            'Aches and pains in joint of muscles'
        ]
    },
    {
        id: 'fastTrackSkin',
        title: 'Fast Track Skin Support',
        icon: '/icons/fastTrackSkin.svg',
        section: 'fastTrack',
        description: [
            'A mole',
            'A skin lesion',
            'Other common skin conditions such as acne, eczema, rosacea and more'
        ]
    }
];
const ClaimTypeStep = ()=>{
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const [selectedCard, setSelectedCard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSelectCard = (cardId)=>{
        setSelectedCard(cardId);
        // Store the selected claim type
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'claimType',
                value: cardId
            }
        });
    };
    const handleContinue = ()=>{
        if (selectedCard) {
            dispatch({
                type: 'NEXT_STEP'
            });
        }
    };
    const fastTrackCards = claimCards.filter((card)=>card.section === 'fastTrack');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-[#fafafb] min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white border-b border-[#d2d3d6] w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-[1440px] px-[30px] py-[12px]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-[1200px] mx-auto px-[120px] py-[48px] flex flex-col gap-[48px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[24px] px-[24px] max-w-[696px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-[16px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "font-semibold text-[24px] leading-[normal] text-[#4d4f5c]",
                                    children: "What kind of claim do you want to start?"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-normal text-[16px] leading-[24px] text-[#2e2f37]",
                                    children: "We provide different support to meet your needs. Let us know what kind of care you're seeking, and we'll do our best to assist you."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-[24px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-[24px] items-stretch",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex flex-col gap-[24px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-normal text-[20px] leading-[normal] text-[#2e2f37]",
                                            children: "Need specialised care"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                            lineNumber: 122,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimCardComponent, {
                                            card: claimCards[0],
                                            isSelected: selectedCard === claimCards[0].id,
                                            onSelect: handleSelectCard,
                                            descriptionPrefix: "This option is for you if you:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                            lineNumber: 125,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex flex-col gap-[24px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-normal text-[20px] leading-[normal] text-[#2e2f37]",
                                            children: "Regular check-ups or care"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                            lineNumber: 135,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimCardComponent, {
                                            card: claimCards[1],
                                            isSelected: selectedCard === claimCards[1].id,
                                            onSelect: handleSelectCard,
                                            descriptionPrefix: "Cash backs for regular medical costs such as:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                            lineNumber: 138,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-[8px] bg-gradient-to-r from-[#cce9fb] to-[#cce9fb] py-[24px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-[24px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-[24px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-normal text-[20px] leading-[normal] text-[#0e5e9a]",
                                        children: "Fast track services for quick support"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-[24px] flex gap-[24px] items-stretch",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimCardComponent, {
                                            card: fastTrackCards[0],
                                            isSelected: selectedCard === fastTrackCards[0].id,
                                            onSelect: handleSelectCard,
                                            descriptionPrefix: "Quick physiotherapy appointment and support for symptoms such as:",
                                            isFastTrack: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                            lineNumber: 157,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimCardComponent, {
                                            card: fastTrackCards[1],
                                            isSelected: selectedCard === fastTrackCards[1].id,
                                            onSelect: handleSelectCard,
                                            descriptionPrefix: "Quick care and support for skin issues such as:",
                                            isFastTrack: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                            lineNumber: 164,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-[24px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleContinue,
                            disabled: !selectedCard,
                            className: `h-[60px] w-[309px] px-[24px] py-[12px] rounded-[6px] flex items-center justify-center transition-colors ${selectedCard ? 'bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] cursor-pointer' : 'bg-[#c7c9ce] cursor-not-allowed'}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `font-semibold text-[16px] leading-[20px] tracking-[0.1px] ${selectedCard ? 'text-white' : 'text-[#4d4f5c]'}`,
                                children: "Continue"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const ClaimCardComponent = ({ card, isSelected, onSelect, descriptionPrefix, isFastTrack = false })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full flex-1 h-[360px] flex flex-col gap-[16px] p-[24px] rounded-[6px] border transition-all ${isSelected ? 'bg-[#F5FBFF] border-[2px] border-[#0055b7]' : isFastTrack ? 'bg-white border-[1px] border-[#4191cd]' : 'bg-white border-[1px] border-[#d2d3d6]'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-[24px] items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[56px] h-[56px] bg-[#cce9fb] rounded-[8px] flex items-center justify-center shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: card.icon,
                                    alt: card.title,
                                    width: 48,
                                    height: 48
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                    lineNumber: 229,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium text-[18px] leading-[1.4] text-[#1e1e1e] text-left",
                                children: card.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: isSelected,
                        className: `h-[48px] w-[144px] px-[24px] py-[12px] rounded-[6px] border-[1.5px] flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#F5FBFF] border-[#0055b7] cursor-not-allowed opacity-70' : 'bg-white border-[#0055b7]'}`,
                        onClick: (e)=>{
                            e.stopPropagation();
                            if (!isSelected) {
                                onSelect(card.id);
                            }
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-[16px] leading-[20px] text-[#0055b7] tracking-[0.1px]",
                            children: "Select"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                            lineNumber: 257,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-[#d7d8dc] pt-[16px] w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `font-normal text-[16px] leading-[24px] mb-[8px] ${isFastTrack ? 'text-[#8a8c95]' : 'text-[#757575]'}`,
                            children: descriptionPrefix
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                            lineNumber: 266,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "list-disc pl-[24px] space-y-[4px]",
                            children: card.description.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: `font-normal text-[16px] leading-[24px] ${isFastTrack ? 'text-[#8a8c95]' : 'text-[#757575]'}`,
                                    children: item
                                }, index, false, {
                                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                                    lineNumber: 273,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                    lineNumber: 265,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/ClaimTypeStep.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/steps/OnboardingStep.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnboardingStep",
    ()=>OnboardingStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
const OnboardingStep = ()=>{
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const handleStartClaim = ()=>{
        dispatch({
            type: 'NEXT_STEP'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-[1440px] mx-auto px-24 py-12 flex gap-24 items-start",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-12 max-w-[720px] min-w-[360px] w-[600px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[36px] leading-[48px] font-semibold text-[#4d4f5c]",
                                children: "Let's get your claim started"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 26,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[16px] leading-[24px] text-[#2e2f37]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-0",
                                        children: "We've designed this process to be as simple as possible."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 31,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-0",
                                        children: [
                                            "It usually takes about ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold",
                                                children: "5–10 minutes"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                lineNumber: 35,
                                                columnNumber: 38
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " to complete. To make things even easier, we recommend getting some of these information ready:"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 34,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-[15px] h-[15px]",
                                            viewBox: "0 0 15 15",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 51,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.625 1.875V13.125M8.625 2.8125V12.1875",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 59,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 45,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 44,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[16px] leading-[20px] font-medium text-[#4d4f5c]",
                                        children: "When you first experienced symptom"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-[15px] h-[15px]",
                                            viewBox: "0 0 15 15",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.625 1.875V13.125M8.625 2.8125V12.1875",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 90,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[16px] leading-[20px] font-medium text-[#4d4f5c] flex-1",
                                        children: "If you have had any previous or ongoing treatment for the same or similar condition"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-[15px] h-[15px]",
                                            viewBox: "0 0 15 15",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.625 1.875V13.125M8.625 2.8125V12.1875",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[16px] leading-[20px] font-medium text-[#4d4f5c]",
                                        children: "When did you get your GP referral"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleStartClaim,
                        className: "bg-[#0055b7] text-white h-[64px] min-w-[280px] px-[24px] py-[16px] rounded-[8px] flex items-center justify-center transition-all duration-200 hover:bg-[#1276c0] active:bg-[#004494] self-start",
                        "aria-label": "Start your claim",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-[16px] leading-[28px] tracking-[0.1px]",
                            children: "Start Claim"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border border-[#d2d3d6] rounded-2xl p-8 flex flex-col gap-6 w-[559px] flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[18px] leading-normal font-semibold text-[#4d4f5c]",
                                children: "New to this? Watch a quick walkthrough"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[16px] leading-[24px] text-[#4d4f5c]",
                                children: "If you'd like to see exactly how the process works before you dive in, our 90-second video guides you through every step."
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full aspect-video rounded-lg overflow-hidden bg-[#f0f0f0]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-br from-[#ffd271] to-[#ffb347]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "w-[82.6px] h-[82.6px] rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 shadow-lg",
                                    "aria-label": "Play video",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-[47.2px] h-[47.2px] ml-1",
                                        viewBox: "0 0 48 48",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M17 12L35 24L17 36V12Z",
                                            fill: "#0055b7"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-[18px] leading-normal font-semibold text-[#4d4f5c]",
                                children: "Prefer reading instead?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-0.5 py-4 text-[#0055b7] hover:text-[#1276c0] transition-colors duration-200",
                                "aria-label": "Read video transcript",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                        children: "Read video transcript"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        viewBox: "0 0 16 16",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M6 12L10 8L6 4",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 203,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/ui/QuestionTag.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QuestionTag",
    ()=>QuestionTag,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const QuestionTag = ({ partLabel, currentIndex, total, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `inline-flex items-center self-start rounded-lg bg-[#cce9fb] px-4 py-2 text-sm font-medium text-[#0055b7] ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "truncate",
            children: [
                partLabel,
                " – ",
                currentIndex,
                "/",
                total
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/QuestionTag.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/QuestionTag.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = QuestionTag;
}),
"[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QuestionLayout",
    ()=>QuestionLayout,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionTag$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionTag.tsx [app-ssr] (ecmascript)");
;
;
const QuestionLayout = ({ partLabel, currentIndex, total, question, description, children, className = '', hideQuestionTag = false })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `flex flex-col max-w-question ${className}`,
        children: [
            !hideQuestionTag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionTag$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionTag"], {
                partLabel: partLabel,
                currentIndex: currentIndex,
                total: total
            }, void 0, false, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 47,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mt-6 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl leading-10 font-semibold text-gray-700",
                        children: question
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[16px] leading-[28px] font-normal text-[#4d4f5c]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 space-y-4",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = QuestionLayout;
}),
"[project]/src/components/ui/OptionChip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OptionChip",
    ()=>OptionChip,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const OptionChip = ({ label, description, icon, selected = false, disabled = false, onClick, className = '', variant = 'default' })=>{
    const baseClasses = variant === 'large' ? 'w-full min-w-[280px] max-w-[600px] text-left rounded-[8px] transition flex items-start gap-2' : 'w-full min-w-[280px] max-w-[600px] text-left rounded-lg transition flex items-start gap-2';
    const stateClasses = selected ? variant === 'large' ? 'border-[2px] border-[#0055b7] bg-white px-[15px] py-[15px]' : 'border-[2px] border-[#0055b7] bg-white px-[15px] py-[11px]' : variant === 'large' ? 'border-[1px] border-[#d2d3d6] bg-white px-[16px] py-[16px] hover:border-[#0055b7]/60 hover:bg-gray-50' : 'border-[1px] border-[#d2d3d6] bg-white px-4 py-3 hover:border-[#0055b7]/60 hover:bg-gray-50';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:border-[#d2d3d6] hover:bg-white' : 'cursor-pointer';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: disabled,
        onClick: onClick,
        className: `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`,
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: icon,
                alt: "",
                className: "w-9 h-9 flex-shrink-0",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/OptionChip.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex flex-col flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[18px] leading-[32px] font-medium text-[#4d4f5c]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/OptionChip.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[16px] leading-[28px] font-normal text-[#8a8c95]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/OptionChip.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/OptionChip.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/OptionChip.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = OptionChip;
}),
"[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OptionChipGroup",
    ()=>OptionChipGroup,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChip.tsx [app-ssr] (ecmascript)");
;
;
const OptionChipGroup = ({ options, value, onChange, disabled = false, layout = 'vertical', className = '' })=>{
    const layoutClasses = layout === 'horizontal' ? 'flex flex-row gap-4' : layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-3';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${layoutClasses} ${className}`,
        children: options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OptionChip"], {
                label: opt.label,
                description: opt.description,
                icon: opt.icon,
                selected: value === opt.value,
                disabled: disabled,
                onClick: ()=>onChange(opt.value),
                variant: layout === 'grid' ? 'large' : 'default'
            }, String(opt.label), false, {
                fileName: "[project]/src/components/ui/OptionChipGroup.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/OptionChipGroup.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = OptionChipGroup;
}),
"[project]/src/components/steps/Step1Who.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step1Who",
    ()=>Step1Who,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
const Step1Who = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                label: 'Dr Isidoro Banhurst',
                icon: '/icons/person.svg',
                value: 'self'
            },
            {
                label: 'Miss Kolton Herne',
                icon: '/icons/person.svg',
                value: 'other'
            }
        ], []);
    const claimant = state.responses.claimant;
    const selectedValue = claimant ? claimant.relationship === 'Self' ? 'self' : 'other' : null;
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'claimant',
                value: {
                    id: value,
                    name: value === 'self' ? 'Dr Isidoro Banhurst' : 'Miss Kolton Herne',
                    relationship: value === 'self' ? 'Self' : 'Dependant'
                }
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Claim details",
        currentIndex: 1,
        total: 2,
        question: "Who do you want to claim for?",
        description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "underline",
            children: "Didn't see the person you want to claim for?"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step1Who.tsx",
            lineNumber: 49,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: selectedValue,
            onChange: handleSelect,
            layout: "horizontal"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step1Who.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step1Who.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step1Who;
}),
"[project]/src/components/steps/Step2Insurance.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step2Insurance",
    ()=>Step2Insurance,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
const Step2Insurance = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const hasOtherInsurance = state.responses.hasOtherInsurance ?? null;
    const coverDetails = state.responses.otherMedicalCover ?? {};
    // Automatically show form if user previously selected "Yes"
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(hasOtherInsurance === true);
    // Update showForm when hasOtherInsurance changes or component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (hasOtherInsurance === true) {
            setShowForm(true);
        }
    }, [
        hasOtherInsurance
    ]);
    const options = [
        {
            label: 'Yes',
            description: 'I have coverage with another provider',
            value: true
        },
        {
            label: 'No',
            description: 'WPA is my only provider',
            value: false
        }
    ];
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'hasOtherInsurance',
                value
            }
        });
        // Show form if Yes is selected
        if (value === true) {
            setShowForm(true);
        } else {
            setShowForm(false);
            // Clear form data if No is selected
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'otherMedicalCover',
                    value: {}
                }
            });
        }
    };
    const handleReselect = ()=>{
        setShowForm(false);
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'hasOtherInsurance',
                value: undefined
            }
        });
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'otherMedicalCover',
                value: {}
            }
        });
    };
    const handleFieldChange = (field, value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'otherMedicalCover',
                value: {
                    ...coverDetails,
                    [field]: value
                }
            }
        });
    };
    // If Yes is selected and form should be shown
    if (hasOtherInsurance === true && showForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
            partLabel: "Claim details",
            currentIndex: 2,
            total: 2,
            question: "Do you have other medical insurance with another company?",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleReselect,
                        className: "flex items-center gap-0.5 py-4 text-[#0055b7] hover:text-[#1276c0] transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-4 h-4",
                                viewBox: "0 0 16 16",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M10 12L6 8L10 4",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                children: "Reselect"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[18px] leading-[32px] font-medium text-[#4d4f5c]",
                        children: "Please tell us more about your medical cover."
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-x-12 gap-y-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[32px] font-normal text-[#4d4f5c]",
                                        children: "Are you a subscriber or dependant?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-4",
                                        children: [
                                            'Subscriber',
                                            'Dependant'
                                        ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "subscriberType",
                                                        checked: coverDetails.subscriberType === option,
                                                        onChange: ()=>handleFieldChange('subscriberType', option),
                                                        className: "w-[18px] h-[18px] border-2 border-[#d2d3d6] rounded-full checked:border-[#0055b7] checked:bg-[#0055b7] appearance-none cursor-pointer relative before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:bg-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[16px] leading-[28px] font-medium text-[#4d4f5c]",
                                                        children: option
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, option, true, {
                                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                lineNumber: 123,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[32px] font-normal text-[#4d4f5c]",
                                        children: "Which type does your policy belong to?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-4",
                                        children: [
                                            'PMI',
                                            'Cash Plan'
                                        ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "policyType",
                                                        checked: coverDetails.policyType === option,
                                                        onChange: ()=>handleFieldChange('policyType', option),
                                                        className: "w-[18px] h-[18px] border-2 border-[#d2d3d6] rounded-full checked:border-[#0055b7] checked:bg-[#0055b7] appearance-none cursor-pointer relative before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:bg-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 148,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[16px] leading-[28px] font-medium text-[#4d4f5c]",
                                                        children: option
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, option, true, {
                                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                lineNumber: 147,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[1.4] font-normal text-[#1e1e1e]",
                                        children: "Which insurer is your policy with?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-[360px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: coverDetails.insurerName ?? '',
                                                onChange: (e)=>handleFieldChange('insurerName', e.target.value),
                                                className: "w-full h-[60px] px-4 py-3 bg-white border border-[#d2d3d6] rounded-md text-[16px] leading-[28px] text-[#4d4f5c] appearance-none cursor-pointer focus:outline-none focus:border-[#0055b7]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select your insurer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Bupa",
                                                        children: "Bupa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Aviva",
                                                        children: "Aviva"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "AXA",
                                                        children: "AXA"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Vitality",
                                                        children: "Vitality"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Other",
                                                        children: "Other"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                lineNumber: 170,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.625 9.375L12 12.75L15.375 9.375",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                lineNumber: 183,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 169,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[1.4] font-normal text-[#1e1e1e]",
                                        children: "What's your policy or customer number?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: coverDetails.policyNumber ?? '',
                                        onChange: (e)=>handleFieldChange('policyNumber', e.target.value),
                                        placeholder: "Enter policy number",
                                        className: "w-[360px] h-[60px] px-4 py-3 bg-white border border-[#d2d3d6] rounded-lg text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 194,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                lineNumber: 190,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-1 space-y-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[32px] font-normal text-[#4d4f5c]",
                                        children: "Have you advised the other insurer of this claim?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-4",
                                        children: [
                                            {
                                                label: 'Yes',
                                                value: true
                                            },
                                            {
                                                label: 'No',
                                                value: false
                                            }
                                        ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "hasAdvisedInsurer",
                                                        checked: coverDetails.hasAdvisedInsurer === option.value,
                                                        onChange: ()=>handleFieldChange('hasAdvisedInsurer', option.value),
                                                        className: "w-[18px] h-[18px] border-2 border-[#d2d3d6] rounded-full checked:border-[#0055b7] checked:bg-[#0055b7] appearance-none cursor-pointer relative before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:bg-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[16px] leading-[28px] font-medium text-[#4d4f5c]",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 220,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, option.label, true, {
                                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                lineNumber: 211,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step2Insurance.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Default: Show Yes/No options
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Claim details",
        currentIndex: 2,
        total: 2,
        question: "Do you have other medical insurance with another company?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: hasOtherInsurance,
            onChange: handleSelect,
            layout: "horizontal"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step2Insurance.tsx",
            lineNumber: 241,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
        lineNumber: 235,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step2Insurance;
}),
"[project]/src/components/steps/Step3KnowCondition.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step3KnowCondition",
    ()=>Step3KnowCondition,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
const Step3KnowCondition = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const options = [
        {
            label: 'Yes',
            value: true,
            description: 'I have a diagnosis, and I know what I have'
        },
        {
            label: 'No',
            value: false,
            description: "I'll describe what I have the best I can"
        }
    ];
    const handleSelect = (value)=>{
        // This drives the branch in navigation-logic:
        // true  -> Q4_1
        // false -> Q4_2
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'knowsCondition',
                value
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 1,
        total: 4,
        question: "Do you know what condition you have?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: state.responses.knowsCondition,
            onChange: handleSelect,
            layout: "horizontal"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step3KnowCondition.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step3KnowCondition.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step3KnowCondition;
}),
"[project]/src/components/ui/SearchInput.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchInput",
    ()=>SearchInput,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const SearchInput = ({ value, onChange, placeholder = 'Please enter your diagnosis', autoFocus, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full max-w-[576px] ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex w-full items-center gap-[8px] overflow-clip rounded-[8px] border border-[#d2d3d6] bg-white p-[16px]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: placeholder,
                autoFocus: autoFocus,
                className: "flex-1 border-none bg-transparent font-normal text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SearchInput.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/ui/SearchInput.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/SearchInput.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = SearchInput;
}),
"[project]/src/components/ui/LoadingIndicator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoadingIndicator",
    ()=>LoadingIndicator,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const LoadingIndicator = ({ label = 'Loading…', className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-3 text-[#4d4f5c] ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#d2d3d6] border-t-[#0055b7]",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/LoadingIndicator.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[16px] leading-[28px]",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/ui/LoadingIndicator.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/LoadingIndicator.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = LoadingIndicator;
}),
"[project]/src/components/ui/SnomedResultTile.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SnomedResultTile",
    ()=>SnomedResultTile,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const SnomedResultTile = ({ name, onConfirm, onSomethingElse, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-[8px] ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-[14px] min-w-[360px] w-full max-w-[720px] rounded-[8px] border border-[#d2d3d6] bg-white px-[24px] py-[24px]",
            "aria-label": `Search result ${name}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "font-medium text-[18px] leading-[32px] text-[#4d4f5c] w-full",
                    children: name
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-[16px] items-start w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onConfirm,
                            className: "flex-1 min-w-0 flex items-center justify-center gap-[8px] p-[16px] rounded-[8px] border border-[#d2d3d6] bg-white transition hover:bg-[#f6f6f7]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-[18px] leading-[32px] text-[#4d4f5c] text-center",
                                children: "Sounds like it"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onSomethingElse,
                            className: "flex-1 min-w-0 flex items-center justify-center gap-[8px] p-[16px] rounded-[8px] border border-[#d2d3d6] bg-white transition hover:bg-[#f6f6f7]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-[18px] leading-[32px] text-[#4d4f5c] text-center",
                                children: "It's something else"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = SnomedResultTile;
}),
"[project]/src/components/ui/ModalOverlay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModalOverlay",
    ()=>ModalOverlay,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const ModalOverlay = ({ open, onClose, title, children, className = '' })=>{
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": title ? 'modal-title' : undefined,
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative w-full max-w-[600px] h-[85vh] max-h-[700px] rounded-[8px] border border-[#d2d3d6] bg-white shadow-lg flex flex-col ${className}`,
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-shrink-0 p-[24px] pb-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end w-full mb-[16px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                className: "w-[24px] h-[24px] flex items-center justify-center text-[#4d4f5c] hover:text-[#0055b7] focus:outline-none cursor-pointer",
                                "aria-label": "Close",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "24",
                                    height: "24",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z",
                                        fill: "currentColor"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            id: "modal-title",
                            className: "font-normal text-[18px] leading-[28px] text-[#4d4f5c] w-full",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                            lineNumber: 62,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto px-[24px] flex flex-col gap-[16px]",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/ModalOverlay.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/ModalOverlay.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ModalOverlay;
}),
"[project]/src/hooks/useSnomed.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mock SNOMED API Service
 * Simulates fetching SNOMED codes with a delay
 */ __turbopack_context__.s([
    "fetchSnomed",
    ()=>fetchSnomed,
    "fetchSnomedSuggestions",
    ()=>fetchSnomedSuggestions,
    "getAllSnomedCodes",
    ()=>getAllSnomedCodes,
    "getRandomSnomed",
    ()=>getRandomSnomed,
    "verifySnomedCode",
    ()=>verifySnomedCode
]);
// Mock SNOMED database
const MOCK_SNOMED_DATABASE = [
    // Knee conditions
    {
        code: '30989003',
        name: 'Knee pain',
        description: 'Pain in the knee joint'
    },
    {
        code: '239873007',
        name: 'Osteoarthritis of knee',
        description: 'Degenerative joint disease of the knee'
    },
    {
        code: '304120007',
        name: 'Torn meniscus of knee',
        description: 'Tear in the cartilage of the knee'
    },
    {
        code: '429516004',
        name: 'Anterior cruciate ligament injury',
        description: 'ACL tear or sprain'
    },
    {
        code: '202855006',
        name: 'Lateral collateral ligament injury of knee',
        description: 'LCL injury'
    },
    {
        code: '156659008',
        name: 'Swelling of knee',
        description: 'Knee effusion or swelling'
    },
    // Back and spine
    {
        code: '161891005',
        name: 'Back pain',
        description: 'Pain in the back region'
    },
    {
        code: '279039007',
        name: 'Low back pain',
        description: 'Pain in the lower back'
    },
    {
        code: '21522001',
        name: 'Abdominal pain',
        description: 'Pain in the abdomen'
    },
    {
        code: '395507008',
        name: 'Slipped disc',
        description: 'Herniated intervertebral disc'
    },
    {
        code: '203082005',
        name: 'Fibromyalgia',
        description: 'Chronic widespread musculoskeletal pain'
    },
    // Shoulder and arm
    {
        code: '45326000',
        name: 'Shoulder pain',
        description: 'Pain in the shoulder region'
    },
    {
        code: '399114005',
        name: 'Arthritis of shoulder',
        description: 'Inflammatory condition of shoulder joint'
    },
    {
        code: '56208002',
        name: 'Elbow pain',
        description: 'Pain in the elbow'
    },
    {
        code: '73583000',
        name: 'Epicondylitis',
        description: 'Tennis elbow or golfer\'s elbow'
    },
    {
        code: '299306003',
        name: 'Rotator cuff syndrome',
        description: 'Rotator cuff tear or injury'
    },
    // Ankle and foot
    {
        code: '247373008',
        name: 'Ankle pain',
        description: 'Pain in the ankle'
    },
    {
        code: '44465007',
        name: 'Sprained ankle',
        description: 'Ligament injury to ankle'
    },
    {
        code: '47933007',
        name: 'Foot pain',
        description: 'Pain in the foot'
    },
    {
        code: '202882003',
        name: 'Plantar fasciitis',
        description: 'Inflammation of the plantar fascia'
    },
    {
        code: '239830003',
        name: 'Achilles tendonitis',
        description: 'Inflammation of the Achilles tendon'
    },
    // Hip
    {
        code: '49218002',
        name: 'Hip pain',
        description: 'Pain in the hip region'
    },
    {
        code: '239872002',
        name: 'Osteoarthritis of hip',
        description: 'Degenerative joint disease of the hip'
    },
    // Hand and wrist
    {
        code: '56608008',
        name: 'Wrist pain',
        description: 'Pain in the wrist'
    },
    {
        code: '134407002',
        name: 'Carpal tunnel syndrome',
        description: 'Nerve compression in the wrist'
    },
    {
        code: '53057004',
        name: 'Hand pain',
        description: 'Pain in the hand'
    },
    {
        code: '156659008',
        name: 'Hand injury',
        description: 'Traumatic injury to the hand'
    },
    // Headache and neurological
    {
        code: '25064002',
        name: 'Headache',
        description: 'Pain in the head'
    },
    {
        code: '37796009',
        name: 'Migraine',
        description: 'Recurrent severe headache'
    },
    {
        code: '230690007',
        name: 'Cerebrovascular accident',
        description: 'Stroke'
    },
    // Chest and cardiovascular
    {
        code: '29857009',
        name: 'Chest pain',
        description: 'Pain in the chest region'
    },
    {
        code: '426976009',
        name: 'Angina pectoris',
        description: 'Chest pain due to reduced blood flow to heart'
    },
    // Respiratory
    {
        code: '49727002',
        name: 'Cough',
        description: 'Forceful expulsion of air from lungs'
    },
    {
        code: '267036007',
        name: 'Dyspnea',
        description: 'Shortness of breath or difficulty breathing'
    },
    {
        code: '195967001',
        name: 'Asthma',
        description: 'Chronic respiratory condition'
    },
    // Skin
    {
        code: '271807003',
        name: 'Rash',
        description: 'Skin eruption or change in skin appearance'
    },
    {
        code: '90734009',
        name: 'Chronic pain',
        description: 'Persistent pain lasting more than 3 months'
    },
    // General symptoms
    {
        code: '84229001',
        name: 'Fatigue',
        description: 'Extreme tiredness or exhaustion'
    },
    {
        code: '422587007',
        name: 'Nausea',
        description: 'Feeling of sickness with inclination to vomit'
    },
    {
        code: '386661006',
        name: 'Fever',
        description: 'Elevated body temperature'
    },
    {
        code: '271681002',
        name: 'Stomach ache',
        description: 'Pain in the stomach region'
    }
];
const fetchSnomed = async (query)=>{
    // Simulate network delay (1 second)
    await new Promise((resolve)=>setTimeout(resolve, 1000));
    if (!query || query.trim().length === 0) {
        return null;
    }
    const normalizedQuery = query.toLowerCase().trim();
    // Find exact match first
    const exactMatch = MOCK_SNOMED_DATABASE.find((item)=>item.name.toLowerCase() === normalizedQuery);
    if (exactMatch) {
        return exactMatch;
    }
    // Find partial match (any word matches)
    const queryWords = normalizedQuery.split(/\s+/);
    for (const item of MOCK_SNOMED_DATABASE){
        const itemWords = item.name.toLowerCase().split(/\s+/);
        const hasMatch = queryWords.some((qWord)=>itemWords.some((iWord)=>iWord.includes(qWord) || qWord.includes(iWord)));
        if (hasMatch) {
            return item;
        }
    }
    // Check description for matches
    const descriptionMatch = MOCK_SNOMED_DATABASE.find((item)=>item.description?.toLowerCase().includes(normalizedQuery));
    if (descriptionMatch) {
        return descriptionMatch;
    }
    // Default fallback - return a generic result
    return {
        code: '22253000',
        name: query.charAt(0).toUpperCase() + query.slice(1),
        description: 'Symptom or condition based on user description'
    };
};
const fetchSnomedSuggestions = async (query, limit = 4)=>{
    // Simulate network delay (1 second)
    await new Promise((resolve)=>setTimeout(resolve, 1000));
    if (!query || query.trim().length === 0) {
        return [];
    }
    const normalizedQuery = query.toLowerCase().trim();
    const results = [];
    // Score each item based on relevance
    for (const item of MOCK_SNOMED_DATABASE){
        let score = 0;
        const itemName = item.name.toLowerCase();
        const itemDescription = item.description?.toLowerCase() || '';
        // Exact match in name (highest priority)
        if (itemName === normalizedQuery) {
            score += 100;
        }
        // Name starts with query
        if (itemName.startsWith(normalizedQuery)) {
            score += 50;
        }
        // Name contains query
        if (itemName.includes(normalizedQuery)) {
            score += 25;
        }
        // Word-by-word matching
        const queryWords = normalizedQuery.split(/\s+/);
        const itemWords = itemName.split(/\s+/);
        queryWords.forEach((qWord)=>{
            itemWords.forEach((iWord)=>{
                if (iWord.includes(qWord)) {
                    score += 10;
                }
                if (qWord.includes(iWord)) {
                    score += 5;
                }
            });
        });
        // Description contains query
        if (itemDescription.includes(normalizedQuery)) {
            score += 15;
        }
        if (score > 0) {
            results.push({
                item,
                score
            });
        }
    }
    // Sort by score (descending) and return top results
    return results.sort((a, b)=>b.score - a.score).slice(0, limit).map((r)=>r.item);
};
const getRandomSnomed = ()=>{
    const randomIndex = Math.floor(Math.random() * MOCK_SNOMED_DATABASE.length);
    return MOCK_SNOMED_DATABASE[randomIndex];
};
const getAllSnomedCodes = ()=>{
    return [
        ...MOCK_SNOMED_DATABASE
    ];
};
const verifySnomedCode = async (code)=>{
    await new Promise((resolve)=>setTimeout(resolve, 500));
    return MOCK_SNOMED_DATABASE.some((item)=>item.code === code);
};
}),
"[project]/src/components/steps/Step4SymptomKnown.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step4SymptomKnown",
    ()=>Step4SymptomKnown,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SearchInput.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/LoadingIndicator.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SnomedResultTile.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ModalOverlay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSnomed.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
const SUGGESTION_LIMIT = 4;
const Step4SymptomKnown = ()=>{
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [suggestions, setSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [suggestionsLoading, setSuggestionsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmedQuery, setConfirmedQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedSuggestion, setSelectedSuggestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSearchChange = async (value)=>{
        setQuery(value);
        // Clear confirmed query when user starts editing
        if (value !== confirmedQuery) {
            setConfirmedQuery('');
        }
        if (!value.trim()) {
            setResult(null);
            return;
        }
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSnomed"])(value);
            setResult(res);
        } finally{
            setLoading(false);
        }
    };
    const handleConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!result) return;
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'symptom',
                value: {
                    snomedCode: result,
                    userInput: result.name,
                    isConfirmed: true
                }
            }
        });
        // Replace search input with SNOMED name and hide the result tile
        setQuery(result.name);
        setConfirmedQuery(result.name); // Track that this is a confirmed result
        setResult(null);
    }, [
        result,
        dispatch
    ]);
    const handleSomethingElse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setResult(null);
        setModalOpen(true);
        const searchQuery = query.trim() || 'symptom';
        setSuggestionsLoading(true);
        try {
            const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSnomedSuggestions"])(searchQuery, SUGGESTION_LIMIT);
            setSuggestions(list);
        } finally{
            setSuggestionsLoading(false);
        }
    }, [
        query
    ]);
    const handleLoadMoreSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const searchQuery = query.trim() || 'symptom';
        setSuggestionsLoading(true);
        try {
            const newList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSnomedSuggestions"])(searchQuery, SUGGESTION_LIMIT);
            // Replace current suggestions with new ones (refresh)
            setSuggestions(newList);
            // Clear selection when loading new suggestions
            setSelectedSuggestion(null);
        } finally{
            setSuggestionsLoading(false);
        }
    }, [
        query
    ]);
    const handleSelectSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((code)=>{
        // Just select the suggestion, don't confirm yet
        setSelectedSuggestion(code);
    }, []);
    const handleConfirmSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!selectedSuggestion) return;
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'symptom',
                value: {
                    snomedCode: selectedSuggestion,
                    userInput: selectedSuggestion.name,
                    isConfirmed: true
                }
            }
        });
        setModalOpen(false);
        setSuggestions([]);
        setQuery(selectedSuggestion.name);
        setConfirmedQuery(selectedSuggestion.name);
        setSelectedSuggestion(null);
    }, [
        selectedSuggestion,
        dispatch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 2,
        total: 4,
        question: "Can you share with us the diagnosis?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchInput"], {
                value: query,
                onChange: handleSearchChange,
                placeholder: "Please enter your diagnosis",
                autoFocus: true
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                label: "Looking up SNOMED matches…"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 129,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            !loading && result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-[8px] w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium text-[18px] leading-[32px] text-[#4d4f5c]",
                        children: "Does this sound like what you've got?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SnomedResultTile"], {
                        code: result.code,
                        name: result.name,
                        description: result.description,
                        onConfirm: handleConfirm,
                        onSomethingElse: handleSomethingElse
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 132,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: modalOpen,
                onClose: ()=>{
                    setModalOpen(false);
                    setSuggestions([]);
                    setSelectedSuggestion(null);
                },
                title: "Could it be one of these?",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleLoadMoreSuggestions,
                        disabled: suggestionsLoading,
                        className: "flex items-center justify-start gap-[2px] h-[48px] py-[16px] text-[14px] text-[#0055b7] hover:text-[#1276c0] disabled:opacity-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-normal",
                                children: "Load another 4 suggestions"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 16 16",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                className: suggestionsLoading ? 'animate-spin' : '',
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z",
                                    fill: "currentColor"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    suggestionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                        label: "Loading suggestions…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[14px] w-full",
                        children: [
                            suggestions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleSelectSuggestion(item),
                                    className: `w-full rounded-[8px] border p-[16px] text-left transition min-w-[280px] max-w-[600px] ${selectedSuggestion?.code === item.code ? 'border-[2px] border-[#0055b7] bg-white' : 'border border-[#d2d3d6] bg-white hover:bg-[#f6f6f7]'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium text-[18px] leading-[32px] text-[#4d4f5c]",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, item.code, false, {
                                    fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                    lineNumber: 174,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))),
                            !suggestionsLoading && suggestions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[16px] leading-[28px] text-[#4d4f5c]",
                                children: "No suggestions found. Try searching again."
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                lineNumber: 190,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[10px] items-start justify-center pt-[16px] w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-normal text-[16px] leading-[28px] text-[#4d4f5c] text-left",
                                children: "If you don't see any result you want here, you can try add keywords in your description that specifies the affected body part, position, cause of symptom etc. Otherwise, please call us and we will guide you from here:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-[18px] leading-[24px] text-[#0055b7]",
                                children: "01752 395404"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 p-[24px] pt-[16px] border-t border-[#f0f0f0]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full pr-[280px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleConfirmSelection,
                                disabled: !selectedSuggestion,
                                className: `w-full h-[64px] rounded-[8px] px-[24px] py-[16px] flex items-center justify-center transition ${selectedSuggestion ? 'bg-[#0055b7] hover:bg-[#1276c0] text-white cursor-pointer' : 'bg-[#d2d3d6] text-[#8a8c95] cursor-not-allowed'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-[16px] leading-[28px] tracking-[0.1px]",
                                    children: "Confirm"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step4SymptomKnown;
}),
"[project]/src/components/ui/RecommendationChip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecommendationChip",
    ()=>RecommendationChip,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const RecommendationChip = ({ label, onClick, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: `flex items-center justify-center px-[16px] py-[8px] bg-[#fafbfb] border border-[#86b1e2] rounded-[8px] shrink-0 transition-colors hover:bg-[#e6f2fb] ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "font-medium text-[14px] leading-[24px] text-[#1276c0]",
            children: label
        }, void 0, false, {
            fileName: "[project]/src/components/ui/RecommendationChip.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/RecommendationChip.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = RecommendationChip;
}),
"[project]/src/components/steps/Step4SymptomDescribe.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step4SymptomDescribe",
    ()=>Step4SymptomDescribe,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SearchInput.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/LoadingIndicator.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SnomedResultTile.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$RecommendationChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/RecommendationChip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ModalOverlay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSnomed.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const SUGGESTION_LIMIT = 4;
// Recommendation chip stages
const INITIAL_RECOMMENDATIONS = [
    'A sharp pain in...',
    'An injury in...',
    'A recurring pain in...',
    'Difficulty in...',
    'Constant decline in...'
];
const BODY_PART_RECOMMENDATIONS = [
    'my knee',
    'my ankle',
    'my arm',
    'my wrist',
    'my chest'
];
const Step4SymptomDescribe = ()=>{
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [suggestions, setSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [suggestionsLoading, setSuggestionsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recommendationStage, setRecommendationStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('initial');
    const [partialQuery, setPartialQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmedQuery, setConfirmedQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedSuggestion, setSelectedSuggestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSearchChange = async (value)=>{
        setQuery(value);
        // Clear confirmed query when user starts editing
        if (value !== confirmedQuery) {
            setConfirmedQuery('');
        }
        if (!value.trim()) {
            setResult(null);
            // Reset recommendation stage if query is cleared
            setRecommendationStage('initial');
            setPartialQuery('');
            return;
        }
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSnomed"])(value);
            setResult(res);
        } finally{
            setLoading(false);
        }
    };
    const handleRecommendationClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (recommendation)=>{
        if (recommendationStage === 'initial') {
            // First stage: append to query and show body part options
            const newQuery = recommendation.replace('...', '');
            setQuery(newQuery);
            setPartialQuery(newQuery);
            setRecommendationStage('bodyPart');
        } else {
            // Second stage: complete the query and trigger search
            const completeQuery = `${partialQuery} ${recommendation}`;
            setQuery(completeQuery);
            // Trigger search
            setLoading(true);
            try {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSnomed"])(completeQuery);
                setResult(res);
            } finally{
                setLoading(false);
            }
            // Reset to initial stage for next time
            setRecommendationStage('initial');
            setPartialQuery('');
        }
    }, [
        recommendationStage,
        partialQuery
    ]);
    const handleConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!result) return;
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'symptom',
                value: {
                    snomedCode: result,
                    userInput: result.name,
                    isConfirmed: true
                }
            }
        });
        // Replace search input with SNOMED name and hide the result tile
        setQuery(result.name);
        setConfirmedQuery(result.name); // Track that this is a confirmed result
        setResult(null);
    }, [
        result,
        dispatch
    ]);
    const handleSomethingElse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setResult(null);
        setModalOpen(true);
        const searchQuery = query.trim() || 'symptom';
        setSuggestionsLoading(true);
        try {
            const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSnomedSuggestions"])(searchQuery, SUGGESTION_LIMIT);
            setSuggestions(list);
        } finally{
            setSuggestionsLoading(false);
        }
    }, [
        query
    ]);
    const handleLoadMoreSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const searchQuery = query.trim() || 'symptom';
        setSuggestionsLoading(true);
        try {
            const newList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSnomedSuggestions"])(searchQuery, SUGGESTION_LIMIT);
            // Replace current suggestions with new ones (refresh)
            setSuggestions(newList);
            // Clear selection when loading new suggestions
            setSelectedSuggestion(null);
        } finally{
            setSuggestionsLoading(false);
        }
    }, [
        query
    ]);
    const handleSelectSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((code)=>{
        // Just select the suggestion, don't confirm yet
        setSelectedSuggestion(code);
    }, []);
    const handleConfirmSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!selectedSuggestion) return;
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'symptom',
                value: {
                    snomedCode: selectedSuggestion,
                    userInput: selectedSuggestion.name,
                    isConfirmed: true
                }
            }
        });
        setModalOpen(false);
        setSuggestions([]);
        setQuery(selectedSuggestion.name);
        setConfirmedQuery(selectedSuggestion.name);
        setSelectedSuggestion(null);
    }, [
        selectedSuggestion,
        dispatch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 2,
        total: 4,
        question: "How would you describe your main symptom?",
        description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-0 leading-[28px]",
                    children: "Describe to us the main symptom you're experiencing."
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                    lineNumber: 173,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "list-disc",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "mb-0 ms-[24px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-[28px]",
                                children: "You may want to think about:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 176,
                                columnNumber: 15
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 175,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "mb-0 ms-[24px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-[28px]",
                                children: "What body part is affected?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 179,
                                columnNumber: 15
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 178,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "mb-0 ms-[24px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-[28px]",
                                children: "What did you feel and how severe it is?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 182,
                                columnNumber: 15
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "ms-[24px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-[28px]",
                                children: "How long did it last or how frequent did that happen?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 184,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchInput"], {
                value: query,
                onChange: handleSearchChange,
                placeholder: "E.g. a sharp pain in my front knee",
                autoFocus: true
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            !loading && !result && (!confirmedQuery || query !== confirmedQuery) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-[8px] items-center flex-wrap",
                children: (recommendationStage === 'initial' ? INITIAL_RECOMMENDATIONS : BODY_PART_RECOMMENDATIONS).map((rec)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$RecommendationChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RecommendationChip"], {
                        label: rec,
                        onClick: ()=>handleRecommendationClick(rec)
                    }, rec, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                        lineNumber: 202,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 200,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                label: "Looking up SNOMED matches…"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 211,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            !loading && result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-[8px] w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium text-[18px] leading-[32px] text-[#4d4f5c]",
                        children: "Does this sound like what you've got?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SnomedResultTile"], {
                        code: result.code,
                        name: result.name,
                        description: result.description,
                        onConfirm: handleConfirm,
                        onSomethingElse: handleSomethingElse
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: modalOpen,
                onClose: ()=>{
                    setModalOpen(false);
                    setSuggestions([]);
                    setSelectedSuggestion(null);
                },
                title: "Could it be one of these?",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleLoadMoreSuggestions,
                        disabled: suggestionsLoading,
                        className: "flex items-center justify-start gap-[2px] h-[48px] py-[16px] text-[14px] text-[#0055b7] hover:text-[#1276c0] disabled:opacity-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-normal",
                                children: "Load another 4 suggestions"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 16 16",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                className: suggestionsLoading ? 'animate-spin' : '',
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z",
                                    fill: "currentColor"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    suggestionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                        label: "Loading suggestions…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                        lineNumber: 252,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[14px] w-full",
                        children: [
                            suggestions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleSelectSuggestion(item),
                                    className: `w-full rounded-[8px] border p-[16px] text-left transition min-w-[280px] max-w-[600px] ${selectedSuggestion?.code === item.code ? 'border-[2px] border-[#0055b7] bg-white' : 'border border-[#d2d3d6] bg-white hover:bg-[#f6f6f7]'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium text-[18px] leading-[32px] text-[#4d4f5c]",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                        lineNumber: 266,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, item.code, false, {
                                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                    lineNumber: 256,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))),
                            !suggestionsLoading && suggestions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[16px] leading-[28px] text-[#4d4f5c]",
                                children: "No suggestions found. Try searching again."
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 272,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[10px] items-start justify-center pt-[16px] w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-normal text-[16px] leading-[28px] text-[#4d4f5c] text-left",
                                children: "If you don't see any result you want here, you can try add keywords in your description that specifies the affected body part, position, cause of symptom etc. Otherwise, please call us and we will guide you from here:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-[18px] leading-[24px] text-[#0055b7]",
                                children: "01752 395404"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 282,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 p-[24px] pt-[16px] border-t border-[#f0f0f0]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full pr-[280px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleConfirmSelection,
                                disabled: !selectedSuggestion,
                                className: `w-full h-[64px] rounded-[8px] px-[24px] py-[16px] flex items-center justify-center transition ${selectedSuggestion ? 'bg-[#0055b7] hover:bg-[#1276c0] text-white cursor-pointer' : 'bg-[#d2d3d6] text-[#8a8c95] cursor-not-allowed'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-[16px] leading-[28px] tracking-[0.1px]",
                                    children: "Confirm"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                    lineNumber: 300,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step4SymptomDescribe;
}),
"[project]/src/components/ui/DatePicker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatePicker",
    ()=>DatePicker,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-datepicker/dist/index.es.js [app-ssr] (ecmascript)");
;
;
;
;
const DatePicker = ({ value, onChange, label, id, placeholder = 'dd/mm/yyyy', className = '' })=>{
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(value ? new Date(value) : null);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleChange = (date)=>{
        setSelectedDate(date);
        if (date) {
            // Format as YYYY-MM-DD for consistency
            const formatted = date.toISOString().split('T')[0];
            onChange(formatted);
        }
    };
    const handleClear = ()=>{
        setSelectedDate(null);
        onChange('');
        setIsOpen(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 z-[9999]",
                onClick: ()=>setIsOpen(false),
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/DatePicker.tsx",
                lineNumber: 57,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex flex-col gap-[8px] w-[360px] ${className}`,
                children: [
                    label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: id,
                        className: "font-medium text-[16px] leading-[24px] text-[#4d4f5c] tracking-[0.4px]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/DatePicker.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full custom-datepicker-wrapper",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$datepicker$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                id: id,
                                selected: selectedDate,
                                onChange: handleChange,
                                open: isOpen,
                                onClickOutside: ()=>setIsOpen(false),
                                onInputClick: ()=>setIsOpen(true),
                                dateFormat: "dd/MM/yyyy",
                                placeholderText: placeholder,
                                showMonthDropdown: true,
                                showYearDropdown: true,
                                dropdownMode: "select",
                                className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7] cursor-pointer",
                                wrapperClassName: "w-full",
                                calendarClassName: "custom-datepicker",
                                popperClassName: "datepicker-popper-centered",
                                popperPlacement: "bottom-start",
                                portalId: "root-portal",
                                renderCustomHeader: ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between px-4 py-3 bg-[#0055b7] text-white rounded-t-[8px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: decreaseMonth,
                                                disabled: prevMonthButtonDisabled,
                                                type: "button",
                                                className: "w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded disabled:opacity-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "16",
                                                    height: "16",
                                                    viewBox: "0 0 16 16",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M10 13L5 8L10 3",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 19
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 17
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                lineNumber: 101,
                                                columnNumber: 15
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[16px] leading-[28px] font-medium",
                                                children: date.toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                lineNumber: 111,
                                                columnNumber: 15
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: increaseMonth,
                                                disabled: nextMonthButtonDisabled,
                                                type: "button",
                                                className: "w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded disabled:opacity-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "16",
                                                    height: "16",
                                                    viewBox: "0 0 16 16",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M6 3L11 8L6 13",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 19
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 17
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                lineNumber: 114,
                                                columnNumber: 15
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/DatePicker.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, void 0),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between px-4 py-3 border-t border-[#e0e0e0]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleClear,
                                            className: "text-[14px] leading-[24px] font-medium text-[#0055b7] hover:text-[#1276c0] uppercase",
                                            children: "Clear"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/DatePicker.tsx",
                                            lineNumber: 128,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setIsOpen(false),
                                                    className: "text-[14px] leading-[24px] font-medium text-[#0055b7] hover:text-[#1276c0] uppercase px-3",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setIsOpen(false),
                                                    className: "text-[14px] leading-[24px] font-medium text-[#0055b7] hover:text-[#1276c0] uppercase px-3",
                                                    children: "OK"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ui/DatePicker.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ui/DatePicker.tsx",
                                            lineNumber: 135,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/DatePicker.tsx",
                                    lineNumber: 127,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/DatePicker.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            !selectedDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/icons/calendar.svg",
                                    alt: "",
                                    width: "24",
                                    height: "24",
                                    className: "w-[24px] h-[24px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/DatePicker.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/DatePicker.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/DatePicker.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/DatePicker.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = DatePicker;
}),
"[project]/src/components/steps/Step5SymptomStart.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step5SymptomStart",
    ()=>Step5SymptomStart,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/DatePicker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
const Step5SymptomStart = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const symptomStartDate = state.symptomStartDate || {};
    const handleDateChange = (value)=>{
        if (value) {
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'symptomStartDate',
                    value: {
                        mode: 'exact',
                        exactDate: value,
                        approximateMonth: null,
                        isConfirmed: true,
                        estimatedStartDate: null
                    }
                }
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 3,
        total: 4,
        question: "When did you first start feeling unwell or notice this symptom?",
        description: "If you couldn't remember the exact date, try to pick the closest option.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatePicker"], {
            id: "symptom-date",
            label: "Symptom start date",
            value: symptomStartDate.exactDate || '',
            onChange: handleDateChange,
            placeholder: "dd/mm/yyyy"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step5SymptomStart;
}),
"[project]/src/components/steps/Step6PreviousSymptoms.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step6PreviousSymptoms",
    ()=>Step6PreviousSymptoms,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/DatePicker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
const Step6PreviousSymptoms = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const [showDateInput, setShowDateInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dateValue, setDateValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const hasPreviousSymptoms = state.responses.hasPreviousSymptoms ?? null;
    const previousSymptomDate = state.responses.previousSymptomDate || {};
    // Show date input if user previously selected "Yes"
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (hasPreviousSymptoms === true && previousSymptomDate.date) {
            setShowDateInput(true);
            setDateValue(previousSymptomDate.date);
        }
    }, []);
    const options = [
        {
            label: 'Yes',
            value: true,
            description: "I've had this or similar symptoms before"
        },
        {
            label: 'No',
            value: false,
            description: 'This is the first time I experience this'
        }
    ];
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'hasPreviousSymptoms',
                value
            }
        });
        if (value === true) {
            // Show date input for "Yes"
            setShowDateInput(true);
        } else {
            // Clear previous symptom date for "No"
            setShowDateInput(false);
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'previousSymptomDate',
                    value: null
                }
            });
        }
    };
    const handleDateChange = (value)=>{
        setDateValue(value);
        if (value) {
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'previousSymptomDate',
                    value: {
                        date: value,
                        isConfirmed: true
                    }
                }
            });
        }
    };
    const handleReselect = ()=>{
        setShowDateInput(false);
        setDateValue('');
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'hasPreviousSymptoms',
                value: undefined
            }
        });
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'previousSymptomDate',
                value: null
            }
        });
    };
    // Show date input view when "Yes" is selected
    if (showDateInput) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
            partLabel: "Symptoms & condition",
            currentIndex: 4,
            total: 4,
            question: "When did you have this symptom previously?",
            description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    "We understand it might feel a bit far off.",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
                        lineNumber: 108,
                        columnNumber: 13
                    }, void 0),
                    "No sweat! Just try to choose the nearest date to when you last experienced it."
                ]
            }, void 0, true),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: handleReselect,
                    className: "flex items-center justify-center gap-[2px] h-[48px] py-[16px] text-[#0055b7] hover:text-[#1276c0] transition -mt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "16",
                            height: "16",
                            viewBox: "0 0 16 16",
                            fill: "none",
                            xmlns: "http://www.w3.org/2000/svg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M10 13L5 8L10 3",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-[16px] leading-[28px] tracking-[0.1px]",
                            children: "Reselect"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatePicker"], {
                    id: "previous-symptom-date",
                    label: "Previous symptom start date",
                    value: dateValue,
                    onChange: handleDateChange,
                    placeholder: "dd/mm/yyyy"
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Default view: Show Yes/No options
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 4,
        total: 4,
        question: "Have you ever dealt with this, or very similar symptoms in the past?",
        description: "This helps us see if your condition is related to a previous claim so we can process it correctly.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: hasPreviousSymptoms,
            onChange: handleSelect,
            layout: "horizontal"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
            lineNumber: 148,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step6PreviousSymptoms;
}),
"[project]/src/components/steps/Step7HowHappened.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step7HowHappened",
    ()=>Step7HowHappened,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
const INJURY_OPTIONS = [
    {
        label: 'Yes',
        value: 'sporting',
        description: 'one of these applies to me'
    },
    {
        label: 'No',
        value: 'other',
        description: 'none of these describe my situation'
    }
];
const Step7HowHappened = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    // #region agent log
    console.log('[DEBUG-H1,H2] Step7 render - state structure:', {
        hasResponses: !!state.responses,
        hasInjuryDetailsInResponses: !!state.responses.injuryDetails,
        hasInjuryDetailsDirect: !!state.injuryDetails,
        stateKeys: Object.keys(state),
        responsesKeys: state.responses ? Object.keys(state.responses) : [],
        fullState: state
    });
    // #endregion
    const handleSelect = (value)=>{
        // #region agent log
        console.log('[DEBUG-H2] handleSelect called:', {
            value,
            currentStateBeforeUpdate: state.responses.injuryDetails,
            stateBeforeDispatch: state
        });
        // #endregion
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'injuryDetails',
                value: {
                    type: value
                }
            }
        });
    };
    const injuryDetails = state.responses.injuryDetails || {
        type: null
    };
    const type = injuryDetails.type;
    // #region agent log
    console.log('[DEBUG-H2] Extracted type from state:', {
        injuryDetails,
        type,
        fromResponses: true
    });
    // #endregion
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Background details",
        currentIndex: 1,
        total: 2,
        question: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                "Is your condition the result of a sporting injury, a traffic accident,",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                    fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, void 0),
                "a trip/fall, or an attack/assault?"
            ]
        }, void 0, true),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: INJURY_OPTIONS,
            value: type,
            onChange: handleSelect,
            layout: "grid"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
            lineNumber: 68,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step7HowHappened;
}),
"[project]/src/components/ui/MiniFormSolicitor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MiniFormSolicitor",
    ()=>MiniFormSolicitor,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/DatePicker.tsx [app-ssr] (ecmascript)");
;
;
const MiniFormSolicitor = ({ value, onChange, onReselect, className = '' })=>{
    const d = value ?? {
        dateOfIncident: null,
        solicitorName: '',
        caseHandler: '',
        solicitorAddress: '',
        solicitorPhone: '',
        solicitorEmail: '',
        caseReference: ''
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-[24px] ${className}`,
        "data-variant": "q8-legal-responsibility",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onReselect,
                className: "flex items-center gap-[2px] h-[48px] py-[16px] text-[#0055b7] hover:text-[#1276c0] self-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 16 16",
                        fill: "none",
                        className: "flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M10 13L5 8L10 3",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                        children: "Reselect"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-[18px] leading-[32px] font-medium text-[#4d4f5c]",
                children: "Please provide some additional details so we can assist you more effectively."
            }, void 0, false, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-x-[48px] gap-y-[36px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[24px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]",
                                children: "When did the incident happen?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[360px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatePicker"], {
                                    id: "incident-date",
                                    label: "",
                                    value: d.dateOfIncident ?? '',
                                    onChange: (value)=>onChange({
                                            dateOfIncident: value || null
                                        }),
                                    placeholder: "dd/mm/yyyy",
                                    className: "w-full"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[24px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]",
                                children: "What's the name of your solicitor?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-[8px] w-[360px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: d.solicitorName,
                                    onChange: (e)=>onChange({
                                            solicitorName: e.target.value
                                        }),
                                    placeholder: "Enter name of solicitor",
                                    className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[24px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]",
                                children: "Who's your case handler?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-[8px] w-[360px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: d.caseHandler,
                                    onChange: (e)=>onChange({
                                            caseHandler: e.target.value
                                        }),
                                    placeholder: "Enter name of case handler",
                                    className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[24px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]",
                                children: "Address of solicitor"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-[8px] w-[360px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: d.solicitorAddress,
                                    onChange: (e)=>onChange({
                                            solicitorAddress: e.target.value
                                        }),
                                    placeholder: "Enter address",
                                    className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[24px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]",
                                children: "Case reference number"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-[8px] w-[360px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: d.caseReference,
                                    onChange: (e)=>onChange({
                                            caseReference: e.target.value
                                        }),
                                    placeholder: "Enter case reference number",
                                    className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[24px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]",
                                children: "Solicitor's phone number"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-[8px] w-[360px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "tel",
                                    value: d.solicitorPhone,
                                    onChange: (e)=>onChange({
                                            solicitorPhone: e.target.value
                                        }),
                                    placeholder: "Enter number",
                                    className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                    lineNumber: 139,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-start-2 flex flex-col gap-[24px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]",
                                children: "Solicitor's email"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-[8px] w-[360px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    value: d.solicitorEmail,
                                    onChange: (e)=>onChange({
                                            solicitorEmail: e.target.value
                                        }),
                                    placeholder: "Enter email",
                                    className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MiniFormSolicitor;
}),
"[project]/src/components/steps/Step8Responsibility.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step8Responsibility",
    ()=>Step8Responsibility,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSolicitor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/MiniFormSolicitor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
const EMPTY_SOLICITOR = {
    dateOfIncident: null,
    solicitorName: '',
    caseHandler: '',
    solicitorAddress: '',
    solicitorPhone: '',
    solicitorEmail: '',
    caseReference: ''
};
const Step8Responsibility = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const options = [
        {
            label: 'Yes',
            value: true,
            description: "Someone else's involved in this legally."
        },
        {
            label: 'No',
            value: false,
            description: "There's no legal responsibility involved."
        }
    ];
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'hasLegalResponsibility',
                value
            }
        });
        if (value && !state.responses.solicitorDetails) {
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'solicitorDetails',
                    value: {
                        ...EMPTY_SOLICITOR
                    }
                }
            });
        }
    };
    const handleSolicitorChange = (updates)=>{
        const current = state.responses.solicitorDetails ?? {
            ...EMPTY_SOLICITOR
        };
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'solicitorDetails',
                value: {
                    ...current,
                    ...updates
                }
            }
        });
    };
    const handleReselect = ()=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'hasLegalResponsibility',
                value: null
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Background details",
        currentIndex: 2,
        total: 2,
        question: "Is another person or company legally responsible for this condition?",
        description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                "If this condition is related to an accident or medical mistake, you may consider a",
                ' ',
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "underline decoration-solid",
                    children: "personal injury or medical negligence claim"
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                    lineNumber: 82,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true),
        children: [
            (state.responses.hasLegalResponsibility === null || state.responses.hasLegalResponsibility === undefined || state.responses.hasLegalResponsibility === false) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: options,
                value: state.responses.hasLegalResponsibility,
                onChange: handleSelect,
                layout: "horizontal"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            state.responses.hasLegalResponsibility === true && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSolicitor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                value: state.responses.solicitorDetails,
                onChange: handleSolicitorChange,
                onReselect: handleReselect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step8Responsibility;
}),
"[project]/src/components/steps/Step9GPConsultation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step9GPConsultation",
    ()=>Step9GPConsultation,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
const Step9GPConsultation = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const options = [
        {
            label: 'NHS GP',
            value: 'nhs_gp',
            description: 'I have consulted an NHS GP'
        },
        {
            label: 'Private GP',
            value: 'private_gp',
            description: 'I have consulted a private GP'
        },
        {
            label: 'Self-referral',
            value: 'self_referral',
            description: 'I intend to do a self-referral'
        },
        {
            label: 'Fast-track consultation',
            value: 'fast_track',
            description: 'I have consulted the Fast Track service'
        },
        {
            label: 'Other',
            value: 'other',
            description: 'None of the above'
        }
    ];
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'gpConsultationType',
                value
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Referral",
        currentIndex: 1,
        total: 4,
        question: "Who have you been referred by?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: state.gpConsultationType,
            onChange: handleSelect,
            layout: "grid"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step9GPConsultation.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step9GPConsultation.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step9GPConsultation;
}),
"[project]/src/components/steps/Step10ReferralDate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step10ReferralDate",
    ()=>Step10ReferralDate,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/DatePicker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
const Step10ReferralDate = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const referralDate = state.referralDate ?? {
        mode: null,
        exactDate: null,
        approximateMonth: null,
        isConfirmed: false,
        estimatedStartDate: null
    };
    const handleDateChange = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'referralDate',
                value: {
                    mode: 'exact',
                    exactDate: value,
                    approximateMonth: null,
                    isConfirmed: true,
                    estimatedStartDate: null
                }
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Referral",
        currentIndex: 2,
        total: 4,
        question: "When were you referred by your GP?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatePicker"], {
            id: "referral-date",
            label: "Date of referral",
            value: referralDate.exactDate || '',
            onChange: handleDateChange,
            placeholder: "dd/mm/yyyy"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step10ReferralDate;
}),
"[project]/src/components/ui/SpecialistCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpecialistCard",
    ()=>SpecialistCard,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const SpecialistCard = ({ specialist, selected, onSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onSelect,
        className: `bg-white border border-[#d2d3d6] rounded-[8px] p-[16px] flex gap-[8px] min-w-[280px] max-w-[600px] flex-1 text-left transition hover:border-[#0055b7] hover:bg-[#f6f6f7] ${selected ? 'border-[#0055b7] bg-[#cce9fb]' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 w-[24px] h-[24px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: "/icons/person.svg",
                    alt: "",
                    className: "w-full h-full"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                    lineNumber: 33,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                lineNumber: 32,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col gap-[8px] min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium text-[18px] leading-[32px] text-[#4d4f5c] truncate",
                        children: specialist.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                        lineNumber: 39,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[12px] text-[16px] leading-[28px] text-[#8a8c95]",
                        children: [
                            specialist.gpHospital && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate",
                                children: specialist.gpHospital
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            specialist.distance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: specialist.distance
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                        lineNumber: 44,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    (specialist.specialty || specialist.secondarySpecialty) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-[8px] pt-[8px] flex-wrap",
                        children: [
                            specialist.specialty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-[#e5f4fd] px-[16px] py-[8px] rounded-[8px] text-[14px] leading-[24px] font-medium text-[#1276c0]",
                                children: specialist.specialty
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            specialist.secondarySpecialty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-[#e5f4fd] px-[16px] py-[8px] rounded-[8px] text-[14px] leading-[24px] font-medium text-[#1276c0]",
                                children: specialist.secondarySpecialty
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/SpecialistCard.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const __TURBOPACK__default__export__ = SpecialistCard;
}),
"[project]/src/components/ui/MiniFormSpecialist.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MENTAL_SPECIALIST_CARDS",
    ()=>MENTAL_SPECIALIST_CARDS,
    "MENTAL_THERAPIST_CARDS",
    ()=>MENTAL_THERAPIST_CARDS,
    "MiniFormSpecialist",
    ()=>MiniFormSpecialist,
    "SPECIALIST_CARDS",
    ()=>SPECIALIST_CARDS,
    "THERAPIST_CARDS",
    ()=>THERAPIST_CARDS,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SpecialistCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SpecialistCard.tsx [app-ssr] (ecmascript)");
;
;
const SPECIALIST_CARDS = [
    {
        id: '1',
        name: 'Dr Sarah Mitchell',
        specialty: 'Orthopaedic',
        secondarySpecialty: 'Sports Medicine',
        gpHospital: 'London Bridge Hospital',
        distance: '2.5 miles away'
    },
    {
        id: '2',
        name: 'Dr James Chen',
        specialty: 'Cardiology',
        secondarySpecialty: 'Internal Medicine',
        gpHospital: 'The Wellington Hospital',
        distance: '3.1 miles away'
    },
    {
        id: '3',
        name: 'Dr Emma Watson',
        specialty: 'Rheumatology',
        secondarySpecialty: 'Immunology',
        gpHospital: 'Harley Street Clinic',
        distance: '4.2 miles away'
    }
];
const MENTAL_SPECIALIST_CARDS = [
    {
        id: 'm1',
        name: 'Dr Rachel Green',
        specialty: 'Clinical Psychology',
        secondarySpecialty: 'CBT',
        gpHospital: 'Priory Wellbeing Centre',
        distance: '1.8 miles away'
    },
    {
        id: 'm2',
        name: 'Dr Tom Hughes',
        specialty: 'Psychiatry',
        secondarySpecialty: 'Anxiety Disorders',
        gpHospital: 'Nightingale Hospital',
        distance: '2.3 miles away'
    },
    {
        id: 'm3',
        name: 'Dr Anna Kowalski',
        specialty: 'Counselling',
        secondarySpecialty: 'Trauma Therapy',
        gpHospital: 'Therapy Centre London',
        distance: '3.6 miles away'
    }
];
const MENTAL_THERAPIST_CARDS = [
    {
        id: 'mt1',
        name: 'Sarah Thompson',
        specialty: 'CBT',
        secondarySpecialty: 'Anxiety',
        gpHospital: 'London Therapy Centre',
        distance: '1.5 miles away'
    },
    {
        id: 'mt2',
        name: 'Michael Roberts',
        specialty: 'Counselling',
        secondarySpecialty: 'Depression',
        gpHospital: 'Mindful Therapy Clinic',
        distance: '2.0 miles away'
    },
    {
        id: 'mt3',
        name: 'Emily Chen',
        specialty: 'EMDR',
        secondarySpecialty: 'Trauma',
        gpHospital: 'Wellness Psychology Practice',
        distance: '2.8 miles away'
    }
];
const THERAPIST_CARDS = [
    {
        id: 't1',
        name: 'Lisa Anderson',
        specialty: 'Physiotherapy',
        secondarySpecialty: 'Sports Injuries',
        gpHospital: 'Active Physio Clinic',
        distance: '1.2 miles away'
    },
    {
        id: 't2',
        name: 'David Martinez',
        specialty: 'Osteopathy',
        secondarySpecialty: 'Back Pain',
        gpHospital: 'City Osteopathic Centre',
        distance: '1.9 miles away'
    },
    {
        id: 't3',
        name: 'Sophie Williams',
        specialty: 'Chiropractic',
        secondarySpecialty: 'Joint Pain',
        gpHospital: 'Wellness Chiropractic Practice',
        distance: '2.4 miles away'
    }
];
const MiniFormSpecialist = ({ question, type, value, onChange, onReselect, className = '' })=>{
    const name = value?.name ?? '';
    // Determine cards, icon, title, question, and placeholder based on type
    let cards = SPECIALIST_CARDS;
    let icon = '/icons/stethoscope.svg';
    let title = 'Specialist';
    let questionText = 'What is the name of the specialist?';
    let placeholder = 'Enter name of specialist';
    if (type === 'mental specialist') {
        cards = MENTAL_SPECIALIST_CARDS;
        icon = '/icons/mentalHealthSpecialist.svg';
        title = 'Mental Specialist';
        questionText = 'What is the name of the mental specialist?';
        placeholder = 'Enter name of mental specialist';
    } else if (type === 'mental therapist') {
        cards = MENTAL_THERAPIST_CARDS;
        icon = '/icons/mentalHealthTherapist.svg';
        title = 'Mental Therapist';
        questionText = 'What is the name of the mental therapist?';
        placeholder = 'Enter name of mental therapist';
    } else if (type === 'therapist') {
        cards = THERAPIST_CARDS;
        icon = '/icons/Therapist.svg';
        title = 'Therapist';
        questionText = 'What is the name of the therapist?';
        placeholder = 'Enter name of therapist';
    } else if (type === 'direct referral') {
        cards = SPECIALIST_CARDS;
        icon = '/icons/DirectReferral.svg';
        title = 'Direct Referral for Test';
        questionText = 'Who are you referred to?';
        placeholder = 'Enter name of specialist';
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-[24px] ${className}`,
        "data-variant": `question-${question}-${type}`,
        children: [
            onReselect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onReselect,
                className: "flex gap-[2px] items-center justify-center py-[16px] h-[48px] self-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 16 16",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M10 13L5 8L10 3",
                            stroke: "#0055b7",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                            lineNumber: 183,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-[16px] leading-[28px] text-[#0055b7] tracking-[0.1px]",
                        children: "Reselect"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                lineNumber: 177,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-[16px] items-center w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: icon,
                        alt: "",
                        className: "shrink-0 w-[36px] h-[36px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex-1 font-medium text-[18px] leading-[32px] text-[#4d4f5c]",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-[24px] pb-[36px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-normal text-[18px] leading-[1.4] text-[#1e1e1e]",
                        children: questionText
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[8px] w-[360px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: name,
                            onChange: (e)=>onChange({
                                    name: e.target.value
                                }),
                            placeholder: placeholder,
                            className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#f6f6f7] flex flex-col gap-[24px] p-[24px] rounded-[8px] w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-[16px] text-[#4d4f5c]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-[20px] leading-[normal]",
                                children: "Finding someone to consult?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-normal text-[16px] leading-[24px]",
                                children: [
                                    "We've gathered a few specialists within our network that are ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold",
                                        children: "fee verified"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                                        lineNumber: 223,
                                        columnNumber: 74
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " you might want to pick based on your location."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-[24px] w-full",
                        children: cards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SpecialistCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpecialistCard"], {
                                specialist: card,
                                selected: name === card.name,
                                onSelect: ()=>onChange({
                                        name: card.name,
                                        gpHospital: card.gpHospital,
                                        specialties: [
                                            card.specialty,
                                            card.secondarySpecialty
                                        ].filter(Boolean)
                                    })
                            }, card.id, false, {
                                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MiniFormSpecialist;
}),
"[project]/src/components/steps/Step11ServiceReferral.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step11ServiceReferral",
    ()=>Step11ServiceReferral,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSpecialist$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/MiniFormSpecialist.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
const REFERRAL_OPTIONS = [
    {
        label: 'Specialist',
        value: 'specialist',
        description: 'Performs surgeries, investigates confusing symptoms, and manages serious illnesses.',
        icon: '/icons/stethoscope.svg'
    },
    {
        label: 'Mental Health Specialist',
        value: 'mental_health_specialist',
        description: 'Diagnoses complex psychiatric conditions (like Bipolar or Schizophrenia) and can prescribe medication.',
        icon: '/icons/mentalHealthSpecialist.svg'
    },
    {
        label: 'Therapist',
        value: 'therapist',
        description: 'Provides hands-on treatment like manipulation, massage, or exercises (e.g. Physiotherapist, Chiropractor).',
        icon: '/icons/Therapist.svg'
    },
    {
        label: 'Mental Health Therapist',
        value: 'mental_health_therapist',
        description: 'Helps you manage thoughts and behaviours through conversation (e.g. CBT, counselling).',
        icon: '/icons/mentalHealthTherapist.svg'
    },
    {
        label: 'Direct Referral for Test',
        value: 'direct_test',
        description: 'Allows you to call your insurer to get a scan or specialist appointment authorised immediately, without going to a GP first.',
        icon: '/icons/DirectReferral.svg'
    }
];
const Step11ServiceReferral = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'referralServiceType',
                value
            }
        });
        if ((value === 'specialist' || value === 'mental_health_specialist' || value === 'mental_health_therapist' || value === 'therapist' || value === 'direct_test') && !state.responses.specialistDetails) {
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'specialistDetails',
                    value: {
                        name: ''
                    }
                }
            });
        }
    };
    const handleReselect = ()=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'referralServiceType',
                value: null
            }
        });
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'specialistDetails',
                value: null
            }
        });
    };
    const handleSpecialistChange = (updates)=>{
        const current = state.responses.specialistDetails ?? {
            name: ''
        };
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'specialistDetails',
                value: {
                    ...current,
                    ...updates
                }
            }
        });
    };
    const referralServiceType = state.responses.referralServiceType;
    const showSpecialistForm = referralServiceType === 'specialist' || referralServiceType === 'mental_health_specialist' || referralServiceType === 'mental_health_therapist' || referralServiceType === 'therapist' || referralServiceType === 'direct_test';
    let type = 'specialist';
    if (referralServiceType === 'mental_health_specialist') {
        type = 'mental specialist';
    } else if (referralServiceType === 'mental_health_therapist') {
        type = 'mental therapist';
    } else if (referralServiceType === 'therapist') {
        type = 'therapist';
    } else if (referralServiceType === 'direct_test') {
        type = 'direct referral';
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Referral",
        currentIndex: 3,
        total: 4,
        question: "What kind of service are you referred to?",
        children: [
            !showSpecialistForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: REFERRAL_OPTIONS,
                value: referralServiceType,
                onChange: handleSelect,
                layout: "grid"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showSpecialistForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSpecialist$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                question: 11,
                type: type,
                value: state.responses.specialistDetails,
                onChange: handleSpecialistChange,
                onReselect: handleReselect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
                lineNumber: 127,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step11ServiceReferral;
}),
"[project]/src/components/steps/Step12HospitalClinic.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step12HospitalClinic",
    ()=>Step12HospitalClinic,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
/** Previous hospital – clicking it populates the hospital/clinic input */ const PREVIOUS_HOSPITAL = 'Plymouth Nuffield Hospital';
const Step12HospitalClinic = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const value = state.responses.hospitalClinic ?? '';
    const handleInputChange = (v)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'hospitalClinic',
                value: v
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Referral",
        currentIndex: 4,
        total: 4,
        question: "Which hospital or clinic will you be attending?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-[8px] w-[360px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "hospital-clinic-input",
                            className: "font-medium text-[16px] leading-[24px] text-[#4d4f5c] tracking-[0.4px]",
                            children: "Hospital or clinic to visit"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "hospital-clinic-input",
                            type: "text",
                            value: value,
                            onChange: (e)=>handleInputChange(e.target.value),
                            placeholder: "Enter hospital or clinic name",
                            className: "w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-[10px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium text-[16px] leading-[32px] text-[#4d4f5c]",
                            children: "Your previous hospital"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>handleInputChange(PREVIOUS_HOSPITAL),
                            className: "bg-[#fafbfb] border border-[#86b1e2] rounded-[8px] px-[16px] py-[8px] inline-flex items-center justify-center self-start hover:bg-[#e5f4fd] transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-[14px] leading-[24px] text-[#1276c0]",
                                children: PREVIOUS_HOSPITAL
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step12HospitalClinic;
}),
"[project]/src/components/ui/ReviewRow.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewRow",
    ()=>ReviewRow,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const ReviewRow = ({ label, value, onEdit, showEditButton = true })=>{
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const displayValue = value || '–';
    const isNotProvided = !value;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-[16px] h-[172px] min-w-[200px] w-[260px] p-[12px] rounded-[8px] relative shrink-0 transition-colors ${isHovered ? 'bg-[#f6f6f7]' : ''}`,
        onMouseEnter: ()=>setIsHovered(true),
        onMouseLeave: ()=>setIsHovered(false),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-[#d2d3d6] border-solid flex h-[48px] items-center justify-between w-full shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-1 items-center min-h-px min-w-px",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium leading-[32px] text-[#4d4f5c] text-[18px] shrink-0",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/ReviewRow.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ReviewRow.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    showEditButton && onEdit && value && isHovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onEdit,
                        className: "flex gap-[2px] items-center justify-center h-[48px] py-[16px] transition-colors hover:opacity-80",
                        "aria-label": `Edit ${label}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-[16px] h-[16px]",
                                viewBox: "0 0 16 16",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M11.3333 2.00001C11.5084 1.82491 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44763 12.6667 1.44763C12.9142 1.44763 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8249 1.82491 14 2.00001C14.1751 2.17511 14.314 2.383 14.4087 2.6118C14.5035 2.8406 14.5524 3.08578 14.5524 3.33334C14.5524 3.58091 14.5035 3.82609 14.4087 4.05489C14.314 4.28369 14.1751 4.49158 14 4.66668L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 2.00001Z",
                                    stroke: "#0055b7",
                                    strokeWidth: "1.5",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/ReviewRow.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ReviewRow.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-[16px] leading-[28px] text-[#0055b7] tracking-[0.1px]",
                                children: "Edit"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ReviewRow.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/ReviewRow.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ReviewRow.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col h-[44px] items-start w-full shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-0 items-center min-w-[120px] w-full shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `flex-1 font-medium leading-[32px] text-[18px] min-h-px min-w-px ${isNotProvided ? 'text-gray-400 italic' : 'text-[#1e1e1e]'}`,
                        children: displayValue
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ReviewRow.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ReviewRow.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ReviewRow.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ReviewRow.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ReviewRow;
}),
"[project]/src/types/claim.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Claim Flow TypeScript Interfaces
 * Comprehensive type definitions for a 12-question claim flow with branching logic
 */ // Step ID Type - All valid step identifiers in the claim flow
__turbopack_context__.s([
    "createInitialClaimState",
    ()=>createInitialClaimState,
    "formatDateSelection",
    ()=>formatDateSelection,
    "formatReviewDate",
    ()=>formatReviewDate
]);
const createInitialClaimState = ()=>({
        claimType: null,
        claimant: null,
        hasOtherInsurance: null,
        otherMedicalCover: null,
        knowsCondition: null,
        symptom: {
            snomedCode: null,
            userInput: '',
            bodySide: null,
            isConfirmed: false
        },
        symptomStartDate: {
            mode: null,
            exactDate: null,
            approximateMonth: null,
            isConfirmed: false,
            estimatedStartDate: null
        },
        hasPreviousSymptoms: null,
        previousSymptomDate: null,
        injuryDetails: {
            type: null
        },
        hasLegalResponsibility: null,
        solicitorDetails: null,
        gpConsultationType: null,
        referralDate: {
            mode: null,
            exactDate: null,
            approximateMonth: null,
            isConfirmed: false,
            estimatedStartDate: null
        },
        referralServiceType: null,
        specialistDetails: null,
        hospitalClinic: '',
        currentStep: 'CLAIM_TYPE',
        completedSteps: [],
        outcome: null
    });
const formatReviewDate = (dateString, isEstimate = false)=>{
    if (!dateString) return null;
    try {
        // Month abbreviations
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        // Parse the date string
        const parts = dateString.split('-');
        if (parts.length < 2) {
            // Invalid format
            return dateString;
        }
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1; // 0-indexed
        const monthName = months[monthIndex] || parts[1];
        // Estimated date: show "Jan 2026"
        if (isEstimate || parts.length === 2) {
            return `${monthName} ${year}`;
        }
        // Exact date: show "28 Jan 2026"
        const day = parseInt(parts[2], 10); // Remove leading zero
        return `${day} ${monthName} ${year}`;
    } catch (error) {
        // If parsing fails, return original string
        console.warn('Failed to format date:', dateString, error);
        return dateString;
    }
};
const formatDateSelection = (dateSelection)=>{
    if (!dateSelection) return null;
    // Try exact date first
    if (dateSelection.exactDate) {
        return formatReviewDate(dateSelection.exactDate, false);
    }
    // Try estimated date
    if (dateSelection.estimatedStartDate) {
        return formatReviewDate(dateSelection.estimatedStartDate, true);
    }
    // Try approximate month (legacy field)
    if (dateSelection.approximateMonth) {
        return dateSelection.approximateMonth; // Already formatted as "January 2025"
    }
    return null;
};
}),
"[project]/src/components/steps/StepReviewSummary.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepReviewSummary",
    ()=>StepReviewSummary,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ReviewRow.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$claim$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/claim.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const StepReviewSummary = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    // Helper function to navigate to a specific step
    const editStep = (step)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'currentStep',
                value: step
            }
        });
    };
    // Format claimant value - show the name/title (e.g., "Dr Isidoro Banhurst")
    const getClaimantValue = ()=>{
        const claimant = state.claimant;
        if (!claimant) return null;
        // Return the name from the PolicyHolder object
        return claimant.name || null;
    };
    // Format symptom value - show SNOMED name (from Q4_1 or Q4_2)
    const getSymptomValue = ()=>{
        const symptom = state.symptom;
        if (!symptom) return null;
        // Return the SNOMED code name if available, otherwise userInput
        return symptom.snomedCode?.name || symptom.userInput || null;
    };
    // Format symptom start date (from Q5 - symptomStartDate)
    const getSymptomStartDate = ()=>{
        const startDate = state.symptomStartDate;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$claim$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateSelection"])(startDate);
    };
    // Format legal responsibility value (from Q8)
    const getLegalResponsibilityValue = ()=>{
        const hasLegalResponsibility = state.hasLegalResponsibility;
        if (hasLegalResponsibility === null || hasLegalResponsibility === undefined) return null;
        return hasLegalResponsibility === true ? 'Yes' : 'No';
    };
    // Format GP referral date (from Q10)
    const getReferralDateValue = ()=>{
        const referralDate = state.referralDate;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$claim$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateSelection"])(referralDate);
    };
    // Format referral type (from Q11)
    const getReferralTypeValue = ()=>{
        const type = state.referralServiceType;
        if (!type) return null;
        const typeMap = {
            'specialist': 'Specialist',
            'mental_health_specialist': 'Mental health specialist',
            'therapist': 'Therapist',
            'mental_health_therapist': 'Mental health therapist',
            'direct_test': 'Direct test'
        };
        return typeMap[type] || type;
    };
    // Format specialist name (from Q11 - optional)
    const getSpecialistNameValue = ()=>{
        const specialistDetails = state.specialistDetails;
        if (!specialistDetails || !specialistDetails.name) return null;
        return specialistDetails.name;
    };
    // Format hospital/clinic (from Q12 - optional)
    const getHospitalClinicValue = ()=>{
        const hospital = state.hospitalClinic;
        if (!hospital) return null;
        return String(hospital);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Review",
        currentIndex: 1,
        total: 1,
        question: "Almost there!",
        description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-0",
                    children: "You've entered all the details we need for your claim."
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 111,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Before completing your claim creation, please confirm all the details you've entered are correct."
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 112,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true),
        hideQuestionTag: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-[25px] py-6 w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-[16px] items-center w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: "Claiming for",
                            value: getClaimantValue(),
                            onEdit: ()=>editStep('Q1')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: "Symptom",
                            value: getSymptomValue(),
                            onEdit: ()=>{
                                // Navigate to Q4_1 or Q4_2 based on knowsCondition
                                const knowsCondition = state.knowsCondition;
                                editStep(knowsCondition === true ? 'Q4_1' : 'Q4_2');
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: "Symptom start date",
                            value: getSymptomStartDate(),
                            onEdit: ()=>editStep('Q5')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-[16px] items-center w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: "Legal responsibility",
                            value: getLegalResponsibilityValue(),
                            onEdit: ()=>editStep('Q8')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: "GP referral on",
                            value: getReferralDateValue(),
                            onEdit: ()=>editStep('Q10')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: "Type of referral",
                            value: getReferralTypeValue(),
                            onEdit: ()=>editStep('Q11')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 142,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-[16px] items-center w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: "Name of specialist",
                            value: getSpecialistNameValue(),
                            onEdit: ()=>editStep('Q11'),
                            showEditButton: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: "Hospital or clinic",
                            value: getHospitalClinicValue(),
                            onEdit: ()=>editStep('Q12')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = StepReviewSummary;
}),
"[project]/src/components/steps/SuccessStep.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuccessStep",
    ()=>SuccessStep,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/TopBar.tsx [app-ssr] (ecmascript)");
;
;
;
const SuccessStep = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-[#fafbfb] min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white border-b border-[#d2d3d6] w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-[1440px] px-[30px] py-[12px]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-[1440px] mx-auto px-24 py-12 flex gap-24 items-start justify-center pb-24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-12 max-w-[720px] min-w-[360px] w-[600px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-6 w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-[36px] leading-[48px] font-semibold text-[#4d4f5c]",
                                        children: "We're on it!"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                        lineNumber: 31,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[16px] leading-[28px] font-normal text-[#4d4f5c]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: "Your claim has been submitted. While we're getting your confirmation and reference number ready, you can jump-start your recovery right now."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 37,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: " "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 40,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: [
                                                    "Go to ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: "Doctify"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                        lineNumber: 42,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " with our link below to find a WPA-registered provider and book your appointment. We'll send a follow-up to your inbox shortly, but if you have questions, our support page is always here for you."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 41,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                        lineNumber: 36,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] text-white h-[56px] px-6 py-4 rounded-lg flex gap-2 items-center justify-center transition-all duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                                children: "Book now on Doctify"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 54,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/icons/external-link.svg",
                                                alt: "",
                                                width: 20,
                                                height: 20,
                                                className: "flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 57,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "bg-white border border-[#0055b7] text-[#0055b7] hover:bg-[#f0f7ff] active:bg-[#e0efff] h-[56px] px-6 py-4 rounded-lg flex gap-0 items-center justify-center transition-all duration-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-0.5 items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                                children: "Back to dashboard"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 72,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                        lineNumber: 67,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 w-[462px] h-[555px] relative",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: "/assets/PlaceholderGraphic.png",
                            alt: "Claim process illustration",
                            fill: true,
                            className: "object-contain"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/SuccessStep.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = SuccessStep;
}),
"[project]/src/components/steps/FastTrackEndStep.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FastTrackEndStep",
    ()=>FastTrackEndStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const FastTrackEndStep = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#fafbfb] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-b border-[#d2d3d6] w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-6 py-4 w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#0055b7] h-[48px] w-[65.652px] flex items-center justify-center px-[10px] py-[14px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/assets/wpaLogo.svg",
                                        alt: "WPA",
                                        className: "h-[19.833px] w-[46.242px]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                        lineNumber: 24,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                    lineNumber: 23,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-[48px] w-px bg-[#d2d3d6]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                    lineNumber: 32,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[18px] leading-normal font-normal text-[#4d4f5c]",
                                    children: "New Claim"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                    lineNumber: 35,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "flex items-center justify-center gap-0.5 h-[48px] px-6 py-4 border border-[#0055b7] rounded-[8px] bg-white hover:bg-gray-50 transition-colors",
                            onClick: ()=>{
                                window.location.href = '/';
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "20",
                                    height: "20",
                                    viewBox: "0 0 20 20",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5",
                                            stroke: "#0055b7",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M13.3333 14.1667L17.5 10L13.3333 5.83334",
                                            stroke: "#0055b7",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M17.5 10H7.5",
                                            stroke: "#0055b7",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                            lineNumber: 64,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[16px] leading-[28px] font-semibold text-[#0055b7] tracking-[0.1px]",
                                    children: "Exit"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 py-12 flex flex-col lg:flex-row gap-12 lg:gap-24 items-start justify-center flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-12 w-full lg:max-w-[720px] lg:min-w-[360px] lg:w-[600px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-6 w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-[36px] leading-[48px] font-semibold text-[#4d4f5c]",
                                        children: "We've got your back with Fast Track Physiotherapy."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[16px] leading-[28px] font-normal text-[#4d4f5c]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: "Don't worry about a thing! We're here to make getting started as easy as possible."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                lineNumber: 92,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: " "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                lineNumber: 95,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: [
                                                    "Just have your ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: "CRN"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 32
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " handy and give our claims team a quick ring at",
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "tel:01823625329",
                                                        className: "text-[#0055b7] underline decoration-solid hover:text-[#1276c0]",
                                                        children: "01823 625329"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                        lineNumber: 98,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    ". We'll take care of the rest for you."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] text-white h-[56px] px-6 py-4 rounded-[8px] flex items-center justify-center transition-all duration-200 self-start",
                                onClick: ()=>{
                                    // Navigate back to dashboard
                                    window.location.href = '/';
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                    children: "Back to dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-[#d2d3d6] rounded-[16px] flex flex-col w-full lg:w-[430px] shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-[#d2d3d6] px-9 pt-9 pb-4 flex flex-col gap-[11px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[14px] leading-[24px] font-semibold text-[#8a8c95] uppercase",
                                        children: "Claim Reference"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[24px] leading-[40px] font-normal text-[#4d4f5c]",
                                        children: "MLJNBX"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                        lineNumber: 131,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-9 pt-6 pb-9 flex flex-col gap-[11px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[14px] leading-[24px] font-semibold text-[#8a8c95] uppercase",
                                        children: "Action Required"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-4 items-start",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-[#e5f4fd] rounded-[8px] p-2 flex items-center justify-center shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "36",
                                                    height: "36",
                                                    viewBox: "0 0 36 36",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M33 25.38V29.88C33.0011 30.3185 32.9146 30.7522 32.746 31.1556C32.5773 31.5591 32.3298 31.9237 32.0187 32.2276C31.7077 32.5314 31.3395 32.7682 30.9365 32.9238C30.5336 33.0793 30.1044 33.1505 29.675 33.1325C25.0428 32.6565 20.5905 31.1028 16.69 28.6025C13.1036 26.3516 10.0484 23.2964 7.7975 19.71C5.29251 15.7963 3.73873 11.329 3.2675 6.68251C3.24962 6.25436 3.32052 5.82644 3.47543 5.42449C3.63034 5.02254 3.86603 4.65496 4.16853 4.34419C4.47102 4.03342 4.83406 3.78568 5.23599 3.6161C5.63792 3.44653 6.07018 3.35843 6.5075 3.35751H11.0075C11.7533 3.34995 12.4772 3.61673 13.0453 4.10771C13.6133 4.59869 13.9886 5.28103 14.1 6.02001C14.3087 7.49686 14.6897 8.94454 15.235 10.3325C15.4377 10.8757 15.4735 11.4686 15.3376 12.0322C15.2017 12.5958 14.9001 13.1046 14.4725 13.4925L12.5525 15.4125C14.6869 19.1821 17.8179 22.3131 21.5875 24.4475L23.5075 22.5275C23.8954 22.0999 24.4042 21.7983 24.9678 21.6624C25.5314 21.5265 26.1243 21.5623 26.6675 21.765C28.0555 22.3103 29.5031 22.6913 30.98 22.9C31.7277 23.0126 32.4172 23.3973 32.9092 23.9764C33.4012 24.5556 33.6614 25.2913 33.64 26.045L33 25.38Z",
                                                        stroke: "#0055b7",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                lineNumber: 145,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[16px] leading-[28px] font-normal text-[#4d4f5c]",
                                                        children: "Please contact the WPA help line"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "tel:01823625329",
                                                        className: "text-[18px] leading-[32px] font-medium text-[#1276c0] hover:text-[#0055b7]",
                                                        children: "01823 625329"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                                lineNumber: 158,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/FastTrackEndStep.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/steps/MajorIncidentEndStep.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MajorIncidentEndStep",
    ()=>MajorIncidentEndStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/TopBar.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const MajorIncidentEndStep = ()=>{
    const handleBackToDashboard = ()=>{
        // TODO: Navigate to dashboard
        window.location.href = '/';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-[#fafbfb] min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white border-b border-[#d2d3d6] w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-[1440px] px-[30px] py-[12px]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-[1440px] mx-auto px-24 py-12 flex gap-24 items-start justify-center pb-24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-12 max-w-[720px] min-w-[360px] w-[600px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-6 w-full text-[#4d4f5c]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-[36px] leading-[48px] font-semibold",
                                        children: [
                                            "We're here to help you",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 37,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "through this."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                        lineNumber: 35,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[16px] leading-[28px] font-normal",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: "Because your condition involves a specific incident like a sporting injury or accident, we want to make sure your claim is handled with extra care. These situations often have unique details that are much easier to explain over the phone than in a form."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 43,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: " "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 46,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0 font-bold",
                                                children: "Please give the WPA team a call:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 47,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "list-disc pl-6 mb-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "mb-0",
                                                        children: [
                                                            "Phone: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "tel:01823625329",
                                                                className: "text-[#0055b7] underline",
                                                                children: "01823 625329"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                                lineNumber: 52,
                                                                columnNumber: 26
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                        lineNumber: 51,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "Hours: Monday – Friday, 9am – 5pm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                        lineNumber: 54,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 50,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: " "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 58,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-0",
                                                children: "We're ready to help you take the next step. Just give us a call and we'll get everything moving for you."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 59,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                        lineNumber: 42,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleBackToDashboard,
                                className: "bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] text-white h-[56px] px-6 py-4 rounded-lg flex items-center justify-center transition-all duration-200 self-start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                    children: "Back to dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-[#d2d3d6] rounded-2xl flex flex-col shrink-0 w-[430px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-[#d2d3d6] px-9 pt-9 pb-4 flex flex-col gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[14px] leading-[24px] font-semibold text-[#8a8c95] uppercase",
                                        children: "Claim reference"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[24px] leading-[40px] font-normal text-[#4d4f5c]",
                                        children: "MLJNBX"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-9 py-6 flex flex-col gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[14px] leading-[24px] font-semibold text-[#8a8c95] uppercase",
                                        children: "Action required"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-4 items-start",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-[#e5f4fd] rounded-lg p-2 shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-9 h-9",
                                                    viewBox: "0 0 36 36",
                                                    fill: "none",
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M33 25.92V30.42C33.0011 30.8549 32.9058 31.2845 32.7208 31.6786C32.5359 32.0728 32.2659 32.4216 31.9298 32.7011C31.5938 32.9805 31.1999 33.1839 30.7771 33.2973C30.3543 33.4107 29.9126 33.4314 29.4812 33.3581C24.8356 32.6109 20.4289 30.7878 16.6125 28.0331C13.0824 25.5284 10.1465 22.2925 7.99999 18.5456C5.24997 14.5139 3.48121 9.86716 2.84249 5.01562C2.77028 4.56389 2.79034 4.10172 2.90116 3.65869C3.01198 3.21565 3.21072 2.80192 3.48404 2.44654C3.75737 2.09116 4.09893 1.80281 4.48634 1.60217C4.87375 1.40153 5.29761 1.29318 5.72749 1.28437H9.90624C10.6447 1.27681 11.3604 1.54524 11.9169 2.03936C12.4735 2.53348 12.8318 3.21969 12.925 3.96562C13.0984 5.45582 13.4433 6.92205 13.9531 8.33437C14.1542 8.90981 14.1865 9.53413 14.0459 10.1283C13.9052 10.7225 13.5982 11.2595 13.1625 11.6756L11.4937 13.4606C13.8441 17.3752 17.25 21.0352 20.925 23.5481L22.5937 21.7631C22.9815 21.2987 23.4829 20.9696 24.0361 20.8183C24.5893 20.6669 25.1709 20.7007 25.7062 20.9156C27.0139 21.4608 28.3728 21.8281 29.7562 22.0106C30.4762 22.1069 31.1392 22.4832 31.6212 23.0676C32.1032 23.6519 32.3695 24.4024 32.3687 25.1781L33 25.92Z",
                                                        stroke: "#0055b7",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[16px] leading-[28px] font-normal text-[#4d4f5c]",
                                                        children: "Please contact the WPA help line"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[18px] leading-[32px] font-medium text-[#1276c0]",
                                                        children: "01823 625329"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                                lineNumber: 114,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/MajorIncidentEndStep.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/steps/NavigationOverview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavigationOverview",
    ()=>NavigationOverview,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/TopBar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
const STEP_LINKS = [
    // Initial Selection
    {
        id: 'CLAIM_TYPE',
        label: 'Select Claim Type',
        description: 'Choose the type of claim',
        category: 'Start'
    },
    {
        id: 'ONBOARDING',
        label: 'Onboarding',
        description: 'Welcome and introduction',
        category: 'Start'
    },
    // Part 1: Claim Details
    {
        id: 'Q1',
        label: 'Who are you claiming for?',
        description: 'Select policy holder',
        category: 'Claim Details'
    },
    {
        id: 'Q2',
        label: 'Other medical insurance',
        description: 'Do you have other insurance?',
        category: 'Claim Details'
    },
    {
        id: 'Q2_1',
        label: 'Insurance details',
        description: 'Provide insurance information',
        category: 'Claim Details'
    },
    // Part 2: Symptoms & Condition
    {
        id: 'Q3',
        label: 'Do you know your condition?',
        description: 'Know what condition you have?',
        category: 'Symptoms & Condition'
    },
    {
        id: 'Q4_1',
        label: 'Symptom (with diagnosis)',
        description: 'Search for your condition',
        category: 'Symptoms & Condition'
    },
    {
        id: 'Q4_2',
        label: 'Describe symptom',
        description: 'Describe your symptoms',
        category: 'Symptoms & Condition'
    },
    {
        id: 'Q5',
        label: 'Symptom start date',
        description: 'When did symptoms start?',
        category: 'Symptoms & Condition'
    },
    {
        id: 'Q6',
        label: 'Previous symptoms',
        description: 'Had symptoms before?',
        category: 'Symptoms & Condition'
    },
    // Part 3: Background Details
    {
        id: 'Q7',
        label: 'How did this happen?',
        description: 'Sporting injury or accident?',
        category: 'Background Details'
    },
    {
        id: 'Q8',
        label: 'Legal responsibility',
        description: 'Is someone legally responsible?',
        category: 'Background Details'
    },
    // Part 4: Referral
    {
        id: 'Q9',
        label: 'GP consultation',
        description: 'Consulted your GP?',
        category: 'Referral'
    },
    {
        id: 'Q10',
        label: 'Referral date',
        description: 'When were you referred?',
        category: 'Referral'
    },
    {
        id: 'Q11',
        label: 'Service type',
        description: 'Who were you referred to?',
        category: 'Referral'
    },
    {
        id: 'Q12',
        label: 'Hospital or clinic',
        description: 'Which hospital or clinic?',
        category: 'Referral'
    },
    // Part 5: Review & Submit
    {
        id: 'REVIEW',
        label: 'Review answers',
        description: 'Review all your answers',
        category: 'Review & Submit'
    },
    {
        id: 'OUTCOME',
        label: 'Submission confirmation',
        description: 'Claim submitted successfully',
        category: 'Review & Submit'
    },
    // Special End States
    {
        id: 'END_FAST_TRACK',
        label: 'Fast-track exit',
        description: 'Fast-track consultation path',
        category: 'Special Paths'
    },
    {
        id: 'END_MAJOR_INCIDENT',
        label: 'Major incident exit',
        description: 'Call required for incidents',
        category: 'Special Paths'
    }
];
const NavigationOverview = ()=>{
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const navigateToStep = (stepId)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'currentStep',
                value: stepId
            }
        });
    };
    // Group steps by category
    const stepsByCategory = STEP_LINKS.reduce((acc, step)=>{
        if (!acc[step.category]) {
            acc[step.category] = [];
        }
        acc[step.category].push(step);
        return acc;
    }, {});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-[#fafbfb] min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white border-b border-[#d2d3d6] w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-[1440px] px-[30px] py-[12px]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-[1200px] mx-auto px-24 py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[36px] leading-[48px] font-semibold text-[#4d4f5c] mb-4",
                                children: "Claim Flow Navigation"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[16px] leading-[28px] text-[#4d4f5c]",
                                children: "Quick access to all steps and pages in the claim flow. Click on any step to navigate directly to it."
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-8",
                        children: Object.entries(stepsByCategory).map(([category, steps])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-[16px] border border-[#d2d3d6] p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-[24px] font-semibold text-[#4d4f5c] mb-4 pb-3 border-b border-[#d2d3d6]",
                                        children: category
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: steps.map((step)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>navigateToStep(step.id),
                                                className: "flex flex-col items-start gap-1 p-4 rounded-[8px] border border-[#d2d3d6] bg-white hover:bg-[#f5fbff] hover:border-[#0055b7] transition-all text-left group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 w-full",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[12px] font-semibold text-[#8a8c95] uppercase tracking-wide",
                                                                children: step.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                                                lineNumber: 120,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-[16px] h-[16px] text-[#0055b7] opacity-0 group-hover:opacity-100 transition-opacity ml-auto",
                                                                viewBox: "0 0 16 16",
                                                                fill: "none",
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M6 12L10 8L6 4",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                                                    lineNumber: 131,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                                                lineNumber: 125,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-[18px] font-semibold text-[#1e1e1e] group-hover:text-[#0055b7] transition-colors",
                                                        children: step.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[14px] text-[#8a8c95] leading-[20px]",
                                                        children: step.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, step.id, true, {
                                                fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                                lineNumber: 112,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, category, true, {
                                fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/NavigationOverview.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/NavigationOverview.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = NavigationOverview;
}),
"[project]/src/components/ClaimFlowManager.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AppShell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
// Claim Type Selection
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$ClaimTypeStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/ClaimTypeStep.tsx [app-ssr] (ecmascript)");
// Onboarding
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$OnboardingStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/OnboardingStep.tsx [app-ssr] (ecmascript)");
// Part 1: Claim Details (Q1-Q2)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step1Who$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step1Who.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step2Insurance$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step2Insurance.tsx [app-ssr] (ecmascript)");
// Step2OtherCoverDetails removed - form is now inline in Step2Insurance
// Part 2: Symptoms & Condition (Q3-Q6)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step3KnowCondition$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step3KnowCondition.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomKnown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step4SymptomKnown.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomDescribe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step4SymptomDescribe.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step5SymptomStart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step5SymptomStart.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousSymptoms$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step6PreviousSymptoms.tsx [app-ssr] (ecmascript)");
// Part 3: Background Details (Q7-Q8)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step7HowHappened$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step7HowHappened.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step8Responsibility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step8Responsibility.tsx [app-ssr] (ecmascript)");
// Part 4: Referral (Q9-Q12)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step9GPConsultation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step9GPConsultation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step10ReferralDate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step10ReferralDate.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step11ServiceReferral$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step11ServiceReferral.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step12HospitalClinic$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step12HospitalClinic.tsx [app-ssr] (ecmascript)");
// Part 5: Review & Submit
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepReviewSummary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/StepReviewSummary.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$SuccessStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/SuccessStep.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$FastTrackEndStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/FastTrackEndStep.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$MajorIncidentEndStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/MajorIncidentEndStep.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$NavigationOverview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/NavigationOverview.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
/**
 * ClaimFlowManager
 * 
 * Central component that renders the correct step based on currentStep from context.
 * Maps all 12 question steps plus review/outcome screens.
 * 
 * Navigation flow is controlled by src/lib/navigation-logic.ts
 */ const ClaimFlowManager = ()=>{
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const renderStep = ()=>{
        switch(state.currentStep){
            // ========================================
            // CLAIM TYPE SELECTION
            // ========================================
            case 'CLAIM_TYPE':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$ClaimTypeStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimTypeStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 59,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // ONBOARDING
            // ========================================
            case 'ONBOARDING':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$OnboardingStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OnboardingStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 65,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 1: CLAIM DETAILS (Q1-Q2)
            // ========================================
            case 'Q1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step1Who$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step1Who"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 71,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q2':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step2Insurance$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step2Insurance"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 74,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // Q2_1 removed - insurance details form is now inline in Q2
            // ========================================
            // PART 2: SYMPTOMS & CONDITION (Q3-Q6)
            // ========================================
            case 'Q3':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step3KnowCondition$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step3KnowCondition"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 82,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q4_1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomKnown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step4SymptomKnown"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 85,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q4_2':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomDescribe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step4SymptomDescribe"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 88,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q5':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step5SymptomStart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step5SymptomStart"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 91,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q6':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousSymptoms$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step6PreviousSymptoms"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 94,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 3: BACKGROUND DETAILS (Q7-Q8)
            // ========================================
            case 'Q7':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step7HowHappened$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step7HowHappened"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 100,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q8':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step8Responsibility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step8Responsibility"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 103,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 4: REFERRAL (Q9-Q12)
            // ========================================
            case 'Q9':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step9GPConsultation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step9GPConsultation"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 109,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q10':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step10ReferralDate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step10ReferralDate"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 112,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q11':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step11ServiceReferral$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step11ServiceReferral"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 115,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q12':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step12HospitalClinic$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step12HospitalClinic"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 118,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 5: REVIEW & SUBMIT
            // ========================================
            case 'REVIEW':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepReviewSummary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StepReviewSummary"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 124,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'OUTCOME':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$SuccessStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SuccessStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 127,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'END_FAST_TRACK':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$FastTrackEndStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FastTrackEndStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 130,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'END_MAJOR_INCIDENT':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$MajorIncidentEndStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MajorIncidentEndStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 133,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'NAVIGATION_OVERVIEW':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$NavigationOverview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavigationOverview"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 136,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // DEFAULT / ERROR STATE
            // ========================================
            default:
                console.error(`[ClaimFlowManager] Unknown step: "${state.currentStep}". Valid steps: CLAIM_TYPE, ONBOARDING, Q1-Q12, Q4_1, Q4_2, REVIEW, OUTCOME, END_FAST_TRACK, END_MAJOR_INCIDENT, NAVIGATION_OVERVIEW`);
                // Attempt to recover by showing CLAIM_TYPE (start of flow)
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$ClaimTypeStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimTypeStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 144,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            initial: false,
            mode: "wait",
            children: renderStep()
        }, void 0, false, {
            fileName: "[project]/src/components/ClaimFlowManager.tsx",
            lineNumber: 150,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ClaimFlowManager.tsx",
        lineNumber: 149,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ClaimFlowManager;
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ClaimFlowManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ClaimFlowManager.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ClaimFlowManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__39a5489b._.js.map