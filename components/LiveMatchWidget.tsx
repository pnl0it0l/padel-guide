"use client";

import { useEffect, useState } from "react";
import type {
  PremierPadelData,
  PremierPadelMatch,
} from "@/types/premier-padel";

export default function LiveMatchWidget() {
  const [menData, setMenData] = useState<PremierPadelData | null>(null);
  const [womenData, setWomenData] = useState<PremierPadelData | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menResponse, womenResponse] = await Promise.all([
          fetch(`/api/premier-padel?category=MEN`),
          fetch(`/api/premier-padel?category=WOMEN`),
        ]);

        const [menResult, womenResult] = await Promise.all([
          menResponse.json(),
          womenResponse.json(),
        ]);

        setMenData(menResult);
        setWomenData(womenResult);

        // Show widget if there are live matches
        const hasLiveMatches =
          (menResult?.liveMatches?.length || 0) +
            (womenResult?.liveMatches?.length || 0) >
          0;
        setIsVisible(hasLiveMatches);
      } catch (error) {
        console.error("Error fetching live matches:", error);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const allLiveMatches = [
    ...(menData?.liveMatches || []),
    ...(womenData?.liveMatches || []),
  ];

  if (!isVisible || allLiveMatches.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-fadeIn hidden lg:block">
      <div className="glass rounded-2xl border border-red-500/50 shadow-2xl shadow-red-500/20 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-gradient-to-r from-red-600/90 to-pink-600/90 backdrop-blur-sm p-3 flex items-center justify-between hover:from-red-600 hover:to-pink-600 transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold text-white text-sm">JOGOS AO VIVO</span>
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white font-semibold">
              {allLiveMatches.length}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-white transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Content */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto bg-gray-900/95 backdrop-blur-sm">
            <div className="p-3 space-y-2">
              {allLiveMatches.map((match) => (
                <div
                  key={`${match.category}-${match.id}`}
                  className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-red-500/50 transition-all"
                >
                  {/* Match Info */}
                  <div className="flex items-center gap-2 mb-2 text-[10px]">
                    <span
                      className={`font-bold ${
                        match.category === "MEN"
                          ? "text-blue-400"
                          : "text-pink-400"
                      }`}
                    >
                      {match.category}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{match.round}</span>
                  </div>

                  {/* Team 1 */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      {match.team1.flag1 && (
                        <span className="text-xs">{match.team1.flag1}</span>
                      )}
                      {match.team1.flag2 && (
                        <span className="text-xs">{match.team1.flag2}</span>
                      )}
                      <span className="text-xs font-semibold text-white truncate">
                        {match.team1.player1?.split(" ").pop()}
                        {match.team1.player2 &&
                          ` / ${match.team1.player2.split(" ").pop()}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {match.currentGameScore && (
                        <span className="text-xs font-bold w-6 text-center px-1 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          {match.currentGameScore.team1}
                        </span>
                      )}
                      {match.score && (
                        <>
                          {match.score.set1Team1 !== undefined && (
                            <span className="text-xs font-bold w-5 text-center text-white">
                              {match.score.set1Team1}
                            </span>
                          )}
                          {match.score.set2Team1 !== undefined && (
                            <span className="text-xs font-bold w-5 text-center text-white">
                              {match.score.set2Team1}
                            </span>
                          )}
                          {match.score.set3Team1 !== undefined && (
                            <span className="text-xs font-bold w-5 text-center text-white">
                              {match.score.set3Team1}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      {match.team2.flag1 && (
                        <span className="text-xs">{match.team2.flag1}</span>
                      )}
                      {match.team2.flag2 && (
                        <span className="text-xs">{match.team2.flag2}</span>
                      )}
                      <span className="text-xs font-semibold text-white truncate">
                        {match.team2.player1?.split(" ").pop()}
                        {match.team2.player2 &&
                          ` / ${match.team2.player2.split(" ").pop()}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {match.currentGameScore && (
                        <span className="text-xs font-bold w-6 text-center px-1 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          {match.currentGameScore.team2}
                        </span>
                      )}
                      {match.score && (
                        <>
                          {match.score.set1Team2 !== undefined && (
                            <span className="text-xs font-bold w-5 text-center text-white">
                              {match.score.set1Team2}
                            </span>
                          )}
                          {match.score.set2Team2 !== undefined && (
                            <span className="text-xs font-bold w-5 text-center text-white">
                              {match.score.set2Team2}
                            </span>
                          )}
                          {match.score.set3Team2 !== undefined && (
                            <span className="text-xs font-bold w-5 text-center text-white">
                              {match.score.set3Team2}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Link */}
            <div className="p-2 bg-gray-800/50 border-t border-gray-700/50">
              <a
                href="https://www.premierpadel.com/en/tournaments-live"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Ver no Premier Padel →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
