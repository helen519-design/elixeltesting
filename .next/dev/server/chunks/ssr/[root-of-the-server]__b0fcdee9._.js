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
                }
            };
        case 'NEXT_STEP':
            return {
                ...state,
                history: [
                    ...state.history,
                    state.currentStep
                ],
                currentStep: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextStep"])(state)
            };
        case 'PREVIOUS_STEP':
            return {
                ...state,
                currentStep: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPreviousStep"])(state),
                history: state.history.slice(0, -1)
            };
        default:
            return state;
    }
}
// 3. Create Context
const ClaimContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ClaimProvider = ({ children })=>{
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(claimReducer, initialState);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClaimContext.Provider, {
        value: {
            state,
            dispatch
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ClaimContext.tsx",
        lineNumber: 49,
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
"[project]/src/context/navigation-logic.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * JSON Logic Map for Claim Flow Navigation
 * Defines the next step for every question based on user input and branching logic
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
            'Q2',
            'Q2_1'
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
            'Q6',
            'Q6_1'
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
            'REVIEW_SUMMARY'
        ]
    }
];
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
        nextStep: (state)=>{
            return state.hasPreviousSymptoms === true ? 'Q6_1' : 'Q7';
        }
    },
    Q6_1: {
        step: 'Q6_1',
        label: 'When did you have this symptom previously?',
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
/**
 * Check if a step is a sub-step (e.g., Q2_1, Q4_1, Q4_2)
 */ const isSubStep = (step)=>{
    return step.includes('_') || step === 'END_FAST_TRACK';
};
/**
 * Get the parent step for a sub-step
 * Sub-steps jump back to the parent step that triggered the branch
 */ const getParentStep = (subStep, state)=>{
    // Q2_1 is a sub-step of Q2
    if (subStep === 'Q2_1') {
        return 'Q2';
    }
    // Q4_1 and Q4_2 are sub-steps of Q3
    if (subStep === 'Q4_1' || subStep === 'Q4_2') {
        return 'Q3';
    }
    // Q6_1 is a sub-step of Q6
    if (subStep === 'Q6_1') {
        return 'Q6';
    }
    // END_FAST_TRACK is a sub-step of Q9
    if (subStep === 'END_FAST_TRACK') {
        return 'Q9';
    }
    return null;
};
const getPreviousStep = (currentStep, state)=>{
    // Hide back button on the very first onboarding page
    if (currentStep === 'Q1') {
        return null;
    }
    // If current step is a sub-step, jump back to the parent step
    if (isSubStep(currentStep)) {
        const parentStep = getParentStep(currentStep, state);
        if (parentStep) {
            return parentStep;
        }
    }
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
        'Q6_1',
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
            if (state.hasOtherInsurance === false) return true;
            if (state.hasOtherInsurance === true) {
                return !!(state.otherMedicalCover && state.otherMedicalCover.subscriberType && state.otherMedicalCover.policyType && state.otherMedicalCover.insurerName && state.otherMedicalCover.policyNumber && state.otherMedicalCover.hasAdvisedInsurer !== null);
            }
            return false;
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
            return state.hasPreviousSymptoms !== null;
        case 'Q6_1':
            return !!(state.hasPreviousSymptoms === true && state.previousSymptomDate && state.previousSymptomDate.isConfirmed);
        case 'Q7':
            {
                const t = state.injuryDetails.type;
                if (t === null) return false;
                if (t === 'sporting') {
                    const s = state.injuryDetails.sporting;
                    return !!(s?.sport?.trim() && s?.country?.trim() && s.receivedDonation !== null);
                }
                if (t === 'trip_fall') {
                    const s = state.injuryDetails.tripFall;
                    return !!(s?.cause?.trim() && s?.country?.trim() && s.wasWinterSport !== null);
                }
                if (t === 'traffic') {
                    const s = state.injuryDetails.traffic;
                    return !!(s?.role && s?.country?.trim() && s?.incidentDescription?.trim());
                }
                if (t === 'attack') {
                    const s = state.injuryDetails.attack;
                    return !!(s?.cause?.trim() && s?.country?.trim());
                }
                if (t === 'other') {
                    return !!state.injuryDetails.other?.trim();
                }
                return false;
            }
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
            {
                if (state.referralServiceType === null) return false;
                if (state.referralServiceType === 'specialist' || state.referralServiceType === 'mental_health_specialist') {
                    return !!state.specialistDetails?.name?.trim();
                }
                return true;
            }
        case 'Q12':
            return !!state.hospitalClinic?.trim();
        case 'REVIEW':
            return true;
        default:
            return true;
    }
};
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/navigation-logic.ts [app-ssr] (ecmascript)");
;
;
;
;
const AppShell = ({ children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#fafbfb] text-[#4d4f5c] flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "fixed inset-x-0 top-0 z-40 bg-[#fafbfb]/90 backdrop-blur border-b border-[#d2d3d6]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-4xl px-6 pt-6 pb-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TopBar, {}, void 0, false, {
                                fileName: "[project]/src/components/AppShell.tsx",
                                lineNumber: 31,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppShell.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-4xl px-6 pb-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StageTrackerBar, {}, void 0, false, {
                                fileName: "[project]/src/components/AppShell.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppShell.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/AppShell.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "flex-1 mx-auto w-full max-w-4xl px-6 pt-32 pb-28",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedStepContainer, {
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/AppShell.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-[#d2d3d6]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto max-w-4xl px-6 py-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GlobalActions, {}, void 0, false, {
                            fileName: "[project]/src/components/AppShell.tsx",
                            lineNumber: 46,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/AppShell.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AppShell.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const TopBar = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium text-[#0055b7] tracking-wide uppercase",
                        children: "Health claim"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[24px] leading-[40px] font-semibold text-[#4d4f5c]",
                        children: "Tell us about your claim"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-10 w-10 rounded-full bg-[#cce9fb]"
            }, void 0, false, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const StageTrackerBar = ()=>{
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const activeIndex = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].findIndex((stage)=>stage.steps.includes(state.currentStep));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Claim progress",
        className: "flex items-center justify-between gap-2",
        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].map((stage, index)=>{
            const isActive = index === activeIndex;
            const isCompleted = activeIndex > index;
            const dotColor = isActive ? '#0055b7' // bg-brand-primary-default
             : isCompleted ? '#1276c0' // bg-brand-accent-1
             : '#d2d3d6'; // bg-progress-step-incomplete
            const labelColor = isActive ? '#0055b7' : '#4d4f5c';
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center w-full",
                        children: [
                            index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `h-[2px] flex-1 transition-colors ${isCompleted ? 'bg-[#0055b7]' : 'bg-[#d2d3d6]'}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppShell.tsx",
                                lineNumber: 97,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-4 w-4 items-center justify-center rounded-full border border-white shadow-sm",
                                style: {
                                    backgroundColor: dotColor
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppShell.tsx",
                                lineNumber: 105,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            index < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$navigation$2d$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLAIM_STAGES"].length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `h-[2px] flex-1 transition-colors ${activeIndex > index ? 'bg-[#0055b7]' : 'bg-[#d2d3d6]'}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppShell.tsx",
                                lineNumber: 112,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 94,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-2 text-[14px] leading-[24px] text-center font-medium truncate",
                        style: {
                            color: labelColor
                        },
                        children: stage.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppShell.tsx",
                        lineNumber: 119,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, stage.id, true, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 93,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 79,
        columnNumber: 5
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
            lineNumber: 137,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const GlobalActions = ()=>{
    const { state, goToPreviousStep, goToNextStep, canProceed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const isOnboarding = state.currentStep === 'ONBOARDING';
    const isFirstStep = state.currentStep === 'Q1' || isOnboarding;
    const isContinueDisabled = !canProceed();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between gap-4",
        children: [
            !isOnboarding && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: goToPreviousStep,
                disabled: isFirstStep,
                className: `inline-flex h-12 items-center justify-center rounded-lg border px-4 text-[16px] leading-[28px] font-medium transition
            ${isFirstStep ? 'border-[#d2d3d6] text-[#d2d3d6] cursor-default' : 'border-[#d2d3d6] text-[#4d4f5c] hover:bg-[#f6f6f7]'}`,
                children: "Back"
            }, void 0, false, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 161,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: goToNextStep,
                disabled: isContinueDisabled,
                className: `inline-flex h-12 min-w-[140px] items-center justify-center rounded-lg px-6 text-[16px] leading-[28px] font-medium text-white transition
          ${isContinueDisabled ? 'bg-[#f6f6f7] text-[#d2d3d6] cursor-not-allowed' : 'bg-[#0055b7] hover:bg-[#1276c0]'}`,
                children: "Continue"
            }, void 0, false, {
                fileName: "[project]/src/components/AppShell.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AppShell.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AppShell;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionTag$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionTag.tsx [app-ssr] (ecmascript)");
;
;
;
const QuestionLayout = ({ partLabel, currentIndex, total, question, description, children, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
        className: `flex flex-col gap-4 ${className}`,
        initial: {
            x: '100%',
            opacity: 0
        },
        animate: {
            x: '0%',
            opacity: 1
        },
        exit: {
            x: '-100%',
            opacity: 0
        },
        transition: {
            duration: 0.25,
            ease: 'easeOut'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionTag$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QuestionTag"], {
                partLabel: partLabel,
                currentIndex: currentIndex,
                total: total
            }, void 0, false, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mt-2 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[24px] leading-[40px] font-semibold text-[#4d4f5c]",
                        children: question
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[16px] leading-[28px] text-[#4d4f5c]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 space-y-3",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/QuestionLayout.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/QuestionLayout.tsx",
        lineNumber: 43,
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
const OptionChip = ({ label, description, selected = false, disabled = false, onClick, className = '' })=>{
    const baseClasses = 'w-full min-w-[280px] max-w-[600px] text-left rounded-lg border px-4 py-3 transition flex items-start gap-3';
    const stateClasses = selected ? 'border-[#0055b7] bg-[#cce9fb]' : 'border-[#d2d3d6] bg-white hover:border-[#0055b7]/60 hover:bg-[#f6f6f7]';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:border-[#d2d3d6] hover:bg-white' : 'cursor-pointer';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: disabled,
        onClick: onClick,
        className: `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `mt-[6px] h-4 w-4 rounded-full border ${selected ? 'border-[#0055b7] bg-[#0055b7]' : 'border-[#d2d3d6] bg-white'}`,
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/OptionChip.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[16px] leading-[28px] font-medium text-[#4d4f5c]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/OptionChip.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-1 text-[14px] leading-[24px] text-[#4d4f5c] opacity-80",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/OptionChip.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/OptionChip.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/OptionChip.tsx",
        lineNumber: 43,
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
const OptionChipGroup = ({ options, value, onChange, disabled = false, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-3 ${className}`,
        children: options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OptionChip"], {
                label: opt.label,
                description: opt.description,
                selected: value === opt.value,
                disabled: disabled,
                onClick: ()=>onChange(opt.value)
            }, String(opt.label), false, {
                fileName: "[project]/src/components/ui/OptionChipGroup.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/OptionChipGroup.tsx",
        lineNumber: 31,
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
(()=>{
    const e = new Error("Cannot find module '../context/ClaimContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
const Step1Who = ()=>{
    const { state, dispatch } = useClaim();
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                label: 'Myself',
                value: 'self',
                relationship: 'Self'
            },
            {
                label: 'Someone else on my policy',
                value: 'other',
                relationship: 'Dependant'
            }
        ], []);
    const selectedValue = state.claimant ? state.claimant.relationship === 'Self' ? 'self' : 'other' : null;
    const handleSelect = (value)=>{
        const option = options.find((opt)=>opt.value === value);
        if (!option) return;
        dispatch({
            type: 'UPDATE_FIELD',
            field: 'claimant',
            value: {
                id: value,
                name: value === 'self' ? 'Policy holder' : 'Dependant',
                relationship: option.relationship
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 1 – Claim details",
        currentIndex: 1,
        total: 3,
        question: "Who do you want to claim for?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: selectedValue,
            onChange: handleSelect
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step1Who.tsx",
            lineNumber: 49,
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
"[project]/src/components/ui/MiniFormContainer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MiniFormContainer",
    ()=>MiniFormContainer,
    "UK_INSURERS",
    ()=>UK_INSURERS,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const UK_INSURERS = [
    'Bupa',
    'AXA PPP Healthcare',
    'Vitality Health',
    'Aviva',
    'WPA',
    'Simplyhealth',
    'CS Healthcare',
    'Exeter Family Friendly',
    'Freedom Health Insurance',
    'The Exeter',
    'Health-on-Line',
    'Other'
];
const MiniFormContainer = ({ question, type, value, onChange, className = '' })=>{
    if (question !== 2 || type !== 'medical coverage details') {
        return null;
    }
    const cover = value || {
        subscriberType: null,
        policyType: null,
        insurerName: '',
        policyNumber: '',
        hasAdvisedInsurer: null
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`,
        "data-variant": "question-2-medical-coverage",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1",
                        children: "Subscriber status"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: [
                            'subscriber',
                            'dependant'
                        ].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onChange({
                                        subscriberType: opt
                                    }),
                                className: `rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${cover.subscriberType === opt ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]' : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'}`,
                                children: opt === 'subscriber' ? 'Subscriber' : 'Dependant'
                            }, opt, false, {
                                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1",
                        children: "Policy type"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: [
                            'PMI',
                            'Cash Plan'
                        ].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onChange({
                                        policyType: opt
                                    }),
                                className: `rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${cover.policyType === opt ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]' : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'}`,
                                children: opt
                            }, opt, false, {
                                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1",
                        children: "Insurer name"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: cover.insurerName || '',
                        onChange: (e)=>onChange({
                                insurerName: e.target.value
                            }),
                        className: "w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none focus:border-[#0055b7]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select insurer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            UK_INSURERS.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: name,
                                    children: name
                                }, name, false, {
                                    fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1",
                        children: "Policy number"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: cover.policyNumber || '',
                        onChange: (e)=>onChange({
                                policyNumber: e.target.value
                            }),
                        placeholder: "Enter policy number",
                        className: "w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#949494] focus:outline-none focus:border-[#0055b7]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1",
                        children: "Have you advised your insurer about this claim?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onChange({
                                        hasAdvisedInsurer: true
                                    }),
                                className: `rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${cover.hasAdvisedInsurer === true ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]' : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'}`,
                                children: "Yes"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onChange({
                                        hasAdvisedInsurer: false
                                    }),
                                className: `rounded-lg border px-4 py-2 text-[14px] leading-[24px] font-medium transition ${cover.hasAdvisedInsurer === false ? 'border-[#0055b7] bg-[#cce9fb] text-[#0055b7]' : 'border-[#d2d3d6] bg-white text-[#4d4f5c] hover:bg-[#f6f6f7]'}`,
                                children: "No"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/MiniFormContainer.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MiniFormContainer;
}),
"[project]/src/components/steps/Part1_Details/Step2Insurance.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step2Insurance",
    ()=>Step2Insurance,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormContainer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/MiniFormContainer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ClaimContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
const Step2Insurance = ()=>{
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
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
            field: 'hasOtherInsurance',
            value
        });
        if (value && !state.otherMedicalCover) {
            dispatch({
                type: 'UPDATE_FIELD',
                field: 'otherMedicalCover',
                value: {
                    subscriberType: null,
                    policyType: null,
                    insurerName: '',
                    policyNumber: '',
                    hasAdvisedInsurer: null
                }
            });
        }
    };
    const handleCoverChange = (updates)=>{
        const current = state.otherMedicalCover ?? {
            subscriberType: null,
            policyType: null,
            insurerName: '',
            policyNumber: '',
            hasAdvisedInsurer: null
        };
        dispatch({
            type: 'UPDATE_FIELD',
            field: 'otherMedicalCover',
            value: {
                ...current,
                ...updates
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 1 – Claim details",
        currentIndex: 2,
        total: 3,
        question: "Do you have other medical insurance?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: options,
                value: state.hasOtherInsurance,
                onChange: handleSelect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Part1_Details/Step2Insurance.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            state.hasOtherInsurance === true && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormContainer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    question: 2,
                    type: "medical coverage details",
                    value: state.otherMedicalCover,
                    onChange: handleCoverChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Part1_Details/Step2Insurance.tsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Part1_Details/Step2Insurance.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Part1_Details/Step2Insurance.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step2Insurance;
}),
"[project]/src/components/steps/Step2OtherCoverDetails.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step2OtherCoverDetails",
    ()=>Step2OtherCoverDetails,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
;
;
const Step2OtherCoverDetails = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 1 – Claim details",
        currentIndex: 3,
        total: 3,
        question: "Please tell us about your medical cover details"
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step2OtherCoverDetails.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step2OtherCoverDetails;
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
(()=>{
    const e = new Error("Cannot find module '../context/ClaimContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
const Step3KnowCondition = ()=>{
    const { state, dispatch } = useClaim();
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
        // This drives the branch in navigation-logic:
        // true  -> Q4_1
        // false -> Q4_2
        dispatch({
            type: 'UPDATE_FIELD',
            field: 'knowsCondition',
            value
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 2 – Symptoms & condition",
        currentIndex: 1,
        total: 6,
        question: "Do you know what condition you have?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: state.knowsCondition,
            onChange: handleSelect
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step3KnowCondition.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step3KnowCondition.tsx",
        lineNumber: 26,
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
    const handleSearchChange = async (value)=>{
        setQuery(value);
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
            type: 'UPDATE_SYMPTOM',
            updates: {
                snomedCode: result,
                userInput: query,
                isConfirmed: true
            }
        });
    }, [
        result,
        query,
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
    const handleSelectSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((code)=>{
        dispatch({
            type: 'UPDATE_SYMPTOM',
            updates: {
                snomedCode: code,
                userInput: code.name,
                isConfirmed: true
            }
        });
        setModalOpen(false);
        setSuggestions([]);
        setQuery(code.name);
    }, [
        dispatch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 2 – Symptoms & condition",
        currentIndex: 2,
        total: 6,
        question: "Please enter your main symptom based on your diagnosis",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchInput"], {
                value: query,
                onChange: handleSearchChange,
                placeholder: "Search for your diagnosis…",
                autoFocus: true
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                label: "Looking up SNOMED matches…"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 90,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            !loading && result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SnomedResultTile"], {
                code: result.code,
                name: result.name,
                description: result.description,
                onConfirm: handleConfirm,
                onSomethingElse: handleSomethingElse
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: modalOpen,
                onClose: ()=>{
                    setModalOpen(false);
                    setSuggestions([]);
                },
                title: "Choose a suggestion",
                children: suggestionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                    label: "Loading suggestions…"
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                    lineNumber: 108,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        suggestions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleSelectSuggestion(item),
                                className: "w-full rounded-lg border border-[#d2d3d6] bg-white p-3 text-left transition hover:border-[#0055b7] hover:bg-[#f6f6f7]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[14px] leading-[24px] text-[#949494]",
                                        children: item.code
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium text-[16px] leading-[28px] text-[#4d4f5c]",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                        lineNumber: 119,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[14px] leading-[24px] text-[#4d4f5c] opacity-80",
                                        children: item.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                        lineNumber: 121,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.code, true, {
                                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                                lineNumber: 112,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))),
                        !suggestionsLoading && suggestions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[14px] leading-[24px] text-[#4d4f5c]",
                            children: "No suggestions found. Try searching again."
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                            lineNumber: 126,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                setModalOpen(false);
                                setSuggestions([]);
                            },
                            className: "mt-2 w-full rounded-lg border border-[#d2d3d6] px-4 py-2 text-[16px] leading-[28px] font-medium text-[#4d4f5c] hover:bg-[#f6f6f7]",
                            children: "Search again"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                    lineNumber: 110,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step4SymptomKnown.tsx",
        lineNumber: 77,
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
const Step4SymptomDescribe = ()=>{
    const { dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [suggestions, setSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [suggestionsLoading, setSuggestionsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSearchChange = async (value)=>{
        setQuery(value);
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
            type: 'UPDATE_SYMPTOM',
            updates: {
                snomedCode: result,
                userInput: query,
                isConfirmed: true
            }
        });
    }, [
        result,
        query,
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
    const handleSelectSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((code)=>{
        dispatch({
            type: 'UPDATE_SYMPTOM',
            updates: {
                snomedCode: code,
                userInput: code.name,
                isConfirmed: true
            }
        });
        setModalOpen(false);
        setSuggestions([]);
        setQuery(code.name);
    }, [
        dispatch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 2 – Symptoms & condition",
        currentIndex: 3,
        total: 6,
        question: "How would you describe your main symptom?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SearchInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchInput"], {
                value: query,
                onChange: handleSearchChange,
                placeholder: "Describe your main symptom…",
                autoFocus: true
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                label: "Looking up SNOMED matches…"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 90,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            !loading && result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SnomedResultTile$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SnomedResultTile"], {
                code: result.code,
                name: result.name,
                description: result.description,
                onConfirm: handleConfirm,
                onSomethingElse: handleSomethingElse
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ModalOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: modalOpen,
                onClose: ()=>{
                    setModalOpen(false);
                    setSuggestions([]);
                },
                title: "Choose a suggestion",
                children: suggestionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$LoadingIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingIndicator"], {
                    label: "Loading suggestions…"
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                    lineNumber: 108,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        suggestions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleSelectSuggestion(item),
                                className: "w-full rounded-lg border border-[#d2d3d6] bg-white p-3 text-left transition hover:border-[#0055b7] hover:bg-[#f6f6f7]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[14px] leading-[24px] text-[#949494]",
                                        children: item.code
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium text-[16px] leading-[28px] text-[#4d4f5c]",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                        lineNumber: 119,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[14px] leading-[24px] text-[#4d4f5c] opacity-80",
                                        children: item.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                        lineNumber: 121,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.code, true, {
                                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                                lineNumber: 112,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))),
                        !suggestionsLoading && suggestions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[14px] leading-[24px] text-[#4d4f5c]",
                            children: "No suggestions found. Try searching again."
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 126,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                setModalOpen(false);
                                setSuggestions([]);
                            },
                            className: "mt-2 w-full rounded-lg border border-[#d2d3d6] px-4 py-2 text-[16px] leading-[28px] font-medium text-[#4d4f5c] hover:bg-[#f6f6f7]",
                            children: "Search again"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                    lineNumber: 110,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step4SymptomDescribe.tsx",
        lineNumber: 77,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../context/ClaimContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
const Step5SymptomStart = ()=>{
    const { state, dispatch } = useClaim();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(state.symptomStartDate.mode);
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
            type: 'UPDATE_SYMPTOM_START_DATE',
            updates: {
                mode: value,
                isConfirmed: false
            }
        });
    };
    const handleExactDateChange = (value)=>{
        dispatch({
            type: 'UPDATE_SYMPTOM_START_DATE',
            updates: {
                mode: 'exact',
                exactDate: value || null,
                estimatedStartDate: null,
                approximateMonth: null,
                isConfirmed: !!value
            }
        });
    };
    const handleApproxMonthChange = (value)=>{
        dispatch({
            type: 'UPDATE_SYMPTOM_START_DATE',
            updates: {
                mode: 'approximate',
                approximateMonth: value || null,
                estimatedStartDate: value ? `${value}-01` : null,
                exactDate: null,
                isConfirmed: false
            }
        });
    };
    const handleConfirmEstimatedDate = ()=>{
        const month = state.symptomStartDate.approximateMonth;
        if (!month) return;
        dispatch({
            type: 'UPDATE_SYMPTOM_START_DATE',
            updates: {
                isConfirmed: true,
                estimatedStartDate: `${month}-01`
            }
        });
    };
    const approximateMonth = state.symptomStartDate.approximateMonth;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 2 – Symptoms & condition",
        currentIndex: 4,
        total: 6,
        question: "When did you first start feeling unwell or notice this symptom?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: dateOptions,
                value: mode,
                onChange: handleModeChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            mode === 'exact' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[14px] leading-[24px] text-[#4d4f5c] mb-1",
                        children: "Exact date"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        value: state.symptomStartDate.exactDate ?? '',
                        onChange: (e)=>handleExactDateChange(e.target.value),
                        className: "w-full rounded-lg border border-[#d2d3d6] px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            mode === 'approximate' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-[14px] leading-[24px] text-[#4d4f5c] mb-1",
                                children: "Roughly when was this?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "month",
                                value: state.symptomStartDate.approximateMonth ?? '',
                                onChange: (e)=>handleApproxMonthChange(e.target.value),
                                className: "w-full rounded-lg border border-[#d2d3d6] px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                lineNumber: 107,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    approximateMonth && !state.symptomStartDate.isConfirmed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border border-[#cce9fb] bg-[#cce9fb]/30 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[14px] leading-[24px] text-[#4d4f5c] mb-2",
                                children: [
                                    "Estimated start date: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: estimatedDateLabel
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                        lineNumber: 117,
                                        columnNumber: 39
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleConfirmEstimatedDate,
                                className: "rounded-lg bg-[#0055b7] px-4 py-2 text-[14px] leading-[24px] font-medium text-white hover:bg-[#1276c0]",
                                children: "Confirm estimated date"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                                lineNumber: 119,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                        lineNumber: 115,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step5SymptomStart.tsx",
        lineNumber: 75,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../context/ClaimContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
const Step6PreviousSymptoms = ()=>{
    const { state, dispatch } = useClaim();
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
            field: 'hasPreviousSymptoms',
            value
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 2 – Symptoms & condition",
        currentIndex: 5,
        total: 6,
        question: "Have you ever dealt with this, or very similar symptoms in the past?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            options: options,
            value: state.hasPreviousSymptoms,
            onChange: handleSelect
        }, void 0, false, {
            fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step6PreviousSymptoms.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step6PreviousSymptoms;
}),
"[project]/src/components/steps/Step6PreviousDate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Step6PreviousDate",
    ()=>Step6PreviousDate,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/OptionChipGroup.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../context/ClaimContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
const Step6PreviousDate = ()=>{
    const { state, dispatch } = useClaim();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(state.previousSymptomDate?.mode ?? null);
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
            type: 'UPDATE_PREVIOUS_SYMPTOM_DATE',
            updates: {
                mode: value,
                isConfirmed: false
            }
        });
    };
    const handleExactDateChange = (value)=>{
        dispatch({
            type: 'UPDATE_PREVIOUS_SYMPTOM_DATE',
            updates: {
                mode: 'exact',
                exactDate: value || null,
                estimatedStartDate: null,
                approximateMonth: null,
                isConfirmed: !!value
            }
        });
    };
    const handleApproxMonthChange = (value)=>{
        dispatch({
            type: 'UPDATE_PREVIOUS_SYMPTOM_DATE',
            updates: {
                mode: 'approximate',
                approximateMonth: value || null,
                estimatedStartDate: value ? `${value}-01` : null,
                exactDate: null,
                isConfirmed: false
            }
        });
    };
    const handleConfirmEstimatedDate = ()=>{
        const month = state.previousSymptomDate?.approximateMonth;
        if (!month) return;
        dispatch({
            type: 'UPDATE_PREVIOUS_SYMPTOM_DATE',
            updates: {
                isConfirmed: true,
                estimatedStartDate: `${month}-01`
            }
        });
    };
    const approximateMonth = state.previousSymptomDate?.approximateMonth;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 2 – Symptoms & condition",
        currentIndex: 6,
        total: 6,
        question: "When did you have this symptom previously?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: dateOptions,
                value: mode,
                onChange: handleModeChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            mode === 'exact' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[14px] leading-[24px] text-[#4d4f5c] mb-1",
                        children: "Exact date"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        value: state.previousSymptomDate?.exactDate ?? '',
                        onChange: (e)=>handleExactDateChange(e.target.value),
                        className: "w-full rounded-lg border border-[#d2d3d6] px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            mode === 'approximate' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-[14px] leading-[24px] text-[#4d4f5c] mb-1",
                                children: "Roughly when was this?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "month",
                                value: state.previousSymptomDate?.approximateMonth ?? '',
                                onChange: (e)=>handleApproxMonthChange(e.target.value),
                                className: "w-full rounded-lg border border-[#d2d3d6] px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] focus:outline-none"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    approximateMonth && !state.previousSymptomDate?.isConfirmed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border border-[#cce9fb] bg-[#cce9fb]/30 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[14px] leading-[24px] text-[#4d4f5c] mb-2",
                                children: [
                                    "Estimated start date: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: estimatedDateLabel
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                                        lineNumber: 119,
                                        columnNumber: 39
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                                lineNumber: 118,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleConfirmEstimatedDate,
                                className: "rounded-lg bg-[#0055b7] px-4 py-2 text-[14px] leading-[24px] font-medium text-white hover:bg-[#1276c0]",
                                children: "Confirm estimated date"
                            }, void 0, false, {
                                fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                        lineNumber: 117,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
                lineNumber: 104,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step6PreviousDate.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step6PreviousDate;
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
        question: "Is your condition the result of a sporting injury, a traffic accident, a trip/fall, or an attack/assault?",
        children: [
            (!type || type === 'other') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: INJURY_OPTIONS,
                value: type,
                onChange: handleSelect,
                layout: "grid"
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'sporting' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MiniFormInjurySporting"], {
                injuryDetails: injuryDetails,
                onChange: handleInjuryChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'trip_fall' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MiniFormInjuryTripFall"], {
                injuryDetails: injuryDetails,
                onChange: handleInjuryChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'traffic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MiniFormInjuryTraffic"], {
                injuryDetails: injuryDetails,
                onChange: handleInjuryChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            type === 'attack' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormInjury$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MiniFormInjuryAttack"], {
                injuryDetails: injuryDetails,
                onChange: handleInjuryChange
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step7HowHappened.tsx",
                lineNumber: 73,
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
    const { state, dispatch, updateSolicitorDetails } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
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
            field: 'hasLegalResponsibility',
            value
        });
        if (value && !state.solicitorDetails) {
            dispatch({
                type: 'UPDATE_FIELD',
                field: 'solicitorDetails',
                value: {
                    ...EMPTY_SOLICITOR
                }
            });
        }
    };
    const handleSolicitorChange = (updates)=>{
        updateSolicitorDetails(updates);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 3 – Background details",
        currentIndex: 2,
        total: 2,
        question: "Is another person or company legally responsible for this condition?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: options,
                value: state.hasLegalResponsibility,
                onChange: handleSelect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            state.hasLegalResponsibility === true && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSolicitor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    value: state.solicitorDetails,
                    onChange: handleSolicitorChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step8Responsibility.tsx",
        lineNumber: 45,
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
;
;
const Step9GPConsultation = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 4 – Referral",
        currentIndex: 1,
        total: 4,
        question: "Have you consulted your GP about this?"
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step9GPConsultation.tsx",
        lineNumber: 6,
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
;
;
const Step10ReferralDate = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 4 – Referral",
        currentIndex: 2,
        total: 4,
        question: "When were you referred by your GP?"
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step10ReferralDate.tsx",
        lineNumber: 6,
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
    const { state, dispatch, updateSpecialistDetails } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const handleSelect = (value)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            field: 'referralServiceType',
            value
        });
        if ((value === 'specialist' || value === 'mental_health_specialist') && !state.specialistDetails) {
            dispatch({
                type: 'UPDATE_SPECIALIST_DETAILS',
                updates: {
                    name: ''
                }
            });
        }
    };
    const handleSpecialistChange = (updates)=>{
        updateSpecialistDetails(updates);
    };
    const showSpecialistForm = state.referralServiceType === 'specialist' || state.referralServiceType === 'mental_health_specialist';
    const type = state.referralServiceType === 'mental_health_specialist' ? 'mental specialist' : 'specialist';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 4 – Referral",
        currentIndex: 3,
        total: 4,
        question: "For which service were you referred?",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$OptionChipGroup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                options: REFERRAL_OPTIONS,
                value: state.referralServiceType,
                onChange: handleSelect
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showSpecialistForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$MiniFormSpecialist$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    question: 11,
                    type: type,
                    value: state.specialistDetails,
                    onChange: handleSpecialistChange
                }, void 0, false, {
                    fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/steps/Step11ServiceReferral.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step11ServiceReferral;
}),
"[project]/src/components/steps/Step12HospitalClinic.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PREVIOUS_HOSPITALS",
    ()=>PREVIOUS_HOSPITALS,
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
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const value = state.hospitalClinic ?? '';
    const handleInputChange = (v)=>{
        dispatch({
            type: 'UPDATE_FIELD',
            field: 'hospitalClinic',
            value: v
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 4 – Referral",
        currentIndex: 4,
        total: 4,
        question: "Which hospital or clinic will you be attending?",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: labelClass,
                            children: "Hospital or clinic"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: value,
                            onChange: (e)=>handleInputChange(e.target.value),
                            placeholder: "Enter hospital or clinic name",
                            className: inputClass
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: labelClass,
                            children: "Previous hospital (select to auto-fill)"
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-3",
                            children: PREVIOUS_HOSPITALS.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleInputChange(name),
                                    className: chipClass(value === name),
                                    children: name
                                }, name, false, {
                                    fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                                    lineNumber: 60,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/steps/Step12HospitalClinic.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Step12HospitalClinic;
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
;
;
const StepReviewSummary = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 5 – Review",
        currentIndex: 1,
        total: 1,
        question: "Review all your answers"
    }, void 0, false, {
        fileName: "[project]/src/components/steps/StepReviewSummary.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = StepReviewSummary;
}),
"[project]/src/components/steps/StepOutcome.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepOutcome",
    ()=>StepOutcome,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/QuestionLayout.tsx [app-ssr] (ecmascript)");
;
;
const StepOutcome = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$QuestionLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        partLabel: "Part 5 – Review",
        currentIndex: 1,
        total: 1,
        question: "Your claim outcome"
    }, void 0, false, {
        fileName: "[project]/src/components/steps/StepOutcome.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = StepOutcome;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step1Who$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step1Who.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Part1_Details$2f$Step2Insurance$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Part1_Details/Step2Insurance.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step2OtherCoverDetails$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step2OtherCoverDetails.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step3KnowCondition$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step3KnowCondition.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomKnown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step4SymptomKnown.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomDescribe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step4SymptomDescribe.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step5SymptomStart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step5SymptomStart.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousSymptoms$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step6PreviousSymptoms.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousDate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step6PreviousDate.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step7HowHappened$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step7HowHappened.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step8Responsibility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step8Responsibility.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step9GPConsultation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step9GPConsultation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step10ReferralDate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step10ReferralDate.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step11ServiceReferral$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step11ServiceReferral.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step12HospitalClinic$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/Step12HospitalClinic.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepReviewSummary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/StepReviewSummary.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepOutcome$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/steps/StepOutcome.tsx [app-ssr] (ecmascript)");
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
const ClaimFlowManager = ()=>{
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ClaimContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClaim"])();
    const renderStep = ()=>{
        switch(state.currentStep){
            case 'Q1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step1Who$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step1Who"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 31,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q2':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Part1_Details$2f$Step2Insurance$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step2Insurance"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 33,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q2_1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step2OtherCoverDetails$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step2OtherCoverDetails"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 35,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q3':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step3KnowCondition$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step3KnowCondition"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 37,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q4_1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomKnown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step4SymptomKnown"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 39,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q4_2':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step4SymptomDescribe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step4SymptomDescribe"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 41,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q5':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step5SymptomStart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step5SymptomStart"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 43,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q6':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousSymptoms$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step6PreviousSymptoms"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 45,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q6_1':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step6PreviousDate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step6PreviousDate"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 47,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q7':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step7HowHappened$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step7HowHappened"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 49,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q8':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step8Responsibility$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step8Responsibility"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 51,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q9':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step9GPConsultation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step9GPConsultation"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 53,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q10':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step10ReferralDate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step10ReferralDate"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 55,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q11':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step11ServiceReferral$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step11ServiceReferral"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 57,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'Q12':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step12HospitalClinic$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step12HospitalClinic"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 59,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'REVIEW':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepReviewSummary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StepReviewSummary"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 61,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'OUTCOME':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$StepOutcome$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StepOutcome"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 63,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$steps$2f$Step1Who$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Step1Who"], {}, void 0, false, {
                    fileName: "[project]/src/components/ClaimFlowManager.tsx",
                    lineNumber: 65,
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
            lineNumber: 71,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ClaimFlowManager.tsx",
        lineNumber: 70,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b0fcdee9._.js.map