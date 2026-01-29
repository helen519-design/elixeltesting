/**
 * Mock SNOMED API Service
 * Simulates fetching SNOMED codes with a delay
 */

import type { SnomedCode } from '../types/claim';

// Mock SNOMED database
const MOCK_SNOMED_DATABASE: SnomedCode[] = [
  // Knee conditions
  { code: '30989003', name: 'Knee pain', description: 'Pain in the knee joint' },
  { code: '239873007', name: 'Osteoarthritis of knee', description: 'Degenerative joint disease of the knee' },
  { code: '304120007', name: 'Torn meniscus of knee', description: 'Tear in the cartilage of the knee' },
  { code: '429516004', name: 'Anterior cruciate ligament injury', description: 'ACL tear or sprain' },
  { code: '202855006', name: 'Lateral collateral ligament injury of knee', description: 'LCL injury' },
  { code: '156659008', name: 'Swelling of knee', description: 'Knee effusion or swelling' },

  // Back and spine
  { code: '161891005', name: 'Back pain', description: 'Pain in the back region' },
  { code: '279039007', name: 'Low back pain', description: 'Pain in the lower back' },
  { code: '21522001', name: 'Abdominal pain', description: 'Pain in the abdomen' },
  { code: '395507008', name: 'Slipped disc', description: 'Herniated intervertebral disc' },
  { code: '203082005', name: 'Fibromyalgia', description: 'Chronic widespread musculoskeletal pain' },

  // Shoulder and arm
  { code: '45326000', name: 'Shoulder pain', description: 'Pain in the shoulder region' },
  { code: '399114005', name: 'Arthritis of shoulder', description: 'Inflammatory condition of shoulder joint' },
  { code: '56208002', name: 'Elbow pain', description: 'Pain in the elbow' },
  { code: '73583000', name: 'Epicondylitis', description: 'Tennis elbow or golfer\'s elbow' },
  { code: '299306003', name: 'Rotator cuff syndrome', description: 'Rotator cuff tear or injury' },

  // Ankle and foot
  { code: '247373008', name: 'Ankle pain', description: 'Pain in the ankle' },
  { code: '44465007', name: 'Sprained ankle', description: 'Ligament injury to ankle' },
  { code: '47933007', name: 'Foot pain', description: 'Pain in the foot' },
  { code: '202882003', name: 'Plantar fasciitis', description: 'Inflammation of the plantar fascia' },
  { code: '239830003', name: 'Achilles tendonitis', description: 'Inflammation of the Achilles tendon' },

  // Hip
  { code: '49218002', name: 'Hip pain', description: 'Pain in the hip region' },
  { code: '239872002', name: 'Osteoarthritis of hip', description: 'Degenerative joint disease of the hip' },

  // Hand and wrist
  { code: '56608008', name: 'Wrist pain', description: 'Pain in the wrist' },
  { code: '134407002', name: 'Carpal tunnel syndrome', description: 'Nerve compression in the wrist' },
  { code: '53057004', name: 'Hand pain', description: 'Pain in the hand' },
  { code: '156659008', name: 'Hand injury', description: 'Traumatic injury to the hand' },

  // Headache and neurological
  { code: '25064002', name: 'Headache', description: 'Pain in the head' },
  { code: '37796009', name: 'Migraine', description: 'Recurrent severe headache' },
  { code: '230690007', name: 'Cerebrovascular accident', description: 'Stroke' },

  // Chest and cardiovascular
  { code: '29857009', name: 'Chest pain', description: 'Pain in the chest region' },
  { code: '426976009', name: 'Angina pectoris', description: 'Chest pain due to reduced blood flow to heart' },

  // Respiratory
  { code: '49727002', name: 'Cough', description: 'Forceful expulsion of air from lungs' },
  { code: '267036007', name: 'Dyspnea', description: 'Shortness of breath or difficulty breathing' },
  { code: '195967001', name: 'Asthma', description: 'Chronic respiratory condition' },

  // Skin
  { code: '271807003', name: 'Rash', description: 'Skin eruption or change in skin appearance' },
  { code: '90734009', name: 'Chronic pain', description: 'Persistent pain lasting more than 3 months' },

  // General symptoms
  { code: '84229001', name: 'Fatigue', description: 'Extreme tiredness or exhaustion' },
  { code: '422587007', name: 'Nausea', description: 'Feeling of sickness with inclination to vomit' },
  { code: '386661006', name: 'Fever', description: 'Elevated body temperature' },
  { code: '271681002', name: 'Stomach ache', description: 'Pain in the stomach region' },
];

/**
 * Simulate fetching SNOMED codes with a delay
 * @param query - Search query from user input
 * @returns Promise resolving to a SNOMED code object
 */
export const fetchSnomed = async (query: string): Promise<SnomedCode | null> => {
  // Simulate network delay (1 second)
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!query || query.trim().length === 0) {
    return null;
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Find exact match first
  const exactMatch = MOCK_SNOMED_DATABASE.find(
    item => item.name.toLowerCase() === normalizedQuery
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Find partial match (any word matches)
  const queryWords = normalizedQuery.split(/\s+/);
  
  for (const item of MOCK_SNOMED_DATABASE) {
    const itemWords = item.name.toLowerCase().split(/\s+/);
    const hasMatch = queryWords.some(qWord => 
      itemWords.some(iWord => iWord.includes(qWord) || qWord.includes(iWord))
    );
    
    if (hasMatch) {
      return item;
    }
  }

  // Check description for matches
  const descriptionMatch = MOCK_SNOMED_DATABASE.find(
    item => item.description?.toLowerCase().includes(normalizedQuery)
  );

  if (descriptionMatch) {
    return descriptionMatch;
  }

  // Default fallback - return a generic result
  return {
    code: '22253000',
    name: query.charAt(0).toUpperCase() + query.slice(1),
    description: 'Symptom or condition based on user description',
  };
};

/**
 * Fetch multiple SNOMED suggestions based on a query
 * @param query - Search query from user input
 * @param limit - Maximum number of results to return (default: 4)
 * @returns Promise resolving to an array of SNOMED code objects
 */
export const fetchSnomedSuggestions = async (
  query: string,
  limit: number = 4
): Promise<SnomedCode[]> => {
  // Simulate network delay (1 second)
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: Array<{ item: SnomedCode; score: number }> = [];

  // Score each item based on relevance
  for (const item of MOCK_SNOMED_DATABASE) {
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

    queryWords.forEach(qWord => {
      itemWords.forEach(iWord => {
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
      results.push({ item, score });
    }
  }

  // Sort by score (descending) and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.item);
};

/**
 * Get a random SNOMED code (useful for testing)
 */
export const getRandomSnomed = (): SnomedCode => {
  const randomIndex = Math.floor(Math.random() * MOCK_SNOMED_DATABASE.length);
  return MOCK_SNOMED_DATABASE[randomIndex];
};

/**
 * Get all available SNOMED codes (useful for autocomplete)
 */
export const getAllSnomedCodes = (): SnomedCode[] => {
  return [...MOCK_SNOMED_DATABASE];
};

/**
 * Simulate checking if a SNOMED code exists
 */
export const verifySnomedCode = async (code: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_SNOMED_DATABASE.some(item => item.code === code);
};