"use client";

import { useEffect, useState } from "react";
import type {
  PremierPadelData,
  PremierPadelMatch,
} from "@/types/premier-padel";

export default function PremierPadelLive() {
  const [data, setData] = useState<PremierPadelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>("live");
  const [activeTab, setActiveTab] = useState<"live" | "results" | "upcoming">(
    "live",
  );
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );
  const [selectedCategory, setSelectedCategory] = useState<"MEN" | "WOMEN">(
    "MEN",
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Build query string
        const params = new URLSearchParams();
        if (selectedDate) {
          params.append("date", selectedDate);
        }
        params.append("category", selectedCategory);

        const response = await fetch(`/api/premier-padel?${params.toString()}`);
        const result = await response.json();
        setData(result);

        // Check if we're using fallback data
        const source = response.headers.get("X-Data-Source") || "live";
        setDataSource(source);
      } catch (error) {
        console.error("Error fetching Premier Padel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedDate, selectedCategory]);

  const renderMatch = (match: PremierPadelMatch, showStatus = true) => {
    const isLive = match.status === "LIVE";
    const isCompleted = match.status === "COMPLETED";

    return (
      <div
        key={match.id}
        className={`p-4 rounded-xl border transition-all duration-200 ${
          isLive
            ? "bg-red-900/20 border-red-500/50 shadow-lg shadow-red-500/10"
            : "bg-gray-800/30 border-gray-700/50"
        }`}
      >
        {/* Match Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`font-semibold ${
                match.category === "MEN" ? "text-blue-400" : "text-pink-400"
              }`}
            >
              {match.category}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{match.round}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{match.court}</span>
          </div>
          {showStatus && (
            <div className="flex items-center gap-1.5">
              {isLive && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-red-400">LIVE</span>
                </>
              )}
              {isCompleted && (
                <span className="text-xs font-semibold text-gray-500">
                  CONCLUÍDO
                </span>
              )}
              {match.status === "SCHEDULED" && match.startTime && (
                <span className="text-xs font-semibold text-gray-400">
                  {match.startTime}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Teams and Scores */}
        <div className="space-y-2">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {match.team1.flag1 && (
                <span className="text-sm">{match.team1.flag1}</span>
              )}
              {match.team1.flag2 && (
                <span className="text-sm">{match.team1.flag2}</span>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {match.team1.player1}
                  {match.team1.player2 && ` / ${match.team1.player2}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              {/* Current game score (live matches only) */}
              {match.currentGameScore && (
                <span className="text-sm font-bold w-8 text-center px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  {match.currentGameScore.team1}
                </span>
              )}
              {/* Set scores */}
              {match.score && (
                <>
                  {match.score.set1Team1 !== undefined && (
                    <span
                      className={`text-sm font-bold w-6 text-center ${
                        isCompleted &&
                        match.score.set1Team1 > (match.score.set1Team2 || 0)
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {match.score.set1Team1}
                    </span>
                  )}
                  {match.score.set2Team1 !== undefined && (
                    <span
                      className={`text-sm font-bold w-6 text-center ${
                        isCompleted &&
                        match.score.set2Team1 > (match.score.set2Team2 || 0)
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {match.score.set2Team1}
                    </span>
                  )}
                  {match.score.set3Team1 !== undefined && (
                    <span
                      className={`text-sm font-bold w-6 text-center ${
                        isCompleted &&
                        match.score.set3Team1 > (match.score.set3Team2 || 0)
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {match.score.set3Team1}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {match.team2.flag1 && (
                <span className="text-sm">{match.team2.flag1}</span>
              )}
              {match.team2.flag2 && (
                <span className="text-sm">{match.team2.flag2}</span>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {match.team2.player1}
                  {match.team2.player2 && ` / ${match.team2.player2}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              {/* Current game score (live matches only) */}
              {match.currentGameScore && (
                <span className="text-sm font-bold w-8 text-center px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  {match.currentGameScore.team2}
                </span>
              )}
              {/* Set scores */}
              {match.score && (
                <>
                  {match.score.set1Team2 !== undefined && (
                    <span
                      className={`text-sm font-bold w-6 text-center ${
                        isCompleted &&
                        match.score.set1Team2 > (match.score.set1Team1 || 0)
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {match.score.set1Team2}
                    </span>
                  )}
                  {match.score.set2Team2 !== undefined && (
                    <span
                      className={`text-sm font-bold w-6 text-center ${
                        isCompleted &&
                        match.score.set2Team2 > (match.score.set2Team1 || 0)
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {match.score.set2Team2}
                    </span>
                  )}
                  {match.score.set3Team2 !== undefined && (
                    <span
                      className={`text-sm font-bold w-6 text-center ${
                        isCompleted &&
                        match.score.set3Team2 > (match.score.set3Team1 || 0)
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {match.score.set3Team2}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          {/* Tournament Info Banner */}
          {data && (
            <div className="bg-gradient-to-r from-red-600/20 via-pink-600/20 to-purple-600/20 border-b border-gray-700/50 p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {data.tournament.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                    <span>{data.tournament.location}</span>
                    <span className="text-gray-500">•</span>
                    <span>{data.tournament.dates}</span>
                  </div>
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
          )}

          {/* Date and Category Selectors */}
          {data?.tournament.availableDates &&
            data.tournament.availableDates.length > 0 && (
              <div className="border-b border-gray-700/50 p-4 md:p-6 space-y-4">
                {/* Category Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 font-semibold mr-2">
                    Categoria:
                  </span>
                  <button
                    onClick={() => setSelectedCategory("MEN")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      selectedCategory === "MEN"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-gray-800/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    Masculino
                  </button>
                  <button
                    onClick={() => setSelectedCategory("WOMEN")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      selectedCategory === "WOMEN"
                        ? "bg-pink-600 text-white shadow-lg shadow-pink-500/20"
                        : "bg-gray-800/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    Feminino
                  </button>
                </div>

                {/* Date Selector */}
                <div>
                  <span className="text-sm text-gray-400 font-semibold mb-3 block">
                    Selecionar Data:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDate(undefined)}
                      className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                        !selectedDate
                          ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/20"
                          : "bg-gray-800/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      TODAS AS DATAS
                    </button>
                    {data.tournament.availableDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                          selectedDate === date
                            ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/20"
                            : "bg-gray-800/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Data Source Notice */}
          {dataSource === "fallback" && (
            <div className="bg-yellow-900/20 border-b border-yellow-700/30 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs text-yellow-400">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Exibindo dados de amostra. Para resultados em tempo real,
                  visite o site oficial do Premier Padel.
                </span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-700/50 px-4 md:px-6">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("live")}
                className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                  activeTab === "live"
                    ? "border-red-500 text-red-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activeTab === "live"
                        ? "bg-red-500 animate-pulse"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  AO VIVO
                  {data && data.liveMatches.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">
                      {data.liveMatches.length}
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                  activeTab === "results"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                RESULTADOS
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                  activeTab === "upcoming"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                PRÓXIMOS
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : data ? (
              <>
                {/* Live Matches */}
                {activeTab === "live" && (
                  <div>
                    {data.liveMatches.length > 0 ? (
                      <div className="space-y-3">
                        {data.liveMatches.map((match) => renderMatch(match))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg
                          className="w-12 h-12 text-gray-600 mx-auto mb-3"
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
                        <p className="text-gray-400">
                          Nenhum jogo ao vivo no momento
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Recent Results */}
                {activeTab === "results" && (
                  <div>
                    {data.recentResults.length > 0 ? (
                      <div className="space-y-3">
                        {data.recentResults.map((match) => renderMatch(match))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg
                          className="w-12 h-12 text-gray-600 mx-auto mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-gray-400">
                          Nenhum resultado disponível
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Upcoming Matches */}
                {activeTab === "upcoming" && (
                  <div>
                    {data.upcomingMatches.length > 0 ? (
                      <div className="space-y-3">
                        {data.upcomingMatches.map((match) =>
                          renderMatch(match),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg
                          className="w-12 h-12 text-gray-600 mx-auto mb-3"
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
                        <p className="text-gray-400">Nenhum jogo agendado</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Erro ao carregar dados</p>
              </div>
            )}
          </div>

          {/* Quick Links Footer */}
          <div className="border-t border-gray-700/50 p-4 md:p-6 bg-gray-900/30">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Links Rápidos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href="https://www.premierpadel.com/en/tournaments-upcoming"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-400"
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
                  <span className="text-sm text-white group-hover:text-blue-400 transition-colors">
                    Calendário
                  </span>
                </div>
              </a>
              <a
                href="https://www.padelfip.com/ranking-male/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
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
                  <span className="text-sm text-white group-hover:text-purple-400 transition-colors">
                    Rankings FIP
                  </span>
                </div>
              </a>
              <a
                href="https://www.premierpadel.com/en"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                  <span className="text-sm text-white group-hover:text-gray-300 transition-colors">
                    Site Oficial
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
