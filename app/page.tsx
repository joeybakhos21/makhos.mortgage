import Quiz from "@/components/quiz/Quiz";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Makhos Mortgage</p>
            <p className="text-sm font-medium text-slate-700">First Home Buyer Guide</p>
          </div>
          <div className="text-2xl">🏠</div>
        </div>
      </header>

      {/* Intro hero */}
      <section className="max-w-lg mx-auto px-4 pt-8 pb-2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          What should you buy first?
        </h1>
        <p className="mt-2 text-slate-500 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
          Answer a few questions about your deposit, income, and goals — we&apos;ll show you what&apos;s possible and which government schemes you may qualify for.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
          {["5% Deposit Scheme", "FHOG Grants", "Guarantor Options", "State-specific Caps", "Rentvesting"].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Quiz card */}
      <div className="max-w-lg mx-auto mt-6 mx-4 bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/70">
        <Quiz />
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-400 px-4">
        <p>© {new Date().getFullYear()} Makhos Mortgage. Australian Credit Licence holder.</p>
        <p className="mt-1">This tool is a guide only. Always seek independent financial advice.</p>
      </footer>
    </main>
  );
}
