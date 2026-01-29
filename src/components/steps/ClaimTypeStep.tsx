'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useClaim } from '@/context/ClaimContext';
import { TopBar } from '@/components/ui/TopBar';

type ClaimType = 'newMedical' | 'routineHealthcare' | 'fastTrackPhysio' | 'fastTrackSkin';

type ClaimCard = {
  id: ClaimType;
  title: string;
  icon: string;
  description: string[];
  section: 'specialized' | 'routine' | 'fastTrack';
};

const claimCards: ClaimCard[] = [
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

export const ClaimTypeStep: React.FC = () => {
  const { dispatch } = useClaim();
  const [selectedCard, setSelectedCard] = useState<ClaimType | null>(null);

  const handleSelectCard = (cardId: ClaimType) => {
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

  const handleContinue = () => {
    if (selectedCard) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const fastTrackCards = claimCards.filter(card => card.section === 'fastTrack');

  return (
    <div className="w-full bg-[#fafafb] min-h-screen">
      {/* TopBar */}
      <header className="bg-white border-b border-[#d2d3d6] w-full">
        <div className="mx-auto max-w-[1440px] px-[30px] py-[12px]">
          <TopBar />
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-[1200px] mx-auto px-[120px] py-[48px] flex flex-col gap-[48px]">
        {/* Question Header */}
        <div className="flex flex-col gap-[24px] px-[24px] max-w-[696px]">
          <div className="flex flex-col gap-[16px]">
            <h1 className="font-semibold text-[24px] leading-[normal] text-[#4d4f5c]">
              What kind of claim do you want to start?
            </h1>
            <p className="font-normal text-[16px] leading-[24px] text-[#2e2f37]">
              We provide different support to meet your needs. Let us know what kind of care you&apos;re seeking, and we&apos;ll do our best to assist you.
            </p>
          </div>
        </div>

        {/* Top Section: Specialized & Routine Care */}
        <div className="px-[24px]">
          <div className="flex gap-[24px] items-stretch">
            {/* Specialized Care Column */}
            <div className="flex-1 flex flex-col gap-[24px]">
              <p className="font-normal text-[20px] leading-[normal] text-[#2e2f37]">
                Need specialised care
              </p>
              <ClaimCardComponent
                card={claimCards[0]}
                isSelected={selectedCard === claimCards[0].id}
                onSelect={handleSelectCard}
                descriptionPrefix="This option is for you if you:"
              />
            </div>

            {/* Routine Care Column */}
            <div className="flex-1 flex flex-col gap-[24px]">
              <p className="font-normal text-[20px] leading-[normal] text-[#2e2f37]">
                Regular check-ups or care
              </p>
              <ClaimCardComponent
                card={claimCards[1]}
                isSelected={selectedCard === claimCards[1].id}
                onSelect={handleSelectCard}
                descriptionPrefix="Cash backs for regular medical costs such as:"
              />
            </div>
          </div>
        </div>

        {/* Fast Track Section */}
        <div className="rounded-[8px] bg-gradient-to-r from-[#cce9fb] to-[#cce9fb] py-[24px]">
          <div className="flex flex-col gap-[24px]">
            <div className="px-[24px]">
              <p className="font-normal text-[20px] leading-[normal] text-[#0e5e9a]">
                Fast track services for quick support
              </p>
            </div>
            <div className="px-[24px] flex gap-[24px] items-stretch">
              <ClaimCardComponent
                card={fastTrackCards[0]}
                isSelected={selectedCard === fastTrackCards[0].id}
                onSelect={handleSelectCard}
                descriptionPrefix="Quick physiotherapy appointment and support for symptoms such as:"
                isFastTrack
              />
              <ClaimCardComponent
                card={fastTrackCards[1]}
                isSelected={selectedCard === fastTrackCards[1].id}
                onSelect={handleSelectCard}
                descriptionPrefix="Quick care and support for skin issues such as:"
                isFastTrack
              />
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="px-[24px]">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedCard}
            className={`h-[60px] w-[309px] px-[24px] py-[12px] rounded-[6px] flex items-center justify-center transition-colors ${
              selectedCard
                ? 'bg-[#0055b7] hover:bg-[#1276c0] active:bg-[#004494] cursor-pointer'
                : 'bg-[#c7c9ce] cursor-not-allowed'
            }`}
          >
            <span className={`font-semibold text-[16px] leading-[20px] tracking-[0.1px] ${
              selectedCard ? 'text-white' : 'text-[#4d4f5c]'
            }`}>
              Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

type ClaimCardComponentProps = {
  card: ClaimCard;
  isSelected: boolean;
  onSelect: (cardId: ClaimType) => void;
  descriptionPrefix: string;
  isFastTrack?: boolean;
};

const ClaimCardComponent: React.FC<ClaimCardComponentProps> = ({ 
  card, 
  isSelected, 
  onSelect, 
  descriptionPrefix,
  isFastTrack = false 
}) => {
  return (
    <div
      className={`w-full flex-1 h-[360px] flex flex-col gap-[16px] p-[24px] rounded-[6px] border transition-all ${
        isSelected
          ? 'bg-[#F5FBFF] border-[2px] border-[#0055b7]'
          : isFastTrack 
            ? 'bg-white border-[1px] border-[#4191cd]'
            : 'bg-white border-[1px] border-[#d2d3d6]'
      }`}
    >
      {/* Top Info Section */}
      <div className="flex items-center justify-between w-full">
        {/* Icon and Title */}
        <div className="flex gap-[24px] items-center">
          <div className="w-[56px] h-[56px] bg-[#cce9fb] rounded-[8px] flex items-center justify-center shrink-0">
            <Image 
              src={card.icon} 
              alt={card.title}
              width={48}
              height={48}
            />
          </div>
          <p className="font-medium text-[18px] leading-[1.4] text-[#1e1e1e] text-left">
            {card.title}
          </p>
        </div>

        {/* Select Button */}
        <button
          type="button"
          disabled={isSelected}
          className={`h-[48px] w-[144px] px-[24px] py-[12px] rounded-[6px] border-[1.5px] flex items-center justify-center shrink-0 ${
            isSelected
              ? 'bg-[#F5FBFF] border-[#0055b7] cursor-not-allowed opacity-70'
              : 'bg-white border-[#0055b7]'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isSelected) {
              onSelect(card.id);
            }
          }}
        >
          <span className="font-semibold text-[16px] leading-[20px] text-[#0055b7] tracking-[0.1px]">
            Select
          </span>
        </button>
      </div>

      {/* Description Section */}
      <div className="border-t border-[#d7d8dc] pt-[16px] w-full">
        <div className="w-full text-left">
          <p className={`font-normal text-[16px] leading-[24px] mb-[8px] ${
            isFastTrack ? 'text-[#8a8c95]' : 'text-[#757575]'
          }`}>
            {descriptionPrefix}
          </p>
          <ul className="list-disc pl-[24px] space-y-[4px]">
            {card.description.map((item, index) => (
              <li 
                key={index} 
                className={`font-normal text-[16px] leading-[24px] ${
                  isFastTrack ? 'text-[#8a8c95]' : 'text-[#757575]'
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
