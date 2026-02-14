"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";

interface ClubAvailability {
  club: {
    tenant_id: string;
    name: string;
    link: string;
    image: string;
  };
  courts: any[];
  hasAvailability: boolean;
  totalSlots90?: number;
  earliestTime?: string | null;
  latestTime?: string | null;
}

interface MultiClubSearchResult {
  date: string;
  totalClubs: number;
  clubsChecked: number;
  results: ClubAvailability[];
}

export default function PlaytomicSearchPage() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("22:00");
  const [clubNameFilter, setClubNameFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MultiClubSearchResult | null>(null);
  const [filteredResults, setFilteredResults] =
    useState<MultiClubSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "favorites">("search");

  // Load user favorites on mount
  useEffect(() => {
    if (session?.user) {
      loadFavorites();
    }
  }, [session]);

  const loadFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        const favSet = new Set<string>(
          data.favorites.map((fav: any) => fav.tenantId),
        );
        setFavorites(favSet);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (club: {
    tenant_id: string;
    name: string;
    image: string;
    link: string;
  }) => {
    if (!session?.user) {
      alert("Por favor, faça login para adicionar favoritos");
      return;
    }

    setFavoriteLoading(club.tenant_id);

    try {
      const isFavorite = favorites.has(club.tenant_id);

      if (isFavorite) {
        // Remove favorite
        const response = await fetch(
          `/api/favorites?tenantId=${club.tenant_id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.delete(club.tenant_id);
          setFavorites(newFavorites);
        }
      } else {
        // Add favorite
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantId: club.tenant_id,
            clubName: club.name,
            clubImage: club.image,
            clubLink: club.link,
          }),
        });

        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.add(club.tenant_id);
          setFavorites(newFavorites);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Erro ao atualizar favoritos");
    } finally {
      setFavoriteLoading(null);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `/api/playtomic/search-all?date=${selectedDate}`,
      );
      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Erro ao procurar campos. Tente novamente.");
        return;
      }

      setResults(data);
      filterResultsByTimeAndName(data, startTime, endTime, clubNameFilter);
    } catch (err) {
      setError("Erro ao procurar campos. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterResultsByTimeAndName = (
    data: MultiClubSearchResult,
    start: string,
    end: string,
    nameFilter: string,
  ) => {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Filter by name first
    let filteredByName = data.results;
    if (nameFilter.trim()) {
      const searchTerm = nameFilter.toLowerCase();
      filteredByName = data.results.filter((clubResult) =>
        clubResult.club.name.toLowerCase().includes(searchTerm),
      );
    }

    const filtered = {
      ...data,
      results: filteredByName.map((clubResult) => {
        // Collect all 90-minute slots from all courts
        let totalSlots90 = 0;
        let earliestTime = "23:59";
        let latestTime = "00:00";

        clubResult.courts.forEach((court) => {
          court.slots?.forEach((slot: any) => {
            const [slotHour, slotMin] = slot.start_time.split(":").map(Number);
            const slotMinutes = slotHour * 60 + slotMin;

            // Check if within time range and exactly 90 minutes
            if (
              slotMinutes >= startMinutes &&
              slotMinutes < endMinutes &&
              slot.duration === 90
            ) {
              totalSlots90++;
              if (slot.start_time < earliestTime)
                earliestTime = slot.start_time;
              if (slot.start_time > latestTime) latestTime = slot.start_time;
            }
          });
        });

        return {
          ...clubResult,
          courts: [], // Don't show individual courts
          hasAvailability: totalSlots90 > 0,
          totalSlots90,
          earliestTime: earliestTime !== "23:59" ? earliestTime : null,
          latestTime: latestTime !== "00:00" ? latestTime : null,
        };
      }),
    };

    // Sort: clubs with availability first
    filtered.results.sort((a, b) => {
      if (a.hasAvailability && !b.hasAvailability) return -1;
      if (!a.hasAvailability && b.hasAvailability) return 1;
      return 0;
    });

    setFilteredResults(filtered);
  };

  // Re-filter when time or name changes
  const handleTimeChange = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
    if (results) {
      filterResultsByTimeAndName(results, start, end, clubNameFilter);
    }
  };

  const handleNameFilterChange = (name: string) => {
    setClubNameFilter(name);
    if (results) {
      filterResultsByTimeAndName(results, startTime, endTime, name);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: string) => {
    // Convert "72 GBP" to "72€" or similar
    const match = price.match(/(\d+(?:\.\d+)?)\s*([A-Z]{3})/);
    if (match) {
      const [, amount, currency] = match;
      const currencySymbol =
        currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;
      return `${amount}${currencySymbol}`;
    }
    return price;
  };

  // Get favorite results (only show favorites with availability)
  const getFavoriteResults = (): MultiClubSearchResult | null => {
    if (!filteredResults || favorites.size === 0) return null;

    const favoriteClubResults = filteredResults.results.filter(
      (clubResult) =>
        favorites.has(clubResult.club.tenant_id) && clubResult.hasAvailability,
    );

    return {
      ...filteredResults,
      results: favoriteClubResults,
    };
  };

  // Get the results to display based on active tab
  const displayResults =
    activeTab === "favorites" ? getFavoriteResults() : filteredResults;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Procurar Campos de Padel - Lisboa
          </h1>
          <p className="text-gray-400">
            Procura disponibilidade em todos os clubes de Lisboa de uma vez
          </p>
        </div>

        {/* Lisboa Only Notice */}
        <div className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5"
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
            <div className="text-sm">
              <p className="text-purple-200 font-semibold mb-1">
                📍 Disponível apenas para Lisboa
              </p>
              <p className="text-purple-200/80">
                De momento, esta funcionalidade está disponível apenas para
                clubes de padel na região de Lisboa. Em breve expandiremos para
                outras regiões!
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="text-blue-200/80">
                Selecione o horário preferido e a data. Procuramos
                automaticamente a disponibilidade em todos os clubes de padel
                dentro do intervalo escolhido. Clubes com campos disponíveis
                aparecem primeiro!
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {/* Time Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Horário (início do jogo)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">De</label>
                  <select
                    value={startTime}
                    onChange={(e) => handleTimeChange(e.target.value, endTime)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                      return [
                        <option key={`${hour}:00`} value={`${hour}:00`}>
                          {hour}:00
                        </option>,
                        <option key={`${hour}:30`} value={`${hour}:30`}>
                          {hour}:30
                        </option>,
                      ];
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Até
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) =>
                      handleTimeChange(startTime, e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                      return [
                        <option key={`${hour}:00`} value={`${hour}:00`}>
                          {hour}:00
                        </option>,
                        <option key={`${hour}:30`} value={`${hour}:30`}>
                          {hour}:30
                        </option>,
                      ];
                    })}
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Mostra apenas campos disponíveis entre {startTime} e {endTime}
              </p>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Club Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filtrar por Nome do Clube
              </label>
              <input
                type="text"
                value={clubNameFilter}
                onChange={(e) => handleNameFilterChange(e.target.value)}
                placeholder="ex: Arena, Padel, Lisboa..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                {clubNameFilter ? (
                  <>A filtrar clubes que contenham "{clubNameFilter}"</>
                ) : (
                  <>Deixe vazio para mostrar todos os clubes</>
                )}
              </p>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  A procurar em todos os clubes...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Procurar Disponibilidade
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        {filteredResults && !loading && (
          <div className="mb-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === "search"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Procurar Campos</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                disabled={!session?.user}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === "favorites"
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
                title={
                  !session?.user ? "Faça login para ver favoritos" : undefined
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>
                    Meus Favoritos
                    {favorites.size > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {favorites.size}
                      </span>
                    )}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Results */}
        {displayResults && !loading && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h2 className="text-xl font-bold text-white">
                {activeTab === "favorites" ? (
                  <>Favoritos Disponíveis</>
                ) : (
                  <>
                    Resultados para {formatDate(displayResults.date)} (
                    {startTime} - {endTime})
                  </>
                )}
              </h2>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm text-gray-400">
                  {displayResults.results.length}{" "}
                  {activeTab === "favorites"
                    ? "favoritos disponíveis"
                    : clubNameFilter
                      ? "filtrados"
                      : "clubes"}{" "}
                  {clubNameFilter &&
                    activeTab === "search" &&
                    `de ${displayResults.totalClubs}`}
                </span>
                {clubNameFilter && activeTab === "search" && (
                  <span className="text-xs text-blue-400">
                    🔍 Filtro: "{clubNameFilter}"
                  </span>
                )}
              </div>
            </div>

            {displayResults.results.filter((r) => r.hasAvailability).length ===
            0 ? (
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  {activeTab === "favorites"
                    ? favorites.size === 0
                      ? "Nenhum favorito adicionado"
                      : "Nenhum favorito disponível"
                    : "Nenhum campo disponível"}
                </h3>
                <p className="text-gray-500">
                  {activeTab === "favorites" ? (
                    favorites.size === 0 ? (
                      <>
                        Adicione clubes aos favoritos clicando no ícone de
                        coração ❤️
                      </>
                    ) : (
                      <>
                        Os seus clubes favoritos não têm campos disponíveis para
                        esta data e horário. Experimente outro intervalo de
                        tempo.
                      </>
                    )
                  ) : (
                    <>
                      Não foram encontrados campos disponíveis para esta data e
                      horário. Experimente outro intervalo de tempo.
                    </>
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {displayResults.results.map((clubResult) => (
                  <div
                    key={clubResult.club.tenant_id}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-200"
                  >
                    {/* Club Header */}
                    <div className="flex items-center gap-4 p-6">
                      <img
                        src={clubResult.club.image}
                        alt={clubResult.club.name}
                        className="w-20 h-20 rounded-xl object-cover border border-gray-700/50"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white">
                            {clubResult.club.name}
                          </h3>
                          {favorites.has(clubResult.club.tenant_id) && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded border border-yellow-500/30 inline-flex items-center gap-1">
                              ⭐ Favorito
                            </span>
                          )}
                        </div>

                        {/* Availability Summary */}
                        {clubResult.hasAvailability &&
                        clubResult.totalSlots90 ? (
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <svg
                                className="w-4 h-4 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-green-300 font-semibold">
                                {clubResult.totalSlots90} blocos de 90min
                                disponíveis
                              </span>
                            </div>
                            {clubResult.earliestTime &&
                              clubResult.latestTime && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
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
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>
                                    {clubResult.earliestTime.slice(0, 5)} -{" "}
                                    {clubResult.latestTime.slice(0, 5)}
                                  </span>
                                </div>
                              )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 mt-2">
                            Sem blocos de 90min disponíveis neste horário
                          </p>
                        )}

                        <a
                          href={`${clubResult.club.link}?date=${selectedDate}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1 mt-2"
                        >
                          Ver disponibilidade no Playtomic
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
                      <div className="flex items-center gap-2">
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(clubResult.club)}
                          disabled={
                            favoriteLoading === clubResult.club.tenant_id
                          }
                          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                          title={
                            favorites.has(clubResult.club.tenant_id)
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                        >
                          {favoriteLoading === clubResult.club.tenant_id ? (
                            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : favorites.has(clubResult.club.tenant_id) ? (
                            <svg
                              className="w-6 h-6 text-yellow-400 fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-gray-400 hover:text-yellow-400 transition-colors"
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
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
