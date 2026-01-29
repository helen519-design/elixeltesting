import React from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import { useClaim } from '@/context/ClaimContext';

export const StepOutcome: React.FC = () => {
  const { state } = useClaim();

  const isFastTrack = state.currentStep === 'END_FAST_TRACK';

  return (
    <QuestionLayout
      partLabel="Review"
      currentIndex={1}
      total={1}
      question={isFastTrack ? 'Fast-track consultation booked' : 'Claim submitted successfully'}
    >
      <div className="space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {isFastTrack ? 'All set!' : 'Thank you!'}
          </h2>
          <p className="text-base text-gray-600">
            {isFastTrack 
              ? 'We\'ll contact you within 24 hours to arrange your fast-track consultation.'
              : 'Your claim has been submitted. We\'ll review it and get back to you within 2-3 business days.'
            }
          </p>
        </div>

        {/* Reference Number */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Reference Number</div>
          <div className="text-xl font-mono font-bold text-gray-900">
            WPA-{Date.now().toString().slice(-8)}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Please save this reference number for your records
          </p>
        </div>

        {/* Next Steps */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-base text-gray-900">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-brand-primary font-bold">1.</span>
              <span>We'll review your claim details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary font-bold">2.</span>
              <span>You'll receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary font-bold">3.</span>
              <span>A claims specialist will contact you if we need any additional information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary font-bold">4.</span>
              <span>You'll receive a decision on your claim within 2-3 business days</span>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">Need help?</h3>
          <p className="text-sm text-blue-900">
            If you have any questions, please contact our claims team at{' '}
            <a href="tel:08001234567" className="font-semibold underline">0800 123 4567</a>
            {' '}or email{' '}
            <a href="mailto:claims@wpa.org.uk" className="font-semibold underline">claims@wpa.org.uk</a>
          </p>
        </div>
      </div>
    </QuestionLayout>
  );
};

export default StepOutcome;

