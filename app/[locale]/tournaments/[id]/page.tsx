"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import { calculateStandings } from "@/lib/round-robin";
import type { TournamentWithRelations } from "@/types/tournament";

export default function TournamentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<TournamentWithRelations | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"games" | "standings">("games");
  const [gameInputs, setGameInputs] = useState<
    Record<string, { team1Points: string; team2Points: string }>
  >({});
  const [savingGames, setSavingGames] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  const fetchTournament = async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`);
      if (response.ok) {
        const data = await response.json();
        setTournament(data);
      } else {
        router.push("/tournaments");
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);
      router.push("/tournaments");
    } finally {
      setLoading(false);
    }
  };

  const getTeamDisplay = (team: any) => {
    return team.teamName || `${team.player1Name} & ${team.player2Name}`;
  };

  const handleGameInputChange = (
    gameId: string,
    field: "team1Points" | "team2Points",
    value: string,
  ) => {
    setGameInputs((prev) => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        [field]: value,
      },
    }));
  };

  const handleSaveGame = async (gameId: string) => {
    const input = gameInputs[gameId];
    if (!input) return;

    const team1Points = parseInt(input.team1Points || "0");
    const team2Points = parseInt(input.team2Points || "0");

    if (isNaN(team1Points) || isNaN(team2Points)) {
      alert("Por favor insira pontuações válidas");
      return;
    }

    setSavingGames((prev) => new Set(prev).add(gameId));

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          team1Points,
          team2Points,
        }),
      });

      if (response.ok) {
        // Refresh tournament data
        await fetchTournament();
        // Clear input for this game
        setGameInputs((prev) => {
          const updated = { ...prev };
          delete updated[gameId];
          return updated;
        });
      } else {
        const data = await response.json();
        alert(`Erro: ${data.error || "Falha ao guardar resultado"}`);
      }
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Erro ao guardar resultado");
    } finally {
      setSavingGames((prev) => {
        const updated = new Set(prev);
        updated.delete(gameId);
        return updated;
      });
    }
  };

  const getProgressStats = () => {
    if (!tournament?.rounds) return { completed: 0, total: 0 };

    const totalGames = tournament.rounds.reduce(
      (sum, round) => sum + (round.games?.length || 0),
      0,
    );
    const completedGames = tournament.rounds.reduce(
      (sum, round) =>
        sum +
        (round.games?.filter((g) => g.status === "COMPLETED").length || 0),
      0,
    );

    return { completed: completedGames, total: totalGames };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header showCreateTournament={true} />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">A carregar torneio...</div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-black">
        <Header showCreateTournament={true} />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">Torneio não encontrado</div>
        </div>
      </div>
    );
  }

  const stats = getProgressStats();
  const progressPercentage =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  // Calculate standings
  const standings =
    tournament.teams && tournament.rounds
      ? calculateStandings(
          tournament.teams.map((team) => ({
            ...team,
            teamName:
              team.teamName || `${team.player1Name} & ${team.player2Name}`,
          })),
          tournament.rounds.flatMap((r) => r.games || []),
        )
      : [];

  return (
    <div className="min-h-screen bg-black">
      <Header showCreateTournament={true} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tournament Info */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/tournaments")}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
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
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar aos Torneios
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">
            {tournament.name}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(tournament.date).toLocaleDateString("pt-PT")}
            </div>

            <div className="flex items-center gap-2">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {tournament.teams?.length || 0} Equipas
            </div>

            <div className="flex items-center gap-2">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {stats.completed} / {stats.total} Jogos
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("games")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "games"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Jogos por Ronda
          </button>
          <button
            onClick={() => setActiveTab("standings")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "standings"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Classificação
          </button>
        </div>

        {/* Games Tab */}
        {activeTab === "games" && (
          <div className="space-y-6">
            {tournament.rounds?.map((round) => (
              <div
                key={round.id}
                className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Ronda {round.roundNumber}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      round.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-400"
                        : round.status === "IN_PROGRESS"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {round.status === "COMPLETED"
                      ? "Completa"
                      : round.status === "IN_PROGRESS"
                        ? "Em Progresso"
                        : "Pendente"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {round.games?.map((game) => (
                    <div
                      key={game.id}
                      className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-medium text-blue-400">
                          Campo {game.court}
                        </span>
                        <span
                          className={`text-xs ${
                            game.status === "COMPLETED"
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {game.status === "COMPLETED"
                            ? "Finalizado"
                            : "Por jogar"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {/* Team 1 */}
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              game.winnerId === game.team1Id
                                ? "text-white font-semibold"
                                : "text-gray-300"
                            }`}
                          >
                            {getTeamDisplay(game.team1)}
                          </span>
                          {game.status === "COMPLETED" ? (
                            <span
                              className={`text-lg font-bold ${
                                game.winnerId === game.team1Id
                                  ? "text-white"
                                  : "text-gray-400"
                              }`}
                            >
                              {game.team1Points}
                            </span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={gameInputs[game.id]?.team1Points || ""}
                              onChange={(e) =>
                                handleGameInputChange(
                                  game.id,
                                  "team1Points",
                                  e.target.value,
                                )
                              }
                              className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center focus:outline-none focus:border-blue-500"
                              placeholder="0"
                            />
                          )}
                        </div>

                        {/* Team 2 */}
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              game.winnerId === game.team2Id
                                ? "text-white font-semibold"
                                : "text-gray-300"
                            }`}
                          >
                            {getTeamDisplay(game.team2)}
                          </span>
                          {game.status === "COMPLETED" ? (
                            <span
                              className={`text-lg font-bold ${
                                game.winnerId === game.team2Id
                                  ? "text-white"
                                  : "text-gray-400"
                              }`}
                            >
                              {game.team2Points}
                            </span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={gameInputs[game.id]?.team2Points || ""}
                              onChange={(e) =>
                                handleGameInputChange(
                                  game.id,
                                  "team2Points",
                                  e.target.value,
                                )
                              }
                              className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center focus:outline-none focus:border-blue-500"
                              placeholder="0"
                            />
                          )}
                        </div>
                      </div>

                      {game.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleSaveGame(game.id)}
                          disabled={
                            savingGames.has(game.id) ||
                            !gameInputs[game.id]?.team1Points ||
                            !gameInputs[game.id]?.team2Points
                          }
                          className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          {savingGames.has(game.id)
                            ? "A guardar..."
                            : "Guardar Resultado"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {(!tournament.rounds || tournament.rounds.length === 0) && (
              <div className="text-center text-gray-400 py-12">
                Nenhum jogo agendado
              </div>
            )}
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === "standings" && (
          <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Equipa
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      J
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      V
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      E
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      D
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      PF
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      PS
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      Diff
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {standings.map((standing, index) => (
                    <tr
                      key={standing.teamId}
                      className={`${
                        index === 0 ? "bg-green-500/10" : "hover:bg-gray-800/30"
                      } transition-colors`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-medium">
                        {standing.teamName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 text-center">
                        {standing.played}
                      </td>
                      <td className="px-4 py-3 text-sm text-green-400 text-center">
                        {standing.won}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 text-center">
                        {standing.drawn}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-400 text-center">
                        {standing.lost}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 text-center">
                        {standing.pointsFor}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 text-center">
                        {standing.pointsAgainst}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-center font-medium ${
                          standing.pointsDiff > 0
                            ? "text-green-400"
                            : standing.pointsDiff < 0
                              ? "text-red-400"
                              : "text-gray-400"
                        }`}
                      >
                        {standing.pointsDiff > 0
                          ? `+${standing.pointsDiff}`
                          : standing.pointsDiff}
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-bold text-center">
                        {standing.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {standings.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  Nenhum resultado ainda
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
