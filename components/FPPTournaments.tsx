"use client";

import { useState, useEffect } from "react";

interface Tournament {
  date: string;
  endDate?: string;
  points: string;
  category: string;
  name: string;
  levels: string;
  location: string;
  participants?: number;
  url?: string;
}

export default function FPPTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/fpp-tournaments")
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data.tournaments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading tournaments:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
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
          <div>
            <h2 className="text-base font-bold text-white">
              Próximos Torneios FPP
            </h2>
            <p className="text-[10px] text-gray-400">A carregar...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-800/50 rounded-lg p-3 h-32"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || tournaments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
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
          <div>
            <h2 className="text-base font-bold text-white">
              Próximos Torneios FPP
            </h2>
            <p className="text-[10px] text-gray-400">
              Calendário oficial da FPP
            </p>
          </div>
        </div>
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm mb-3">
            {error ? "Erro ao carregar torneios" : "Nenhum torneio disponível"}
          </p>
          <a
            href="https://tour.tiesports.com/fpp/calendar_(tournaments)"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Ver Calendário FPP
            <svg
              className="w-3 h-3"
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
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
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
          <div>
            <h2 className="text-base font-bold text-white">
              Próximos Torneios FPP
            </h2>
            <p className="text-[10px] text-gray-400">
              Calendário oficial da FPP
            </p>
          </div>
        </div>
        <a
          href="https://tour.tiesports.com/fpp/calendar_(tournaments)"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          Ver todos
          <svg
            className="w-3 h-3"
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
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tournaments.map((tournament, index) => {
          const Component = tournament.url ? "a" : "div";
          const linkProps = tournament.url
            ? {
                href: tournament.url,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {};

          return (
            <Component
              key={index}
              {...linkProps}
              className="group bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-blue-500/50 rounded-lg p-3 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 block"
            >
              <div className="flex flex-col gap-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded px-2 py-1 text-center min-w-[50px]">
                    <div className="text-blue-400 font-bold text-xs leading-none">
                      {tournament.date.split(" ")[0]}
                    </div>
                    <div className="text-blue-300 text-[9px] font-medium">
                      {tournament.date.split(" ")[1]}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {tournament.points && (
                      <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 text-[9px] font-bold rounded border border-yellow-500/30">
                        {tournament.points}
                      </span>
                    )}
                    {tournament.category && (
                      <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[9px] font-bold rounded border border-purple-500/30">
                        {tournament.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tournament Info */}
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                    {tournament.name}
                  </h3>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <svg
                        className="w-3 h-3 flex-shrink-0"
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
                      <span className="truncate">{tournament.location}</span>
                    </div>
                    {tournament.levels && (
                      <div className="flex items-start gap-1.5 text-[10px] text-gray-500">
                        <svg
                          className="w-3 h-3 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span className="line-clamp-1">
                          {tournament.levels}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Component>
          );
        })}
      </div>
    </div>
  );
}
