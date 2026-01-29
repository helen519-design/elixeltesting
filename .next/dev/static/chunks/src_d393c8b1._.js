(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/navigation-logic.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
        nextStep: 'Q8'
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
        label: 'Have you consulted your GP about this?',
        component: 'Step9GPConsultation.tsx',
        nextStep: (state)=>{
            // Fast-track path exits early
            return state.gpConsultationType === 'fast_track' ? 'END_FAST_TRACK' : 'Q10';
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
        label: 'For which service were you referred?',
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
        component: 'StepOutcome.tsx',
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
    // Onboarding
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
    if (currentStep === 'Q11') return 'Q10';
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
        case 'ONBOARDING':
            // Onboarding is informational only, always can proceed
            return true;
        case 'Q1':
            // Check both direct property and responses object for claimant selection
            return !!(state.claimant || state.responses?.claimant);
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
            // Q5 requires mode selection and a date (exact or estimated)
            // Confirmation checkbox is optional for better UX
            return !!(state.symptomStartDate?.mode && (state.symptomStartDate?.exactDate || state.symptomStartDate?.estimatedStartDate));
        case 'Q6':
            // Q6 only asks Yes/No - previous symptom date is not collected
            // Just answering the question is sufficient to proceed
            return state.hasPreviousSymptoms !== null && state.hasPreviousSymptoms !== undefined;
        case 'Q7':
            return !!state.injuryDetails?.type;
        case 'Q8':
            if (state.hasLegalResponsibility === false) {
                return true;
            }
            return !!(state.hasLegalResponsibility === true && state.solicitorDetails && state.solicitorDetails.dateOfIncident && state.solicitorDetails.solicitorName);
        case 'Q9':
            return state.gpConsultationType !== null && state.gpConsultationType !== undefined;
        case 'Q10':
            // Q10 requires mode selection and a date (exact or estimated)
            // Confirmation checkbox is optional for better UX
            return !!(state.referralDate?.mode && (state.referralDate?.exactDate || state.referralDate?.estimatedStartDate));
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClaimProvider",
    ()=>ClaimProvider,
    "useClaim",
    ()=>useClaim
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/navigation-logic.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// 1. Initial State
const initialState = {
    currentStep: 'ONBOARDING',
    responses: {},
    history: []
};
// 2. Reducer Logic
function claimReducer(state, action) {
    switch(action.type){
        case 'UPDATE_FIELD':
            return {
                ...state,
                responses: {
                    ...state.responses,
                    [action.payload.field]: action.payload.value
                },
                // Also set as direct property for easy access
                [action.payload.field]: action.payload.value
            };
        case 'NEXT_STEP':
            {
                const nextStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextStep"])(state.currentStep, state);
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
                currentStep: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPreviousStep"])(state.currentStep, state) ?? state.currentStep,
                history: state.history.slice(0, -1)
            };
        default:
            return state;
    }
}
const ClaimContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ClaimProvider = ({ children })=>{
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(claimReducer, initialState);
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canProceedFromStep"])(state.currentStep, state);
        } catch  {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ClaimContext.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ClaimProvider, "6JWkGZ32UPfojeNx+xqn8ZU8A0Q=");
_c = ClaimProvider;
const useClaim = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ClaimContext);
    if (!context) {
        throw new Error('useClaim must be used within a ClaimProvider');
    }
    return context;
};
_s1(useClaim, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ClaimProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/TopBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopBar",
    ()=>TopBar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const TopBar = ()=>{
    const handleExit = ()=>{
        // TODO: Add exit confirmation dialog
        if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
            window.location.href = '/';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between w-full h-[56px] m-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-[12px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#0055b7] flex items-center justify-center h-[64px] px-[10px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/assets/wpaLogo.svg",
                            alt: "WPA Logo",
                            className: "w-[65px] h-[48px]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/TopBar.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[48px] w-px bg-[#d2d3d6]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[18px] font-normal leading-normal text-[#4d4f5c]",
                            children: "New Claim"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/TopBar.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/TopBar.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleExit,
                className: "flex items-center justify-center gap-[2px] h-[48px] px-[24px] py-[16px] bg-white border-[1px] border-solid border-[#0055b7] rounded-[8px] text-[16px] font-semibold text-[#0055b7] leading-[28px] tracking-[0.1px] hover:bg-gray-50 transition",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-[20px] h-[20px]",
                        viewBox: "0 0 20 20",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M7.5 15L12.5 10L7.5 5",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/TopBar.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Exit"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/TopBar.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/TopBar.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = TopBar;
const __TURBOPACK__default__export__ = TopBar;
var _c;
__turbopack_context__.k.register(_c, "TopBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/StageTrackerBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StageTrackerBar",
    ()=>StageTrackerBar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/navigation-logic.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const StageTrackerBar = ()=>{
    _s();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const activeIndex = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].findIndex((stage)=>stage.steps.includes(state.currentStep));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Claim progress",
        className: "flex items-center justify-between gap-2",
        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].map((stage, index)=>{
            const isActive = index === activeIndex;
            const isCompleted = activeIndex > index;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center w-full",
                        children: [
                            index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `h-[2px] flex-1 transition-colors ${isCompleted ? 'bg-brand-primary' : 'bg-gray-200'}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                                lineNumber: 40,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex h-4 w-4 items-center justify-center rounded-full border border-white shadow-sm transition-colors ${isActive ? 'bg-brand-primary' : isCompleted ? 'bg-brand-primary-hover' : 'bg-gray-200'}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                                lineNumber: 48,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            index < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `h-[2px] flex-1 transition-colors ${activeIndex > index ? 'bg-brand-primary' : 'bg-gray-200'}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                                lineNumber: 60,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                        lineNumber: 37,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `mt-[10px] text-sm leading-6 text-center font-medium truncate transition-colors ${isActive ? 'text-brand-primary' : 'text-gray-700'}`,
                        children: stage.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                        lineNumber: 69,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, stage.id, true, {
                fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
                lineNumber: 35,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/src/components/ui/StageTrackerBar.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StageTrackerBar, "xjxTo/X+AKU6ZpFM1C+9eqhBE8Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = StageTrackerBar;
const __TURBOPACK__default__export__ = StageTrackerBar;
var _c;
__turbopack_context__.k.register(_c, "StageTrackerBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/GlobalActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalActions",
    ()=>GlobalActions,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const GlobalActions = ()=>{
    _s();
    const { state, dispatch, canProceed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    // Hide GlobalActions on the final success/outcome screen
    if (state.currentStep === 'OUTCOME' || state.currentStep === 'END_FAST_TRACK') {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-[#F9FAFB]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-4xl px-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 gap-[16px] items-center min-h-px min-w-px relative py-[24px]",
                children: [
                    !isFirstStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handlePreviousStep,
                        className: "bg-white border-[#0055b7] border-[1px] border-solid flex gap-0 h-[64px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0 transition hover:bg-gray-50 active:bg-gray-100",
                        "aria-label": "Go back to previous step",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-[2px] items-center justify-center relative shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-clip relative shrink-0 w-[20px] h-[20px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-full h-full",
                                    viewBox: "0 0 20 20",
                                    fill: "none",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleNextStep,
                        disabled: isContinueDisabled,
                        className: `flex gap-0 h-[64px] items-center justify-center min-w-[280px] px-[24px] py-[16px] relative rounded-[8px] shrink-0 transition-all duration-200 ${isContinueDisabled ? 'bg-[#d2d3d6] text-[#949494] cursor-not-allowed opacity-60' : 'bg-[#0055b7] text-white hover:bg-[#1276c0] active:bg-[#004494] opacity-100'}`,
                        "aria-label": isContinueDisabled ? 'Complete required fields to continue' : isOnboarding ? 'Start your claim' : isReviewStep ? 'Submit your claim' : 'Continue to next step',
                        "aria-disabled": isContinueDisabled,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-[2px] items-center justify-center relative shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center tracking-[0.1px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(GlobalActions, "dYuzYjFLbFDiKivZJSff+lN/RpM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = GlobalActions;
const __TURBOPACK__default__export__ = GlobalActions;
var _c;
__turbopack_context__.k.register(_c, "GlobalActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AppShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/TopBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StageTrackerBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/StageTrackerBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$GlobalActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/GlobalActions.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
    _s();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const isOnboarding = state.currentStep === 'ONBOARDING';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#F9FAFB] text-gray-700 flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "fixed inset-x-0 top-0 z-50 bg-white border-b border-[#d2d3d6]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-4xl px-6 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$TopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/AppShell.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[64px] flex-shrink-0",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: [
                    !isOnboarding && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#fafbfb]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-4xl px-6 py-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StageTrackerBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StageTrackerBar"], {}, void 0, false, {
                                fileName: "[project]/src/components/AppShell.tsx",
                                lineNumber: 45,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppShell.tsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: `w-full py-8 ${isOnboarding ? '' : 'mx-auto max-w-4xl px-6'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedStepContainer, {
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppShell.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$GlobalActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlobalActions"], {}, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AppShellContent, "xjxTo/X+AKU6ZpFM1C+9eqhBE8Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = AppShellContent;
const AppShell = ({ children })=>{
    // Don't create a new ClaimProvider here - use the one from page.tsx
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppShellContent, {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 64,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = AppShell;
const AnimatedStepContainer = ({ children })=>{
    _s1();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        initial: false,
        mode: "wait",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
            lineNumber: 72,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(AnimatedStepContainer, "xjxTo/X+AKU6ZpFM1C+9eqhBE8Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c2 = AnimatedStepContainer;
const __TURBOPACK__default__export__ = AppShell;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AppShellContent");
__turbopack_context__.k.register(_c1, "AppShell");
__turbopack_context__.k.register(_c2, "AnimatedStepContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/OnboardingStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnboardingStep",
    ()=>OnboardingStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const OnboardingStep = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-[1440px] mx-auto px-24 py-12 flex gap-24 items-start",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-12 max-w-[720px] min-w-[360px] w-[600px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[36px] leading-[48px] font-semibold text-[#4d4f5c]",
                                children: "Let's get your claim started"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 20,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[16px] leading-[24px] text-[#2e2f37]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-0",
                                        children: "We've designed this process to be as simple as possible."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 25,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-0",
                                        children: [
                                            "It usually takes about ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold",
                                                children: "5–10 minutes"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                lineNumber: 29,
                                                columnNumber: 38
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " to complete. To make things even easier, we recommend getting some of these information ready:"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 28,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-[15px] h-[15px]",
                                            viewBox: "0 0 15 15",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 45,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.625 1.875V13.125M8.625 2.8125V12.1875",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 53,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 39,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[16px] leading-[20px] font-medium text-[#4d4f5c]",
                                        children: "When you first experienced symptom"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 62,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-[15px] h-[15px]",
                                            viewBox: "0 0 15 15",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.625 1.875V13.125M8.625 2.8125V12.1875",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 69,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[16px] leading-[20px] font-medium text-[#4d4f5c] flex-1",
                                        children: "If you have had any previous or ongoing treatment for the same or similar condition"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#ffd271] rounded-xl w-6 h-6 flex items-center justify-center flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-[15px] h-[15px]",
                                            viewBox: "0 0 15 15",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.625 2.8125L5.625 1.875L1.875 3.75V12.1875L5.625 13.125L8.625 12.1875L12.375 13.125V4.6875L8.625 2.8125Z",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.625 1.875V13.125M8.625 2.8125V12.1875",
                                                    stroke: "#4d4f5c",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 101,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[16px] leading-[20px] font-medium text-[#4d4f5c]",
                                        children: "When did you get your GP referral"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border border-[#d2d3d6] rounded-2xl p-8 flex flex-col gap-6 w-[559px] flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[18px] leading-normal font-semibold text-[#4d4f5c]",
                                children: "New to this? Watch a quick walkthrough"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[16px] leading-[24px] text-[#4d4f5c]",
                                children: "If you'd like to see exactly how the process works before you dive in, our 90-second video guides you through every step."
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full aspect-video rounded-lg overflow-hidden bg-[#f0f0f0]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-br from-[#ffd271] to-[#ffb347]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "w-[82.6px] h-[82.6px] rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200 shadow-lg",
                                    "aria-label": "Play video",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-[47.2px] h-[47.2px] ml-1",
                                        viewBox: "0 0 48 48",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M17 12L35 24L17 36V12Z",
                                            fill: "#0055b7"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 159,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-[18px] leading-normal font-semibold text-[#4d4f5c]",
                                children: "Prefer reading instead?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-0.5 py-4 text-[#0055b7] hover:text-[#1276c0] transition-colors duration-200",
                                "aria-label": "Read video transcript",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                        children: "Read video transcript"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        viewBox: "0 0 16 16",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M6 12L10 8L6 4",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                            lineNumber: 185,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/OnboardingStep.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/OnboardingStep.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = OnboardingStep;
var _c;
__turbopack_context__.k.register(_c, "OnboardingStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/QuestionTag.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QuestionTag",
    ()=>QuestionTag,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const QuestionTag = ({ partLabel, currentIndex, total, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `inline-flex items-center self-start rounded-lg bg-[#cce9fb] px-4 py-2 text-sm font-medium text-[#0055b7] ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_c = QuestionTag;
const __TURBOPACK__default__export__ = QuestionTag;
var _c;
__turbopack_context__.k.register(_c, "QuestionTag");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QuestionLayout",
    ()=>QuestionLayout,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionTag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionTag.tsx [app-client] (ecmascript)");
;
;
const QuestionLayout = ({ partLabel, currentIndex, total, question, description, children, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `flex flex-col max-w-question ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionTag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionTag"], {
                partLabel: partLabel,
                currentIndex: currentIndex,
                total: total
            }, void 0, false, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mt-6 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl leading-10 font-semibold text-gray-700",
                        children: question
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[16px] leading-[28px] font-normal text-[#4d4f5c]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 space-y-4",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = QuestionLayout;
const __TURBOPACK__default__export__ = QuestionLayout;
var _c;
__turbopack_context__.k.register(_c, "QuestionLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/OptionChip.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OptionChip",
    ()=>OptionChip,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const OptionChip = ({ label, description, icon, selected = false, disabled = false, onClick, className = '' })=>{
    const baseClasses = 'w-full min-w-[280px] max-w-[600px] text-left rounded-lg transition flex items-start gap-2';
    const stateClasses = selected ? 'border-[2px] border-[#0055b7] bg-white px-[15px] py-[11px]' : 'border-[1px] border-[#d2d3d6] bg-white px-4 py-3 hover:border-[#0055b7]/60 hover:bg-gray-50';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:border-[#d2d3d6] hover:bg-white' : 'cursor-pointer';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: disabled,
        onClick: onClick,
        className: `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`,
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: icon,
                alt: "",
                className: "w-9 h-9 flex-shrink-0",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/OptionChip.tsx",
                lineNumber: 52,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex flex-col flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[18px] leading-[32px] font-medium text-[#4d4f5c]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/OptionChip.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[16px] leading-[28px] font-normal text-[#8a8c95]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/OptionChip.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/OptionChip.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/OptionChip.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = OptionChip;
const __TURBOPACK__default__export__ = OptionChip;
var _c;
__turbopack_context__.k.register(_c, "OptionChip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OptionChipGroup",
    ()=>OptionChipGroup,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChip.tsx [app-client] (ecmascript)");
;
;
const OptionChipGroup = ({ options, value, onChange, disabled = false, layout = 'vertical', className = '' })=>{
    const layoutClasses = layout === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-3';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${layoutClasses} ${className}`,
        children: options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OptionChip"], {
                label: opt.label,
                description: opt.description,
                icon: opt.icon,
                selected: value === opt.value,
                disabled: disabled,
                onClick: ()=>onChange(opt.value)
            }, String(opt.label), false, {
                fileName: "[project]/src/components/ui/OptionChipGroup.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/OptionChipGroup.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = OptionChipGroup;
const __TURBOPACK__default__export__ = OptionChipGroup;
var _c;
__turbopack_context__.k.register(_c, "OptionChipGroup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step1Who.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step1Who",
    ()=>Step1Who,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const Step1Who = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Step1Who.useMemo[options]": ()=>[
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
            ]
    }["Step1Who.useMemo[options]"], []);
    const claimant = state.responses.claimant;
    const selectedValue = claimant ? claimant.relationship === 'Self' ? 'self' : 'other' : null;
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'claimant',
                value: {
                    id: value,
                    name: value === 'self' ? 'Policy holder' : 'Dependant',
                    relationship: value === 'self' ? 'Self' : 'Dependant'
                }
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Claim details",
        currentIndex: 1,
        total: 2,
        question: "Who do you want to claim for?",
        description: "Didn't see the person you want to claim for?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: selectedValue,
            onChange: handleSelect,
            layout: "horizontal"
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step1Who.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step1Who.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step1Who, "Ji7vvGcjJ7HlJwnI191sdUJjLwM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step1Who;
const __TURBOPACK__default__export__ = Step1Who;
var _c;
__turbopack_context__.k.register(_c, "Step1Who");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step2Insurance.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step2Insurance",
    ()=>Step2Insurance,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const Step2Insurance = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const hasOtherInsurance = state.responses.hasOtherInsurance;
    const coverDetails = state.responses.otherMedicalCover ?? {};
    // Automatically show form if user previously selected "Yes"
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(hasOtherInsurance === true);
    // Update showForm when hasOtherInsurance changes or component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Step2Insurance.useEffect": ()=>{
            if (hasOtherInsurance === true) {
                setShowForm(true);
            }
        }
    }["Step2Insurance.useEffect"], [
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
            partLabel: "Claim details",
            currentIndex: 2,
            total: 2,
            question: "Do you have other medical insurance with another company?",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleReselect,
                        className: "flex items-center gap-0.5 py-4 text-[#0055b7] hover:text-[#1276c0] transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-4 h-4",
                                viewBox: "0 0 16 16",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[18px] leading-[32px] font-medium text-[#4d4f5c]",
                        children: "Please tell us more about your medical cover."
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-x-12 gap-y-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[32px] font-normal text-[#4d4f5c]",
                                        children: "Are you a subscriber or dependant?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-4",
                                        children: [
                                            'Subscriber',
                                            'Dependant'
                                        ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[32px] font-normal text-[#4d4f5c]",
                                        children: "Which type does your policy belong to?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-4",
                                        children: [
                                            'PMI',
                                            'Cash Plan'
                                        ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[1.4] font-normal text-[#1e1e1e]",
                                        children: "Which insurer is your policy with?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-[360px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: coverDetails.insurerName ?? '',
                                                onChange: (e)=>handleFieldChange('insurerName', e.target.value),
                                                className: "w-full h-[60px] px-4 py-3 bg-white border border-[#d2d3d6] rounded-md text-[16px] leading-[28px] text-[#4d4f5c] appearance-none cursor-pointer focus:outline-none focus:border-[#0055b7]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select your insurer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Bupa",
                                                        children: "Bupa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Aviva",
                                                        children: "Aviva"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "AXA",
                                                        children: "AXA"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Vitality",
                                                        children: "Vitality"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[1.4] font-normal text-[#1e1e1e]",
                                        children: "What's your policy or customer number?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-1 space-y-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[18px] leading-[32px] font-normal text-[#4d4f5c]",
                                        children: "Have you advised the other insurer of this claim?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step2Insurance.tsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Claim details",
        currentIndex: 2,
        total: 2,
        question: "Do you have other medical insurance with another company?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
_s(Step2Insurance, "z2wutORICeHBeUm44Z6PDinWhqA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step2Insurance;
const __TURBOPACK__default__export__ = Step2Insurance;
var _c;
__turbopack_context__.k.register(_c, "Step2Insurance");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step3KnowCondition.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step3KnowCondition",
    ()=>Step3KnowCondition,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const Step3KnowCondition = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 1,
        total: 6,
        question: "Do you know what condition you have?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
_s(Step3KnowCondition, "Lg0esL6W4VmXLMAY+3PGAFP0jdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step3KnowCondition;
const __TURBOPACK__default__export__ = Step3KnowCondition;
var _c;
__turbopack_context__.k.register(_c, "Step3KnowCondition");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/SearchInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchInput",
    ()=>SearchInput,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const SearchInput = ({ value, onChange, placeholder = 'Please enter your diagnosis', autoFocus, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full max-w-[576px] ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex w-full items-center gap-[8px] overflow-clip rounded-[8px] border border-[#d2d3d6] bg-white p-[16px]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
_c = SearchInput;
const __TURBOPACK__default__export__ = SearchInput;
var _c;
__turbopack_context__.k.register(_c, "SearchInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/LoadingIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoadingIndicator",
    ()=>LoadingIndicator,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const LoadingIndicator = ({ label = 'Loading…', className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-3 text-[#4d4f5c] ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#d2d3d6] border-t-[#0055b7]",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/LoadingIndicator.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_c = LoadingIndicator;
const __TURBOPACK__default__export__ = LoadingIndicator;
var _c;
__turbopack_context__.k.register(_c, "LoadingIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/SnomedResultTile.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SnomedResultTile",
    ()=>SnomedResultTile,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const SnomedResultTile = ({ code, name, description, onConfirm, onSomethingElse, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `rounded-lg border border-[#d2d3d6] bg-white px-4 py-3 shadow-sm ${className}`,
        "aria-label": `Search result ${name}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[14px] leading-[24px] text-[#949494]",
                        children: code
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[16px] leading-[28px] font-medium text-[#4d4f5c]",
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[14px] leading-[24px] text-[#4d4f5c] opacity-80",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onConfirm,
                        className: "inline-flex h-11 items-center justify-center rounded-lg bg-[#0055b7] px-4 text-[16px] leading-[28px] font-medium text-white transition hover:bg-[#1276c0]",
                        children: "Sounds like it"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onSomethingElse,
                        className: "inline-flex h-11 items-center justify-center rounded-lg border border-[#d2d3d6] px-4 text-[16px] leading-[28px] font-medium text-[#4d4f5c] transition hover:bg-[#f6f6f7]",
                        children: "Something else"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SnomedResultTile;
const __TURBOPACK__default__export__ = SnomedResultTile;
var _c;
__turbopack_context__.k.register(_c, "SnomedResultTile");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/ModalOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModalOverlay",
    ()=>ModalOverlay,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const ModalOverlay = ({ open, onClose, title, children, className = '' })=>{
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": title ? 'modal-title' : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/40",
                onClick: onClose,
                onKeyDown: (e)=>e.key === 'Escape' && onClose(),
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative w-full max-w-md rounded-lg border border-[#d2d3d6] bg-white p-4 shadow-lg ${className}`,
                onClick: (e)=>e.stopPropagation(),
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        id: "modal-title",
                        className: "text-[18px] leading-[32px] font-medium text-[#4d4f5c] mb-3",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onClose,
                        className: "absolute top-3 right-3 text-[#4d4f5c] hover:text-[#0055b7] focus:outline-none",
                        "aria-label": "Close",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xl leading-none",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ModalOverlay.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ModalOverlay;
const __TURBOPACK__default__export__ = ModalOverlay;
var _c;
__turbopack_context__.k.register(_c, "ModalOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useSnomed.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step4SymptomKnown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step4SymptomKnown",
    ()=>Step4SymptomKnown,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SearchInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/LoadingIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SnomedResultTile.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ModalOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSnomed.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [suggestions, setSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [suggestionsLoading, setSuggestionsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSearchChange = async (value)=>{
        setQuery(value);
        if (!value.trim()) {
            setResult(null);
            return;
        }
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSnomed"])(value);
            setResult(res);
        } finally{
            setLoading(false);
        }
    };
    const handleConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Step4SymptomKnown.useCallback[handleConfirm]": ()=>{
            if (!result) return;
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'symptom',
                    value: {
                        snomedCode: result,
                        userInput: query,
                        isConfirmed: true
                    }
                }
            });
        }
    }["Step4SymptomKnown.useCallback[handleConfirm]"], [
        result,
        query,
        dispatch
    ]);
    const handleSomethingElse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Step4SymptomKnown.useCallback[handleSomethingElse]": async ()=>{
            setResult(null);
            setModalOpen(true);
            const searchQuery = query.trim() || 'symptom';
            setSuggestionsLoading(true);
            try {
                const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSnomedSuggestions"])(searchQuery, SUGGESTION_LIMIT);
                setSuggestions(list);
            } finally{
                setSuggestionsLoading(false);
            }
        }
    }["Step4SymptomKnown.useCallback[handleSomethingElse]"], [
        query
    ]);
    const handleSelectSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Step4SymptomKnown.useCallback[handleSelectSuggestion]": (code)=>{
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'symptom',
                    value: {
                        snomedCode: code,
                        userInput: code.name,
                        isConfirmed: true
                    }
                }
            });
            setModalOpen(false);
            setSuggestions([]);
            setQuery(code.name);
        }
    }["Step4SymptomKnown.useCallback[handleSelectSuggestion]"], [
        dispatch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 2,
        total: 6,
        question: "Can you share with us the diagnosis?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchInput"], {
                value: query,
                onChange: handleSearchChange,
                placeholder: "Please enter your diagnosis",
                autoFocus: true
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                label: "Looking up SNOMED matches…"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 96,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            !loading && result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SnomedResultTile"], {
                code: result.code,
                name: result.name,
                description: result.description,
                onConfirm: handleConfirm,
                onSomethingElse: handleSomethingElse
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: modalOpen,
                onClose: ()=>{
                    setModalOpen(false);
                    setSuggestions([]);
                },
                title: "Choose a suggestion",
                children: suggestionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                    label: "Loading suggestions…"
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        suggestions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleSelectSuggestion(item),
                                className: "w-full rounded-lg border border-[#d2d3d6] bg-white p-3 text-left transition hover:border-[#0055b7] hover:bg-[#f6f6f7]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[14px] leading-[24px] text-[#949494]",
                                        children: item.code
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium text-[16px] leading-[28px] text-[#4d4f5c]",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                        lineNumber: 125,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[14px] leading-[24px] text-[#4d4f5c] opacity-80",
                                        children: item.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                        lineNumber: 127,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.code, true, {
                                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                lineNumber: 118,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))),
                        !suggestionsLoading && suggestions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[14px] leading-[24px] text-[#4d4f5c]",
                            children: "No suggestions found. Try searching again."
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                            lineNumber: 132,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                setModalOpen(false);
                                setSuggestions([]);
                            },
                            className: "mt-2 w-full rounded-lg border border-[#d2d3d6] px-4 py-2 text-[16px] leading-[28px] font-medium text-[#4d4f5c] hover:bg-[#f6f6f7]",
                            children: "Search again"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                    lineNumber: 116,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step4SymptomKnown, "pYbXLzgbtgDGh6sJnqmGOQYnXXI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step4SymptomKnown;
const __TURBOPACK__default__export__ = Step4SymptomKnown;
var _c;
__turbopack_context__.k.register(_c, "Step4SymptomKnown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step4SymptomDescribe.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step4SymptomDescribe",
    ()=>Step4SymptomDescribe,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SearchInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/LoadingIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SnomedResultTile.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ModalOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSnomed.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [suggestions, setSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [suggestionsLoading, setSuggestionsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recommendationStage, setRecommendationStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('initial');
    const [partialQuery, setPartialQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSearchChange = async (value)=>{
        setQuery(value);
        if (!value.trim()) {
            setResult(null);
            // Reset recommendation stage if query is cleared
            setRecommendationStage('initial');
            setPartialQuery('');
            return;
        }
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSnomed"])(value);
            setResult(res);
        } finally{
            setLoading(false);
        }
    };
    const handleRecommendationClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Step4SymptomDescribe.useCallback[handleRecommendationClick]": (recommendation)=>{
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
                handleSearchChange(completeQuery);
                // Reset to initial stage for next time
                setRecommendationStage('initial');
                setPartialQuery('');
            }
        }
    }["Step4SymptomDescribe.useCallback[handleRecommendationClick]"], [
        recommendationStage,
        partialQuery
    ]);
    const handleConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Step4SymptomDescribe.useCallback[handleConfirm]": ()=>{
            if (!result) return;
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'symptom',
                    value: {
                        snomedCode: result,
                        userInput: query,
                        isConfirmed: true
                    }
                }
            });
        }
    }["Step4SymptomDescribe.useCallback[handleConfirm]"], [
        result,
        query,
        dispatch
    ]);
    const handleSomethingElse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Step4SymptomDescribe.useCallback[handleSomethingElse]": async ()=>{
            setResult(null);
            setModalOpen(true);
            const searchQuery = query.trim() || 'symptom';
            setSuggestionsLoading(true);
            try {
                const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSnomed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSnomedSuggestions"])(searchQuery, SUGGESTION_LIMIT);
                setSuggestions(list);
            } finally{
                setSuggestionsLoading(false);
            }
        }
    }["Step4SymptomDescribe.useCallback[handleSomethingElse]"], [
        query
    ]);
    const handleSelectSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Step4SymptomDescribe.useCallback[handleSelectSuggestion]": (code)=>{
            dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    field: 'symptom',
                    value: {
                        snomedCode: code,
                        userInput: code.name,
                        isConfirmed: true
                    }
                }
            });
            setModalOpen(false);
            setSuggestions([]);
            setQuery(code.name);
        }
    }["Step4SymptomDescribe.useCallback[handleSelectSuggestion]"], [
        dispatch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 3,
        total: 6,
        question: "How would you describe your main symptom?",
        description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-0 leading-[28px]",
                    children: "Describe to us the main symptom you're experiencing."
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                    lineNumber: 131,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "list-disc",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "mb-0 ms-[24px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-[28px]",
                                children: "You may want to think about:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 134,
                                columnNumber: 15
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 133,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "mb-0 ms-[24px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-[28px]",
                                children: "What body part is affected?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 137,
                                columnNumber: 15
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 136,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "mb-0 ms-[24px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-[28px]",
                                children: "What did you feel and how severe it is?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 140,
                                columnNumber: 15
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 139,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "ms-[24px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-[28px]",
                                children: "How long did it last or how frequent did that happen?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 143,
                                columnNumber: 15
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                    lineNumber: 132,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchInput"], {
                value: query,
                onChange: handleSearchChange,
                placeholder: "E.g. a sharp pain in my front knee",
                autoFocus: true
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                label: "Looking up SNOMED matches…"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 156,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            !loading && result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SnomedResultTile"], {
                code: result.code,
                name: result.name,
                description: result.description,
                onConfirm: handleConfirm,
                onSomethingElse: handleSomethingElse
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 159,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: modalOpen,
                onClose: ()=>{
                    setModalOpen(false);
                    setSuggestions([]);
                },
                title: "Choose a suggestion",
                children: suggestionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                    label: "Loading suggestions…"
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        suggestions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleSelectSuggestion(item),
                                className: "w-full rounded-lg border border-[#d2d3d6] bg-white p-3 text-left transition hover:border-[#0055b7] hover:bg-[#f6f6f7]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[14px] leading-[24px] text-[#949494]",
                                        children: item.code
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium text-[16px] leading-[28px] text-[#4d4f5c]",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                        lineNumber: 185,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[14px] leading-[24px] text-[#4d4f5c] opacity-80",
                                        children: item.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                        lineNumber: 187,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.code, true, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 178,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))),
                        !suggestionsLoading && suggestions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[14px] leading-[24px] text-[#4d4f5c]",
                            children: "No suggestions found. Try searching again."
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 192,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                setModalOpen(false);
                                setSuggestions([]);
                            },
                            className: "mt-2 w-full rounded-lg border border-[#d2d3d6] px-4 py-2 text-[16px] leading-[28px] font-medium text-[#4d4f5c] hover:bg-[#f6f6f7]",
                            children: "Search again"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                    lineNumber: 176,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step4SymptomDescribe, "grcCg5Y//52329r0qSngC7ayBcg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step4SymptomDescribe;
const __TURBOPACK__default__export__ = Step4SymptomDescribe;
var _c;
__turbopack_context__.k.register(_c, "Step4SymptomDescribe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step5SymptomStart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step5SymptomStart",
    ()=>Step5SymptomStart,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const Step5SymptomStart = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const symptomStartDate = state.responses.symptomStartDate || {};
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(symptomStartDate.mode);
    const dateOptions = [
        {
            label: 'I know the exact date',
            value: 'exact'
        },
        {
            label: 'I roughly remember',
            value: 'approximate'
        }
    ];
    const handleModeChange = (value)=>{
        setMode(value);
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'symptomStartDate',
                value: {
                    mode: value,
                    isConfirmed: false
                }
            }
        });
    };
    const handleExactDateChange = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'symptomStartDate',
                value: {
                    mode: 'exact',
                    exactDate: value || null,
                    estimatedStartDate: null,
                    approximateMonth: null,
                    isConfirmed: !!value
                }
            }
        });
    };
    const handleApproxMonthChange = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'symptomStartDate',
                value: {
                    mode: 'approximate',
                    approximateMonth: value || null,
                    estimatedStartDate: value ? `${value}-01` : null,
                    exactDate: null,
                    isConfirmed: false
                }
            }
        });
    };
    const handleConfirmEstimatedDate = ()=>{
        const symptomDate = state.responses.symptomStartDate || {};
        const month = symptomDate.approximateMonth;
        if (!month) return;
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'symptomStartDate',
                value: {
                    ...symptomDate,
                    isConfirmed: true,
                    estimatedStartDate: `${month}-01`
                }
            }
        });
    };
    const symptomDate = state.responses.symptomStartDate || {};
    const approximateMonth = symptomDate.approximateMonth;
    const estimatedDateLabel = approximateMonth ? (()=>{
        const [y, m] = approximateMonth.split('-');
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const monthName = monthNames[parseInt(m, 10) - 1] || m;
        return `1 ${monthName} ${y}`;
    })() : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 4,
        total: 6,
        question: "When did you first start feeling unwell or notice this symptom?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                options: dateOptions,
                value: mode,
                onChange: handleModeChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            mode === 'exact' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[14px] leading-[24px] text-[#4d4f5c] mb-1",
                        children: "Exact date"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        value: symptomStartDate.exactDate ?? '',
                        onChange: (e)=>handleExactDateChange(e.target.value),
                        className: "w-full rounded-lg border border-[#d2d3d6] px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                lineNumber: 104,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            mode === 'approximate' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-[14px] leading-[24px] text-[#4d4f5c] mb-1",
                                children: "Roughly when was this?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "month",
                                value: symptomStartDate.approximateMonth ?? '',
                                onChange: (e)=>handleApproxMonthChange(e.target.value),
                                className: "w-full rounded-lg border border-[#d2d3d6] px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    approximateMonth && !symptomStartDate.isConfirmed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border border-[#cce9fb] bg-[#cce9fb]/30 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[14px] leading-[24px] text-[#4d4f5c] mb-2",
                                children: [
                                    "Estimated start date: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: estimatedDateLabel
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                        lineNumber: 133,
                                        columnNumber: 39
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                lineNumber: 132,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleConfirmEstimatedDate,
                                className: "rounded-lg bg-[#0055b7] px-4 py-2 text-[14px] leading-[24px] font-medium text-white hover:bg-[#1276c0]",
                                children: "Confirm estimated date"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                lineNumber: 135,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                        lineNumber: 131,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step5SymptomStart, "Rgm6teHfURbHDD2liIMIXsD0TZ4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step5SymptomStart;
const __TURBOPACK__default__export__ = Step5SymptomStart;
var _c;
__turbopack_context__.k.register(_c, "Step5SymptomStart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step6PreviousSymptoms.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step6PreviousSymptoms",
    ()=>Step6PreviousSymptoms,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const Step6PreviousSymptoms = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const options = [
        {
            label: 'Yes',
            value: true
        },
        {
            label: 'No',
            value: false
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
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Symptoms & condition",
        currentIndex: 5,
        total: 6,
        question: "Have you ever dealt with this, or very similar symptoms in the past?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: state.responses.hasPreviousSymptoms,
            onChange: handleSelect
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step6PreviousSymptoms, "Lg0esL6W4VmXLMAY+3PGAFP0jdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step6PreviousSymptoms;
const __TURBOPACK__default__export__ = Step6PreviousSymptoms;
var _c;
__turbopack_context__.k.register(_c, "Step6PreviousSymptoms");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/MiniFormInjury.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MiniFormInjuryAttack",
    ()=>MiniFormInjuryAttack,
    "MiniFormInjuryOther",
    ()=>MiniFormInjuryOther,
    "MiniFormInjurySporting",
    ()=>MiniFormInjurySporting,
    "MiniFormInjuryTraffic",
    ()=>MiniFormInjuryTraffic,
    "MiniFormInjuryTripFall",
    ()=>MiniFormInjuryTripFall
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const inputClass = 'w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#949494] focus:outline-none focus:border-[#0055b7]';
const labelClass = 'block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1';
const chipClass = (selected)=>`rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${selected ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]' : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'}`;
const MiniFormInjurySporting = ({ injuryDetails, onChange, className = '' })=>{
    const d = injuryDetails.sporting || {
        sport: '',
        country: '',
        receivedDonation: null
    };
    const update = (u)=>onChange({
            sporting: {
                ...d,
                ...u
            }
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-sporting",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Where did this happen?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.country,
                        onChange: (e)=>update({
                                country: e.target.value
                            }),
                        placeholder: "e.g. United Kingdom",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Sport or activity"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.sport,
                        onChange: (e)=>update({
                                sport: e.target.value
                            }),
                        placeholder: "e.g. Football, Rugby",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Did you receive a donation or payment related to this activity?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>update({
                                        receivedDonation: true
                                    }),
                                className: chipClass(d.receivedDonation === true),
                                children: "Yes"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>update({
                                        receivedDonation: false
                                    }),
                                className: chipClass(d.receivedDonation === false),
                                children: "No"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = MiniFormInjurySporting;
const MiniFormInjuryTripFall = ({ injuryDetails, onChange, className = '' })=>{
    const d = injuryDetails.tripFall || {
        cause: '',
        country: '',
        wasWinterSport: null
    };
    const update = (u)=>onChange({
            tripFall: {
                ...d,
                ...u
            }
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-trip-fall",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Where did this happen?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.country,
                        onChange: (e)=>update({
                                country: e.target.value
                            }),
                        placeholder: "e.g. United Kingdom",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Cause"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.cause,
                        onChange: (e)=>update({
                                cause: e.target.value
                            }),
                        placeholder: "e.g. Slipped on wet floor",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Was this during winter sport?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>update({
                                        wasWinterSport: true
                                    }),
                                className: chipClass(d.wasWinterSport === true),
                                children: "Yes"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>update({
                                        wasWinterSport: false
                                    }),
                                className: chipClass(d.wasWinterSport === false),
                                children: "No"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = MiniFormInjuryTripFall;
const MiniFormInjuryTraffic = ({ injuryDetails, onChange, className = '' })=>{
    const d = injuryDetails.traffic || {
        role: null,
        incidentDescription: '',
        criminalProceedings: '',
        country: ''
    };
    const update = (u)=>onChange({
            traffic: {
                ...d,
                ...u
            }
        });
    const roles = [
        {
            value: 'motorcycle_bicycle',
            label: 'Motorcycle / Bicycle'
        },
        {
            value: 'motor_vehicle',
            label: 'Motor vehicle'
        },
        {
            value: 'pedestrian',
            label: 'Pedestrian'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-traffic",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Where did this happen?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.country,
                        onChange: (e)=>update({
                                country: e.target.value
                            }),
                        placeholder: "e.g. United Kingdom",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Your role"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: roles.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>update({
                                        role: r.value
                                    }),
                                className: chipClass(d.role === r.value),
                                children: r.label
                            }, r.value, false, {
                                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Incident description"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: d.incidentDescription,
                        onChange: (e)=>update({
                                incidentDescription: e.target.value
                            }),
                        placeholder: "Brief description",
                        rows: 3,
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Criminal proceedings"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.criminalProceedings,
                        onChange: (e)=>update({
                                criminalProceedings: e.target.value
                            }),
                        placeholder: "If applicable",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c2 = MiniFormInjuryTraffic;
const MiniFormInjuryAttack = ({ injuryDetails, onChange, className = '' })=>{
    const d = injuryDetails.attack || {
        cause: '',
        country: ''
    };
    const update = (u)=>onChange({
            attack: {
                ...d,
                ...u
            }
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-attack",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Where did this happen?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.country,
                        onChange: (e)=>update({
                                country: e.target.value
                            }),
                        placeholder: "e.g. United Kingdom",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Cause / circumstances"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.cause,
                        onChange: (e)=>update({
                                cause: e.target.value
                            }),
                        placeholder: "Brief description",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = MiniFormInjuryAttack;
const MiniFormInjuryOther = ({ injuryDetails, onChange, className = '' })=>{
    const other = injuryDetails.other ?? '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-other",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: labelClass,
                    children: "Please describe how this happened"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                    lineNumber: 175,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    value: other,
                    onChange: (e)=>onChange({
                            other: e.target.value
                        }),
                    placeholder: "Brief description",
                    rows: 3,
                    className: inputClass
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                    lineNumber: 176,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
            lineNumber: 174,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = MiniFormInjuryOther;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "MiniFormInjurySporting");
__turbopack_context__.k.register(_c1, "MiniFormInjuryTripFall");
__turbopack_context__.k.register(_c2, "MiniFormInjuryTraffic");
__turbopack_context__.k.register(_c3, "MiniFormInjuryAttack");
__turbopack_context__.k.register(_c4, "MiniFormInjuryOther");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step7HowHappened.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step7HowHappened",
    ()=>Step7HowHappened,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/MiniFormInjury.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const INJURY_OPTIONS = [
    {
        label: 'Sporting injury',
        value: 'sporting'
    },
    {
        label: 'Trip or fall',
        value: 'trip_fall'
    },
    {
        label: 'Traffic accident',
        value: 'traffic'
    },
    {
        label: 'Attack / assault',
        value: 'attack'
    },
    {
        label: 'Other',
        value: 'other'
    }
];
const Step7HowHappened = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const handleSelect = (value)=>{
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
    const handleInjuryChange = (updates)=>{
        const current = state.responses.injuryDetails || {
            type: null
        };
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'injuryDetails',
                value: {
                    ...current,
                    ...updates
                }
            }
        });
    };
    const injuryDetails = state.responses.injuryDetails || {
        type: null
    };
    const type = injuryDetails.type;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Background details",
        currentIndex: 1,
        total: 2,
        question: "How did this happen?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                options: INJURY_OPTIONS,
                value: type,
                onChange: handleSelect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'sporting' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniFormInjurySporting"], {
                    injuryDetails: injuryDetails,
                    onChange: handleInjuryChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                    lineNumber: 64,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'trip_fall' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniFormInjuryTripFall"], {
                    injuryDetails: injuryDetails,
                    onChange: handleInjuryChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                    lineNumber: 69,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'traffic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniFormInjuryTraffic"], {
                    injuryDetails: injuryDetails,
                    onChange: handleInjuryChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'attack' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniFormInjuryAttack"], {
                    injuryDetails: injuryDetails,
                    onChange: handleInjuryChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                    lineNumber: 79,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'other' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniFormInjuryOther"], {
                    injuryDetails: injuryDetails,
                    onChange: handleInjuryChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                    lineNumber: 84,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step7HowHappened, "Lg0esL6W4VmXLMAY+3PGAFP0jdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step7HowHappened;
const __TURBOPACK__default__export__ = Step7HowHappened;
var _c;
__turbopack_context__.k.register(_c, "Step7HowHappened");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/MiniFormSolicitor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MiniFormSolicitor",
    ()=>MiniFormSolicitor,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const inputClass = 'w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#949494] focus:outline-none focus:border-[#0055b7]';
const labelClass = 'block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1';
const MiniFormSolicitor = ({ value, onChange, className = '' })=>{
    const d = value ?? {
        dateOfIncident: null,
        solicitorName: '',
        caseHandler: '',
        solicitorAddress: '',
        solicitorPhone: '',
        solicitorEmail: '',
        caseReference: ''
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "question-8-legal-responsibility",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Date of incident"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        value: d.dateOfIncident ?? '',
                        onChange: (e)=>onChange({
                                dateOfIncident: e.target.value || null
                            }),
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Solicitor name"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.solicitorName,
                        onChange: (e)=>onChange({
                                solicitorName: e.target.value
                            }),
                        placeholder: "Name of solicitor or firm",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Case handler"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.caseHandler,
                        onChange: (e)=>onChange({
                                caseHandler: e.target.value
                            }),
                        placeholder: "If applicable",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Solicitor address"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.solicitorAddress,
                        onChange: (e)=>onChange({
                                solicitorAddress: e.target.value
                            }),
                        placeholder: "Address",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Phone"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "tel",
                        value: d.solicitorPhone,
                        onChange: (e)=>onChange({
                                solicitorPhone: e.target.value
                            }),
                        placeholder: "Phone number",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "email",
                        value: d.solicitorEmail,
                        onChange: (e)=>onChange({
                                solicitorEmail: e.target.value
                            }),
                        placeholder: "Email",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Case reference"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: d.caseReference,
                        onChange: (e)=>onChange({
                                caseReference: e.target.value
                            }),
                        placeholder: "If applicable",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = MiniFormSolicitor;
const __TURBOPACK__default__export__ = MiniFormSolicitor;
var _c;
__turbopack_context__.k.register(_c, "MiniFormSolicitor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step8Responsibility.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step8Responsibility",
    ()=>Step8Responsibility,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSolicitor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/MiniFormSolicitor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const options = [
        {
            label: 'Yes',
            value: true
        },
        {
            label: 'No',
            value: false
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Background details",
        currentIndex: 2,
        total: 2,
        question: "Is another person or company legally responsible for this condition?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                options: options,
                value: state.responses.hasLegalResponsibility,
                onChange: handleSelect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            state.responses.hasLegalResponsibility === true && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSolicitor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    value: state.responses.solicitorDetails,
                    onChange: handleSolicitorChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step8Responsibility, "Lg0esL6W4VmXLMAY+3PGAFP0jdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step8Responsibility;
const __TURBOPACK__default__export__ = Step8Responsibility;
var _c;
__turbopack_context__.k.register(_c, "Step8Responsibility");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step9GPConsultation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step9GPConsultation",
    ()=>Step9GPConsultation,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const Step9GPConsultation = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const options = [
        {
            label: 'Yes, I have seen my GP',
            value: 'yes'
        },
        {
            label: 'No, not yet',
            value: 'no'
        },
        {
            label: 'I want a fast-track consultation',
            value: 'fast_track'
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Referral",
        currentIndex: 1,
        total: 4,
        question: "Have you consulted your GP about this?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                options: options,
                value: state.responses.gpConsultationType,
                onChange: handleSelect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step9GPConsultation.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            state.responses.gpConsultationType === 'fast_track' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-blue-900",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Fast-track option:"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step9GPConsultation.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        " You can arrange a consultation without a GP referral. We'll guide you through the next steps."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step9GPConsultation.tsx",
                    lineNumber: 42,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step9GPConsultation.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step9GPConsultation.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step9GPConsultation, "Lg0esL6W4VmXLMAY+3PGAFP0jdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step9GPConsultation;
const __TURBOPACK__default__export__ = Step9GPConsultation;
var _c;
__turbopack_context__.k.register(_c, "Step9GPConsultation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step10ReferralDate.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step10ReferralDate",
    ()=>Step10ReferralDate,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-brand-primary';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const Step10ReferralDate = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const referralDate = state.responses.referralDate ?? {
        mode: null,
        isConfirmed: false
    };
    const [localConfirmed, setLocalConfirmed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(referralDate.isConfirmed);
    const modeOptions = [
        {
            label: 'I know the exact date',
            value: 'exact'
        },
        {
            label: 'I can estimate',
            value: 'estimate'
        }
    ];
    const handleModeChange = (mode)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'referralDate',
                value: {
                    ...referralDate,
                    mode
                }
            }
        });
    };
    const handleDateChange = (field, value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'referralDate',
                value: {
                    ...referralDate,
                    [field]: value
                }
            }
        });
    };
    const handleConfirm = ()=>{
        const confirmed = !localConfirmed;
        setLocalConfirmed(confirmed);
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'referralDate',
                value: {
                    ...referralDate,
                    isConfirmed: confirmed
                }
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Referral",
        currentIndex: 2,
        total: 4,
        question: "When were you referred by your GP?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: labelClass,
                            children: "How would you like to provide the date?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            options: modeOptions,
                            value: referralDate.mode,
                            onChange: handleModeChange
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                referralDate.mode === 'exact' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: labelClass,
                            children: "Referral date"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "date",
                            value: referralDate.exactDate ?? '',
                            onChange: (e)=>handleDateChange('exactDate', e.target.value),
                            className: inputClass
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                    lineNumber: 71,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                referralDate.mode === 'estimate' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: labelClass,
                            children: "Approximate date (month and year)"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                            lineNumber: 84,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "month",
                            value: referralDate.estimatedStartDate ?? '',
                            onChange: (e)=>handleDateChange('estimatedStartDate', e.target.value),
                            className: inputClass
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                    lineNumber: 83,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                referralDate.mode && (referralDate.exactDate || referralDate.estimatedStartDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "checkbox",
                            id: "confirm-date",
                            checked: localConfirmed,
                            onChange: handleConfirm,
                            className: "w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "confirm-date",
                            className: "text-sm text-gray-700",
                            children: "I confirm this date is correct"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
                    lineNumber: 95,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step10ReferralDate, "o7U+TARDEHPVm1oi42oHHjod3DY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step10ReferralDate;
const __TURBOPACK__default__export__ = Step10ReferralDate;
var _c;
__turbopack_context__.k.register(_c, "Step10ReferralDate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/SpecialistCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpecialistCard",
    ()=>SpecialistCard,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const cardClass = (selected)=>`rounded-lg border p-4 text-left transition cursor-pointer ${selected ? 'border-[#0055b7] bg-[#cce9fb]' : 'border-[#d2d3d6] bg-white hover:border-[#0055b7]/60 hover:bg-[#f6f6f7]'}`;
const SpecialistCard = ({ specialist, selected, onSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onSelect,
        className: cardClass(selected),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-medium text-[16px] leading-[28px] text-[#4d4f5c]",
                children: specialist.name
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                lineNumber: 32,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            specialist.specialty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[14px] leading-[24px] text-[#949494] mt-1",
                children: specialist.specialty
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            specialist.gpHospital && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[14px] leading-[24px] text-[#4d4f5c] mt-1",
                children: specialist.gpHospital
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/SpecialistCard.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = SpecialistCard;
const __TURBOPACK__default__export__ = SpecialistCard;
var _c;
__turbopack_context__.k.register(_c, "SpecialistCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/MiniFormSpecialist.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MENTAL_SPECIALIST_CARDS",
    ()=>MENTAL_SPECIALIST_CARDS,
    "MiniFormSpecialist",
    ()=>MiniFormSpecialist,
    "SPECIALIST_CARDS",
    ()=>SPECIALIST_CARDS,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SpecialistCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SpecialistCard.tsx [app-client] (ecmascript)");
;
;
const inputClass = 'w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#949494] focus:outline-none focus:border-[#0055b7]';
const labelClass = 'block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1';
const SPECIALIST_CARDS = [
    {
        id: '1',
        name: 'Dr Sarah Mitchell',
        specialty: 'Orthopaedic Surgeon',
        gpHospital: 'London Bridge Hospital'
    },
    {
        id: '2',
        name: 'Dr James Chen',
        specialty: 'Sports Medicine',
        gpHospital: 'The Wellington Hospital'
    },
    {
        id: '3',
        name: 'Dr Emma Watson',
        specialty: 'Rheumatology',
        gpHospital: 'Harley Street Clinic'
    },
    {
        id: '4',
        name: 'Dr David Okonkwo',
        specialty: 'Neurology',
        gpHospital: 'The Lister Hospital'
    }
];
const MENTAL_SPECIALIST_CARDS = [
    {
        id: 'm1',
        name: 'Dr Rachel Green',
        specialty: 'Clinical Psychologist',
        gpHospital: 'Priory Wellbeing Centre'
    },
    {
        id: 'm2',
        name: 'Dr Tom Hughes',
        specialty: 'Psychiatrist',
        gpHospital: 'Nightingale Hospital'
    },
    {
        id: 'm3',
        name: 'Dr Anna Kowalski',
        specialty: 'CBT Therapist',
        gpHospital: 'Therapy Centre London'
    },
    {
        id: 'm4',
        name: 'Dr Luke Williams',
        specialty: 'Counselling Psychologist',
        gpHospital: 'Harley Therapy'
    }
];
const MiniFormSpecialist = ({ question, type, value, onChange, className = '' })=>{
    const name = value?.name ?? '';
    const cards = type === 'mental specialist' ? MENTAL_SPECIALIST_CARDS : SPECIALIST_CARDS;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": `question-${question}-${type}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Name of specialist"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: name,
                        onChange: (e)=>onChange({
                                name: e.target.value
                            }),
                        placeholder: "Select a specialist below or type name",
                        className: inputClass
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Or choose from specialists"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-3 sm:grid-cols-2",
                        children: cards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SpecialistCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpecialistCard"], {
                                specialist: card,
                                selected: name === card.name,
                                onSelect: ()=>onChange({
                                        name: card.name,
                                        gpHospital: card.gpHospital,
                                        specialties: card.specialty ? [
                                            card.specialty
                                        ] : undefined
                                    })
                            }, card.id, false, {
                                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = MiniFormSpecialist;
const __TURBOPACK__default__export__ = MiniFormSpecialist;
var _c;
__turbopack_context__.k.register(_c, "MiniFormSpecialist");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step11ServiceReferral.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step11ServiceReferral",
    ()=>Step11ServiceReferral,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSpecialist$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/MiniFormSpecialist.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const REFERRAL_OPTIONS = [
    {
        label: 'Specialist',
        value: 'specialist'
    },
    {
        label: 'Mental health specialist',
        value: 'mental_health_specialist'
    },
    {
        label: 'Therapist',
        value: 'therapist'
    },
    {
        label: 'Mental health therapist',
        value: 'mental_health_therapist'
    },
    {
        label: 'Direct test',
        value: 'direct_test'
    }
];
const Step11ServiceReferral = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                field: 'referralServiceType',
                value
            }
        });
        if ((value === 'specialist' || value === 'mental_health_specialist') && !state.responses.specialistDetails) {
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
    const showSpecialistForm = referralServiceType === 'specialist' || referralServiceType === 'mental_health_specialist';
    const type = referralServiceType === 'mental_health_specialist' ? 'mental specialist' : 'specialist';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Referral",
        currentIndex: 3,
        total: 4,
        question: "For which service were you referred?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                options: REFERRAL_OPTIONS,
                value: referralServiceType,
                onChange: handleSelect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showSpecialistForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSpecialist$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    question: 11,
                    type: type,
                    value: state.responses.specialistDetails,
                    onChange: handleSpecialistChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
                    lineNumber: 69,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step11ServiceReferral, "Lg0esL6W4VmXLMAY+3PGAFP0jdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step11ServiceReferral;
const __TURBOPACK__default__export__ = Step11ServiceReferral;
var _c;
__turbopack_context__.k.register(_c, "Step11ServiceReferral");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/Step12HospitalClinic.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PREVIOUS_HOSPITALS",
    ()=>PREVIOUS_HOSPITALS,
    "Step12HospitalClinic",
    ()=>Step12HospitalClinic,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const PREVIOUS_HOSPITALS = [
    'London Bridge Hospital',
    'The Wellington Hospital',
    'Harley Street Clinic',
    'The Lister Hospital',
    'Nightingale Hospital',
    'Priory Wellbeing Centre',
    'Other'
];
const inputClass = 'w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#949494] focus:outline-none focus:border-[#0055b7]';
const labelClass = 'block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1';
const chipClass = (selected)=>`rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${selected ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]' : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'}`;
const Step12HospitalClinic = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Referral",
        currentIndex: 4,
        total: 4,
        question: "Which hospital or clinic will you be attending?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: labelClass,
                            children: "Hospital or clinic"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: value,
                            onChange: (e)=>handleInputChange(e.target.value),
                            placeholder: "Enter hospital or clinic name",
                            className: inputClass
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: labelClass,
                            children: "Previous hospital (select to auto-fill)"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-3",
                            children: PREVIOUS_HOSPITALS.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleInputChange(name),
                                    className: chipClass(value === name),
                                    children: name
                                }, name, false, {
                                    fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                                    lineNumber: 62,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Step12HospitalClinic, "Lg0esL6W4VmXLMAY+3PGAFP0jdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = Step12HospitalClinic;
const __TURBOPACK__default__export__ = Step12HospitalClinic;
var _c;
__turbopack_context__.k.register(_c, "Step12HospitalClinic");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/ReviewRow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewRow",
    ()=>ReviewRow,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const ReviewRow = ({ label, value, onEdit, showEditButton = true })=>{
    const displayValue = value || 'Not provided';
    const isNotProvided = !value;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 h-[172px] min-w-[200px] w-[260px] p-3 rounded-lg relative shrink-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-[#d2d3d6] border-solid flex h-12 items-center justify-between w-full shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 items-center min-h-px min-w-px",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium leading-8 text-[#4d4f5c] text-lg shrink-0",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ReviewRow.tsx",
                        lineNumber: 35,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ReviewRow.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ReviewRow.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col h-11 items-start w-full shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-0 items-center min-w-[120px] w-full shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `flex-1 font-medium leading-8 text-lg min-h-px min-w-px ${isNotProvided ? 'text-gray-400 italic' : 'text-[#1e1e1e]'}`,
                        children: displayValue
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ReviewRow.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ReviewRow.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ReviewRow.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showEditButton && onEdit && value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onEdit,
                    className: "text-sm font-semibold text-[#0055b7] hover:text-[#1276c0] underline transition",
                    children: "Edit"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ReviewRow.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ReviewRow.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ReviewRow.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ReviewRow;
const __TURBOPACK__default__export__ = ReviewRow;
var _c;
__turbopack_context__.k.register(_c, "ReviewRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/claim.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
        currentStep: 'Q1',
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/StepReviewSummary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepReviewSummary",
    ()=>StepReviewSummary,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ReviewRow.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$claim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/claim.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const StepReviewSummary = ()=>{
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const responses = state.responses;
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
    // Format claimant value
    const getClaimantValue = ()=>{
        const claimant = responses.claimant;
        if (!claimant) return null;
        if (claimant === 'self') return 'Myself';
        if (claimant === 'partner') return 'My partner';
        if (claimant === 'dependent') return 'A dependent';
        return String(claimant);
    };
    // Format symptom value (from Q4_1 or Q4_2)
    const getSymptomValue = ()=>{
        const symptom = responses.symptom;
        if (!symptom) return null;
        return symptom.description || symptom.display || 'Provided';
    };
    // Format symptom start date (from Q5)
    const getSymptomStartDate = ()=>{
        const startDate = responses.symptomStartDate;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$claim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateSelection"])(startDate);
    };
    // Format cause value (from Q7)
    const getCauseValue = ()=>{
        const injuryDetails = responses.injuryDetails;
        if (!injuryDetails || !injuryDetails.type) return null;
        const typeMap = {
            'sporting': 'Sporting injury',
            'trip_fall': 'Trip or fall',
            'traffic': 'Traffic accident',
            'attack': 'Attack or assault',
            'other': 'Other'
        };
        return typeMap[injuryDetails.type] || injuryDetails.type;
    };
    // Format legal responsibility value (from Q8)
    const getLegalResponsibilityValue = ()=>{
        const hasLegalResponsibility = responses.hasLegalResponsibility;
        if (hasLegalResponsibility === null || hasLegalResponsibility === undefined) return null;
        return hasLegalResponsibility === true ? 'Yes' : 'No';
    };
    // Format GP referral date (from Q10)
    const getReferralDateValue = ()=>{
        const referralDate = responses.referralDate;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$claim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateSelection"])(referralDate);
    };
    // Format referral type (from Q11)
    const getReferralTypeValue = ()=>{
        const type = responses.referralServiceType;
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
        const specialistDetails = responses.specialistDetails;
        if (!specialistDetails || !specialistDetails.name) return null;
        return specialistDetails.name;
    };
    // Format hospital/clinic (from Q12 - optional)
    const getHospitalClinicValue = ()=>{
        const hospital = responses.hospitalClinic;
        if (!hospital) return null;
        return String(hospital);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Review",
        currentIndex: 1,
        total: 1,
        question: "Review all your answers",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-6 py-6 w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4 items-start w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Claiming for",
                        value: getClaimantValue(),
                        onEdit: ()=>editStep('Q1')
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4 items-start w-full flex-wrap",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Symptom",
                            value: getSymptomValue(),
                            onEdit: ()=>{
                                // Navigate to Q4_1 or Q4_2 based on knowsCondition
                                const knowsCondition = responses.knowsCondition;
                                editStep(knowsCondition === true ? 'Q4_1' : 'Q4_2');
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Symptom start date",
                            value: getSymptomStartDate(),
                            onEdit: ()=>editStep('Q5')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Cause",
                            value: getCauseValue(),
                            onEdit: ()=>editStep('Q7')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Is there legal responsibility?",
                            value: getLegalResponsibilityValue(),
                            onEdit: ()=>editStep('Q8')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4 items-start w-full flex-wrap",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "GP referral on",
                            value: getReferralDateValue(),
                            onEdit: ()=>editStep('Q10')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Type of referral",
                            value: getReferralTypeValue(),
                            onEdit: ()=>editStep('Q11')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Name of specialist",
                            value: getSpecialistNameValue(),
                            onEdit: ()=>editStep('Q11'),
                            showEditButton: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ReviewRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Hospital or clinic",
                            value: getHospitalClinicValue(),
                            onEdit: ()=>editStep('Q12')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-blue-900",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Please review carefully:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Once you submit, your claim will be processed. You can click 'Edit' on any row to make changes, or use the Back button to review previous sections."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 194,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StepReviewSummary, "Lg0esL6W4VmXLMAY+3PGAFP0jdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = StepReviewSummary;
const __TURBOPACK__default__export__ = StepReviewSummary;
var _c;
__turbopack_context__.k.register(_c, "StepReviewSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/StepOutcome.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepOutcome",
    ()=>StepOutcome,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const StepOutcome = ()=>{
    _s();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const isFastTrack = state.currentStep === 'END_FAST_TRACK';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Review",
        currentIndex: 1,
        total: 1,
        question: isFastTrack ? 'Fast-track consultation booked' : 'Claim submitted successfully',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-10 h-10 text-green-600",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M5 13l4 4L19 7"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                lineNumber: 27,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/StepOutcome.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-gray-900",
                            children: isFastTrack ? 'All set!' : 'Thank you!'
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-base text-gray-600",
                            children: isFastTrack ? 'We\'ll contact you within 24 hours to arrange your fast-track consultation.' : 'Your claim has been submitted. We\'ll review it and get back to you within 2-3 business days.'
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-50 border border-gray-200 rounded-lg p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-medium text-gray-500 mb-1",
                            children: "Reference Number"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xl font-mono font-bold text-gray-900",
                            children: [
                                "WPA-",
                                Date.now().toString().slice(-8)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500 mt-2",
                            children: "Please save this reference number for your records"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border border-gray-200 rounded-lg p-4 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold text-base text-gray-900",
                            children: "What happens next?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-2 text-sm text-gray-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-brand-primary font-bold",
                                            children: "1."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                            lineNumber: 66,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "We'll review your claim details"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-brand-primary font-bold",
                                            children: "2."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "You'll receive a confirmation email shortly"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-brand-primary font-bold",
                                            children: "3."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "A claims specialist will contact you if we need any additional information"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-brand-primary font-bold",
                                            children: "4."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "You'll receive a decision on your claim within 2-3 business days"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-blue-50 border border-blue-200 rounded-lg p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold text-sm text-blue-900 mb-2",
                            children: "Need help?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-blue-900",
                            children: [
                                "If you have any questions, please contact our claims team at",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "tel:08001234567",
                                    className: "font-semibold underline",
                                    children: "0800 123 4567"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                ' ',
                                "or email",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "mailto:claims@wpa.org.uk",
                                    className: "font-semibold underline",
                                    children: "claims@wpa.org.uk"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/StepOutcome.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepOutcome.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/StepOutcome.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/StepOutcome.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StepOutcome, "xjxTo/X+AKU6ZpFM1C+9eqhBE8Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = StepOutcome;
const __TURBOPACK__default__export__ = StepOutcome;
var _c;
__turbopack_context__.k.register(_c, "StepOutcome");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/steps/SuccessStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuccessStep",
    ()=>SuccessStep,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const SuccessStep = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#fafbfb] flex flex-col items-center justify-start pb-24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[1440px] px-24 py-12 flex gap-24 items-start justify-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-12 max-w-[720px] min-w-[360px] w-[600px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-6 w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-[36px] leading-[48px] font-semibold text-[#4d4f5c]",
                                    children: "We're on it!"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                    lineNumber: 22,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[16px] leading-[28px] font-normal text-[#4d4f5c]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-0",
                                            children: "Your claim has been submitted. While we're getting your confirmation and reference number ready, you can jump-start your recovery right now."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 28,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-0",
                                            children: " "
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 31,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-0",
                                            children: [
                                                "Go to ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold",
                                                    children: "Doctify"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 33,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " with our link below to find a WPA-registered provider and book your appointment. We'll send a follow-up to your inbox shortly, but if you have questions, our support page is always here for you."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 32,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 items-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] text-white h-[56px] px-6 py-4 rounded-lg flex gap-0 items-center justify-center transition-all duration-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-0.5 items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                            children: "Book now on Doctify"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 47,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "bg-white border border-[#0055b7] text-[#0055b7] hover:bg-[#f0f7ff] active:bg-[#e0efff] h-[56px] px-6 py-4 rounded-lg flex gap-0 items-center justify-center transition-all duration-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-0.5 items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[16px] leading-[28px] font-semibold tracking-[0.1px]",
                                            children: "Back to dashboard"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 59,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white border border-[#d2d3d6] rounded-2xl h-[555px] w-[462px] p-9 flex-shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[14px] leading-[20px] font-semibold text-[#8f9199] uppercase mb-9",
                            children: "Your claim process"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-4 items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-[#0055b7] rounded-2xl w-8 h-8 flex items-center justify-center flex-shrink-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white text-[14px] leading-normal font-medium",
                                                        children: "1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                        lineNumber: 80,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#4d4f5c] text-[16px] leading-[20px] font-medium",
                                                    children: "Fill in claim details"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-12 flex gap-1 items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-4 h-4 flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 16 16",
                                                        fill: "none",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: "8",
                                                                cy: "8",
                                                                r: "7.5",
                                                                fill: "#22C55E",
                                                                stroke: "#22C55E",
                                                                strokeWidth: "1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                                lineNumber: 90,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M5 8L7 10L11 6",
                                                                stroke: "white",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                                lineNumber: 91,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                        lineNumber: 89,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#4d4f5c] text-[12px] leading-[20px] font-normal",
                                                    children: "Completed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-4 w-0.5 h-[74.5px] bg-[#d2d3d6]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-4 items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-[#0055b7] rounded-2xl w-8 h-8 flex items-center justify-center flex-shrink-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white text-[14px] leading-normal font-medium",
                                                        children: "2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                        lineNumber: 106,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#4d4f5c] text-[16px] leading-[20px] font-medium",
                                                    children: "Find your treatment provider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-12 flex gap-1 items-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#4d4f5c] text-[12px] leading-[20px] font-normal",
                                                children: "Awaiting confirmation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-4 w-0.5 h-[74.5px] bg-[#d2d3d6]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-4 items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-[#4d4f5c] rounded-2xl w-8 h-8 flex items-center justify-center flex-shrink-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white text-[14px] leading-normal font-medium",
                                                        children: "3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#8f9199] text-[16px] leading-[20px] font-medium",
                                                    children: "Get authorised"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 124,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-4 w-0.5 h-[74.5px] bg-[#d2d3d6]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                            lineNumber: 133,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-4 items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-[#4d4f5c] rounded-2xl w-8 h-8 flex items-center justify-center flex-shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white text-[14px] leading-normal font-medium",
                                                    children: "4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                    lineNumber: 140,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 139,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#8f9199] text-[16px] leading-[20px] font-medium",
                                                children: "Add treatment to your claim"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                                lineNumber: 142,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/steps/SuccessStep.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/SuccessStep.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/SuccessStep.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/SuccessStep.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SuccessStep;
const __TURBOPACK__default__export__ = SuccessStep;
var _c;
__turbopack_context__.k.register(_c, "SuccessStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ClaimFlowManager.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AppShell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
// Onboarding
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$OnboardingStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/OnboardingStep.tsx [app-client] (ecmascript)");
// Part 1: Claim Details (Q1-Q2)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step1Who$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step1Who.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step2Insurance$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step2Insurance.tsx [app-client] (ecmascript)");
// Step2OtherCoverDetails removed - form is now inline in Step2Insurance
// Part 2: Symptoms & Condition (Q3-Q6)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step3KnowCondition$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step3KnowCondition.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomKnown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step4SymptomKnown.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomDescribe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step4SymptomDescribe.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step5SymptomStart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step5SymptomStart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousSymptoms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step6PreviousSymptoms.tsx [app-client] (ecmascript)");
// Part 3: Background Details (Q7-Q8)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step7HowHappened$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step7HowHappened.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step8Responsibility$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step8Responsibility.tsx [app-client] (ecmascript)");
// Part 4: Referral (Q9-Q12)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step9GPConsultation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step9GPConsultation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step10ReferralDate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step10ReferralDate.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step11ServiceReferral$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step11ServiceReferral.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step12HospitalClinic$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step12HospitalClinic.tsx [app-client] (ecmascript)");
// Part 5: Review & Submit
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepReviewSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/StepReviewSummary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepOutcome$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/StepOutcome.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$SuccessStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/SuccessStep.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"])();
    const renderStep = ()=>{
        switch(state.currentStep){
            // ========================================
            // ONBOARDING
            // ========================================
            case 'ONBOARDING':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$OnboardingStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 54,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 1: CLAIM DETAILS (Q1-Q2)
            // ========================================
            case 'Q1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step1Who$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step1Who"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 60,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q2':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step2Insurance$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step2Insurance"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 63,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // Q2_1 removed - insurance details form is now inline in Q2
            // ========================================
            // PART 2: SYMPTOMS & CONDITION (Q3-Q6)
            // ========================================
            case 'Q3':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step3KnowCondition$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step3KnowCondition"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 71,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q4_1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomKnown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step4SymptomKnown"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 74,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q4_2':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomDescribe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step4SymptomDescribe"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 77,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q5':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step5SymptomStart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step5SymptomStart"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 80,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q6':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousSymptoms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step6PreviousSymptoms"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 83,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 3: BACKGROUND DETAILS (Q7-Q8)
            // ========================================
            case 'Q7':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step7HowHappened$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step7HowHappened"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 89,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q8':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step8Responsibility$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step8Responsibility"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 92,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 4: REFERRAL (Q9-Q12)
            // ========================================
            case 'Q9':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step9GPConsultation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step9GPConsultation"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 98,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q10':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step10ReferralDate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step10ReferralDate"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 101,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q11':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step11ServiceReferral$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step11ServiceReferral"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 104,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q12':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step12HospitalClinic$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Step12HospitalClinic"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 107,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 5: REVIEW & SUBMIT
            // ========================================
            case 'REVIEW':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepReviewSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepReviewSummary"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 113,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'OUTCOME':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$SuccessStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SuccessStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 116,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'END_FAST_TRACK':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepOutcome$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepOutcome"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 119,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // DEFAULT / ERROR STATE
            // ========================================
            default:
                console.error(`[ClaimFlowManager] Unknown step: "${state.currentStep}". Valid steps: ONBOARDING, Q1-Q12, Q4_1, Q4_2, REVIEW, OUTCOME, END_FAST_TRACK`);
                // Attempt to recover by showing ONBOARDING (start of flow)
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$OnboardingStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 127,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            initial: false,
            mode: "wait",
            children: renderStep()
        }, void 0, false, {
            fileName: "[project]/src/components/ClaimFlowManager.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ClaimFlowManager.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ClaimFlowManager, "xjxTo/X+AKU6ZpFM1C+9eqhBE8Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClaim"]
    ];
});
_c = ClaimFlowManager;
const __TURBOPACK__default__export__ = ClaimFlowManager;
var _c;
__turbopack_context__.k.register(_c, "ClaimFlowManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ClaimFlowManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ClaimFlowManager.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClaimProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ClaimFlowManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
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
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d393c8b1._.js.map