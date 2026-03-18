export type State = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";

export type QuestionId =
  | "state"
  | "firstHomeBuyer"
  | "buyingWith"
  | "income"
  | "deposit"
  | "hasGuarantor"
  | "guarantorEquity"
  | "guarantorFormalised"
  | "propertyBudget"
  | "locationFlexible"
  | "rentWhileBuying"
  | "employmentStatus"
  | "citizenship";

export type AnswerValue = string | number;

export interface Answer {
  questionId: QuestionId;
  value: AnswerValue;
}

export interface QuizState {
  answers: Partial<Record<QuestionId, AnswerValue>>;
  currentQuestionId: QuestionId;
  history: QuestionId[];
  completed: boolean;
}

export type Recommendation =
  | "owner_occupied"
  | "investment_local"
  | "investment_interstate";

export interface RecommendationResult {
  primary: Recommendation;
  secondaries: Recommendation[];
  eligibleSchemes: EligibleScheme[];
  summary: string;
  details: string[];
  depositGap?: number;
}

export interface EligibleScheme {
  name: string;
  description: string;
  amount?: string;
  link?: string;
}

export interface StateData {
  name: string;
  fhgCapCity: number;
  fhgCapRegional: number;
  stampDutyExemptionCap: number | null;
  stampDutyConcessionCap: number | null;
  stampDutyNote: string;
  averagePropertyPrice: number;
  affordableInterstateBuying?: string[];
}
