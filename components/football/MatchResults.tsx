import { matches } from "@/lib/footballData";

export default function MatchResults() {
  const sorted = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function result(m: (typeof matches)[0]) {
    if (m.ourScore > m.theirScore) return "W";
    if (m.ourScore === m.theirScore) return "D";
    return "L";
  }

  function resultStyle(r: string) {
    if (r === "W") return "bg-green-100 text-green-800 border-green-300";
    if (r === "D") return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-red-100 text-red-700 border-red-300";
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <section className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="bg-green-800 px-5 py-3 flex items-center gap-2">
        <span className="text-lg">📋</span>
        <h2 className="text-sm font-bold uppercase tracking-widest text-green-100">
          Match Results
        </h2>
      </div>
      <ul className="divide-y divide-green-50">
        {sorted.map((m) => {
          const r = result(m);
          return (
            <li key={m.id} className="flex items-center gap-3 px-5 py-3">
              {/* Result badge */}
              <span
                className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 ${resultStyle(r)}`}
              >
                {r}
              </span>

              {/* Opponent + date */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{m.opponent}</p>
                <p className="text-xs text-slate-400">
                  {formatDate(m.date)} · {m.isHome ? "Home" : "Away"}
                </p>
              </div>

              {/* Score */}
              <span className="text-base font-bold text-slate-700 tabular-nums">
                {m.ourScore}–{m.theirScore}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
