"use client";

import { useState, useEffect } from "react";

interface Props {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label?: string;
}

function formatDisplayValue(val: number): string {
  return new Intl.NumberFormat("en-AU").format(val);
}

export default function CurrencyInput({ value, min, max, step, onChange, label }: Props) {
  const [inputStr, setInputStr] = useState(formatDisplayValue(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setInputStr(formatDisplayValue(value));
    }
  }, [value, focused]);

  const pct = ((value - min) / (max - min)) * 100;

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setInputStr(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  }

  function handleBlur() {
    setFocused(false);
    // Clamp to range
    const clamped = Math.min(max, Math.max(min, value));
    const snapped = Math.round(clamped / step) * step;
    onChange(snapped);
    setInputStr(formatDisplayValue(snapped));
  }

  return (
    <div className="space-y-5">
      {/* Large dollar display */}
      <div className="flex items-center gap-2 justify-center">
        <span className="text-3xl font-light text-slate-500">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={focused ? inputStr.replace(/,/g, "") : inputStr}
          onChange={handleTextChange}
          onFocus={() => { setFocused(true); setInputStr(String(value)); }}
          onBlur={handleBlur}
          className="text-4xl font-bold text-indigo-700 bg-transparent border-b-2 border-indigo-300 focus:border-indigo-600 outline-none text-center w-48 transition-colors"
        />
      </div>
      {label && <p className="text-center text-sm text-slate-500">{label}</p>}

      {/* Slider */}
      <div className="relative pt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-600"
          style={{
            background: `linear-gradient(to right, #4f46e5 ${pct}%, #e2e8f0 ${pct}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>${min >= 1000 ? `${min / 1000}k` : min}</span>
          <span>${max >= 1000000 ? `${max / 1000000}M` : `${max / 1000}k`}</span>
        </div>
      </div>

      {/* Quick-pick presets */}
      <div className="flex flex-wrap gap-2 justify-center">
        {getPresets(min, max).map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              value === preset
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
            }`}
          >
            {preset >= 1000000
              ? `$${preset / 1000000}M`
              : `$${preset >= 1000 ? `${preset / 1000}k` : preset}`}
          </button>
        ))}
      </div>
    </div>
  );
}

function getPresets(min: number, max: number): number[] {
  if (max <= 500000) {
    return [20000, 50000, 100000, 150000, 200000].filter((v) => v >= min && v <= max);
  }
  if (max <= 1000000) {
    return [50000, 100000, 150000, 200000, 300000].filter((v) => v >= min && v <= max);
  }
  return [300000, 500000, 700000, 900000, 1500000].filter((v) => v >= min && v <= max);
}
