export type TabType = 'home' | 'phq9' | 'gad7' | 'history' | 'about';

export type GenderType = 'Laki-laki' | 'Perempuan';

export interface RespondentInfo {
  name: string;
  gender: GenderType | '';
  age: string;
  phone?: string;
  notes?: string;
}

export interface QuestionOption {
  text: string;
  score: number;
}

export interface ClinicalReferenceRow {
  scoreRange: string;
  minScore: number;
  maxScore: number;
  severity: string;
  action: string;
  highlight?: boolean;
}

export interface ScreeningResult {
  id: string;
  type: 'phq9' | 'gad7';
  title: string;
  respondent: RespondentInfo;
  answers: number[];
  totalScore: number;
  maxScore: number;
  category: string;
  severityLevel: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
  summaryDescription: string;
  interpretationTitle: string;
  interpretationText: string;
  recommendations: string[];
  criticalAlert?: {
    flagged: boolean;
    title: string;
    message: string;
    scoreVal?: number;
  };
  pfaData?: {
    look: string;
    listen: string;
    link: string;
  };
  dateFullWita: string;
  timestamp: number;
}
