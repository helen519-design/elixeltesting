module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/navigation-logic.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * JSON Logic Map for Claim Flow Navigation
 * Defines the next step for every question based on user input and branching logic
 */ __turbopack_context__.s([
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
const NAVIGATION_MAP = {
    // Part 1 - Claim Details
    Q1: {
        step: 'Q1',
        label: 'Who do you want to claim for?',
        nextStep: 'Q2'
    },
    Q2: {
        step: 'Q2',
        label: 'Do you have other medical insurance?',
        nextStep: (state)=>{
            return state.hasOtherInsurance === true ? 'Q2_1' : 'Q3';
        }
    },
    Q2_1: {
        step: 'Q2_1',
        label: 'Please tell us about your medical cover details',
        nextStep: 'Q3'
    },
    // Part 2 - Symptoms & Condition
    Q3: {
        step: 'Q3',
        label: 'Do you know what condition you have?',
        nextStep: (state)=>{
            return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
        }
    },
    Q4_1: {
        step: 'Q4_1',
        label: 'Please enter your main symptom based on your diagnosis',
        nextStep: 'Q5'
    },
    Q4_2: {
        step: 'Q4_2',
        label: 'How would you describe your main symptom?',
        nextStep: 'Q5'
    },
    Q5: {
        step: 'Q5',
        label: 'When did you first start feeling unwell or notice this symptom?',
        nextStep: 'Q6'
    },
    Q6: {
        step: 'Q6',
        label: 'Have you ever dealt with this, or very similar symptoms in the past?',
        nextStep: 'Q7'
    },
    // Part 3 - Background Details
    Q7: {
        step: 'Q7',
        label: 'How did this happen?',
        nextStep: 'Q8'
    },
    Q8: {
        step: 'Q8',
        label: 'Is another person or company legally responsible for this condition?',
        nextStep: 'Q9'
    },
    // Part 4 - Referral
    Q9: {
        step: 'Q9',
        label: 'Have you consulted your GP about this?',
        nextStep: (state)=>{
            return state.gpConsultationType === 'fast_track' ? 'END_FAST_TRACK' : 'Q10';
        }
    },
    Q10: {
        step: 'Q10',
        label: 'When were you referred by your GP?',
        nextStep: 'Q11'
    },
    Q11: {
        step: 'Q11',
        label: 'For which service were you referred?',
        nextStep: 'Q12'
    },
    Q12: {
        step: 'Q12',
        label: 'Which hospital or clinic will you be attending?',
        nextStep: 'REVIEW'
    },
    REVIEW: {
        step: 'REVIEW',
        label: 'Review all your answers',
        nextStep: 'OUTCOME'
    },
    OUTCOME: {
        step: 'OUTCOME',
        label: 'Claim submitted',
        nextStep: 'END'
    },
    END_FAST_TRACK: {
        step: 'END_FAST_TRACK',
        label: 'Fast-track consultation',
        nextStep: 'END'
    }
};
const getNextStep = (currentStep, state)=>{
    const rule = NAVIGATION_MAP[currentStep];
    if (!rule) {
        console.warn(`No navigation rule found for step: ${currentStep}`);
        return 'END';
    }
    if (typeof rule.nextStep === 'function') {
        return rule.nextStep(state);
    }
    return rule.nextStep;
};
const getPreviousStep = (currentStep, state)=>{
    // Special cases based on branching logic
    if (currentStep === 'Q3') {
        return state.hasOtherInsurance === true ? 'Q2_1' : 'Q2';
    }
    if (currentStep === 'Q5') {
        return state.knowsCondition === true ? 'Q4_1' : 'Q4_2';
    }
    if (currentStep === 'Q10') {
        return 'Q9';
    }
    if (currentStep === 'END_FAST_TRACK') {
        return 'Q9';
    }
    if (currentStep === 'REVIEW') {
        return 'Q12';
    }
    if (currentStep === 'OUTCOME') {
        return 'REVIEW';
    }
    // Standard backwards navigation
    const stepOrder = [
        'Q1',
        'Q2',
        'Q2_1',
        'Q3',
        'Q4_1',
        'Q4_2',
        'Q5',
        'Q6',
        'Q7',
        'Q8',
        'Q9',
        'Q10',
        'Q11',
        'Q12',
        'REVIEW',
        'OUTCOME'
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
        // Find the last step that was actually visited
        for(let i = currentIndex - 1; i >= 0; i--){
            if (state.completedSteps.includes(stepOrder[i])) {
                return stepOrder[i];
            }
        }
        // If no completed steps found, return the immediate previous step
        return stepOrder[currentIndex - 1];
    }
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
        case 'Q1':
            return state.claimant !== null;
        case 'Q2':
            return state.hasOtherInsurance !== null;
        case 'Q2_1':
            return !!(state.otherMedicalCover && state.otherMedicalCover.subscriberType && state.otherMedicalCover.policyType && state.otherMedicalCover.insurerName && state.otherMedicalCover.policyNumber && state.otherMedicalCover.hasAdvisedInsurer !== null);
        case 'Q3':
            return state.knowsCondition !== null;
        case 'Q4_1':
        case 'Q4_2':
            return !!(state.symptom.snomedCode && state.symptom.isConfirmed && state.symptom.bodySide);
        case 'Q5':
            return !!(state.symptomStartDate.mode && state.symptomStartDate.isConfirmed && (state.symptomStartDate.exactDate || state.symptomStartDate.estimatedStartDate));
        case 'Q6':
            if (state.hasPreviousSymptoms === false) {
                return true;
            }
            return !!(state.hasPreviousSymptoms === true && state.previousSymptomDate && state.previousSymptomDate.isConfirmed);
        case 'Q7':
            return state.injuryDetails.type !== null;
        case 'Q8':
            if (state.hasLegalResponsibility === false) {
                return true;
            }
            return !!(state.hasLegalResponsibility === true && state.solicitorDetails && state.solicitorDetails.dateOfIncident && state.solicitorDetails.solicitorName);
        case 'Q9':
            return state.gpConsultationType !== null;
        case 'Q10':
            return !!(state.referralDate.mode && state.referralDate.isConfirmed && (state.referralDate.exactDate || state.referralDate.estimatedStartDate));
        case 'Q11':
            return state.referralServiceType !== null;
        // Specialist name is optional
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
            return {
                ...state,
                responses: {
                    ...state.responses,
                    [action.payload.field]: action.payload.value
                },
                // Also set as direct property for easy access
                [action.payload.field]: action.payload.value,
                lastSaveTime: Date.now()
            };
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canProceedFromStep"])(state.currentStep, state);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ClaimContext.tsx",
        lineNumber: 108,
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
'use client';
;
const TopBar = ()=>{
    const handleExit = ()=>{
        // TODO: Add exit confirmation dialog
        if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
            window.location.href = '/';
        }
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
                            lineNumber: 30,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[48px] w-px bg-[#d2d3d6]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/TopBar.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
const __TURBOPACK__default__export__ = TopBar;
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
    // Hide GlobalActions on claim type, onboarding and final success/outcome screens
    if (state.currentStep === 'CLAIM_TYPE' || state.currentStep === 'ONBOARDING' || state.currentStep === 'OUTCOME' || state.currentStep === 'END_FAST_TRACK' || state.currentStep === 'END_MAJOR_INCIDENT') {
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
(()=>{
    const e = new Error("Cannot find module './ui/StageTrackerBar'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$GlobalActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/GlobalActions.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './ui/AutoSaveIndicator'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
    const isEndScreen = state.currentStep === 'OUTCOME' || state.currentStep === 'END_FAST_TRACK' || state.currentStep === 'END_MAJOR_INCIDENT';
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AutoSaveIndicator, {
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
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StageTrackerBar, {}, void 0, false, {
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
"[project]/src/components/steps/OnboardingStep.tsx [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
        description: "Didn't see the person you want to claim for?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
    const hasOtherInsurance = state.responses.hasOtherInsurance;
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
const SearchInput = ({ value, onChange, placeholder = 'Search…', autoFocus, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex h-12 items-center rounded-lg border border-[#d2d3d6] bg-white px-3 shadow-sm ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mr-2 text-[#949494]",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "h-5 w-5",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M9.25 3.5C6.3505 3.5 4 5.8505 4 8.75C4 11.6495 6.3505 14 9.25 14C10.5931 14 11.8175 13.5067 12.7559 12.6742L15.2903 15.2086C15.4855 15.4039 15.8021 15.4039 15.9973 15.2086C16.1926 15.0134 16.1926 14.6968 15.9973 14.5016L13.4629 11.9672C14.2954 11.0288 14.7887 9.80443 14.7887 8.46133C14.7887 5.56183 12.4382 3.21133 9.53867 3.21133C9.44216 3.21133 9.34578 3.21388 9.25 3.21901V3.5Z",
                        fill: "currentColor"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SearchInput.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/SearchInput.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SearchInput.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: placeholder,
                autoFocus: autoFocus,
                className: "flex-1 border-none bg-transparent text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#949494] focus:outline-none"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SearchInput.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/SearchInput.tsx",
        lineNumber: 29,
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
const SnomedResultTile = ({ code, name, description, onConfirm, onSomethingElse, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `rounded-lg border border-[#d2d3d6] bg-white px-4 py-3 shadow-sm ${className}`,
        "aria-label": `Search result ${name}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[14px] leading-[24px] text-[#949494]",
                        children: code
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[16px] leading-[28px] font-medium text-[#4d4f5c]",
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onConfirm,
                        className: "inline-flex h-11 items-center justify-center rounded-lg bg-[#0055b7] px-4 text-[16px] leading-[28px] font-medium text-white transition hover:bg-[#1276c0]",
                        children: "Sounds like it"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/SnomedResultTile.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": title ? 'modal-title' : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/40",
                onClick: onClose,
                onKeyDown: (e)=>e.key === 'Escape' && onClose(),
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative w-full max-w-md rounded-lg border border-[#d2d3d6] bg-white p-4 shadow-lg ${className}`,
                onClick: (e)=>e.stopPropagation(),
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        id: "modal-title",
                        className: "text-[18px] leading-[32px] font-medium text-[#4d4f5c] mb-3",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ModalOverlay.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onClose,
                        className: "absolute top-3 right-3 text-[#4d4f5c] hover:text-[#0055b7] focus:outline-none",
                        "aria-label": "Close",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
(()=>{
    const e = new Error("Cannot find module '../ui/RecommendationChip'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
                children: (recommendationStage === 'initial' ? INITIAL_RECOMMENDATIONS : BODY_PART_RECOMMENDATIONS).map((rec)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RecommendationChip, {
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
(()=>{
    const e = new Error("Cannot find module '../ui/DatePicker'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DatePicker, {
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
(()=>{
    const e = new Error("Cannot find module '../ui/DatePicker'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
    const hasPreviousSymptoms = state.responses.hasPreviousSymptoms;
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DatePicker, {
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
"[project]/src/components/ui/MiniFormInjury.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-sporting",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Where did this happen?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Sport or activity"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Did you receive a donation or payment related to this activity?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-trip-fall",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Where did this happen?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Cause"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Was this during winter sport?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-traffic",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Where did this happen?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Your role"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: roles.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Incident description"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Criminal proceedings"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-attack",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Where did this happen?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Cause / circumstances"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
const MiniFormInjuryOther = ({ injuryDetails, onChange, className = '' })=>{
    const other = injuryDetails.other ?? '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "q7-other",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: labelClass,
                    children: "Please describe how this happened"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/MiniFormInjury.tsx",
                    lineNumber: 175,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/MiniFormInjury.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionLayout"], {
        partLabel: "Background details",
        currentIndex: 1,
        total: 2,
        question: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                "Is your condition the result of a sporting injury, a traffic accident,",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                    fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, void 0),
                "a trip/fall, or an attack/assault?"
            ]
        }, void 0, true),
        children: [
            (!type || type === 'other') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: INJURY_OPTIONS,
                value: type,
                onChange: handleSelect,
                layout: "grid"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'sporting' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MiniFormInjurySporting"], {
                injuryDetails: injuryDetails,
                onChange: handleInjuryChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'trip_fall' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MiniFormInjuryTripFall"], {
                injuryDetails: injuryDetails,
                onChange: handleInjuryChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'traffic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MiniFormInjuryTraffic"], {
                injuryDetails: injuryDetails,
                onChange: handleInjuryChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'attack' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MiniFormInjuryAttack"], {
                injuryDetails: injuryDetails,
                onChange: handleInjuryChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
        lineNumber: 46,
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "question-8-legal-responsibility",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Date of incident"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Solicitor name"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Case handler"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Solicitor address"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Phone"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Case reference"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSolicitor.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
(()=>{
    const e = new Error("Cannot find module '../ui/DatePicker'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DatePicker, {
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
const cardClass = (selected)=>`rounded-lg border p-4 text-left transition cursor-pointer ${selected ? 'border-[#0055b7] bg-[#cce9fb]' : 'border-[#d2d3d6] bg-white hover:border-[#0055b7]/60 hover:bg-[#f6f6f7]'}`;
const SpecialistCard = ({ specialist, selected, onSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onSelect,
        className: cardClass(selected),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-medium text-[16px] leading-[28px] text-[#4d4f5c]",
                children: specialist.name
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                lineNumber: 32,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            specialist.specialty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[14px] leading-[24px] text-[#949494] mt-1",
                children: specialist.specialty
            }, void 0, false, {
                fileName: "[project]/src/components/ui/SpecialistCard.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            specialist.gpHospital && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
const __TURBOPACK__default__export__ = SpecialistCard;
}),
"[project]/src/components/ui/MiniFormSpecialist.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SpecialistCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SpecialistCard.tsx [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": `question-${question}-${type}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Name of specialist"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: labelClass,
                        children: "Or choose from specialists"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormSpecialist.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-3 sm:grid-cols-2",
                        children: cards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SpecialistCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpecialistCard"], {
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
"[project]/src/types/claim.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Claim Flow TypeScript Interfaces
 * Comprehensive type definitions for a 12-question claim flow with branching logic
 */ // SNOMED Data Types
__turbopack_context__.s([
    "createInitialClaimState",
    ()=>createInitialClaimState
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
(()=>{
    const e = new Error("Cannot find module '../ui/ReviewRow'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
    // Format cause value (from Q7)
    const getCauseValue = ()=>{
        const injuryDetails = state.injuryDetails;
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
                    lineNumber: 128,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Before completing your claim creation, please confirm all the details you've entered are correct."
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 129,
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "Claiming for",
                            value: getClaimantValue(),
                            onEdit: ()=>editStep('Q1')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "Symptom",
                            value: getSymptomValue(),
                            onEdit: ()=>{
                                // Navigate to Q4_1 or Q4_2 based on knowsCondition
                                const knowsCondition = state.knowsCondition;
                                editStep(knowsCondition === true ? 'Q4_1' : 'Q4_2');
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "Symptom start date",
                            value: getSymptomStartDate(),
                            onEdit: ()=>editStep('Q5')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-[16px] items-center w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "Cause",
                            value: getCauseValue(),
                            onEdit: ()=>editStep('Q7')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "Legal responsibility",
                            value: getLegalResponsibilityValue(),
                            onEdit: ()=>editStep('Q8')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "GP referral on",
                            value: getReferralDateValue(),
                            onEdit: ()=>editStep('Q10')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-[16px] items-center w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "Type of referral",
                            value: getReferralTypeValue(),
                            onEdit: ()=>editStep('Q11')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "Name of specialist",
                            value: getSpecialistNameValue(),
                            onEdit: ()=>editStep('Q11'),
                            showEditButton: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                            label: "Hospital or clinic",
                            value: getHospitalClinicValue(),
                            onEdit: ()=>editStep('Q12')
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
            lineNumber: 134,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
        lineNumber: 121,
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
(()=>{
    const e = new Error("Cannot find module './steps/ClaimTypeStep'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
(()=>{
    const e = new Error("Cannot find module './steps/FastTrackEndStep'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './steps/MajorIncidentEndStep'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimTypeStep, {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 58,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // ONBOARDING
            // ========================================
            case 'ONBOARDING':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$OnboardingStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OnboardingStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 64,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 1: CLAIM DETAILS (Q1-Q2)
            // ========================================
            case 'Q1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step1Who$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step1Who"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 70,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q2':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step2Insurance$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step2Insurance"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 73,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // Q2_1 removed - insurance details form is now inline in Q2
            // ========================================
            // PART 2: SYMPTOMS & CONDITION (Q3-Q6)
            // ========================================
            case 'Q3':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step3KnowCondition$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step3KnowCondition"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 81,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q4_1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomKnown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step4SymptomKnown"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 84,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q4_2':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomDescribe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step4SymptomDescribe"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 87,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q5':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step5SymptomStart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step5SymptomStart"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 90,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q6':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousSymptoms$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step6PreviousSymptoms"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 93,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 3: BACKGROUND DETAILS (Q7-Q8)
            // ========================================
            case 'Q7':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step7HowHappened$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step7HowHappened"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 99,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q8':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step8Responsibility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step8Responsibility"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 102,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 4: REFERRAL (Q9-Q12)
            // ========================================
            case 'Q9':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step9GPConsultation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step9GPConsultation"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 108,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q10':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step10ReferralDate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step10ReferralDate"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 111,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q11':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step11ServiceReferral$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step11ServiceReferral"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 114,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q12':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step12HospitalClinic$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step12HospitalClinic"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 117,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // PART 5: REVIEW & SUBMIT
            // ========================================
            case 'REVIEW':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepReviewSummary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StepReviewSummary"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 123,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'OUTCOME':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$SuccessStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SuccessStep"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 126,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'END_FAST_TRACK':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FastTrackEndStep, {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 129,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'END_MAJOR_INCIDENT':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MajorIncidentEndStep, {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 132,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            // ========================================
            // DEFAULT / ERROR STATE
            // ========================================
            default:
                console.error(`[ClaimFlowManager] Unknown step: "${state.currentStep}". Valid steps: CLAIM_TYPE, ONBOARDING, Q1-Q12, Q4_1, Q4_2, REVIEW, OUTCOME, END_FAST_TRACK, END_MAJOR_INCIDENT`);
                // Attempt to recover by showing CLAIM_TYPE (start of flow)
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimTypeStep, {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 140,
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
            lineNumber: 146,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ClaimFlowManager.tsx",
        lineNumber: 145,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b04fab6a._.js.map