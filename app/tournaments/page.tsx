"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import LoginButton from "@/components/LoginButton";

interface Tournament {
  id: string;
  name: string;
  date: string;
  status: string;
  format: string;
  matchFormatType: string;
  teams: any[];
  matches: any[];
}

export default function TournamentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    // TEMP: Buscar torneios sem autenticação
    // if (session) {
    fetchTournaments();
    // }
  }, [session]);

  const fetchTournaments = async () => {
    try {
      const response = await fetch("/api/tournaments");
      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter((t) => {
    if (filter === "all") return true;
    return t.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: "bg-gray-700 text-gray-300",
      ACTIVE: "bg-blue-600 text-white",
      COMPLETED: "bg-green-600 text-white",
    };
    return styles[status as keyof typeof styles] || styles.DRAFT;
  };

  const getFormatLabel = (format: string) => {
    return format === "GROUPS_PLAYOFF" ? "Grupos + Playoff" : "Playoff Direto";
  };

  const getMatchFormatLabel = (format: string) => {
    const labels = {
      BEST_OF_3: "Melhor de 3",
      PRO_SET: "Pro-Set",
      TIMED: "Por Tempo",
    };
    return labels[format as keyof typeof labels] || format;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">A carregar...</div>
      </div>
    );
  }

  // TEMP: Autenticação desativada
  if (false && !session) {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-gray-700/50 shadow-lg">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
                  <svg
                    className="w-9 h-9 text-blue-400 relative z-10 group-hover:text-blue-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                    Padel Guide
                  </h1>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    Portugal
                  </p>
                </div>
              </Link>

              {/* Navigation Menu */}
              <nav className="hidden lg:flex items-center gap-1 ml-8">
                <a
                  href="/#fpp"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  FPP
                </a>
                <a
                  href="/#reservas"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  Reservas
                </a>
                <a
                  href="/#treino"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  Treino
                </a>
                <a
                  href="/tournaments"
                  className="px-4 py-2 text-sm font-medium bg-gray-800/50 text-white rounded-lg transition-all duration-200"
                >
                  Torneios
                </a>
                <a
                  href="/#comunidade"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  Comunidade
                </a>
              </nav>

              <div className="flex-1"></div>

              {/* Login Button */}
              <LoginButton />
            </div>
          </div>
        </header>

        {/* Not Logged In Message */}
        <main className="max-w-[1600px] mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass rounded-3xl p-12 border border-gray-700/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Login Necessário
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Os torneios estão disponíveis apenas para utilizadores
                autenticados. Faça login com a sua conta Google para criar e
                gerir os seus torneios de padel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LoginButton />
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Voltar à Página Inicial
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header showCreateTournament={true} />

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {["all", "draft", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                filter === f
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-900/80 text-gray-300 border border-gray-700/50 hover:border-blue-500/60 hover:text-white"
              }`}
            >
              {f === "all"
                ? "Todos"
                : f === "draft"
                  ? "Rascunhos"
                  : f === "active"
                    ? "Ativos"
                    : "Concluídos"}
            </button>
          ))}
        </div>

        {/* Tournaments Grid */}
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-gray-900/50 mb-6">
              <svg
                className="w-16 h-16 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhum torneio encontrado
            </h3>
            <p className="text-gray-400 mb-6">
              {filter === "all"
                ? "Cria o teu primeiro torneio para começar!"
                : `Não tens torneios ${filter === "draft" ? "em rascunho" : filter === "active" ? "ativos" : "concluídos"}.`}
            </p>
            <Link
              href="/tournaments/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Criar Primeiro Torneio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/tournaments/${tournament.id}`}
                className="block group"
              >
                <div className="glass rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {tournament.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(tournament.status)}`}
                    >
                      {tournament.status === "DRAFT"
                        ? "Rascunho"
                        : tournament.status === "ACTIVE"
                          ? "Ativo"
                          : "Concluído"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
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
                      {new Date(tournament.date).toLocaleDateString("pt-PT")}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {tournament.teams.length} equipas
                    </div>

                    <div className="text-sm text-gray-400">
                      {getFormatLabel(tournament.format)} •{" "}
                      {getMatchFormatLabel(tournament.matchFormatType)}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="pt-4 border-t border-gray-700/50">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Progresso</span>
                      <span>
                        {
                          tournament.matches.filter(
                            (m: any) => m.status === "COMPLETED",
                          ).length
                        }{" "}
                        / {tournament.matches.length} jogos
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                        style={{
                          width: `${tournament.matches.length > 0 ? (tournament.matches.filter((m: any) => m.status === "COMPLETED").length / tournament.matches.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
