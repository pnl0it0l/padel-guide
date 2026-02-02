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
