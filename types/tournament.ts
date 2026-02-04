// Re-export Prisma types for use throughout the app
export type {
  Tournament,
  Player,
  Team,
  Round,
  Game,
  TournamentStatus,
  RoundStatus,
  GameStatus,
} from "@prisma/client";

// Extended types with relations for API responses
export interface PlayerWithRelations {
  id: string;
  name: string;
  tournamentId: string;
  teamId: string | null;
}

export interface TeamWithRelations {
  id: string;
  tournamentId: string;
  player1Name: string;
  player2Name: string;
  teamName: string | null;
  position: number;
  players?: PlayerWithRelations[];
}

export interface GameWithRelations {
  id: string;
  roundId: string;
  tournamentId: string;
  team1Id: string;
  team2Id: string;
  court: number;
  team1Points: number;
  team2Points: number;
  winnerId: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  startTime: Date | null;
  endTime: Date | null;
  team1: TeamWithRelations;
  team2: TeamWithRelations;
  winner?: TeamWithRelations | null;
}

export interface RoundWithGames {
  id: string;
  tournamentId: string;
  roundNumber: number;
  startTime: Date | null;
  endTime: Date | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  games: GameWithRelations[];
}

export interface TournamentWithRelations {
  id: string;
  name: string;
  date: Date;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  courtsAvailable: number;
  gameDuration: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  teams: TeamWithRelations[];
  players: PlayerWithRelations[];
  rounds: RoundWithGames[];
  games?: GameWithRelations[];
}

// Input types for API requests
export interface CreateTournamentInput {
  name: string;
  date: string; // ISO date string
  courtsAvailable: number;
  numberOfGames?: number; // Optional max number of games to generate
  playerNames?: string[]; // For auto-pairing mode
  teams?: Array<{
    // For manual pairing mode
    player1Name: string;
    player2Name: string;
    teamName?: string;
  }>;
}

export interface UpdateGameInput {
  gameId: string;
  team1Points: number;
  team2Points: number;
  winnerId?: string | null; // Can be null for draw
}

// Standings calculation types
export interface TeamStanding {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDiff: number;
  totalPoints: number;
}
