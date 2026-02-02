import LinkCard from "@/components/LinkCard";
import NewsSection from "@/components/NewsSection";
import { links, categories } from "@/data/links";

export default function Home() {
  const featuredLinks = links.filter((link) => link.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-2xl">🎾</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-white tracking-tight">
                  Padel Guide
                </h1>
                <p className="text-[10px] text-gray-400">Portugal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <a
                href="#destaques"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 transition-all"
              >
                ⭐ Destaques
              </a>
              <a
                href="#noticias"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                📰 Notícias
              </a>
              <a
                href="#equipamento"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 transition-all"
              >
                🎾 Equipamento
              </a>
              <a
                href="#treino"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-green-500/10 hover:text-green-400 transition-all"
              >
                💪 Treino
              </a>
              <a
                href="#ferramentas"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 transition-all"
              >
                📱 Ferramentas
              </a>
              <a
                href="#comunidade"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 transition-all"
              >
                👥 Comunidade
              </a>
            </nav>

            {/* CTA */}
            <a
              href="mailto:hello@padelguide.pt"
              className="hidden lg:block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Sugere um link →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-6 lg:px-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 opacity-10"></div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold border border-blue-500/30">
              🇵🇹 Made in Portugal
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              O teu guia de{" "}
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                padel em Portugal
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Links úteis, curados e organizados. Equipamento, treino, apps e
              comunidade num só lugar.
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700/50 text-sm font-semibold">
                50+ Links
              </span>
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700/50 text-sm font-semibold">
                4 Categorias
              </span>
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700/50 text-sm font-semibold">
                100% Grátis
              </span>
            </div>
          </div>
        </section>

        {/* Featured Links */}
        <section id="destaques" className="px-6 lg:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center">
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold mb-4 border border-green-500/30">
                ⭐ Essenciais
              </span>
              <h3 className="text-4xl lg:text-5xl font-black text-white mb-3">
                Começa aqui
              </h3>
              <p className="text-gray-400 text-lg">
                Os recursos que não podes perder
              </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {featuredLinks.map((link) => (
                <LinkCard key={link.title} {...link} />
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="noticias" className="px-6 lg:px-12 py-16 bg-gray-800/20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <span className="inline-block px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-bold mb-4 border border-red-500/30">
                📰 Últimas Notícias
              </span>
              <h3 className="text-4xl lg:text-5xl font-black text-white mb-3">
                Fontes de notícias de padel
              </h3>
              <p className="text-gray-400 text-lg">
                Clica para aceder às principais fontes de notícias sobre padel
              </p>
            </div>
            <NewsSection />
          </div>
        </section>

        {/* Categories */}
        <section className="px-6 lg:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            {categories.map((category) => {
              const categoryLinks = links.filter(
                (link) => link.category === category.id && !link.featured,
              );

              return (
                <div key={category.id} id={category.id} className="mb-20">
                  <div className="flex items-center justify-center gap-4 mb-8 pb-4 border-b border-gray-700/50">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                      {category.emoji}
                    </div>
                    <div className="text-center">
                      <h4 className="text-3xl font-black text-white">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-400 font-medium">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {categoryLinks.map((link) => (
                      <LinkCard key={link.title} {...link} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-12 py-12 border-t border-gray-700/50 bg-gray-900/50">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400 text-sm mb-2">
              Curado com ❤️ para a comunidade portuguesa de padel
            </p>
            <p className="text-gray-500 text-xs">
              © 2026 Padel Guide · Todos os direitos reservados
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
