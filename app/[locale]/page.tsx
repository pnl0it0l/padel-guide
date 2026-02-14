"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import LinkCard from "@/components/LinkCard";
import NewsSection from "@/components/NewsSection";
import FPPTournaments from "@/components/FPPTournaments";
import PremierPadelLive from "@/components/PremierPadelLive";
import LiveMatchWidget from "@/components/LiveMatchWidget";
import FavoriteCourtsWidget from "@/components/FavoriteCourtsWidget";
import AdBanner from "@/components/AdBanner";
import { links, categories } from "@/data/links";

export default function Home() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [columnCount, setColumnCount] = useState(4);

  // Filter links based on search
  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      searchQuery === "" ||
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesSearch;
  });

  // Show back to top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get icon for each category
  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, React.ReactElement> = {
      fpp: (
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
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      reservas: (
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
      ),
      treino: (
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
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      mix: (
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
      ),
      comunidade: (
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
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
    };
    return icons[categoryId] || null;
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main Content */}
      <main id="main-content">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)",
                backgroundSize: "48px 48px",
              }}
            ></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-between">
              {/* Left - Title & Stats */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                  <span className="text-white">Padel</span>{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Guide
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-gray-400 mb-3">
                  Todos os recursos de padel num só lugar
                </p>

                {/* Stats - Inline */}
                <div className="flex gap-4 justify-center md:justify-start text-xs">
                  <div>
                    <span className="font-bold text-blue-400">
                      {links.length}+
                    </span>
                    <span className="text-gray-500 ml-1">recursos</span>
                  </div>
                  <div className="text-gray-700">•</div>
                  <div>
                    <span className="font-bold text-blue-400">
                      {categories.length}
                    </span>
                    <span className="text-gray-500 ml-1">categorias</span>
                  </div>
                </div>
              </div>

              {/* Center - Search Bar */}
              <div className="relative w-full md:w-96 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Procurar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Procurar recursos de padel"
                  className="w-full px-4 py-2.5 pl-10 bg-gray-900/80 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    aria-label="Limpar pesquisa"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 my-4">
          <div className="max-w-7xl mx-auto">
            <NewsSection />
          </div>
        </section>

        {/* Reservar Campos Banner */}
        <section className="px-4 sm:px-6 my-6">
          <div className="max-w-7xl mx-auto">
            <a
              href="/campos"
              className="block group relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

              <div className="relative px-6 py-8 md:py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white">
                          Reservar Campos
                        </h2>
                        <p className="text-sm text-white/90 font-medium">
                          Encontra campos disponíveis agora
                        </p>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto md:mx-0 mb-3">
                      Pesquisa e reserva campos de padel nos melhores clubes de
                      Portugal. Campos disponíveis em tempo real!
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 w-fit mx-auto md:mx-0">
                      <svg
                        className="w-4 h-4 text-yellow-300 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs md:text-sm text-white font-semibold">
                        Registados podem guardar clubes favoritos para pesquisa
                        mais rápida
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-3 px-8 py-4 bg-white rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <span className="text-lg font-bold text-green-600">
                        Ver Disponibilidade
                      </span>
                      <svg
                        className="w-6 h-6 text-green-600 group-hover:translate-x-2 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </section>

        <section className="px-4 sm:px-6 my-4">
          <div className="max-w-7xl mx-auto">
            <PremierPadelLive />
          </div>
        </section>

        <section className="px-4 sm:px-6 my-4">
          <div className="max-w-7xl mx-auto">
            <FPPTournaments />
          </div>
        </section>

        {/* Links Section */}
        <section className="px-4 sm:px-6 my-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
              {/* Header */}
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
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Recursos de Padel
                    </h2>
                    <p className="text-[10px] text-gray-400">
                      {searchQuery
                        ? `${filteredLinks.length} de ${links.length} links`
                        : `${links.length} links úteis para a comunidade`}
                    </p>
                  </div>
                </div>
                {/* Column Selector */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">Colunas:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setColumnCount(num)}
                        className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                          columnCount === num
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links Grid - Mobile: Single column, Desktop: Multiple columns */}
              <div
                className={`grid gap-3 md:gap-4 grid-cols-1 ${
                  columnCount === 1
                    ? "md:grid-cols-1"
                    : columnCount === 2
                      ? "md:grid-cols-2"
                      : columnCount === 3
                        ? "md:grid-cols-2 lg:grid-cols-3"
                        : columnCount === 4
                          ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                          : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                }`}
              >
                {categories.map((category) => {
                  const categoryLinks = filteredLinks.filter(
                    (link) => link.category === category.id,
                  );

                  // Skip empty categories when searching
                  if (searchQuery && categoryLinks.length === 0) {
                    return null;
                  }

                  return (
                    <div
                      key={category.id}
                      id={category.id}
                      className="space-y-2 animate-fadeIn"
                    >
                      {/* Column Header */}
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700/50 group">
                        <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all duration-300">
                          {getCategoryIcon(category.id)}
                        </div>
                        <div>
                          <h3 className="text-sm md:text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {categoryLinks.length}{" "}
                            {categoryLinks.length === 1 ? "link" : "links"}
                          </p>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="space-y-2">
                        {categoryLinks.length === 0 ? (
                          <p className="text-sm text-gray-500 italic py-6 text-center">
                            Nenhum link nesta categoria
                          </p>
                        ) : (
                          categoryLinks.map((link) => (
                            <LinkCard
                              key={link.title}
                              title={link.title}
                              url={link.url}
                              tags={link.tags}
                              opinion={link.opinion}
                              image={link.image}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-8 border-t border-gray-800/50 bg-gradient-to-b from-transparent to-gray-900/30">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
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
              <span className="text-sm font-bold text-white">Padel Guide</span>
            </div>
            <p className="text-gray-500 text-xs">
              O teu guia completo de padel em Portugal
            </p>
            <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <p className="text-gray-600 text-[10px]">
              © 2026 Padel Guide · Feito com ❤️ para a comunidade de padel
            </p>
          </div>
        </footer>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center group hover:scale-110 animate-fadeIn"
          aria-label="Voltar ao topo"
          style={{ right: "auto" }}
        >
          <svg
            className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Ir para o conteúdo principal
      </a>

      <LiveMatchWidget />
      <FavoriteCourtsWidget />
    </div>
  );
}
