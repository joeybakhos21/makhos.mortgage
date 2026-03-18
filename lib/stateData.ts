import { State, StateData } from "@/types/quiz";

// Data current as of 2025 financial year
// First Home Guarantee (FHBG) - 5% deposit, no LMI, government guarantees 15%
// First Home Owner Grant (FHOG) - cash grant for new builds
// Stamp duty exemptions/concessions for first home buyers

export const STATE_DATA: Record<State, StateData> = {
  NSW: {
    name: "New South Wales",
    fhgCapCity: 900000,
    fhgCapRegional: 750000,
    fhogAmount: 10000,
    fhogCondition: "New builds only. Property value must not exceed $600,000 (or $750,000 if land + build contract).",
    stampDutyExemptionCap: 800000,
    stampDutyConcessionCap: 1000000,
    stampDutyNote: "Full exemption for properties up to $800k, concessions up to $1M for first home buyers purchasing a new or existing home.",
    averagePropertyPrice: 1100000,
    affordableInterstateBuying: ["QLD", "SA", "WA", "TAS"],
  },
  VIC: {
    name: "Victoria",
    fhgCapCity: 800000,
    fhgCapRegional: 650000,
    fhogAmount: 10000,
    fhogCondition: "New builds only in metro. $20,000 for new builds in regional Victoria.",
    stampDutyExemptionCap: 600000,
    stampDutyConcessionCap: 750000,
    stampDutyNote: "Full exemption for properties up to $600k, sliding concession up to $750k for first home buyers.",
    averagePropertyPrice: 900000,
    affordableInterstateBuying: ["QLD", "SA", "WA", "TAS"],
  },
  QLD: {
    name: "Queensland",
    fhgCapCity: 700000,
    fhgCapRegional: 550000,
    fhogAmount: 30000,
    fhogCondition: "New builds only (house, unit, or townhouse). Contract signed on or after 20 November 2023.",
    stampDutyExemptionCap: null,
    stampDutyConcessionCap: 700000,
    stampDutyNote: "Concessional transfer duty rate on properties up to $700k. No full exemption but significant savings available.",
    averagePropertyPrice: 750000,
    affordableInterstateBuying: ["SA", "WA", "TAS", "NT"],
  },
  SA: {
    name: "South Australia",
    fhgCapCity: 600000,
    fhgCapRegional: 450000,
    fhogAmount: 15000,
    fhogCondition: "New builds only. No income or property value cap for the grant itself.",
    stampDutyExemptionCap: null,
    stampDutyConcessionCap: null,
    stampDutyNote: "The previous stamp duty concession for first home buyers was phased out. No current general concession — stamp duty applies at standard rates.",
    averagePropertyPrice: 680000,
    affordableInterstateBuying: ["WA", "TAS", "NT"],
  },
  WA: {
    name: "Western Australia",
    fhgCapCity: 450000,
    fhgCapRegional: 400000,
    fhogAmount: 10000,
    fhogCondition: "New builds only. Property value up to $750,000.",
    stampDutyExemptionCap: 430000,
    stampDutyConcessionCap: 530000,
    stampDutyNote: "Full stamp duty exemption for properties up to $430k, concession up to $530k.",
    averagePropertyPrice: 650000,
    affordableInterstateBuying: ["SA", "TAS", "NT"],
  },
  TAS: {
    name: "Tasmania",
    fhgCapCity: 600000,
    fhgCapRegional: 450000,
    fhogAmount: 30000,
    fhogCondition: "New builds only. One of the most generous grants in Australia.",
    stampDutyExemptionCap: 400000,
    stampDutyConcessionCap: null,
    stampDutyNote: "50% stamp duty concession on established homes up to $400k, or full concession if eligible for the FHOG on a new build.",
    averagePropertyPrice: 530000,
    affordableInterstateBuying: [],
  },
  ACT: {
    name: "Australian Capital Territory",
    fhgCapCity: 750000,
    fhgCapRegional: 750000,
    fhogAmount: null,
    fhogCondition: null,
    stampDutyExemptionCap: null,
    stampDutyConcessionCap: null,
    stampDutyNote: "ACT has no FHOG but offers stamp duty (conveyance duty) concessions/exemptions based on income thresholds under the Home Buyer Concession Scheme (HBCS).",
    averagePropertyPrice: 820000,
    affordableInterstateBuying: ["QLD", "SA", "WA", "TAS"],
  },
  NT: {
    name: "Northern Territory",
    fhgCapCity: 600000,
    fhgCapRegional: 600000,
    fhogAmount: 10000,
    fhogCondition: "New or substantially renovated homes. No property value cap.",
    stampDutyExemptionCap: null,
    stampDutyConcessionCap: null,
    stampDutyNote: "First home buyers receive a $18,601 stamp duty discount (Territory Home Owner Discount). Standard rates apply above this.",
    averagePropertyPrice: 500000,
    affordableInterstateBuying: [],
  },
};

// Minimum deposit amount for 5% deposit scheme (after checking eligible)
export const MIN_DEPOSIT_FHG = 0.05;
export const MIN_DEPOSIT_STANDARD = 0.2; // No LMI
export const MIN_DEPOSIT_LMI = 0.05; // With LMI

export const INCOME_CAPS: Record<"single" | "joint", number> = {
  single: 125000,
  joint: 200000,
};

export const HELP_TO_BUY_CAP: Record<"single" | "joint", number> = {
  single: 90000,
  joint: 120000,
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}
