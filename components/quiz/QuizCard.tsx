"use client";

import { useState, useEffect } from "react";
import { Question } from "@/lib/questions";
import { AnswerValue, QuestionId } from "@/types/quiz";
import SingleChoice from "./SingleChoice";
import CurrencyInput from "./CurrencyInput";

interface Props {
  question: Question;
  existingAnswer?: AnswerValue;
  onAnswer: (questionId: QuestionId, value: AnswerValue) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export default function QuizCard({ question, existingAnswer, onAnswer, onBack, canGoBack }: Props) {
  const [localValue, setLocalValue] = useState<AnswerValue | undefined>(existingAnswer);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setLocalValue(existingAnswer);
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 50);
    return () => clearTimeout(t);
  }, [question.id, existingAnswer]);

  function handleSingleSelect(value: string) {
    setLocalValue(value);
    // Auto-advance on single choice
    setTimeout(() => {
      onAnswer(question.id, value);
    }, 300);
  }

  function handleContinue() {
    if (localValue !== undefined) {
      onAnswer(question.id, localValue);
    }
  }

  const defaultCurrencyValue = question.type === "currency"
    ? typeof existingAnswer === "number"
      ? existingAnswer
      : Math.round(((question.min! + question.max!) / 2) / question.step!) * question.step!
    : 0;

  return (
    <div
      className={`transition-all duration-400 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
    >
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="mt-2 text-sm md:text-base text-slate-500 leading-relaxed">
            {question.subtitle}
          </p>
        )}
      </div>

      {question.type === "single" && question.options && (
        <SingleChoice
          options={question.options}
          selected={typeof localValue === "string" ? localValue : undefined}
          onSelect={handleSingleSelect}
        />
      )}

      {question.type === "currency" && (
        <div className="mt-4">
          <CurrencyInput
            value={typeof localValue === "number" ? localValue : defaultCurrencyValue}
            min={question.min!}
            max={question.max!}
            step={question.step!}
            onChange={(v) => setLocalValue(v)}
          />
          <button
            onClick={handleContinue}
            disabled={localValue === undefined}
            className="mt-8 w-full py-3.5 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base shadow-sm"
          >
            Continue →
          </button>
        </div>
      )}

      {canGoBack && (
        <button
          onClick={onBack}
          className="mt-4 w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
