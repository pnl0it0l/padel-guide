import { NextResponse } from "next/server";
import type {
  MatchScorerTournamentDetail,
  MatchScorerMatch,
} from "@/types/premier-padel";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 1 minute (since matches change frequently)

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("t") || "tol"; // Default to men's tournament

    // Fetch the tournament dashboard page
    const response = await fetch(
      `https://widget.matchscorerlive.com/dashboard/${id}?t=${type}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tournament: ${response.status}`);
    }

    const html = await response.text();

    // Extract tournament information
    const nameMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const name = nameMatch ? nameMatch[1].trim() : id.replace(/-/g, " ");

    const locationMatch = html.match(
      /<[^>]*class="[^"]*location[^"]*"[^>]*>(.*?)<\//i,
    );
    const location = locationMatch ? locationMatch[1].trim() : "Unknown";

    const datesMatch = html.match(
      /<[^>]*class="[^"]*dates[^"]*"[^>]*>(.*?)<\//i,
    );
    const dates = datesMatch ? datesMatch[1].trim() : "TBD";

    const category: "MEN" | "WOMEN" | "MIXED" =
      type === "tol" ? "MEN" : type === "wom" ? "WOMEN" : "MIXED";

    // Parse matches from the HTML
    const matches: MatchScorerMatch[] = [];
    const matchesByDay: Record<string, MatchScorerMatch[]> = {};
    const liveMatches: MatchScorerMatch[] = [];
    const availableDates: string[] = [];

    // Extract match data (this is a simplified parser - you'll need to adjust based on actual HTML structure)
    const matchRegex =
      /<div[^>]*class="[^"]*match[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    const matchElements = html.matchAll(matchRegex);

    let matchCounter = 0;
    for (const matchElement of matchElements) {
      matchCounter++;
      const matchHtml = matchElement[1];

      // Extract match information
      const roundMatch = matchHtml.match(
        /<[^>]*class="[^"]*round[^"]*"[^>]*>(.*?)<\//i,
      );
      const round = roundMatch ? roundMatch[1].trim() : "Round Unknown";

      const courtMatch = matchHtml.match(
        /<[^>]*class="[^"]*court[^"]*"[^>]*>(.*?)<\//i,
      );
      const court = courtMatch ? courtMatch[1].trim() : "Court TBD";

      // Check if match is live
      const isLive = matchHtml.toLowerCase().includes("live");
      const isCompleted = matchHtml.toLowerCase().includes("completed");
      const status: "LIVE" | "COMPLETED" | "SCHEDULED" = isLive
        ? "LIVE"
        : isCompleted
          ? "COMPLETED"
          : "SCHEDULED";

      // Extract time and date
      const timeMatch = matchHtml.match(/(\d{1,2}:\d{2})/);
      const startTime = timeMatch ? timeMatch[1] : undefined;

      const dateMatch = matchHtml.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch
        ? dateMatch[1]
        : new Date().toISOString().split("T")[0];

      // Extract teams and players
      const team1Match = matchHtml.match(
        /<[^>]*class="[^"]*team1[^"]*"[^>]*>(.*?)<\//i,
      );
      const team2Match = matchHtml.match(
        /<[^>]*class="[^"]*team2[^"]*"[^>]*>(.*?)<\//i,
      );

      const match: MatchScorerMatch = {
        id: `${id}-match-${matchCounter}`,
        round,
        court,
        status,
        startTime,
        date,
        team1: {
          player1: team1Match ? team1Match[1].trim() : "Player 1",
        },
        team2: {
          player1: team2Match ? team2Match[1].trim() : "Player 2",
        },
      };

      matches.push(match);

      // Add to appropriate collections
      if (status === "LIVE") {
        liveMatches.push(match);
      }

      if (!matchesByDay[date]) {
        matchesByDay[date] = [];
        availableDates.push(date);
      }
      matchesByDay[date].push(match);
    }

    // If no matches found, return mock data
    if (matches.length === 0) {
      const today = new Date().toISOString().split("T")[0];
      const mockMatches: MatchScorerMatch[] = [
        {
          id: `${id}-match-1`,
          round: "Round of 16",
          court: "Central Court",
          status: "LIVE",
          startTime: "14:00",
          date: today,
          team1: {
            player1: "Player A",
            player2: "Player B",
            flag1: "🇪🇸",
            flag2: "🇪🇸",
          },
          team2: {
            player1: "Player C",
            player2: "Player D",
            flag1: "🇦🇷",
            flag2: "🇦🇷",
          },
          score: {
            set1Team1: 6,
            set1Team2: 4,
            set2Team1: 3,
            set2Team2: 2,
          },
          currentGameScore: {
            team1: "40",
            team2: "30",
          },
        },
        {
          id: `${id}-match-2`,
          round: "Quarter Final",
          court: "Court 2",
          status: "SCHEDULED",
          startTime: "16:00",
          date: today,
          team1: {
            player1: "Player E",
            player2: "Player F",
            flag1: "🇫🇷",
            flag2: "🇮🇹",
          },
          team2: {
            player1: "Player G",
            player2: "Player H",
            flag1: "🇵🇹",
            flag2: "🇧🇷",
          },
        },
      ];

      return NextResponse.json({
        id,
        name,
        location,
        dates,
        category,
        status: "LIVE",
        availableDates: [today],
        liveMatches: [mockMatches[0]],
        matchesByDay: {
          [today]: mockMatches,
        },
      } as MatchScorerTournamentDetail);
    }

    const tournamentStatus: "UPCOMING" | "LIVE" | "COMPLETED" =
      liveMatches.length > 0
        ? "LIVE"
        : matches.every((m) => m.status === "COMPLETED")
          ? "COMPLETED"
          : "UPCOMING";

    return NextResponse.json({
      id,
      name,
      location,
      dates,
      category,
      status: tournamentStatus,
      availableDates: availableDates.sort(),
      liveMatches,
      matchesByDay,
    } as MatchScorerTournamentDetail);
  } catch (error) {
    console.error("Error fetching tournament details:", error);

    // Return mock data on error
    const { id } = await context.params;
    const today = new Date().toISOString().split("T")[0];

    return NextResponse.json({
      id,
      name: "Tournament Details Unavailable",
      location: "Unknown",
      dates: "TBD",
      category: "MEN",
      status: "LIVE",
      availableDates: [today],
      liveMatches: [],
      matchesByDay: { [today]: [] },
    } as MatchScorerTournamentDetail);
  }
}
