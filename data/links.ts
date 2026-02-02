export interface Link {
  title: string;
  url: string;
  description: string;
  category: "equipamento" | "treino" | "ferramentas" | "comunidade";
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
    category: "ferramentas",
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
    title: "Padel Point",
    url: "https://padelpoint.pt",
    description:
      "Loja online com raquetes, bolas e acessórios. Entregas rápidas em Portugal.",
    category: "equipamento",
    tags: ["loja", "raquetes", "Portugal"],
    opinion: {
      type: "recommended",
      note: "Boa variedade e preços competitivos",
    },
    featured: true,
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop",
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
  {
    title: "Padel Academy",
    url: "#",
    description:
      "Aulas de grupo e privadas com treinadores certificados em Lisboa.",
    category: "treino",
    tags: ["aulas", "Lisboa", "iniciantes"],
    opinion: {
      type: "recommended",
      note: "Óptimo para começar do zero",
    },
    featured: true,
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop",
  },

  // Equipamento
  {
    title: "Decathlon Padel",
    url: "https://www.decathlon.pt/padel",
    description:
      "Raquetes entry-level e equipamento básico. Preços acessíveis para iniciantes.",
    category: "equipamento",
    tags: ["loja", "iniciantes", "acessível"],
    opinion: {
      type: "recommended",
      note: "Boa opção para quem está a começar",
    },
  },
  {
    title: "Nox Padel",
    url: "https://noxpadel.com",
    description:
      "Marca espanhola de referência. Raquetes de alta qualidade e design moderno.",
    category: "equipamento",
    tags: ["raquetes", "premium", "Espanha"],
    opinion: {
      type: "paid",
      note: "Qualidade profissional, preço alto",
    },
  },
  {
    title: "Bullpadel",
    url: "https://bullpadel.com",
    description:
      "Sponsor oficial de vários jogadores pro. Grande variedade de modelos.",
    category: "equipamento",
    tags: ["raquetes", "profissional", "roupa"],
    opinion: {
      type: "recommended",
      note: "Marca de confiança, várias gamas de preço",
    },
  },

  // Treino
  {
    title: "Padel Academy Porto",
    url: "#",
    description:
      "Centro de treino no Porto com courts indoor e outdoor. Aulas para todos os níveis.",
    category: "treino",
    tags: ["aulas", "Porto", "indoor"],
    opinion: {
      type: "recommended",
      note: "Instalações top, bons treinadores",
    },
  },
  {
    title: "Padelonomics (YouTube)",
    url: "https://youtube.com/@padelonomics",
    description:
      "Canal com análise táctica, técnica e mental. Conteúdo em inglês e espanhol.",
    category: "treino",
    tags: ["YouTube", "táctica", "grátis"],
    opinion: {
      type: "free",
      note: "Melhor canal para aprender estratégia",
    },
  },
  {
    title: "Sanyo Gutiérrez Academy",
    url: "https://sanyogutierrez.com",
    description:
      "Cursos online do Sanyo. Técnica, táctica e treino físico específico para padel.",
    category: "treino",
    tags: ["online", "profissional", "pago"],
    opinion: {
      type: "paid",
      note: "Conteúdo premium, vale o investimento",
    },
  },

  // Ferramentas
  {
    title: "Padel Manager",
    url: "#",
    description:
      "App para gerir torneios amadores. Criar brackets, seguir resultados em tempo real.",
    category: "ferramentas",
    tags: ["app", "torneios", "resultados"],
    opinion: {
      type: "free",
      note: "Essencial para organizar torneios",
    },
  },
  {
    title: "My Padel Stats",
    url: "#",
    description:
      "Regista os teus jogos, acompanha estatísticas e evolução ao longo do tempo.",
    category: "ferramentas",
    tags: ["stats", "tracking", "análise"],
    opinion: {
      type: "free",
      note: "Útil para jogadores sérios",
    },
  },
  {
    title: "Robot Padel",
    url: "https://robotpadel.pt/",
    description:
      "Plataforma para criar e gerir grupos privados de torneios. Organiza competições personalizadas com os teus amigos.",
    category: "ferramentas",
    tags: ["torneios", "grupos", "organização", "Portugal"],
    opinion: {
      type: "free",
      note: "Perfeito para grupos e torneios privados",
    },
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
  },

  // Comunidade
  {
    title: "Smash4Fun",
    url: "https://smash4fun.pt/",
    description:
      "Comunidade portuguesa de padel. Torneios, eventos sociais e networking entre jogadores.",
    category: "comunidade",
    tags: ["comunidade", "eventos", "torneios", "Portugal"],
    opinion: {
      type: "free",
      note: "Comunidade dinâmica com eventos regulares",
    },
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop",
  },
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
  {
    title: "Rankings Absolutos Portugal",
    url: "https://tour.tiesports.com/fpp/weekly_rankings?rank=absolutos",
    description:
      "Rankings semanais oficiais dos melhores jogadores de padel em Portugal. Acompanha a tua posição e evolução.",
    category: "comunidade",
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
    category: "comunidade",
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
    id: "equipamento",
    name: "Equipamento",
    description: "Raquetes, bolas, roupa e acessórios",
    emoji: "🎾",
  },
  {
    id: "treino",
    name: "Treino",
    description: "Aulas, cursos, YouTube e treinadores",
    emoji: "💪",
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
