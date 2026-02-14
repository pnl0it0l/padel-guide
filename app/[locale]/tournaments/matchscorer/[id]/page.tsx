"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import type {
  MatchScorerTournamentDetail,
  MatchScorerMatch,
} from "@/types/premier-padel";

export default function TournamentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const type = searchParams.get("t") || "tol";

  const [tournament, setTournament] =
    useState<MatchScorerTournamentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"live" | "by-day" | "results">(
    "live",
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await fetch(
          `/api/matchscorer/tournaments/${id}?t=${type}`,
        );
        const data = await response.json();
        setTournament(data);

        // Set initial selected date to today or the first available date
        if (data.availableDates.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          const hasToday = data.availableDates.includes(today);
          setSelectedDate(hasToday ? today : data.availableDates[0]);
        }

        // If there are live matches, default to live tab
        if (data.liveMatches.length > 0) {
          setActiveTab("live");
        } else {
          setActiveTab("by-day");
        }
      } catch (error) {
        console.error("Error fetching tournament details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchTournamentDetails, 30000);
    return () => clearInterval(interval);
  }, [id, type]);

  const renderMatch = (match: MatchScorerMatch) => {
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
            <span className="text-gray-400">{match.round}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{match.court}</span>
            {match.startTime && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{match.startTime}</span>
              </>
            )}
          </div>
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
            {match.status === "SCHEDULED" && (
              <span className="text-xs font-semibold text-blue-400">
                AGENDADO
              </span>
            )}
          </div>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="px-4 sm:px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="px-4 sm:px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <p className="text-gray-400">Torneio não encontrado</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const matchesBySelectedDate = selectedDate
    ? tournament.matchesByDay[selectedDate] || []
    : [];
  const completedMatches = Object.values(tournament.matchesByDay)
    .flat()
    .filter((m) => m.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Tournament Header */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold ${
                        tournament.category === "MEN"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-pink-500/20 text-pink-400"
                      }`}
                    >
                      {tournament.category === "MEN" ? "MASCULINO" : "FEMININO"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold ${
                        tournament.status === "LIVE"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : tournament.status === "UPCOMING"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                    >
                      {tournament.status === "LIVE" && (
                        <span className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          AO VIVO
                        </span>
                      )}
                      {tournament.status === "UPCOMING" && "PRÓXIMO"}
                      {tournament.status === "COMPLETED" && "CONCLUÍDO"}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {tournament.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{tournament.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{tournament.dates}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://widget.matchscorerlive.com/dashboard/${tournament.id}?t=${type}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all duration-200"
                >
                  Ver Original
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

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-2 bg-gray-900/50 rounded-xl p-2 border border-gray-800/50">
              <button
                onClick={() => setActiveTab("live")}
                className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                  activeTab === "live"
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/20"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {tournament.liveMatches.length > 0 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  Ao Vivo ({tournament.liveMatches.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("by-day")}
                className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                  activeTab === "by-day"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Por Dia
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                  activeTab === "results"
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/20"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Resultados ({completedMatches.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            {activeTab === "live" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Jogos ao Vivo
                </h3>
                {tournament.liveMatches.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      Nenhum jogo ao vivo no momento
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {tournament.liveMatches.map(renderMatch)}
                  </div>
                )}
              </div>
            )}

            {activeTab === "by-day" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Jogos por Dia
                  </h3>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 bg-gray-800/80 border border-gray-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  >
                    {tournament.availableDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date + "T12:00:00").toLocaleDateString(
                          "pt-PT",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          },
                        )}
                      </option>
                    ))}
                  </select>
                </div>
                {matchesBySelectedDate.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Nenhum jogo para este dia</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {matchesBySelectedDate.map(renderMatch)}
                  </div>
                )}
              </div>
            )}

            {activeTab === "results" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Resultados
                </h3>
                {completedMatches.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Nenhum resultado disponível</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {completedMatches.map(renderMatch)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
