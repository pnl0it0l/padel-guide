"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface FavoriteClub {
  tenantId: string;
  clubName: string;
  clubImage: string | null;
  clubLink: string | null;
  totalSlots90?: number;
  earliestTime?: string;
  latestTime?: string;
}

export default function FavoriteCourtsWidget() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteClub[]>([]);
  const [availability, setAvailability] = useState<Map<string, any>>(new Map());
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [startTime, setStartTime] = useState("00:00");

  useEffect(() => {
    if (!session?.user) {
      setIsVisible(false);
      return;
    }

    const fetchData = async (isFilterChange = false) => {
      try {
        if (isFilterChange) {
          setIsRefreshing(true);
        }

        // Load favorites
        const favResponse = await fetch("/api/favorites");
        if (!favResponse.ok) {
          setIsVisible(false);
          return;
        }

        const favData = await favResponse.json();
        const userFavorites = favData.favorites || [];

        if (userFavorites.length === 0) {
          setIsVisible(false);
          setIsLoading(false);
          return;
        }

        setFavorites(userFavorites);

        // Fetch availability for selected date
        const availResponse = await fetch(
          `/api/playtomic/search-all?date=${selectedDate}`,
        );

        if (!availResponse.ok) {
          setIsVisible(false);
          setIsLoading(false);
          return;
        }

        const availData = await availResponse.json();

        // Process availability data - filter for 90min slots only
        const availMap = new Map();
        let hasAnyAvailability = false;

        availData.results?.forEach((clubResult: any) => {
          const tenantId = clubResult.club.tenant_id;

          // Count 90min slots
          let totalSlots90 = 0;
          let earliestTime = "23:59";
          let latestTime = "00:00";

          clubResult.courts?.forEach((court: any) => {
            court.slots?.forEach((slot: any) => {
              // Filter 90min slots and slots after startTime
              if (slot.duration === 90 && slot.start_time >= startTime) {
                totalSlots90++;
                if (slot.start_time < earliestTime)
                  earliestTime = slot.start_time;
                if (slot.start_time > latestTime) latestTime = slot.start_time;
              }
            });
          });

          if (totalSlots90 > 0) {
            availMap.set(tenantId, {
              totalSlots90,
              earliestTime: earliestTime !== "23:59" ? earliestTime : null,
              latestTime: latestTime !== "00:00" ? latestTime : null,
            });
            hasAnyAvailability = true;
          }
        });

        setAvailability(availMap);
        setIsVisible(hasAnyAvailability);
        setIsLoading(false);
        setIsRefreshing(false);
      } catch (error) {
        console.error("Error fetching favorites availability:", error);
        setIsVisible(false);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    // Initial load
    if (!favorites.length) {
      fetchData();
    } else {
      // Filter change - refresh with indicator
      fetchData(true);
    }

    // Refresh every 5 minutes
    const interval = setInterval(() => fetchData(), 300000);
    return () => clearInterval(interval);
  }, [session, selectedDate, startTime]);

  // Filter favorites to only show those with availability
  const favoritesWithAvailability = favorites.filter((fav) =>
    availability.has(fav.tenantId),
  );

  if (!session?.user) {
    return null;
  }

  return (
    <div className="fixed bottom-[22rem] right-6 z-40 max-w-sm animate-fadeIn hidden lg:block">
      <div className="glass rounded-2xl border border-yellow-500/50 shadow-2xl shadow-yellow-500/20 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-gradient-to-r from-yellow-600/90 to-amber-600/90 backdrop-blur-sm p-3 flex items-center justify-between hover:from-yellow-600 hover:to-amber-600 transition-all"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-white fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="font-bold text-white text-sm">
              {favoritesWithAvailability.length > 0
                ? "CAMPOS DISPONÍVEIS"
                : "MEUS FAVORITOS"}
            </span>
            {!isLoading && favorites.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white font-semibold">
                {favoritesWithAvailability.length > 0
                  ? favoritesWithAvailability.length
                  : favorites.length}
              </span>
            )}
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
          <div className="max-h-[28rem] overflow-y-auto bg-gray-900/95 backdrop-blur-sm">
            {/* Date & Time Filters */}
            <div className="p-3 border-b border-gray-700/50 bg-gray-800/30 space-y-2">
              <div className="flex gap-2">
                {/* Date Selector */}
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-400 mb-1 font-medium">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-2 py-1.5 text-xs bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                  />
                </div>

                {/* Start Time Selector */}
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-400 mb-1 font-medium">
                    Hora Inicial
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setSelectedDate(new Date().toISOString().split("T")[0])
                  }
                  className="flex-1 px-2 py-1 text-[10px] bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/30 rounded text-gray-300 hover:text-white transition-all"
                >
                  Hoje
                </button>
                <button
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setSelectedDate(tomorrow.toISOString().split("T")[0]);
                  }}
                  className="flex-1 px-2 py-1 text-[10px] bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/30 rounded text-gray-300 hover:text-white transition-all"
                >
                  Amanhã
                </button>
                <button
                  onClick={() => setStartTime("00:00")}
                  className="flex-1 px-2 py-1 text-[10px] bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/30 rounded text-gray-300 hover:text-white transition-all"
                >
                  Todas as Horas
                </button>
              </div>
            </div>

            <div className="p-3 space-y-2">
              {(isLoading || isRefreshing) && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                  <p className="text-xs text-gray-400 mt-2">
                    {isLoading ? "A carregar favoritos..." : "A atualizar..."}
                  </p>
                </div>
              )}

              {!isLoading && !isRefreshing && favorites.length === 0 && (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-600 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-400">Sem favoritos</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Adicione clubes aos favoritos na página de Reservas
                  </p>
                </div>
              )}

              {!isLoading &&
                !isRefreshing &&
                favorites.length > 0 &&
                favoritesWithAvailability.length === 0 && (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-600 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">Sem disponibilidade</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tente outra data ou hora
                    </p>
                  </div>
                )}

              {!isLoading &&
                !isRefreshing &&
                favoritesWithAvailability.map((fav) => {
                  const avail = availability.get(fav.tenantId);

                  return (
                    <div
                      key={fav.tenantId}
                      className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-yellow-500/50 transition-all"
                    >
                      {/* Club Info */}
                      <div className="flex items-start gap-3 mb-2">
                        {fav.clubImage && (
                          <img
                            src={fav.clubImage}
                            alt={fav.clubName}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-700/50"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm truncate">
                            {fav.clubName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs text-green-300 font-semibold">
                                {avail?.totalSlots90} blocos
                              </span>
                            </div>
                            {avail?.earliestTime && avail?.latestTime && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>
                                  {avail.earliestTime.slice(0, 5)} -{" "}
                                  {avail.latestTime.slice(0, 5)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {fav.clubLink && (
                        <a
                          href={`${fav.clubLink}?date=${selectedDate}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-lg text-xs text-yellow-300 font-medium transition-colors"
                        >
                          <span>Ver no Playtomic</span>
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
                      )}
                    </div>
                  );
                })}

              {/* Footer Link */}
              <Link
                href="/campos"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 mt-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-xs text-gray-300 hover:text-white font-medium transition-all"
              >
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
                <span>Ver todos os campos</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
