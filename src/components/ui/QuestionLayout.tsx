import React, { ReactNode } from 'react';

import { QuestionTag } from './QuestionTag';

type QuestionLayoutProps = {
  partLabel: string;
  currentIndex: number;
  total: number;
  question: string | ReactNode;
  description?: string | ReactNode;
  children: ReactNode;
  className?: string;
  hideQuestionTag?: boolean;
};

/**
 * QuestionLayout
 *
 * Structure:
 * - QuestionTag at the very top
 * - Question text + description (24px gap from tag, 16px gap between heading/description)
 * - Content slot (children) for controls (48px gap from header)
 *
 * Animation is handled by AppShell's AnimatedStepContainer.
 *
 * Figma variable mapping:
 * - Question: 24px / 40px, font-semibold (title-page-md)
 * - Description: 16px / 28px (body)
 * - Spacing: 24px from tag to header, 48px from header to inputs
 */
export const QuestionLayout: React.FC<QuestionLayoutProps> = ({
  partLabel,
  currentIndex,
  total,
  question,
  description,
  children,
  className = '',
  hideQuestionTag = false,
}) => {
  return (
    <section
      className={`flex flex-col max-w-question ${className}`}
    >
      {/* Tag at the very top */}
      {!hideQuestionTag && (
        <QuestionTag partLabel={partLabel} currentIndex={currentIndex} total={total} />
      )}

      {/* Question text + description */}
      <header className="mt-6 space-y-4">
        <h2 className="text-2xl leading-10 font-semibold text-gray-700">
          {question}
        </h2>
        {description && (
          <div className="text-[16px] leading-[28px] font-normal text-[#4d4f5c]">{description}</div>
        )}
      </header>

      {/* Content slot for inputs (chips, search, etc.) - 48px gap from header */}
      <div className="mt-12 space-y-4">{children}</div>
    </section>
  );
};

export default QuestionLayout;

