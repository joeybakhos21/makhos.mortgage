import { QuestionId, AnswerValue, RecommendationResult, EligibleScheme, State, StateData } from "@/types/quiz";
import { STATE_DATA, formatCurrency } from "./stateData";

export function generateRecommendation(
  answers: Partial<Record<QuestionId, AnswerValue>>
): RecommendationResult {
  const state = answers.state as State;
  const stateData = STATE_DATA[state];
  const isFirstHome = answers.firstHomeBuyer === "yes";
  const isCitizen = answers.citizenship === "citizen" || answers.citizenship === "pr";
  const deposit = Number(answers.deposit) || 0;
  const budget = Number(answers.propertyBudget) || 0;
  const hasGuarantor = answers.hasGuarantor === "yes";
  const guarantorStrong =
    answers.guarantorEquity === "outright" || answers.guarantorEquity === "equity";
  const guarantorFormalised = answers.guarantorFormalised === "yes";
  const locationFlexible = answers.locationFlexible === "yes";
  const rentOk = answers.rentWhileBuying === "yes" || answers.rentWhileBuying === "maybe";
  const employment = answers.employmentStatus as string;

  const schemes: EligibleScheme[] = [];
  const details: string[] = [];

  // ── First Home Guarantee (5% deposit, no LMI) ──────────────────────────────
  // No income caps since 1 July 2024. Eligibility: first home buyer, citizen/PR,
  // purchase price within state cap, and at least 5% deposit saved.
  const fhgCap = stateData.fhgCapCity;
  const fhgCapRegional = stateData.fhgCapRegional;
  const has5PctDeposit = budget > 0 && deposit >= budget * 0.05;
  const fhgEligible = isFirstHome && isCitizen && budget <= fhgCap && has5PctDeposit;
  const fhgEligibleRegional = isFirstHome && isCitizen && budget <= fhgCapRegional && has5PctDeposit;

  if (fhgEligible) {
    schemes.push({
      name: "First Home Guarantee (5% Deposit Scheme)",
      description:
        `Buy with just a 5% deposit — the federal government guarantees the remaining 15%, meaning you pay zero Lenders Mortgage Insurance (LMI). ` +
        `Available on properties up to ${formatCurrency(fhgCap)} in ${stateData.name} (or ${formatCurrency(fhgCapRegional)} in regional areas). ` +
        `No income test applies. You must move in as your principal place of residence.`,
      amount: `LMI waived — saves $10,000–$35,000+ depending on your loan`,
    });
    details.push(
      `✅ You appear eligible for the First Home Guarantee — your target price of ${formatCurrency(budget)} is within the ${stateData.name} cap of ${formatCurrency(fhgCap)}.`
    );
    details.push(
      `✅ With ${formatCurrency(deposit)} saved you meet the minimum 5% deposit threshold of ${formatCurrency(Math.ceil(budget * 0.05))} for this purchase price.`
    );
  } else if (isFirstHome && isCitizen && budget > fhgCap) {
    details.push(
      `⚠️ Your target price of ${formatCurrency(budget)} exceeds the First Home Guarantee cap of ${formatCurrency(fhgCap)} in ${stateData.name}. ` +
        `Consider whether a lower purchase price would bring you within the cap, or explore a guarantor to avoid LMI on a higher-priced purchase.`
    );
    if (budget <= fhgCapRegional) {
      details.push(`ℹ️ If buying in a regional area of ${stateData.name}, the cap is ${formatCurrency(fhgCapRegional)} — your budget may qualify.`);
    }
  } else if (isFirstHome && isCitizen && !has5PctDeposit && budget > 0) {
    const required = Math.ceil(budget * 0.05);
    details.push(
      `⚠️ You need at least ${formatCurrency(required)} (5% of ${formatCurrency(budget)}) to access the First Home Guarantee. ` +
        `You currently have ${formatCurrency(deposit)} — a gap of ${formatCurrency(required - deposit)}.`
    );
  } else if (!isFirstHome) {
    details.push(`ℹ️ The First Home Guarantee is only available to first home buyers who have never owned residential property in Australia.`);
  } else if (!isCitizen) {
    details.push(`ℹ️ The First Home Guarantee requires Australian citizenship or permanent residency.`);
  }

  // ── Stamp Duty ─────────────────────────────────────────────────────────────
  if (isFirstHome && stateData.stampDutyExemptionCap && budget <= stateData.stampDutyExemptionCap) {
    schemes.push({
      name: "Stamp Duty Exemption",
      description: stateData.stampDutyNote,
      amount: "Full exemption",
    });
    details.push(`✅ Your budget may qualify for a full stamp duty exemption in ${stateData.name}.`);
  } else if (isFirstHome && stateData.stampDutyConcessionCap && budget <= stateData.stampDutyConcessionCap) {
    schemes.push({
      name: "Stamp Duty Concession",
      description: stateData.stampDutyNote,
    });
    details.push(`✅ Your budget may qualify for a stamp duty concession in ${stateData.name}.`);
  } else {
    details.push(`ℹ️ Stamp duty note for ${stateData.name}: ${stateData.stampDutyNote}`);
  }

  // ── Guarantor ──────────────────────────────────────────────────────────────
  const effectiveGuarantor = hasGuarantor && guarantorStrong;
  if (effectiveGuarantor) {
    schemes.push({
      name: "Family Guarantee",
      description: guarantorFormalised
        ? "Your guarantor has sought independent advice — you're ready to proceed. A family guarantee can let you borrow with minimal deposit and avoid LMI."
        : "A guarantor can help you buy with minimal deposit and avoid LMI. Your guarantor will still need independent legal and financial advice before signing.",
      amount: "Potential to buy with 0–5% deposit",
    });
    details.push(`✅ Strong guarantor available — this can significantly reduce your required deposit.`);
  }

  // ── Deposit analysis ───────────────────────────────────────────────────────
  const depositPct = budget > 0 ? deposit / budget : 0;
  const depositGap = budget > 0 ? Math.max(0, budget * 0.2 - deposit) : 0;

  if (depositPct < 0.05 && !effectiveGuarantor && !fhgEligible) {
    details.push(`⚠️ Your deposit of ${formatCurrency(deposit)} is less than 5% of your target price. You may need to save more or explore guarantor options.`);
  } else if (depositPct >= 0.05 && depositPct < 0.2) {
    if (!fhgEligible && !effectiveGuarantor) {
      details.push(`⚠️ With ${Math.round(depositPct * 100)}% deposit you will likely need to pay Lenders Mortgage Insurance unless you qualify for the First Home Guarantee or have a guarantor.`);
    }
  } else if (depositPct >= 0.2) {
    details.push(`✅ Your ${Math.round(depositPct * 100)}% deposit means you can likely avoid Lenders Mortgage Insurance entirely.`);
  }

  // ── Employment note ────────────────────────────────────────────────────────
  if (employment === "selfemployed" || employment === "contractor") {
    details.push(`ℹ️ As a ${employment === "selfemployed" ? "self-employed" : "contractor"} borrower, most lenders require 2 years of tax returns. Some specialist lenders offer 1-year ABN or alt-doc products — speak to a broker.`);
  }

  // ── DECISION LOGIC ─────────────────────────────────────────────────────────
  // Can they buy owner-occupied in their state?
  const canBuyOwnerOccupied =
    (fhgEligible || effectiveGuarantor || depositPct >= 0.05) && budget <= stateData.fhgCapCity * 1.5;

  // Is interstate investing relevant?
  const interstateMakesSense =
    locationFlexible && rentOk && (stateData.affordableInterstateBuying?.length ?? 0) > 0;

  // Is local investment relevant? (if budget over FHG cap but can still buy something cheaper as investment)
  const localInvestmentMakesSense =
    !isFirstHome || // Not first home — investment is always valid
    (isFirstHome && budget > stateData.fhgCapCity); // Budget over FHG cap, consider lower-priced investment

  let primary: "owner_occupied" | "investment_local" | "investment_interstate";
  const secondaries: ("owner_occupied" | "investment_local" | "investment_interstate")[] = [];

  if (canBuyOwnerOccupied && (!interstateMakesSense || depositPct >= 0.1)) {
    primary = "owner_occupied";
    if (interstateMakesSense) secondaries.push("investment_interstate");
    if (localInvestmentMakesSense && budget > stateData.fhgCapCity) secondaries.push("investment_local");
  } else if (interstateMakesSense) {
    primary = "investment_interstate";
    if (canBuyOwnerOccupied) secondaries.push("owner_occupied");
    if (localInvestmentMakesSense) secondaries.push("investment_local");
  } else if (localInvestmentMakesSense) {
    primary = "investment_local";
    if (canBuyOwnerOccupied) secondaries.push("owner_occupied");
  } else {
    primary = "owner_occupied";
  }

  // Build summary
  let summary = buildSummary(primary, {
    state,
    stateData,
    budget,
    deposit,
    fhgEligible,
    effectiveGuarantor,
    isFirstHome,
    interstateMakesSense,
  });

  return {
    primary,
    secondaries,
    eligibleSchemes: schemes,
    summary,
    details,
    depositGap: depositGap > 0 ? depositGap : undefined,
  };
}

