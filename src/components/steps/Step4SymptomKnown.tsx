import React, { useState, useCallback } from 'react';
import { QuestionLayout } from '../ui/QuestionLayout';
import { SearchInput } from '../ui/SearchInput';
import { LoadingIndicator } from '../ui/LoadingIndicator';
import { SnomedResultTile } from '../ui/SnomedResultTile';
import ModalOverlay from '../ui/ModalOverlay';
import { useClaim } from '@/context/ClaimContext';
import { fetchSnomed, fetchSnomedSuggestions } from '../../hooks/useSnomed';
import type { SnomedCode } from '../../types/claim';

const SUGGESTION_LIMIT = 4;

export const Step4SymptomKnown: React.FC = () => {
  const { dispatch } = useClaim();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SnomedCode | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SnomedCode[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [confirmedQuery, setConfirmedQuery] = useState<string>('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<SnomedCode | null>(null);

  const handleSearchChange = async (value: string) => {
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
      const res = await fetchSnomed(value);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = useCallback(() => {
    if (!result) return;
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'symptom',
        value: {
          snomedCode: result,
          userInput: result.name,
          isConfirmed: true,
        },
      },
    });
    // Replace search input with SNOMED name and hide the result tile
    setQuery(result.name);
    setConfirmedQuery(result.name); // Track that this is a confirmed result
    setResult(null);
  }, [result, dispatch]);

  const handleSomethingElse = useCallback(async () => {
    setResult(null);
    setModalOpen(true);
    const searchQuery = query.trim() || 'symptom';
    setSuggestionsLoading(true);
    try {
      const list = await fetchSnomedSuggestions(searchQuery, SUGGESTION_LIMIT);
      setSuggestions(list);
    } finally {
      setSuggestionsLoading(false);
    }
  }, [query]);

  const handleLoadMoreSuggestions = useCallback(async () => {
    const searchQuery = query.trim() || 'symptom';
    setSuggestionsLoading(true);
    try {
      const newList = await fetchSnomedSuggestions(searchQuery, SUGGESTION_LIMIT);
      // Replace current suggestions with new ones (refresh)
      setSuggestions(newList);
      // Clear selection when loading new suggestions
      setSelectedSuggestion(null);
    } finally {
      setSuggestionsLoading(false);
    }
  }, [query]);

  const handleSelectSuggestion = useCallback((code: SnomedCode) => {
    // Just select the suggestion, don't confirm yet
    setSelectedSuggestion(code);
  }, []);

  const handleConfirmSelection = useCallback(() => {
    if (!selectedSuggestion) return;
    
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'symptom',
        value: {
          snomedCode: selectedSuggestion,
          userInput: selectedSuggestion.name,
          isConfirmed: true,
        },
      },
    });
    setModalOpen(false);
    setSuggestions([]);
    setQuery(selectedSuggestion.name);
    setConfirmedQuery(selectedSuggestion.name);
    setSelectedSuggestion(null);
  }, [selectedSuggestion, dispatch]);

  return (
    <QuestionLayout
      partLabel="Symptoms & condition"
      currentIndex={2}
      total={4}
      question="Can you share with us the diagnosis?"
    >
      <SearchInput
        value={query}
        onChange={handleSearchChange}
        placeholder="Please enter your diagnosis"
        autoFocus
      />

      {loading && <LoadingIndicator label="Looking up SNOMED matches…" />}

      {!loading && result && (
        <div className="flex flex-col gap-[8px] w-full">
          <p className="font-medium text-[18px] leading-[32px] text-[#4d4f5c]">
            Does this sound like what you&apos;ve got?
          </p>
          <SnomedResultTile
            code={result.code}
            name={result.name}
            description={result.description}
            onConfirm={handleConfirm}
            onSomethingElse={handleSomethingElse}
          />
        </div>
      )}

      <ModalOverlay
        open={modalOpen}
        onClose={() => { 
          setModalOpen(false); 
          setSuggestions([]);
          setSelectedSuggestion(null);
        }}
        title="Could it be one of these?"
      >
        {/* Load more suggestions button - left aligned */}
        <button
          type="button"
          onClick={handleLoadMoreSuggestions}
          disabled={suggestionsLoading}
          className="flex items-center justify-start gap-[2px] h-[48px] py-[16px] text-[14px] text-[#0055b7] hover:text-[#1276c0] disabled:opacity-50"
        >
          <span className="font-normal">Load another 4 suggestions</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={suggestionsLoading ? 'animate-spin' : ''}>
            <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
          </svg>
        </button>

        {/* Suggestions list */}
        {suggestionsLoading ? (
          <LoadingIndicator label="Loading suggestions…" />
        ) : (
          <div className="flex flex-col gap-[14px] w-full">
            {suggestions.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className={`w-full rounded-[8px] border p-[16px] text-left transition min-w-[280px] max-w-[600px] ${
                  selectedSuggestion?.code === item.code
                    ? 'border-[2px] border-[#0055b7] bg-white'
                    : 'border border-[#d2d3d6] bg-white hover:bg-[#f6f6f7]'
                }`}
              >
                <p className="font-medium text-[18px] leading-[32px] text-[#4d4f5c]">
                  {item.name}
                </p>
              </button>
            ))}
            {!suggestionsLoading && suggestions.length === 0 && (
              <p className="text-[16px] leading-[28px] text-[#4d4f5c]">No suggestions found. Try searching again.</p>
            )}
          </div>
        )}

        {/* Support text - left aligned */}
        <div className="flex flex-col gap-[10px] items-start justify-center pt-[16px] w-full">
          <p className="font-normal text-[16px] leading-[28px] text-[#4d4f5c] text-left">
            If you don&apos;t see any result you want here, you can try add keywords in your description that specifies the affected body part, position, cause of symptom etc. Otherwise, please call us and we will guide you from here:
          </p>
          <p className="font-semibold text-[18px] leading-[24px] text-[#0055b7]">
            01752 395404
          </p>
        </div>

        {/* Footer - fixed at bottom */}
        <div className="flex-shrink-0 p-[24px] pt-[16px] border-t border-[#f0f0f0]">
          <div className="w-full pr-[280px]">
            <button
              type="button"
              onClick={handleConfirmSelection}
              disabled={!selectedSuggestion}
              className={`w-full h-[64px] rounded-[8px] px-[24px] py-[16px] flex items-center justify-center transition ${
                selectedSuggestion
                  ? 'bg-[#0055b7] hover:bg-[#1276c0] text-white cursor-pointer'
                  : 'bg-[#d2d3d6] text-[#8a8c95] cursor-not-allowed'
              }`}
            >
              <span className="font-semibold text-[16px] leading-[28px] tracking-[0.1px]">
                Confirm
              </span>
            </button>
          </div>
        </div>
      </ModalOverlay>
    </QuestionLayout>
  );
};

export default Step4SymptomKnown;
