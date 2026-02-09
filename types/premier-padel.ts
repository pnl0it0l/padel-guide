export interface PremierPadelMatch {
  id: string;
  tournament: string;
  category: "MEN" | "WOMEN";
  round: string;
  court: string;
  status: "LIVE" | "COMPLETED" | "SCHEDULED";
  startTime?: string;
  team1: {
    player1: string;
    player2?: string;
    flag1: string;
    flag2?: string;
  };
  team2: {
    player1: string;
    player2?: string;
    flag1: string;
    flag2?: string;
  };
  score?: {
    set1Team1?: number;
    set1Team2?: number;
    set2Team1?: number;
    set2Team2?: number;
    set3Team1?: number;
    set3Team2?: number;
  };
}

export interface PremierPadelData {
  tournament: {
    name: string;
    dates: string;
    location: string;
  };
  liveMatches: PremierPadelMatch[];
  recentResults: PremierPadelMatch[];
  upcomingMatches: PremierPadelMatch[];
}
