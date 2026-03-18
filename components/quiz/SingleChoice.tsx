"use client";

import { Option } from "@/lib/questions";

interface Props {
  options: Option[];
  selected?: string;
  onSelect: (value: string) => void;
}

export default function SingleChoice({ options, selected, onSelect }: Props) {
  return (
    <div className="grid gap-3">
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`
              flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200
              ${isSelected
                ? "border-indigo-600 bg-indigo-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
              }
            `}
          >
            {opt.icon && (
              <span className="text-2xl leading-none mt-0.5 shrink-0">{opt.icon}</span>
            )}
            <div>
              <p className={`font-medium ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
                {opt.label}
              </p>
              {opt.description && (
                <p className="text-sm text-slate-500 mt-0.5">{opt.description}</p>
              )}
            </div>
            <div className={`
              ml-auto shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
              ${isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}
            `}>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
