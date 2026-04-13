import type { Metadata } from "next";
import { getRecord, getTopScorer, getTopAssist } from "@/lib/footballData";
import TopPlayers from "@/components/football/TopPlayers";
import MatchResults from "@/components/football/MatchResults";
import PlayerRankings from "@/components/football/PlayerRankings";

export const metadata: Metadata = {
  title: "Team Dashboard",
  description: "Football team stats — goals, assists, results, and player of the season standings.",
};

export default function FootballDashboard() {
  const record    = getRecord();
  const topScorer = getTopScorer();
  const topAssist = getTopAssist();

  function resultBar() {
    const total = record.played;
    const wPct  = (record.wins   / total) * 100;
    const dPct  = (record.draws  / total) * 100;
    const lPct  = (record.losses / total) * 100;
    return { wPct, dPct, lPct };
  }

  const { wPct, dPct, lPct } = resultBar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800">
      {/* ── Header ── */}
      <header className="bg-green-950/80 backdrop-blur-sm border-b border-green-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-400">
              Season 2025
            </p>
            <h1 className="text-lg font-bold text-white leading-tight">
              Team Dashboard
            </h1>
          </div>
          <span className="text-3xl">⚽</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── Season summary strip ── */}
        <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-300 mb-3">
            Season Summary
          </p>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Played", value: record.played },
              { label: "Wins",   value: record.wins,   color: "text-green-400" },
              { label: "Draws",  value: record.draws,  color: "text-yellow-400" },
              { label: "Losses", value: record.losses, color: "text-red-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={`text-2xl font-bold ${color ?? "text-white"}`}>{value}</p>
                <p className="text-xs text-green-300">{label}</p>
              </div>
            ))}
          </div>

          {/* W / D / L bar */}
          <div className="h-2.5 rounded-full overflow-hidden flex gap-px bg-green-900">
            <div className="bg-green-400 rounded-l-full transition-all" style={{ width: `${wPct}%` }} />
            <div className="bg-yellow-400 transition-all"               style={{ width: `${dPct}%` }} />
            <div className="bg-red-400 rounded-r-full transition-all"   style={{ width: `${lPct}%` }} />
          </div>

          <div className="mt-3 flex gap-4 text-xs text-green-300">
            <span>Goals For: <strong className="text-white">{record.gf}</strong></span>
            <span>Goals Against: <strong className="text-white">{record.ga}</strong></span>
            <span>Goal Diff: <strong className={record.gf - record.ga >= 0 ? "text-green-400" : "text-red-400"}>
              {record.gf - record.ga >= 0 ? "+" : ""}{record.gf - record.ga}
            </strong></span>
          </div>
        </section>

        {/* ── Hero stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl shrink-0">
              ⚽
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
                Top Goalscorer
              </p>
              <p className="text-xl font-bold text-slate-900 truncate">{topScorer.name}</p>
              <p className="text-sm text-slate-500">
                {topScorer.goals} goal{topScorer.goals !== 1 ? "s" : ""} · #{topScorer.number} {topScorer.position}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-2xl shrink-0">
              🎯
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
                Top Assists
              </p>
              <p className="text-xl font-bold text-slate-900 truncate">{topAssist.name}</p>
              <p className="text-sm text-slate-500">
                {topAssist.assists} assist{topAssist.assists !== 1 ? "s" : ""} · #{topAssist.number} {topAssist.position}
              </p>
            </div>
          </div>
        </div>

        {/* ── Main content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <TopPlayers type="goals" />
            <TopPlayers type="assists" />
          </div>

          {/* Right column */}
          <div>
            <MatchResults />
          </div>
        </div>

        {/* ── Full-width rankings ── */}
        <PlayerRankings />
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-xs text-green-500 px-4">
        <p>© {new Date().getFullYear()} Team Dashboard · Updated after each match</p>
      </footer>
    </div>
  );
}
