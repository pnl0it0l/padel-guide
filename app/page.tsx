import LinkCard from "@/components/LinkCard";
import NewsSection from "@/components/NewsSection";
import AdBanner from "@/components/AdBanner";
import { links, categories } from "@/data/links";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎾</span>
              </div>
              <div>
                <h1 className="text-sm font-black text-white">Padel Guide</h1>
                <p className="text-[9px] text-gray-400">Portugal</p>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Procurar links..."
                  className="w-full px-4 py-1.5 pl-9 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors"
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
              </div>
            </div>

            {/* CTA */}
            <a
              href="mailto:hello@padelguide.pt"
              className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Sugere um link →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero */}
        <section className="py-12 px-6">
          <div className="max-w-[1600px] mx-auto text-center">
            <div className="inline-block mb-3 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
              🇵🇹 Made in Portugal
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
              O teu guia de{" "}
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                padel em Portugal
              </span>
            </h2>
            <p className="text-base text-gray-300 mb-6 max-w-2xl mx-auto">
              Links úteis, curados e organizados num só lugar
            </p>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => {
                const categoryLinks = links.filter(
                  (link) => link.category === category.id,
                );

                return (
                  <div key={category.id} className="space-y-3">
                    {/* Column Header */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700/50">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center text-lg">
                        {category.emoji}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">
                          {category.name}
                        </h3>
                        <p className="text-[10px] text-gray-400">
                          {categoryLinks.length} links
                        </p>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                      {categoryLinks.map((link) => (
                        <LinkCard
                          key={link.title}
                          title={link.title}
                          url={link.url}
                          tags={link.tags}
                          opinion={link.opinion}
                          image={link.image}
                        />
                      ))}
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
        <footer className="px-6 py-8 border-t border-gray-700/50 bg-gray-900/50">
          <div className="max-w-[1600px] mx-auto text-center">
            <p className="text-gray-400 text-xs mb-1">
              Curado com ❤️ para a comunidade portuguesa de padel
            </p>
            <p className="text-gray-500 text-[10px]">
              © 2026 Padel Guide · Todos os direitos reservados
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
