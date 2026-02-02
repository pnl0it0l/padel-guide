import LinkCard from "@/components/LinkCard";
import { links, categories } from "@/data/links";

export default function Home() {
  const featuredLinks = links.filter((link) => link.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎾</span>
            <h1 className="text-xl font-bold text-gray-900">Padel Guide</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              href="#equipamento"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Equipamento
            </a>
            <a
              href="#treino"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Treino
            </a>
            <a
              href="#ferramentas"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Ferramentas
            </a>
            <a
              href="#comunidade"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Comunidade
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            O teu guia de padel em Portugal
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Links úteis, curados e organizados num só lugar. Equipamento,
            treino, apps e comunidade.
          </p>
        </div>
      </section>

      {/* Featured Links */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Começa aqui</h3>
          <span className="text-sm text-gray-500">→ Os essenciais</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredLinks.map((link) => (
            <LinkCard key={link.title} {...link} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          Explora por categoria
        </h3>

        {categories.map((category) => {
          const categoryLinks = links.filter(
            (link) => link.category === category.id && !link.featured,
          );

          return (
            <div key={category.id} id={category.id} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.emoji}</span>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryLinks.map((link) => (
                  <LinkCard key={link.title} {...link} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Conheces um recurso fixe?
          </h3>
          <p className="text-gray-600 mb-6">
            Partilha connosco e ajuda a comunidade a crescer
          </p>
          <a
            href="mailto:hello@padelguide.pt"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg 
                       hover:bg-blue-700 transition-colors"
          >
            Sugere um link
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            Padel Guide · Curado com ❤️ para a comunidade portuguesa de padel
          </p>
        </div>
      </footer>
    </div>
  );
}
