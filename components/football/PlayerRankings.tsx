import { computeRankings } from "@/lib/footballData";

export default function PlayerRankings() {
  const rankings = computeRankings();

  const podiumColors = [
    "text-yellow-500",
    "text-slate-400",
    "text-orange-500",
  ];

  const podiumIcons = ["🥇", "🥈", "🥉"];

  return (
    <section className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="bg-green-800 px-5 py-3 flex items-center gap-2">
        <span className="text-lg">🏆</span>
        <h2 className="text-sm font-bold uppercase tracking-widest text-green-100">
          Player of the Season Standings
        </h2>
      </div>

      {/* Voting legend */}
      <div className="flex gap-3 px-5 pt-3 pb-1">
        {[
          { pts: 3, label: "Best" },
          { pts: 2, label: "2nd" },
          { pts: 1, label: "3rd" },
        ].map(({ pts, label }) => (
          <span
            key={pts}
            className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5 font-medium"
          >
            {label} = {pts} pts
          </span>
        ))}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-3 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-green-50">
        <span>#</span>
        <span>Player</span>
        <span className="text-center">3pt</span>
        <span className="text-center">2pt</span>
        <span className="text-center">1pt</span>
        <span className="text-right">Total</span>
      </div>

      <ul className="divide-y divide-green-50">
        {rankings.map((entry, i) => (
          <li
            key={entry.player.id}
            className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-3 items-center px-5 py-3 ${
              i === 0 ? "bg-yellow-50/60" : ""
            }`}
          >
            {/* Rank */}
            <span className={`text-base w-6 text-center ${i < 3 ? podiumColors[i] : "text-slate-400 text-sm"}`}>
              {i < 3 ? podiumIcons[i] : i + 1}
            </span>

            {/* Name */}
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate text-sm">
                {entry.player.name}
              </p>
              <p className="text-xs text-slate-400">
                #{entry.player.number} · {entry.player.position}
              </p>
            </div>

            {/* Vote breakdown */}
            <span className="text-center text-sm font-medium text-slate-600 w-6">
              {entry.threePointVotes}
            </span>
            <span className="text-center text-sm font-medium text-slate-600 w-6">
              {entry.twoPointVotes}
            </span>
            <span className="text-center text-sm font-medium text-slate-600 w-6">
              {entry.onePointVotes}
            </span>

            {/* Total */}
            <span className="text-right text-base font-bold text-green-800 min-w-[2rem]">
              {entry.points}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
