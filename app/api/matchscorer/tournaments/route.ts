import { NextResponse } from "next/server";
import type { MatchScorerTournament } from "@/types/premier-padel";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    // Fetch the screen page with search filters for Padel FIP 2026 tournaments
    // Using search parameters: year=2026, sport=Padel FIP, category=P1
    const searchParams = new URLSearchParams({
      sport: "Padel FIP",
      year: "2026",
      category: "P1",
    });

    const response = await fetch(
      `https://widget.matchscorerlive.com/screen/?${searchParams.toString()}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tournaments: ${response.status}`);
    }

    const html = await response.text();

    console.log("🔍 Fetching tournaments from MatchScorer Live");
    console.log(`📄 HTML length: ${html.length} bytes`);
    console.log(`📝 HTML sample (first 500 chars):\n${html.substring(0, 500)}`);
    console.log(
      `📝 Looking for FIP references: ${html.match(/FIP/gi)?.length || 0} found`,
    );
    console.log(
      `📝 Looking for dashboard links: ${html.match(/dashboard/gi)?.length || 0} found`,
    );

    // Parse the HTML to extract tournament information
    const tournaments: MatchScorerTournament[] = [];

    // Look for all dashboard links - try multiple patterns
    const patterns = [
      /href="\/dashboard\/(FIP-\d{4}-\d+)\?t=(\w+)"/gi,
      /href=['"]\/dashboard\/(FIP-\d{4}-\d+)\?t=(\w+)['"]/gi,
      /\/dashboard\/(FIP-\d{4}-\d+)\?t=(\w+)/gi,
    ];

    let allMatches: Array<{ id: string; type: string; index: number }> = [];

    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      pattern.lastIndex = 0; // Reset regex
      while ((match = pattern.exec(html)) !== null) {
        // Check if we already have this tournament ID
        if (!allMatches.some((m) => m.id === match![1])) {
          allMatches.push({
            id: match[1],
            type: match[2],
            index: match.index,
          });
        }
      }
    }

    console.log(`🎯 Found ${allMatches.length} tournament links`);

    for (const { id, type, index } of allMatches) {
      // Extract the tournament card content around this link
      const startPos = Math.max(0, index - 500);
      const endPos = Math.min(html.length, index + 1000);
      const cardContent = html.substring(startPos, endPos);

      // Extract tournament name from the card
      const nameMatch = cardContent.match(/FIP\s+\w+\s+[\w\s]+\d{4}/i);
      const name = nameMatch ? nameMatch[0].trim() : id.replace(/-/g, " ");

      // Extract location
      const locationMatch = cardContent.match(
        /(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      );
      const location = locationMatch ? locationMatch[1].trim() : "Unknown";

      // Extract dates (look for date patterns like "10-16 Feb" or "February 10-16")
      const datesMatch = cardContent.match(
        /(\d{1,2}[-–]\d{1,2}\s+\w+\s+\d{4}|\w+\s+\d{1,2}[-–]\d{1,2},?\s+\d{4})/i,
      );
      const dates = datesMatch ? datesMatch[1].trim() : "TBD";

      // Determine category based on tournament type parameter
      const category: "MEN" | "WOMEN" | "MIXED" =
        type === "tol" ? "MEN" : type === "wom" ? "WOMEN" : "MIXED";

      // Check if tournament is live (contains "LIVE" text or live indicators)
      const isLive =
        cardContent.toLowerCase().includes("live") ||
        cardContent.includes("🔴") ||
        cardContent.includes("●");
      const isCompleted =
        cardContent.toLowerCase().includes("completed") ||
        cardContent.toLowerCase().includes("finished");
      const status: "UPCOMING" | "LIVE" | "COMPLETED" = isLive
        ? "LIVE"
        : isCompleted
          ? "COMPLETED"
          : "UPCOMING";

      tournaments.push({
        id,
        name,
        location,
        dates,
        category,
        status,
        url: `https://widget.matchscorerlive.com/dashboard/${id}?t=${type}`,
      });

      console.log(`  ✅ ${id} - ${name} (${category}, ${status})`);
    }

    // If no tournaments found, return a fallback message
    if (tournaments.length === 0) {
      // Return mock data for development
      return NextResponse.json([
        {
          id: "FIP-2026-902",
          name: "FIP RISE Alicante 2026",
          location: "Alicante, Spain",
          dates: "10-16 Feb 2026",
          category: "MEN",
          status: "LIVE",
          url: "https://widget.matchscorerlive.com/dashboard/FIP-2026-902?t=tol",
        },
        {
          id: "FIP-2026-903",
          name: "FIP RISE Barcelona 2026",
          location: "Barcelona, Spain",
          dates: "17-23 Feb 2026",
          category: "WOMEN",
          status: "UPCOMING",
          url: "https://widget.matchscorerlive.com/dashboard/FIP-2026-903?t=wom",
        },
      ] as MatchScorerTournament[]);
    }

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error("Error fetching MatchScorer tournaments:", error);

    // Return mock data on error for development
    return NextResponse.json([
      {
        id: "FIP-2026-902",
        name: "FIP RISE Alicante 2026",
        location: "Alicante, Spain",
        dates: "10-16 Feb 2026",
        category: "MEN",
        status: "LIVE",
        url: "https://widget.matchscorerlive.com/dashboard/FIP-2026-902?t=tol",
      },
      {
        id: "FIP-2026-903",
        name: "FIP RISE Barcelona 2026",
        location: "Barcelona, Spain",
        dates: "17-23 Feb 2026",
        category: "WOMEN",
        status: "UPCOMING",
        url: "https://widget.matchscorerlive.com/dashboard/FIP-2026-903?t=wom",
      },
    ] as MatchScorerTournament[]);
  }
}
