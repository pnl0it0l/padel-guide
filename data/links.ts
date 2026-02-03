export interface Link {
  title: string;
  url: string;
  description: string;
  category:
    | "fpp"
    | "reservas"
    | "treino"
    | "mix"
    | "ferramentas"
    | "comunidade";
  tags: string[];
  opinion?: {
    type: "recommended" | "caution" | "free" | "paid";
    note: string;
  };
  featured?: boolean;
  image?: string;
}

export const links: Link[] = [
  // Featured / Destaques
  {
    title: "Playtomic",
    url: "https://playtomic.io",
    description:
      "Reserva courts, encontra parceiros de jogo e acompanha o teu ranking.",
    category: "reservas",
    tags: ["app", "reservas", "ranking"],
    opinion: {
      type: "free",
      note: "A app mais usada em Portugal",
    },
    featured: true,
    image:
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "World Padel Tour",
    url: "https://www.worldpadeltour.com",
    description:
      "Assiste aos melhores jogadores do mundo. Transmissões ao vivo e replays.",
    category: "comunidade",
    tags: ["profissional", "streaming", "competições"],
    opinion: {
      type: "free",
      note: "Inspiração e técnica ao mais alto nível",
    },
    featured: true,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
  },

  // Treino
  {
    title: "The Padel School",
    url: "https://www.youtube.com/@ThePadelSchool",
    description:
      "Canal de YouTube com tutoriais de técnica, táctica e drills. Conteúdo gratuito e de qualidade.",
    category: "treino",
    tags: ["YouTube", "técnica", "grátis", "tutoriais"],
    opinion: {
      type: "free",
      note: "Excelente para aprender fundamentos",
    },
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=800&auto=format&fit=crop",
  },

  // Mix
  {
    title: "Robot Padel",
    url: "https://robotpadel.pt/",
    description:
      "Plataforma para criar e gerir grupos privados de torneios. Organiza competições personalizadas com os teus amigos.",
    category: "mix",
    tags: ["torneios", "grupos", "organização", "Portugal"],
    opinion: {
      type: "free",
      note: "Perfeito para grupos e torneios privados",
    },
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Smash4Fun",
    url: "https://smash4fun.pt/",
    description:
      "Comunidade portuguesa de padel. Torneios, eventos sociais e networking entre jogadores.",
    category: "mix",
    tags: ["comunidade", "eventos", "torneios", "Portugal"],
    opinion: {
      type: "free",
      note: "Comunidade dinâmica com eventos regulares",
    },
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop",
  },

  // Comunidade
  {
    title: "Padel Portugal (Facebook)",
    url: "https://facebook.com/groups/padelportugal",
    description:
      "Grupo no Facebook com mais de 15k membros. Dicas, vendas e procura de parceiros.",
    category: "comunidade",
    tags: ["Facebook", "comunidade", "Portugal"],
    opinion: {
      type: "free",
      note: "Comunidade activa e prestável",
    },
  },
  {
    title: "r/padel (Reddit)",
    url: "https://reddit.com/r/padel",
    description:
      "Subreddit internacional sobre padel. Discussões, gear reviews e highlights.",
    category: "comunidade",
    tags: ["Reddit", "internacional", "inglês"],
    opinion: {
      type: "free",
      note: "Boa fonte de reviews e conselhos",
    },
  },
  {
    title: "Federação Portuguesa de Padel",
    url: "https://fppadel.pt",
    description:
      "Site oficial da FPP. Calendário de torneios oficiais e rankings nacionais.",
    category: "comunidade",
    tags: ["oficial", "torneios", "rankings"],
    opinion: {
      type: "free",
      note: "Essencial para competição federada",
    },
  },
  {
    title: "Padel FIP - Notícias",
    url: "https://www.padelfip.com/news/",
    description:
      "Notícias oficiais da Federação Internacional de Padel. Acompanha torneios profissionais e novidades do circuito mundial.",
    category: "comunidade",
    tags: ["notícias", "profissional", "internacional", "FIP"],
    opinion: {
      type: "free",
      note: "Fonte oficial de notícias do padel mundial",
    },
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "World Padel Tour - News",
    url: "https://www.worldpadeltour.com/noticias",
    description:
      "Últimas notícias do circuito profissional. Resultados, entrevistas e bastidores do WPT.",
    category: "comunidade",
    tags: ["notícias", "WPT", "profissional", "circuito"],
    opinion: {
      type: "free",
      note: "Cobertura completa do circuito pro",
    },
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop",
  },
  // FPP - Federação Portuguesa de Padel
  {
    title: "Rankings Absolutos Portugal",
    url: "https://tour.tiesports.com/fpp/weekly_rankings?rank=absolutos",
    description:
      "Rankings semanais oficiais dos melhores jogadores de padel em Portugal. Acompanha a tua posição e evolução.",
    category: "fpp",
    tags: ["rankings", "oficial", "competição", "Portugal"],
    opinion: {
      type: "free",
      note: "Rankings oficiais actualizados semanalmente",
    },
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Calendário de Torneios FPP",
    url: "https://tour.tiesports.com/fpp/calendar_(tournaments)",
    description:
      "Calendário oficial de todos os torneios federados em Portugal. Consulta datas, locais e inscrições.",
    category: "fpp",
    tags: ["torneios", "oficial", "calendário", "FPP"],
    opinion: {
      type: "free",
      note: "Agenda completa de competições",
    },
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop",
  },
];

export const categories = [
  {
    id: "fpp",
    name: "FPP",
    description: "Federação Portuguesa de Padel",
    emoji: "🏆",
  },
  {
    id: "reservas",
    name: "Reservas",
    description: "Apps para reservar courts",
    emoji: "📅",
  },
  {
    id: "treino",
    name: "Treino",
    description: "Aulas, cursos, YouTube e treinadores",
    emoji: "💪",
  },
  {
    id: "mix",
    name: "Mix",
    description: "Torneios e eventos organizados",
    emoji: "🎯",
  },
  {
    id: "ferramentas",
    name: "Ferramentas",
    description: "Apps, reservas e análise de jogo",
    emoji: "📱",
  },
  {
    id: "comunidade",
    name: "Comunidade",
    description: "Grupos, fóruns e redes sociais",
    emoji: "👥",
  },
];
