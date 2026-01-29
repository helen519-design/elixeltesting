import React from 'react';
import type {
  InjuryDetails,
  SportingInjuryDetails,
  TripFallDetails,
  TrafficAccidentDetails,
  AttackAssaultDetails,
  TrafficAccidentRole,
} from '../../types/claim';

const inputClass =
  'w-full rounded-lg border border-[#d2d3d6] bg-white px-3 py-2 text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#949494] focus:outline-none focus:border-[#0055b7]';
const labelClass = 'block text-[14px] leading-[24px] font-medium text-[#4d4f5c] mb-1';

type InjuryFormVariantProps = {
  injuryDetails: InjuryDetails;
  onChange: (updates: Partial<InjuryDetails>) => void;
  className?: string;
};

/** question=7, type=sporting injury */
export const MiniFormInjurySporting: React.FC<InjuryFormVariantProps> = ({
  injuryDetails,
  onChange,
  className = '',
}) => {
  const d = (injuryDetails.sporting || { sport: '', country: '', receivedDonation: null }) as SportingInjuryDetails;
  const update = (u: Partial<SportingInjuryDetails>) =>
    onChange({ sporting: { ...d, ...u } });
  
  const handleReselect = () => {
    onChange({ type: null });
  };

  return (
    <div className={`flex flex-col gap-[24px] ${className}`} data-variant="q7-sporting">
      {/* Reselect button */}
      <button
        type="button"
        onClick={handleReselect}
        className="flex items-center gap-[2px] h-[48px] py-[16px] text-[#0055b7] hover:text-[#1276c0] self-start"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
          <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
          Reselect
        </span>
      </button>

      {/* Heading */}
      <h3 className="text-[18px] leading-[32px] font-medium text-[#4d4f5c]">
        Sporting Injury
      </h3>

      {/* 2-column grid for subquestions */}
      <div className="grid grid-cols-2 gap-x-[48px] gap-y-[36px]">
        {/* Left column: Sport or activity */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            What sport or activity were you playing?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <label className="text-[18px] leading-[25.2px] font-medium text-[#1e1e1e]">
              Sport or activity
            </label>
            <input
              type="text"
              value={d.sport}
              onChange={(e) => update({ sport: e.target.value })}
              placeholder="E.g. football"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Right column: Country */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Where did this happen?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <label className="text-[18px] leading-[25.2px] font-medium text-[#1e1e1e]">
              Country
            </label>
            <input
              type="text"
              value={d.country}
              onChange={(e) => update({ country: e.target.value })}
              placeholder="E.g. Spain"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Full width: Donation question */}
        <div className="col-span-2 flex flex-col gap-[14px] min-w-[360px] py-[24px] rounded-[8px]">
          <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c] w-full">
            Were you receiving any donation or subsidy for this activity?
          </p>
          <div className="flex gap-[16px] flex-wrap items-start w-full">
            {/* Yes radio button */}
            <button
              type="button"
              onClick={() => update({ receivedDonation: true })}
              className="flex items-center gap-[8px]"
            >
              <div 
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                  d.receivedDonation === true 
                    ? 'border-[#0055b7] bg-white' 
                    : 'border-[#d2d3d6] bg-white'
                }`}
              >
                {d.receivedDonation === true && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                )}
              </div>
              <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                Yes
              </span>
            </button>

            {/* No radio button */}
            <button
              type="button"
              onClick={() => update({ receivedDonation: false })}
              className="flex items-center gap-[8px]"
            >
              <div 
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                  d.receivedDonation === false 
                    ? 'border-[#0055b7] bg-white' 
                    : 'border-[#d2d3d6] bg-white'
                }`}
              >
                {d.receivedDonation === false && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                )}
              </div>
              <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                No
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** question=7, type=trip/fall */
export const MiniFormInjuryTripFall: React.FC<InjuryFormVariantProps> = ({
  injuryDetails,
  onChange,
  className = '',
}) => {
  const d = (injuryDetails.tripFall || { cause: '', country: '', wasWinterSport: null }) as TripFallDetails;
  const update = (u: Partial<TripFallDetails>) =>
    onChange({ tripFall: { ...d, ...u } });
  
  const handleReselect = () => {
    onChange({ type: null });
  };

  return (
    <div className={`flex flex-col gap-[24px] ${className}`} data-variant="q7-trip-fall">
      {/* Reselect button */}
      <button
        type="button"
        onClick={handleReselect}
        className="flex items-center gap-[2px] h-[48px] py-[16px] text-[#0055b7] hover:text-[#1276c0] self-start"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
          <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
          Reselect
        </span>
      </button>

      {/* Heading */}
      <h3 className="text-[18px] leading-[32px] font-medium text-[#4d4f5c]">
        Trip or Fall
      </h3>

      {/* 2-column grid for subquestions */}
      <div className="grid grid-cols-2 gap-x-[48px] gap-y-[36px]">
        {/* Left column: Cause of injury */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            What caused the injury?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <label className="text-[18px] leading-[25.2px] font-medium text-[#1e1e1e]">
              Cause of injury
            </label>
            <input
              type="text"
              value={d.cause}
              onChange={(e) => update({ cause: e.target.value })}
              placeholder="E.g. slippery floor"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Right column: Country */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Where did this happen?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <label className="text-[18px] leading-[25.2px] font-medium text-[#1e1e1e]">
              Country
            </label>
            <input
              type="text"
              value={d.country}
              onChange={(e) => update({ country: e.target.value })}
              placeholder="E.g. Spain"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Full width: Winter sport question */}
        <div className="col-span-2 flex flex-col gap-[14px] min-w-[360px] py-[24px] rounded-[8px]">
          <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c] w-full">
            Were you part-taking a winter sport at the time of injury?
          </p>
          <div className="flex gap-[16px] flex-wrap items-start w-full">
            {/* Yes radio button */}
            <button
              type="button"
              onClick={() => update({ wasWinterSport: true })}
              className="flex items-center gap-[8px]"
            >
              <div 
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                  d.wasWinterSport === true 
                    ? 'border-[#0055b7] bg-white' 
                    : 'border-[#d2d3d6] bg-white'
                }`}
              >
                {d.wasWinterSport === true && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                )}
              </div>
              <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                Yes
              </span>
            </button>

            {/* No radio button */}
            <button
              type="button"
              onClick={() => update({ wasWinterSport: false })}
              className="flex items-center gap-[8px]"
            >
              <div 
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                  d.wasWinterSport === false 
                    ? 'border-[#0055b7] bg-white' 
                    : 'border-[#d2d3d6] bg-white'
                }`}
              >
                {d.wasWinterSport === false && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                )}
              </div>
              <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                No
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** question=7, type=traffic accident */
export const MiniFormInjuryTraffic: React.FC<InjuryFormVariantProps> = ({
  injuryDetails,
  onChange,
  className = '',
}) => {
  const d = (injuryDetails.traffic || {
    role: null,
    incidentDescription: '',
    criminalProceedings: null,
    country: '',
  }) as TrafficAccidentDetails;
  const update = (u: Partial<TrafficAccidentDetails>) =>
    onChange({ traffic: { ...d, ...u } });
  
  const handleReselect = () => {
    onChange({ type: null });
  };

  const roles: { value: TrafficAccidentRole; label: string }[] = [
    { value: 'motorcycle_bicycle', label: 'On a motorcycle or bicycle' },
    { value: 'motor_vehicle', label: 'In a car van or other motor vehicle' },
    { value: 'pedestrian', label: 'A pedestrian involved' },
  ];

  return (
    <div className={`flex flex-col gap-[24px] ${className}`} data-variant="q7-traffic">
      {/* Reselect button */}
      <button
        type="button"
        onClick={handleReselect}
        className="flex items-center gap-[2px] h-[48px] py-[16px] text-[#0055b7] hover:text-[#1276c0] self-start"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
          <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
          Reselect
        </span>
      </button>

      {/* Heading */}
      <h3 className="text-[18px] leading-[32px] font-medium text-[#4d4f5c]">
        Traffic Accident
      </h3>

      {/* Form layout */}
      <div className="flex flex-col gap-[36px]">
        {/* Role selection - single column */}
        <div className="flex flex-col gap-[14px] min-w-[360px] py-[24px] rounded-[8px]">
          <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c] w-full">
            Are any of these correct for you in regards to the incident?
          </p>
          <div className="flex flex-col gap-[16px] items-start w-full">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => update({ role: role.value })}
                className="flex items-center gap-[8px]"
              >
                <div 
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                    d.role === role.value 
                      ? 'border-[#0055b7] bg-white' 
                      : 'border-[#d2d3d6] bg-white'
                  }`}
                >
                  {d.role === role.value && (
                    <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                  )}
                </div>
                <span className="text-[18px] leading-[32px] font-medium text-[#4d4f5c]">
                  {role.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional sub-question for motorcycle/bicycle */}
        {d.role === 'motorcycle_bicycle' && (
          <div className="flex flex-col gap-[14px] min-w-[360px] py-[24px] rounded-[8px]">
            <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c] w-full">
              Were you wearing appropriate protection including a helmet?
            </p>
            <div className="flex gap-[16px] flex-wrap items-start w-full">
              <button
                type="button"
                onClick={() => update({ hadProtection: true })}
                className="flex items-center gap-[8px]"
              >
                <div 
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                    d.hadProtection === true 
                      ? 'border-[#0055b7] bg-white' 
                      : 'border-[#d2d3d6] bg-white'
                  }`}
                >
                  {d.hadProtection === true && (
                    <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                  )}
                </div>
                <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                  Yes
                </span>
              </button>

              <button
                type="button"
                onClick={() => update({ hadProtection: false })}
                className="flex items-center gap-[8px]"
              >
                <div 
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                    d.hadProtection === false 
                      ? 'border-[#0055b7] bg-white' 
                      : 'border-[#d2d3d6] bg-white'
                  }`}
                >
                  {d.hadProtection === false && (
                    <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                  )}
                </div>
                <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                  No
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Conditional sub-question for motor vehicle */}
        {d.role === 'motor_vehicle' && (
          <div className="flex flex-col gap-[14px] min-w-[360px] py-[24px] rounded-[8px]">
            <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c] w-full">
              Were you wearing a seatbelt?
            </p>
            <div className="flex gap-[16px] flex-wrap items-start w-full">
              <button
                type="button"
                onClick={() => update({ hadSeatbelt: true })}
                className="flex items-center gap-[8px]"
              >
                <div 
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                    d.hadSeatbelt === true 
                      ? 'border-[#0055b7] bg-white' 
                      : 'border-[#d2d3d6] bg-white'
                  }`}
                >
                  {d.hadSeatbelt === true && (
                    <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                  )}
                </div>
                <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                  Yes
                </span>
              </button>

              <button
                type="button"
                onClick={() => update({ hadSeatbelt: false })}
                className="flex items-center gap-[8px]"
              >
                <div 
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                    d.hadSeatbelt === false 
                      ? 'border-[#0055b7] bg-white' 
                      : 'border-[#d2d3d6] bg-white'
                  }`}
                >
                  {d.hadSeatbelt === false && (
                    <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                  )}
                </div>
                <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                  No
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Criminal proceedings question */}
        <div className="flex flex-col gap-[14px] min-w-[360px] py-[24px] rounded-[8px]">
          <p className="text-[18px] leading-[32px] font-normal text-[#4d4f5c] w-full">
            Are there any criminal proceedings against you?
          </p>
          <div className="flex gap-[16px] flex-wrap items-start w-full">
            {/* Yes radio button */}
            <button
              type="button"
              onClick={() => update({ criminalProceedings: true })}
              className="flex items-center gap-[8px]"
            >
              <div 
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                  d.criminalProceedings === true 
                    ? 'border-[#0055b7] bg-white' 
                    : 'border-[#d2d3d6] bg-white'
                }`}
              >
                {d.criminalProceedings === true && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                )}
              </div>
              <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                Yes
              </span>
            </button>

            {/* No radio button */}
            <button
              type="button"
              onClick={() => update({ criminalProceedings: false })}
              className="flex items-center gap-[8px]"
            >
              <div 
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                  d.criminalProceedings === false 
                    ? 'border-[#0055b7] bg-white' 
                    : 'border-[#d2d3d6] bg-white'
                }`}
              >
                {d.criminalProceedings === false && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0055b7]" />
                )}
              </div>
              <span className="text-[16px] leading-[28px] font-medium text-[#4d4f5c]">
                No
              </span>
            </button>
          </div>
        </div>

        {/* Country input */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Where did this happen?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <label className="text-[18px] leading-[25.2px] font-medium text-[#1e1e1e]">
              Country
            </label>
            <input
              type="text"
              value={d.country}
              onChange={(e) => update({ country: e.target.value })}
              placeholder="E.g. Spain"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/** question=7, type=attack/assault */
export const MiniFormInjuryAttack: React.FC<InjuryFormVariantProps> = ({
  injuryDetails,
  onChange,
  className = '',
}) => {
  const d = (injuryDetails.attack || { cause: '', country: '' }) as AttackAssaultDetails;
  const update = (u: Partial<AttackAssaultDetails>) =>
    onChange({ attack: { ...d, ...u } });
  
  const handleReselect = () => {
    onChange({ type: null });
  };

  return (
    <div className={`flex flex-col gap-[24px] ${className}`} data-variant="q7-attack">
      {/* Reselect button */}
      <button
        type="button"
        onClick={handleReselect}
        className="flex items-center gap-[2px] h-[48px] py-[16px] text-[#0055b7] hover:text-[#1276c0] self-start"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
          <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[16px] leading-[28px] font-semibold tracking-[0.1px]">
          Reselect
        </span>
      </button>

      {/* Heading */}
      <h3 className="text-[18px] leading-[32px] font-medium text-[#4d4f5c]">
        Attack or assault
      </h3>

      {/* 2-column grid for subquestions */}
      <div className="grid grid-cols-2 gap-x-[48px] gap-y-[36px]">
        {/* Left column: Cause of incident */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Can you describe how did this happened?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <label className="text-[18px] leading-[25.2px] font-medium text-[#1e1e1e]">
              Cause of the incident
            </label>
            <input
              type="text"
              value={d.cause}
              onChange={(e) => update({ cause: e.target.value })}
              placeholder="Please describe the cause"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>

        {/* Right column: Country */}
        <div className="flex flex-col gap-[24px]">
          <p className="text-[18px] leading-[25.2px] font-normal text-[#1e1e1e]">
            Where did this happen?
          </p>
          <div className="flex flex-col gap-[8px] w-[360px]">
            <label className="text-[18px] leading-[25.2px] font-medium text-[#1e1e1e]">
              Country
            </label>
            <input
              type="text"
              value={d.country}
              onChange={(e) => update({ country: e.target.value })}
              placeholder="E.g. Spain"
              className="w-full h-[56px] px-[16px] py-[16px] rounded-[8px] border border-[#d2d3d6] bg-white text-[16px] leading-[28px] text-[#4d4f5c] placeholder:text-[#8a8c95] focus:outline-none focus:border-[#0055b7] focus:ring-1 focus:ring-[#0055b7]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/** question=7, type=other */
export const MiniFormInjuryOther: React.FC<InjuryFormVariantProps> = ({
  injuryDetails,
  onChange,
  className = '',
}) => {
  const other = injuryDetails.other ?? '';
  return (
    <div className={`rounded-lg border border-[#d2d3d6] bg-white p-4 space-y-4 ${className}`} data-variant="q7-other">
      <div>
        <label className={labelClass}>Please describe how this happened</label>
        <textarea value={other} onChange={(e) => onChange({ other: e.target.value })} placeholder="Brief description" rows={3} className={inputClass} />
      </div>
    </div>
  );
};
