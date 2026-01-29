import React from 'react';
import type { SpecialistDetails } from '../../types/claim';
import { SpecialistCard, type SpecialistCardItem } from './SpecialistCard';

/** Mock Doctify-style specialists (physical) with updated details */
export const SPECIALIST_CARDS: SpecialistCardItem[] = [
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
  },
];

/** Mock Doctify-style mental health specialists */
export const MENTAL_SPECIALIST_CARDS: SpecialistCardItem[] = [
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
  },
];

/** Mock Doctify-style mental health therapists */
export const MENTAL_THERAPIST_CARDS: SpecialistCardItem[] = [
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
  },
];

/** Mock Doctify-style therapists (physical) */
export const THERAPIST_CARDS: SpecialistCardItem[] = [
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
  },
];

type MiniFormSpecialistProps = {
  question: number;
  type: 'specialist' | 'mental specialist' | 'mental therapist' | 'therapist' | 'direct referral';
  value: SpecialistDetails | null;
  onChange: (updates: Partial<SpecialistDetails>) => void;
  onReselect?: () => void;
  className?: string;
};

/** question=11, type=specialist or type=mental specialist – Name of Specialist + Doctify cards */
export const MiniFormSpecialist: React.FC<MiniFormSpecialistProps> = ({
  question,
  type,
  value,
  onChange,
  onReselect,
  className = '',
}) => {
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

  return (
    <div
      className={`flex flex-col gap-[24px] ${className}`}
      data-variant={`question-${question}-${type}`}
    >
      {/* Reselect button */}
      {onReselect && (
        <button
          type="button"
          onClick={onReselect}
          className="flex gap-[2px] items-center justify-center py-[16px] h-[48px] self-start"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M10 13L5 8L10 3" stroke="#0055b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold text-[16px] leading-[28px] text-[#0055b7] tracking-[0.1px]">
            Reselect
          </span>
        </button>
      )}

      {/* Title with icon */}
      <div className="flex gap-[16px] items-center w-full">
        <img src={icon} alt="" className="shrink-0 w-[36px] h-[36px]" />
        <p className="flex-1 font-medium text-[18px] leading-[32px] text-[#4d4f5c]">
          {title}
        </p>
      </div>

      {/* Sub-question: Name input */}
      <div className="flex flex-col gap-[24px] pb-[36px]">
        <p className="font-normal text-[18px] leading-[1.4] text-[#1e1e1e]">
          {questionText}
        </p>
        <div className="flex flex-col gap-[8px] w-[360px]">
          <input
            type="text"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={placeholder}
            className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
          />
        </div>
      </div>

      {/* Specialist Recommendation section */}
      <div className="bg-[#f6f6f7] flex flex-col gap-[24px] p-[24px] rounded-[8px] w-full">
        {/* Title */}
        <div className="flex flex-col gap-[16px] text-[#4d4f5c]">
          <p className="font-semibold text-[20px] leading-[normal]">
            Finding someone to consult?
          </p>
          <p className="font-normal text-[16px] leading-[24px]">
            We've gathered a few specialists within our network that are <span className="font-bold">fee verified</span> you might want to pick based on your location.
          </p>
        </div>

        {/* Specialist cards */}
        <div className="flex gap-[24px] w-full">
          {cards.map((card) => (
            <SpecialistCard
              key={card.id}
              specialist={card}
              selected={name === card.name}
              onSelect={() => onChange({ 
                name: card.name, 
                gpHospital: card.gpHospital, 
                specialties: [card.specialty, card.secondarySpecialty].filter(Boolean) as string[]
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniFormSpecialist;