function buildSummary(
  primary: string,
  ctx: {
    state: State;
    stateData: StateData;
    budget: number;
    deposit: number;
    fhgEligible: boolean;
    effectiveGuarantor: boolean;
    isFirstHome: boolean;
    interstateMakesSense: boolean;
  }
): string {
  const { stateData, budget, deposit, fhgEligible, effectiveGuarantor, isFirstHome } = ctx;

  if (primary === "owner_occupied") {
    const how = fhgEligible
      ? "using the First Home Guarantee (5% deposit, no LMI)"
      : effectiveGuarantor
      ? "with the support of your family guarantor"
      : deposit >= budget * 0.2
      ? "with your 20%+ deposit — no LMI required"
      : "with your current savings";
    return `Based on your situation, buying an owner-occupied property in ${stateData.name} looks like your best first move. You could enter the market ${how}. This gets you into your own home while taking advantage of any first home buyer benefits available in your state.`;
  }

  if (primary === "investment_interstate") {
    const states = (stateData.affordableInterstateBuying ?? []).join(", ");
    return `A rentvesting strategy looks like a strong option for you. By purchasing an investment property in a more affordable state (consider ${states}), you can get into the property market sooner while continuing to rent where you prefer to live. This builds equity and can set you up to buy your own home later.`;
  }

  if (primary === "investment_local") {
    return `Buying an investment property in ${stateData.name} could be a smart stepping stone. If the areas you want to live in are outside your current budget, buying a more affordable investment property gets you into the market now, building equity while you save for your ideal home.`;
  }

  return "Based on your answers, speak to a mortgage broker to explore your options in detail.";
}
