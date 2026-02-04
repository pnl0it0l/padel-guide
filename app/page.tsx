"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import LinkCard from "@/components/LinkCard";
import NewsSection from "@/components/NewsSection";
import AdBanner from "@/components/AdBanner";
import { links, categories } from "@/data/links";

export default function Home() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Get all unique tags
  const allTags = Array.from(
    new Set(links.flatMap((link) => link.tags)),
  ).sort();

  // Filter links based on search and tags
  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      searchQuery === "" ||
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => link.tags.includes(tag));

    return matchesSearch && matchesTags;
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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
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
        {/* Hero Section - More Professional & Cleaner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)',
              backgroundSize: '48px 48px'
            }}></div>
          </div>

          <div className="max-w-[1600px] mx-auto px-6 py-16 md:py-24 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-semibold">
                  O Seu Guia Completo
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                  Padel em<br />
                  <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Portugal
                  </span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                  Todos os recursos essenciais de padel num único lugar. Clubes, torneios, treinos e comunidade.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-xl">
                  <input
                    type="text"
                    placeholder="Procurar clubes, treinos, torneios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Procurar recursos de padel"
                    className="w-full px-6 py-4 pl-14 bg-gray-900/80 border border-gray-700/50 rounded-2xl text-base text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/30 focus:bg-gray-900 transition-all duration-300"
                  />
                  <svg
                    className="absolute left-5 top-4.5 w-6 h-6 text-gray-400"
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
                      className="absolute right-5 top-3.5 text-2xl text-gray-400 hover:text-white"
                      aria-label="Limpar pesquisa"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-4">
                  <div>
                    <div className="text-3xl font-bold text-white">{links.length}+</div>
                    <div className="text-sm text-gray-400">Recursos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{categories.length}</div>
                    <div className="text-sm text-gray-400">Categorias</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{allTags.length}+</div>
                    <div className="text-sm text-gray-400">Tags</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                  <img
                    src="https://media.timeout.com/images/105805648/1920/1080/image.webp"
                    alt="Padel court in Portugal"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                {/* Decorative Element */}
                <div className="absolute -z-10 -bottom-8 -right-8 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -z-10 -top-8 -left-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Tag Filter Section */}
        <section className="bg-black/50">
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2.5 justify-center">
                {allTags.slice(0, 12).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${selectedTags.includes(tag)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:border-blue-500/50 hover:text-white hover:bg-gray-800"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all duration-200"
                  >
                    × Limpar
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* News Ticker */}
        <section className="px-6 mb-12">
          <div className="max-w-[1600px] mx-auto">
            <NewsSection />
          </div>
        </section>

        {/* Ad Banner Top */}
        <section className="px-6 mb-8">
          <div className="max-w-[1600px] mx-auto">
            <AdBanner dataAdSlot="1234567890" />
          </div>
        </section>

        {/* Links Grid - 6 Columns */}
        <section className="px-6 pb-16">
          <div className="max-w-[1600px] mx-auto">
            {/* Search/Filter Results Info */}
            {(searchQuery || selectedTags.length > 0) && (
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-400">
                  {filteredLinks.length === 0 ? (
                    <span className="text-yellow-400">
                      Nenhum link encontrado
                    </span>
                  ) : (
                    <>
                      A mostrar{" "}
                      <span className="text-blue-400 font-bold">
                        {filteredLinks.length}
                      </span>{" "}
                      de {links.length} links
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {categories.map((category) => {
                const categoryLinks = filteredLinks.filter(
                  (link) => link.category === category.id,
                );

                // Skip empty categories when filtering
                if (
                  (searchQuery || selectedTags.length > 0) &&
                  categoryLinks.length === 0
                ) {
                  return null;
                }

                return (
                  <div key={category.id} className="space-y-3 animate-fadeIn">
                    {/* Column Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50 group">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                        {getCategoryIcon(category.id)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-blue-300 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {categoryLinks.length}{" "}
                          {categoryLinks.length === 1 ? "link" : "links"}
                        </p>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
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
        </section>

        {/* Ad Banner Bottom */}
        <section className="px-6 mb-8">
          <div className="max-w-[1600px] mx-auto">
            <AdBanner dataAdSlot="0987654321" />
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-16 border-t border-gray-800/50 bg-gradient-to-b from-transparent to-gray-900/30">
          <div className="max-w-[1600px] mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg
                className="w-6 h-6 text-blue-400"
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
              <span className="text-lg font-bold text-white">Padel Guide</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              O teu guia completo de padel em Portugal
            </p>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <p className="text-gray-600 text-xs">© 2026 Padel Guide · Feito com ❤️ para a comunidade de padel</p>
          </div>
        </footer>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 flex items-center justify-center group hover:scale-110 animate-fadeIn"
          aria-label="Voltar ao topo"
        >
          <svg
            className="w-6 h-6 group-hover:-translate-y-1 transition-transform"
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

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Ir para o conteúdo principal
      </a>
    </div>
  );
}
