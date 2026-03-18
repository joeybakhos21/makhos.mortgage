import { State, StateData } from "@/types/quiz";

// Data current as of 2025 financial year
// First Home Guarantee (FHG) - 5% deposit, no LMI, government guarantees 15%
// Income caps for FHG were removed from 1 July 2024 — no income test applies
// Stamp duty exemptions/concessions for first home buyers

export const STATE_DATA: Record<State, StateData> = {
  NSW: {
    name: "New South Wales",
    fhgCapCity: 900000,
    fhgCapRegional: 750000,
    stampDutyExemptionCap: 800000,
    stampDutyConcessionCap: 1000000,
    stampDutyNote: "Full exemption on properties up to $800k, concession up to $1M for first home buyers (new or existing homes).",
    averagePropertyPrice: 1100000,
    affordableInterstateBuying: ["QLD", "SA", "WA", "TAS"],
  },
  VIC: {
    name: "Victoria",
    fhgCapCity: 800000,
    fhgCapRegional: 650000,
    stampDutyExemptionCap: 600000,
    stampDutyConcessionCap: 750000,
    stampDutyNote: "Full exemption on properties up to $600k, sliding concession up to $750k for first home buyers.",
    averagePropertyPrice: 900000,
    affordableInterstateBuying: ["QLD", "SA", "WA", "TAS"],
  },
  QLD: {
    name: "Queensland",
    fhgCapCity: 700000,
    fhgCapRegional: 550000,
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
    stampDutyExemptionCap: null,
    stampDutyConcessionCap: null,
    stampDutyNote: "No general stamp duty concession for first home buyers — stamp duty applies at standard rates.",
    averagePropertyPrice: 680000,
    affordableInterstateBuying: ["WA", "TAS", "NT"],
  },
  WA: {
    name: "Western Australia",
    fhgCapCity: 450000,
    fhgCapRegional: 400000,
    stampDutyExemptionCap: 430000,
    stampDutyConcessionCap: 530000,
    stampDutyNote: "Full stamp duty exemption on properties up to $430k, concession up to $530k.",
    averagePropertyPrice: 650000,
    affordableInterstateBuying: ["SA", "TAS", "NT"],
  },
  TAS: {
    name: "Tasmania",
    fhgCapCity: 600000,
    fhgCapRegional: 450000,
    stampDutyExemptionCap: 400000,
    stampDutyConcessionCap: null,
    stampDutyNote: "50% stamp duty concession on established homes up to $400k for first home buyers.",
    averagePropertyPrice: 530000,
    affordableInterstateBuying: [],
  },
  ACT: {
    name: "Australian Capital Territory",
    fhgCapCity: 750000,
    fhgCapRegional: 750000,
    stampDutyExemptionCap: null,
    stampDutyConcessionCap: null,
    stampDutyNote: "Stamp duty (conveyance duty) concessions/exemptions available based on income thresholds under the Home Buyer Concession Scheme (HBCS).",
    averagePropertyPrice: 820000,
    affordableInterstateBuying: ["QLD", "SA", "WA", "TAS"],
  },
  NT: {
    name: "Northern Territory",
    fhgCapCity: 600000,
    fhgCapRegional: 600000,
    stampDutyExemptionCap: null,
    stampDutyConcessionCap: null,
    stampDutyNote: "First home buyers receive a $18,601 stamp duty discount (Territory Home Owner Discount).",
    averagePropertyPrice: 500000,
    affordableInterstateBuying: [],
  },
};

// First Home Guarantee requires minimum 5% deposit
// No income caps apply (removed 1 July 2024)
export const MIN_DEPOSIT_FHG = 0.05;
export const MIN_DEPOSIT_STANDARD = 0.2; // 20% avoids LMI entirely

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}
