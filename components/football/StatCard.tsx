interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  accent: string; // tailwind bg class for icon bubble
}

export default function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-700">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight truncate">{value}</p>
        {sub && <p className="text-sm text-slate-500 truncate">{sub}</p>}
      </div>
    </div>
  );
}
