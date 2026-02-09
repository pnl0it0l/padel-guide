"use client";

export default function PremierPadelLive() {
  return (
    <section className="px-4 sm:px-6 py-10 md:py-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
              <svg
                className="w-8 h-8 text-red-400 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400">
                Premier Padel
              </h2>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Circuito Profissional Mundial
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="glass rounded-2xl border border-gray-700/50 overflow-hidden">
          {/* Live Banner */}
          <div className="bg-gradient-to-r from-red-600/20 via-pink-600/20 to-purple-600/20 border-b border-gray-700/50 p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm md:text-base font-bold text-red-400">
                    AO VIVO
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  Resultados em tempo real
                </span>
              </div>
              <a
                href="https://www.premierpadel.com/en/tournaments-live"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Ver Jogos Ao Vivo
              </a>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="p-4 md:p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Acesso Rápido
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Live Matches */}
              <a
                href="https://www.premierpadel.com/en/tournaments-live"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-red-500/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                      Jogos Ao Vivo
                    </p>
                    <p className="text-xs text-gray-400">Live scores</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>

              {/* Calendar */}
              <a
                href="https://www.premierpadel.com/en/tournaments-upcoming"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Calendário
                    </p>
                    <p className="text-xs text-gray-400">Próximos torneios</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>

              {/* Rankings */}
              <a
                href="https://www.padelfip.com/ranking-male/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                      Rankings FIP
                    </p>
                    <p className="text-xs text-gray-400">Top jogadores</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700/50 p-4 md:p-6 bg-gray-900/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                Acompanha os melhores jogadores do mundo no circuito oficial
              </p>
              <a
                href="https://www.premierpadel.com/en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Visitar Premier Padel
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
