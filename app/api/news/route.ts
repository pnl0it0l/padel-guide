import { NextResponse } from "next/server";

export async function GET() {
  const news = [
    {
      title: "Padel FIP - Notícias Oficiais",
      link: "https://www.padelfip.com/news/",
      source: "Padel FIP",
      contentSnippet:
        "Todas as notícias oficiais da Federação Internacional de Padel. Torneios, rankings, e muito mais.",
    },
    {
      title: "World Padel Tour - Últimas Notícias",
      link: "https://www.worldpadeltour.com/noticias",
      source: "WPT",
      contentSnippet:
        "Notícias do circuito profissional de padel mais importante do mundo. Resultados e highlights.",
    },
    {
      title: "A1 Pádel - Notícias Portugal",
      link: "https://a1padel.pt/noticias/",
      source: "A1 Pádel",
      contentSnippet:
        "Notícias de padel em Portugal. Torneios nacionais, clubes e comunidade portuguesa.",
    },
    {
      title: "Premier Padel - Tour Oficial",
      link: "https://premierpadel.com/news",
      source: "Premier Padel",
      contentSnippet:
        "O novo circuito oficial de padel profissional. Acompanha os melhores jogadores do mundo.",
    },
    {
      title: "Padel Portugal - Blog",
      link: "https://padelportugal.com/blog/",
      source: "Padel Portugal",
      contentSnippet:
        "Blog português sobre padel com dicas, análises e novidades do mundo do padel.",
    },
    {
      title: "FPP - Federação Portuguesa",
      link: "https://fpp.pt/noticias",
      source: "FPP",
      contentSnippet:
        "Notícias oficiais da Federação Portuguesa de Padel. Competições nacionais e seleções.",
    },
  ];

  return NextResponse.json({ news });
}
