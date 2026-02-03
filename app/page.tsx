"use client";

import { useState, useEffect } from "react";
import LinkCard from "@/components/LinkCard";
import NewsSection from "@/components/NewsSection";
import AdBanner from "@/components/AdBanner";
import { links, categories } from "@/data/links";

export default function Home() {
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
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">
                  Padel Guide
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  Portugal
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-1 max-w-md mx-4 md:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Procurar links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Procurar links de padel"
                  className="w-full px-4 py-2 pl-10 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <svg
                  className="absolute left-3 top-2 w-4 h-4 text-gray-400"
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
                    className="absolute right-3 top-2 text-gray-400 hover:text-white"
                    aria-label="Limpar pesquisa"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* CTA */}
            <a
              href="mailto:hello@padelguide.pt"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all"
            >
              Sugere um link
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero */}
        <section className="py-16 px-6">
          <div className="max-w-[1600px] mx-auto text-center">
            {/* Hero Image */}
            <div className="mb-8 rounded-2xl overflow-hidden max-w-4xl mx-auto shadow-2xl relative">
              <img
                src="https://media.timeout.com/images/105805648/1920/1080/image.webp"
                alt="Padel court in Portugal"
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                  Padel Guide
                </h2>
              </div>
            </div>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Todos os recursos essenciais de padel em Portugal, num único lugar
            </p>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
                {allTags.slice(0, 12).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-blue-600 hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-4 py-2 text-xs font-medium rounded-lg bg-gray-900 text-gray-400 border border-gray-800 hover:border-red-600 hover:text-red-400 transition-all"
                  >
                    Limpar filtros
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
                  <div key={category.id} className="space-y-3">
                    {/* Column Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                      <div className="text-blue-500">
                        {getCategoryIcon(category.id)}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white mb-0.5">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {categoryLinks.length}{" "}
                          {categoryLinks.length === 1 ? "link" : "links"}
                        </p>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                      {categoryLinks.length === 0 ? (
                        <p className="text-xs text-gray-500 italic py-4">
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
        <footer className="px-6 py-10 border-t border-gray-900">
          <div className="max-w-[1600px] mx-auto text-center">
            <p className="text-gray-600 text-xs">© 2026 Padel Guide</p>
          </div>
        </footer>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl transition-all flex items-center justify-center group"
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
