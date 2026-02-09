import { NextResponse } from "next/server";
import type { PremierPadelData } from "@/types/premier-padel";

// Dados mockados baseados no site real do Premier Padel
// Em produção, isso poderia fazer scraping ou usar uma API oficial
export async function GET() {
  const data: PremierPadelData = {
    tournament: {
      name: "RIYADH SEASON P1",
      dates: "07-14 February",
      location: "🇸🇦 Riyadh, Saudi Arabia",
    },
    liveMatches: [
      {
        id: "live-1",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "CENTER COURT",
        status: "LIVE",
        startTime: "LIVE NOW",
        team1: {
          player1: "DEUS",
          player2: "LEYGUE",
          flag1: "🇵🇹",
          flag2: "🇫🇷",
        },
        team2: {
          player1: "GOENAGA",
          player2: "GOÑI LACABE",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        score: {
          set1Team1: 6,
          set1Team2: 4,
          set2Team1: 3,
          set2Team2: 2,
        },
      },
      {
        id: "live-2",
        tournament: "RIYADH SEASON P1",
        category: "WOMEN",
        round: "R32",
        court: "COURT 1",
        status: "LIVE",
        startTime: "LIVE NOW",
        team1: {
          player1: "CASTELLO",
          player2: "RUFO ORTIZ",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        team2: {
          player1: "ORTEGA",
          player2: "CALVO SANTAMARIA",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        score: {
          set1Team1: 5,
          set1Team2: 3,
        },
      },
    ],
    recentResults: [
      {
        id: "result-1",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "Q2",
        court: "COURT 2",
        status: "COMPLETED",
        team1: {
          player1: "MENDEZ",
          player2: "CHIOSTRI",
          flag1: "🇪🇸",
          flag2: "🇦🇷",
        },
        team2: {
          player1: "DORTA DIAZ",
          player2: "CASTRO GARCIA",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        score: {
          set1Team1: 6,
          set1Team2: 7,
          set2Team1: 7,
          set2Team2: 6,
          set3Team1: 6,
          set3Team2: 2,
        },
      },
      {
        id: "result-2",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "Q2",
        court: "COURT 1",
        status: "COMPLETED",
        team1: {
          player1: "MARTINEZ",
          player2: "VALENZUELA",
          flag1: "🇪🇸",
          flag2: "🇦🇷",
        },
        team2: {
          player1: "GONZALEZ BLANCO",
          player2: "MENA",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        score: {
          set1Team1: 7,
          set1Team2: 6,
          set2Team1: 6,
          set2Team2: 7,
          set3Team1: 7,
          set3Team2: 6,
        },
      },
      {
        id: "result-3",
        tournament: "RIYADH SEASON P1",
        category: "WOMEN",
        round: "Q2",
        court: "CENTER COURT",
        status: "COMPLETED",
        team1: {
          player1: "TALAVAN",
          player2: "SAIZ VALLEJO",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        team2: {
          player1: "VARO RAMOS",
          player2: "PARMIGIANI",
          flag1: "🇪🇸",
          flag2: "🇮🇹",
        },
        score: {
          set1Team1: 6,
          set1Team2: 3,
          set2Team1: 6,
          set2Team2: 2,
        },
      },
    ],
    upcomingMatches: [
      {
        id: "upcoming-1",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 2",
        status: "SCHEDULED",
        startTime: "FOLLOWED BY",
        team1: {
          player1: "RUBIO",
          player2: "RUIZ",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        team2: {
          player1: "ARCE SIMO",
          player2: "LIJO",
          flag1: "🇦🇷",
          flag2: "🇪🇸",
        },
      },
      {
        id: "upcoming-2",
        tournament: "RIYADH SEASON P1",
        category: "WOMEN",
        round: "R32",
        court: "CENTER COURT",
        status: "SCHEDULED",
        startTime: "NOT BEFORE 7:00 PM",
        team1: {
          player1: "KHALIL FAREH",
          player2: "YAMANI",
          flag1: "🇸🇦",
          flag2: "🇸🇦",
        },
        team2: {
          player1: "MARCHETTI",
          player2: "GODALLIER",
          flag1: "🇮🇹",
          flag2: "🇫🇷",
        },
      },
    ],
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
