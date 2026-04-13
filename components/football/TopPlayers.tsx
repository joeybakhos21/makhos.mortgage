import { players } from "@/lib/footballData";

interface TopPlayersProps {
  type: "goals" | "assists";
}

export default function TopPlayers({ type }: TopPlayersProps) {
  const label = type === "goals" ? "Goals" : "Assists";
  const icon  = type === "goals" ? "⚽" : "🎯";

  const sorted = [...players]
    .filter((p) => (type === "goals" ? p.goals : p.assists) > 0)
    .sort((a, b) =>
      type === "goals" ? b.goals - a.goals : b.assists - a.assists
    )
    .slice(0, 5);

  const medalColors = [
    "bg-yellow-100 text-yellow-700 border-yellow-300",
    "bg-slate-100 text-slate-600 border-slate-300",
    "bg-orange-100 text-orange-700 border-orange-300",
    "bg-green-50 text-green-700 border-green-200",
    "bg-green-50 text-green-700 border-green-200",
  ];

  return (
    <section className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="bg-green-800 px-5 py-3 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-bold uppercase tracking-widest text-green-100">
          Top {label}
        </h2>
      </div>
      <ul className="divide-y divide-green-50">
        {sorted.map((player, i) => {
          const stat = type === "goals" ? player.goals : player.assists;
          return (
            <li key={player.id} className="flex items-center gap-3 px-5 py-3">
              <span
                className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 ${medalColors[i]}`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{player.name}</p>
                <p className="text-xs text-slate-400">
                  #{player.number} · {player.position}
                </p>
              </div>
              <span className="text-lg font-bold text-green-800">{stat}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
