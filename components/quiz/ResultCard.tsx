"use client";

import { RecommendationResult, QuestionId, AnswerValue } from "@/types/quiz";
import { formatCurrency } from "@/lib/stateData";

const RECOMMENDATION_LABELS = {
  owner_occupied: "Buy owner-occupied",
  investment_local: "Buy investment (local)",
  investment_interstate: "Buy investment (interstate)",
};

function buildCalendlyUrl(
  answers: Partial<Record<QuestionId, AnswerValue>>,
  recommendation: string
): string {
  const state = answers.state ?? "—";
  const fhb = answers.firstHomeBuyer === "yes" ? "Yes" : "No";
  const citizenship = answers.citizenship === "citizen" ? "Citizen" : answers.citizenship === "pr" ? "PR" : "Visa";
  const buying = answers.buyingWith === "sole" ? "Solo" : answers.buyingWith === "partner" ? "With partner" : "With friend/family";
  const income = answers.income ? formatCurrency(Number(answers.income)) : "—";
  const employment = answers.employmentStatus ?? "—";
  const deposit = answers.deposit ? formatCurrency(Number(answers.deposit)) : "—";
  const budget = answers.propertyBudget ? formatCurrency(Number(answers.propertyBudget)) : "—";
  const guarantor = answers.hasGuarantor === "yes" ? "Yes" : answers.hasGuarantor === "maybe" ? "Possible" : "No";
  const location = answers.locationFlexible === "yes" ? "Open to interstate" : answers.locationFlexible === "regional" ? "Open to regional" : "Local only";
  const rec = RECOMMENDATION_LABELS[recommendation as keyof typeof RECOMMENDATION_LABELS] ?? recommendation;

  const summary = [
    `State: ${state}`,
    `FHB: ${fhb}`,
    `Residency: ${citizenship}`,
    `Buying: ${buying}`,
    `Income: ${income}`,
    `Employment: ${employment}`,
    `Deposit: ${deposit}`,
    `Budget: ${budget}`,
    `Guarantor: ${guarantor}`,
    `Location pref: ${location}`,
    `Quiz result: ${rec}`,
  ].join(" | ");

  const params = new URLSearchParams({ utm_content: summary });
  return `https://calendly.com/jbakhos/30min?${params.toString()}`;
}

const RECOMMENDATION_META = {
  owner_occupied: {
    title: "Buy an Owner-Occupied Property",
    icon: "🏡",
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    textColor: "text-emerald-800",
  },
  investment_local: {
    title: "Buy an Investment Property in Your State",
    icon: "📈",
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-800",
  },
  investment_interstate: {
    title: "Buy an Investment Property Interstate (Rentvesting)",
    icon: "🗺️",
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    textColor: "text-violet-800",
  },
};

interface Props {
  result: RecommendationResult;
  answers: Partial<Record<QuestionId, AnswerValue>>;
  onRestart: () => void;
}

export default function ResultCard({ result, answers, onRestart }: Props) {
  const primary = RECOMMENDATION_META[result.primary];
  const calendlyUrl = buildCalendlyUrl(answers, result.primary);

  return (
    <div className="space-y-6">
      {/* Hero recommendation */}
      <div className={`rounded-2xl bg-gradient-to-br ${primary.color} p-6 text-white shadow-lg`}>
        <div className="text-4xl mb-3">{primary.icon}</div>
        <p className="text-sm font-medium uppercase tracking-wider opacity-80 mb-1">
          Our Recommendation
        </p>
        <h2 className="text-2xl font-bold leading-tight">{primary.title}</h2>
        <p className="mt-3 text-sm leading-relaxed opacity-90">{result.summary}</p>
      </div>

      {/* Deposit gap callout */}
      {result.depositGap && result.depositGap > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <span className="text-xl">💰</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Deposit gap to 20%</p>
            <p className="text-amber-700 text-sm mt-0.5">
              You&apos;re approximately {formatCurrency(result.depositGap)} away from a 20% deposit (avoiding LMI without a scheme or guarantor).
            </p>
          </div>
        </div>
      )}

      {/* Eligible schemes */}
      {result.eligibleSchemes.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-3">
            Government Schemes & Benefits Available to You
          </h3>
          <div className="space-y-3">
            {result.eligibleSchemes.map((scheme, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-800 text-sm">{scheme.name}</p>
                  {scheme.amount && (
                    <span className="shrink-0 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {scheme.amount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{scheme.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail breakdown */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Your Situation at a Glance</h3>
        <div className="space-y-2">
          {result.details.map((d, i) => (
            <div key={i} className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-3">
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Alternative paths */}
      {result.secondaries.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-3">Also Worth Considering</h3>
          <div className="grid gap-3">
            {result.secondaries.map((rec) => {
              const meta = RECOMMENDATION_META[rec];
              return (
                <div key={rec} className={`${meta.bgLight} ${meta.border} border rounded-xl p-4`}>
                  <p className="text-lg">{meta.icon}</p>
                  <p className={`font-semibold text-sm mt-1 ${meta.textColor}`}>{meta.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>General Advice Disclaimer:</strong> This quiz is a guide only and does not constitute financial, legal, or mortgage advice. Eligibility for government schemes depends on your individual circumstances. Property price caps, grant amounts, and stamp duty rules change frequently — always verify current figures with the relevant state revenue office or your broker. Speak to a licensed mortgage broker before making any decisions.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-center">
        <p className="font-bold text-lg">Ready to take the next step?</p>
        <p className="text-sm opacity-85 mt-1 mb-4">
          Book a free strategy session and we&apos;ll walk through your exact numbers together.
        </p>
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm shadow"
        >
          Book a Free Consultation
        </a>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-3 text-sm text-slate-500 hover:text-slate-700 transition-colors border border-slate-200 rounded-xl"
      >
        ↺ Start Over
      </button>
    </div>
  );
}
