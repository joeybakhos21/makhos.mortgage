"use client";

// MAX_STEPS is a soft ceiling — bar fills toward it but never claims 100% mid-quiz
const MAX_STEPS = 11;

interface Props {
  stepsCompleted: number;
}

export default function ProgressBar({ stepsCompleted }: Props) {
  const pct = Math.min(Math.round((stepsCompleted / MAX_STEPS) * 100), 90);
  return (
    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
