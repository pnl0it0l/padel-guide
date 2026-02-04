"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type PairingMode = "auto" | "manual";

interface TeamInput {
  player1Name: string;
  player2Name: string;
  teamName?: string;
}

export default function CreateTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Basic info
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [courtsAvailable, setCourtsAvailable] = useState(2);

  // Pairing mode
  const [pairingMode, setPairingMode] = useState<PairingMode>("auto");

  // Auto-pairing: list of player names
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);

  // Manual pairing: list of teams
  const [teams, setTeams] = useState<TeamInput[]>([
    { player1Name: "", player2Name: "", teamName: "" },
    { player1Name: "", player2Name: "", teamName: "" },
  ]);

  // Auto-pairing handlers
  const addPlayer = () => {
    setPlayerNames([...playerNames, ""]);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 4) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, value: string) => {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  };

  // Manual pairing handlers
  const addTeam = () => {
    setTeams([...teams, { player1Name: "", player2Name: "", teamName: "" }]);
  };

  const removeTeam = (index: number) => {
    if (teams.length > 2) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const updateTeam = (
    index: number,
    field: keyof TeamInput,
    value: string
  ) => {
    const updated = [...teams];
    updated[index][field] = value;
    setTeams(updated);
  };

  // Validation
  const canSubmit = () => {
    if (!name.trim() || !date || courtsAvailable < 1) {
      return false;
    }

    if (pairingMode === "auto") {
      const validPlayers = playerNames.filter((p) => p.trim() !== "");
      return validPlayers.length >= 4 && validPlayers.length % 2 === 0;
    } else {
      return (
        teams.length >= 2 &&
        teams.every((t) => t.player1Name.trim() && t.player2Name.trim())
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setLoading(true);
    setError("");

    try {
      const payload: any = {
        name: name.trim(),
        date: new Date(date).toISOString(),
        courtsAvailable,
      };

      if (pairingMode === "auto") {
        payload.playerNames = playerNames
          .map((p) => p.trim())
          .filter((p) => p !== "");
      } else {
        payload.teams = teams.map((t) => ({
          player1Name: t.player1Name.trim(),
          player2Name: t.player2Name.trim(),
          teamName: t.teamName?.trim() || undefined,
        }));
      }

      console.log("Creating tournament:", payload);

      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create tournament");
      }

      const tournament = await response.json();
      console.log("Tournament created:", tournament.id);

      router.push(`/tournaments/${tournament.id}`);
    } catch (err) {
      console.error("Error creating tournament:", err);
      setError(err instanceof Error ? err.message : "Failed to create tournament");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header showCreateTournament={false} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Criar Novo Torneio
          </h1>
          <p className="text-gray-400">
            Configure um torneio de padel misto com jogos de 20 minutos
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Card */}
          <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-white mb-4">
              Informações Básicas
            </h2>

            <div className="space-y-4">
              {/* Tournament Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Torneio
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Ex: Torneio de Verão 2024"
                  required
                />
              </div>

              {/* Date and Courts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campos Disponíveis
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={courtsAvailable}
                    onChange={(e) =>
                      setCourtsAvailable(parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex gap-3">
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
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Formato do Torneio:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-200/80">
                  <li>Round-robin (todos jogam contra todos)</li>
                  <li>Jogos de 20 minutos</li>
                  <li>Duração aproximada: ~1h30 para 4-6 equipas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pairing Mode Selection */}
          <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-white mb-4">
              Modo de Emparelhamento
            </h2>

            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPairingMode("auto")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  pairingMode === "auto"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Emparelhamento Automático
              </button>
              <button
                type="button"
                onClick={() => setPairingMode("manual")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  pairingMode === "manual"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Emparelhamento Manual
              </button>
            </div>

            {/* Auto-pairing Mode */}
            {pairingMode === "auto" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Insira os nomes dos jogadores. O sistema irá emparelhar
                  automaticamente.
                </p>

                {playerNames.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updatePlayer(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      placeholder={`Jogador ${index + 1}`}
                    />
                    {playerNames.length > 4 && (
                      <button
                        type="button"
                        onClick={() => removePlayer(index)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPlayer}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                >
                  + Adicionar Jogador
                </button>

                <p className="text-xs text-gray-500">
                  Mínimo: 4 jogadores (número par)
                </p>
              </div>
            )}

            {/* Manual pairing Mode */}
            {pairingMode === "manual" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Crie as equipas manualmente definindo os pares.
                </p>

                {teams.map((team, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-400">
                        Equipa {index + 1}
                      </span>
                      {teams.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeTeam(index)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remover
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={team.player1Name}
                      onChange={(e) =>
                        updateTeam(index, "player1Name", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Jogador 1"
                    />

                    <input
                      type="text"
                      value={team.player2Name}
                      onChange={(e) =>
                        updateTeam(index, "player2Name", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Jogador 2"
                    />

                    <input
                      type="text"
                      value={team.teamName || ""}
                      onChange={(e) =>
                        updateTeam(index, "teamName", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Nome da Equipa (opcional)"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTeam}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                >
                  + Adicionar Equipa
                </button>

                <p className="text-xs text-gray-500">Mínimo: 2 equipas</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/tournaments")}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!canSubmit() || loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {loading ? "A criar..." : "Criar Torneio"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
