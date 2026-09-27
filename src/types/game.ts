export type RegionId = 'balochistan' | 'punjab' | 'kp' | 'sindh' | 'ict';

export type DecisionType = 'paid' | 'borrowed' | 'cut' | 'stipend_covered';

export interface ChoiceOption {
  action: DecisionType;
  label: string;
  subtext: string;
  cost: number;
  debtAdded: number;
  fatimaQuoteUrdu: string;
  fatimaQuoteEn: string;
  healthDelta: number;
  academicDelta: number;
  dignityDelta: number;
  siblingRisk: string;
  consequenceSummary: string;
}

export interface RoundInfo {
  id: number;
  title: string;
  category: string;
  cost: number;
  icon: string;
  distanceNote?: string;
  description: string;
  situationContext: string;
  urduDialogue: string;
  englishTranslation: string;
  studyNote: string;
  isShock?: boolean;
  choices: {
    pay: ChoiceOption;
    borrow: ChoiceOption;
    cut: ChoiceOption;
  };
}

export interface HouseholdPersona {
  id: RegionId;
  regionName: string;
  locationDetails: string;
  studentName: string;
  studentAge: number;
  studentGrade: string;
  fatherOccupation: string;
  monthlyIncome: number;
  distanceToSchoolKm: number;
  distanceDescription: string;
  floatMultiplier: number;
  startingFloat: number;
  regionalBorrowRate: number; // e.g. 64 for 64%
  stipendOddsPercent: number; // e.g. 0.5% in Balochistan, 24.5% in Punjab
  rounds: RoundInfo[];
  siblingStory: {
    count: number;
    names: string[];
    details: string;
  };
}

export interface RoundDecision {
  roundId: number;
  roundTitle: string;
  cost: number;
  decision: DecisionType;
  remainingFloatAfter: number;
  totalDebtAccumulated: number;
  cutItems: string[];
  choiceDetails: ChoiceOption;
}

export interface PlayerStats {
  health: number;    // 0 - 100
  academic: number;  // 0 - 100
  dignity: number;   // 0 - 100
  siblingSecurity: number; // 0 - 100
}

export type GameStage = 'intro' | 'roadmap' | 'decision' | 'consequence' | 'shock_lottery' | 'closing';

export type ViewMode = 'dual' | 'mobile' | 'projector';

export interface AudienceStats {
  totalParticipants: number;
  borrowRate: number; // e.g. 34.2
  cutRate: number; // e.g. 21.8
  paidRate: number; // e.g. 44.0
  activeRound: number;
}
