import { QuestionId, AnswerValue, RecommendationResult, EligibleScheme, State, StateData } from "@/types/quiz";
import { STATE_DATA, INCOME_CAPS, formatCurrency } from "./stateData";

export function generateRecommendation(
  answers: Partial<Record<QuestionId, AnswerValue>>
): RecommendationResult {
  const state = answers.state as State;
  const stateData = STATE_DATA[state];
  const isFirstHome = answers.firstHomeBuyer === "yes";
  const isCitizen = answers.citizenship === "citizen" || answers.citizenship === "pr";
  const buyingWith = answers.buyingWith as string;
  const income = Number(answers.income) || 0;
  const deposit = Number(answers.deposit) || 0;
  const budget = Number(answers.propertyBudget) || 0;
  const hasGuarantor = answers.hasGuarantor === "yes";
  const guarantorStrong =
    answers.guarantorEquity === "outright" || answers.guarantorEquity === "equity";
  const guarantorFormalised = answers.guarantorFormalised === "yes";
  const locationFlexible = answers.locationFlexible === "yes";
  const rentOk = answers.rentWhileBuying === "yes" || answers.rentWhileBuying === "maybe";
  const employment = answers.employmentStatus as string;

  const isJoint = buyingWith === "partner";
  const incomeCap = isJoint ? INCOME_CAPS.joint : INCOME_CAPS.single;
  const incomeEligible = income <= incomeCap;

  const schemes: EligibleScheme[] = [];
  const details: string[] = [];

  // ── First Home Guarantee (5% deposit, no LMI) ──────────────────────────────
  const fhgCap = stateData.fhgCapCity;
  const fhgEligible =
    isFirstHome && isCitizen && incomeEligible && budget <= fhgCap && deposit >= budget * 0.05;

  if (fhgEligible) {
    schemes.push({
      name: "First Home Guarantee",
      description: `Buy with just 5% deposit — the government guarantees 15% so you avoid Lenders Mortgage Insurance. Property must be under ${formatCurrency(fhgCap)} in ${stateData.name}.`,
      amount: "No LMI saving (typically $10,000–$30,000+)",
    });
    details.push(`✅ Eligible for First Home Guarantee — purchase up to ${formatCurrency(fhgCap)}`);
  } else if (isFirstHome && isCitizen && !incomeEligible) {
    details.push(`⚠️ Your income (${formatCurrency(income)}) exceeds the First Home Guarantee cap of ${formatCurrency(incomeCap)} for ${isJoint ? "joint" : "single"} applicants.`);
  } else if (isFirstHome && isCitizen && budget > fhgCap) {
    details.push(`⚠️ Your target price (${formatCurrency(budget)}) exceeds the ${stateData.name} First Home Guarantee cap of ${formatCurrency(fhgCap)}.`);
  }

  // ── First Home Owner Grant ─────────────────────────────────────────────────
  if (isFirstHome && isCitizen && stateData.fhogAmount) {
    schemes.push({
      name: `First Home Owner Grant – ${stateData.name}`,
      description: stateData.fhogCondition ?? `Cash grant for first home buyers.`,
      amount: formatCurrency(stateData.fhogAmount),
    });
    details.push(`✅ Potentially eligible for the ${formatCurrency(stateData.fhogAmount)} First Home Owner Grant (new builds only).`);
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
