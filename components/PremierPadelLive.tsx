"use client";

import { useState, useEffect } from "react";
import type {
  PremierPadelData,
  PremierPadelMatch,
} from "@/types/premier-padel";

export default function PremierPadelLive() {
  const [data, setData] = useState<PremierPadelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"live" | "results" | "upcoming">(
    "live",
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/premier-padel");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching Premier Padel data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const MatchCard = ({ match }: { match: PremierPadelMatch }) => (
    <div className="glass p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{match.category}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400">{match.round}</span>
        </div>
        {match.status === "LIVE" && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-red-400">LIVE</span>
          </div>
        )}
        {match.status === "SCHEDULED" && (
          <span className="text-xs text-blue-400">{match.startTime}</span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-2">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm">
              {match.team1.flag1} {match.team1.flag2 && match.team1.flag2}
            </span>
            <span className="text-sm text-gray-200 font-medium">
              {match.team1.player1}
              {match.team1.player2 && ` / ${match.team1.player2}`}
            </span>
          </div>
          {match.score && (
            <div className="flex gap-2 ml-2">
              <span className="text-sm font-bold text-white bg-gray-800 px-2 py-0.5 rounded">
                {match.score.set1Team1}
              </span>
              {match.score.set2Team1 !== undefined && (
                <span className="text-sm font-bold text-white bg-gray-800 px-2 py-0.5 rounded">
                  {match.score.set2Team1}
                </span>
              )}
              {match.score.set3Team1 !== undefined && (
                <span className="text-sm font-bold text-white bg-gray-800 px-2 py-0.5 rounded">
                  {match.score.set3Team1}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm">
              {match.team2.flag1} {match.team2.flag2 && match.team2.flag2}
            </span>
            <span className="text-sm text-gray-200 font-medium">
              {match.team2.player1}
              {match.team2.player2 && ` / ${match.team2.player2}`}
            </span>
          </div>
          {match.score && (
            <div className="flex gap-2 ml-2">
              <span className="text-sm font-bold text-white bg-gray-800 px-2 py-0.5 rounded">
                {match.score.set1Team2}
              </span>
              {match.score.set2Team2 !== undefined && (
                <span className="text-sm font-bold text-white bg-gray-800 px-2 py-0.5 rounded">
                  {match.score.set2Team2}
                </span>
              )}
              {match.score.set3Team2 !== undefined && (
                <span className="text-sm font-bold text-white bg-gray-800 px-2 py-0.5 rounded">
                  {match.score.set3Team2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-700/30 flex items-center justify-between">
        <span className="text-xs text-gray-500">{match.court}</span>
        {match.status === "COMPLETED" && (
          <span className="text-xs text-gray-400">Finalizado</span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="px-4 sm:px-6 py-10 md:py-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="glass p-6 rounded-2xl border border-gray-700/50">
            <p className="text-center text-gray-400">
              A carregar resultados...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const matches =
    activeTab === "live"
      ? data.liveMatches
      : activeTab === "results"
        ? data.recentResults
        : data.upcomingMatches;

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
              <p className="text-xs text-gray-400">
                {data.tournament.name} {data.tournament.location}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "live"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            🔴 Ao Vivo ({data.liveMatches.length})
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "results"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            📊 Resultados ({data.recentResults.length})
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "upcoming"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            📅 Próximos ({data.upcomingMatches.length})
          </button>
        </div>

        {/* Matches Grid */}
        {matches.length === 0 ? (
          <div className="glass p-6 rounded-2xl border border-gray-700/50 text-center">
            <p className="text-gray-400">
              {activeTab === "live" && "Nenhum jogo ao vivo neste momento"}
              {activeTab === "results" && "Sem resultados recentes"}
              {activeTab === "upcoming" && "Sem jogos agendados"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {/* Link to Premier Padel */}
        <div className="mt-6 text-center">
          <a
            href="https://www.premierpadel.com/en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Ver mais no Premier Padel
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
    </section>
  );
}
