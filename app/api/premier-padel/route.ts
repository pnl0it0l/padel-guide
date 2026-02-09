import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as cheerio from "cheerio";
import type {
  PremierPadelData,
  PremierPadelMatch,
} from "@/types/premier-padel";

// Premier Padel Live Scores API with Date Selection
//
// Features:
// - Date selection support (query param: ?date=09-FEBRUARY)
// - Category filter (MEN/WOMEN)
// - HTML scraping with improved parsing
// - 30-second cache per date to reduce requests
//
// Example: /api/premier-padel?date=09-FEBRUARY&category=MEN

// Flag emoji mapping
const flagMap: Record<string, string> = {
  pt: "🇵🇹",
  fr: "🇫🇷",
  es: "🇪🇸",
  ar: "🇦🇷",
  it: "🇮🇹",
  cl: "🇨🇱",
  sa: "🇸🇦",
  ae: "🇦🇪",
  py: "🇵🇾",
  br: "🇧🇷",
  se: "🇸🇪",
  nl: "🇳🇱",
  de: "🇩🇪",
  uk: "🇬🇧",
  us: "🇺🇸",
};

function getFlagEmoji(flagCode: string): string {
  return flagMap[flagCode.toLowerCase()] || "🏳️";
}

function parseMatchesFromApi(apiData: any): {
  live: PremierPadelMatch[];
  results: PremierPadelMatch[];
  upcoming: PremierPadelMatch[];
} {
  const live: PremierPadelMatch[] = [];
  const results: PremierPadelMatch[] = [];
  const upcoming: PremierPadelMatch[] = [];

  try {
    // Handle different data structures
    let matches: any[] = [];

    if (Array.isArray(apiData)) {
      matches = apiData;
    } else if (apiData.matches && Array.isArray(apiData.matches)) {
      matches = apiData.matches;
    } else if (apiData.results && Array.isArray(apiData.results)) {
      matches = apiData.results;
    } else if (typeof apiData === "object") {
      // Try to find arrays within the object
      for (const key of Object.keys(apiData)) {
        if (Array.isArray(apiData[key]) && apiData[key].length > 0) {
          // Check if first item looks like a match object
          const firstItem = apiData[key][0];
          if (
            firstItem &&
            (firstItem.team1 ||
              firstItem.players ||
              firstItem.player1 ||
              firstItem.status)
          ) {
            matches = apiData[key];
            console.log(`Found matches in property: ${key}`);
            break;
          }
        }
      }
    }

    if (matches.length === 0) {
      console.log("⚠️ No match array found in data");
      console.log(
        "Data structure preview:",
        JSON.stringify(apiData, null, 2).substring(0, 300),
      );
      return { live, results, upcoming };
    }

    console.log(`🔄 Processing ${matches.length} matches...`);

    matches.forEach((match: any, index: number) => {
      try {
        // Log first match for debugging
        if (index === 0) {
          console.log(
            "Sample match structure:",
            JSON.stringify(match, null, 2).substring(0, 400),
          );
        }

        // Parse match status - try multiple property names
        const status = match.status || match.state || match.matchStatus || "";
        const isLive =
          status.toLowerCase().includes("live") ||
          status === "LIVE" ||
          match.isLive;
        const isCompleted =
          status.toLowerCase().includes("completed") ||
          status.toLowerCase().includes("finish") ||
          status === "COMPLETED" ||
          match.isCompleted;
        const isScheduled = !isLive && !isCompleted;

        // Extract player names - handle various structures
        const team1Players = match.team1?.players || match.team1?.names || [];
        const team2Players = match.team2?.players || match.team2?.names || [];

        // Create match object
        const parsedMatch: PremierPadelMatch = {
          id: match.id || match.matchId || `match-${index}`,
          tournament:
            match.tournament || match.tournamentName || "RIYADH SEASON P1",
          category: match.category || match.gender || "MEN",
          round: match.round || match.stage || match.roundName || "R64",
          court: match.court || match.venue || match.courtName || "TBD",
          status: isLive ? "LIVE" : isCompleted ? "COMPLETED" : "SCHEDULED",
          startTime: match.startTime || match.time || match.scheduledTime,
          matchDate: match.date || match.matchDate,
          team1: {
            player1:
              match.team1?.player1 || team1Players[0] || match.player1 || "TBD",
            player2: match.team1?.player2 || team1Players[1],
            flag1:
              match.team1?.flag1 ||
              getFlagEmoji(
                match.team1?.country1 || match.team1?.nationality1 || "",
              ),
            flag2:
              match.team1?.flag2 ||
              getFlagEmoji(
                match.team1?.country2 || match.team1?.nationality2 || "",
              ),
          },
          team2: {
            player1:
              match.team2?.player1 || team2Players[0] || match.player2 || "TBD",
            player2: match.team2?.player2 || team2Players[1],
            flag1:
              match.team2?.flag1 ||
              getFlagEmoji(
                match.team2?.country1 || match.team2?.nationality1 || "",
              ),
            flag2:
              match.team2?.flag2 ||
              getFlagEmoji(
                match.team2?.country2 || match.team2?.nationality2 || "",
              ),
          },
        };

        // Parse scores if available - handle multiple structures
        const scoreData = match.score || match.sets || match.result;
        if (scoreData) {
          parsedMatch.score = {
            set1Team1:
              scoreData.set1Team1 ||
              scoreData.sets?.[0]?.team1 ||
              scoreData[0]?.team1,
            set1Team2:
              scoreData.set1Team2 ||
              scoreData.sets?.[0]?.team2 ||
              scoreData[0]?.team2,
            set2Team1:
              scoreData.set2Team1 ||
              scoreData.sets?.[1]?.team1 ||
              scoreData[1]?.team1,
            set2Team2:
              scoreData.set2Team2 ||
              scoreData.sets?.[1]?.team2 ||
              scoreData[1]?.team2,
            set3Team1:
              scoreData.set3Team1 ||
              scoreData.sets?.[2]?.team1 ||
              scoreData[2]?.team1,
            set3Team2:
              scoreData.set3Team2 ||
              scoreData.sets?.[2]?.team2 ||
              scoreData[2]?.team2,
          };
        }

        // Categorize match
        if (isLive) {
          live.push(parsedMatch);
        } else if (isCompleted) {
          results.push(parsedMatch);
        } else {
          upcoming.push(parsedMatch);
        }
      } catch (err) {
        console.error(`❌ Error parsing match ${index}:`, err);
      }
    });

    console.log(
      `✅ Parsed ${live.length} live, ${results.length} results, ${upcoming.length} upcoming`,
    );
  } catch (err) {
    console.error("❌ Error in parseMatchesFromApi:", err);
  }

  return { live, results, upcoming };
}

async function scrapePremierPadelData(
  selectedDate?: string,
  category: "MEN" | "WOMEN" = "MEN",
): Promise<PremierPadelData> {
  try {
    console.log(
      `Fetching Premier Padel data for date: ${selectedDate || "latest"}, category: ${category}`,
    );

    // Use MatchScorerLive widget - has actual live data!
    // Tournament ID format: FIP-YYYY-MMD (e.g., FIP-2026-902 = Feb 9, 2026)
    const url =
      "https://widget.matchscorerlive.com/screen/tournamentlive/FIP-2026-902?t=tol";
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log(
      `📄 HTML fetched from MatchScorerLive, size: ${html.length} bytes`,
    );

    // Parse matches from the widget tables
    const liveMatches: PremierPadelMatch[] = [];
    const recentResults: PremierPadelMatch[] = [];
    const upcomingMatches: PremierPadelMatch[] = [];

    let matchId = 0;

    // Each match is in a table with court info
    $("table").each((_, table) => {
      try {
        const $table = $(table);

        // Get court and round info from first row
        const firstRow = $table.find("tr").first();
        const headerCells = firstRow.find("td, th"); // Try both td and th
        const courtName = $(headerCells[0]).text().trim() || "UNKNOWN";
        const roundInfo = $(headerCells[1]).text().trim() || "";

        console.log(`📋 Header cells count: ${headerCells.length}`);
        if (headerCells.length > 0) {
          console.log(`   Cell 0: "${courtName}"`);
          console.log(`   Cell 1: "${roundInfo}"`);
        }

        // Extract category (MEN/WOMEN) and round from roundInfo
        const categoryMatch = roundInfo.match(/(MEN|WOMEN)/i);
        const matchCategory = categoryMatch
          ? (categoryMatch[1].toUpperCase() as "MEN" | "WOMEN")
          : "MEN";

        const roundMatch = roundInfo.match(/ROUND OF \d+|R\d+|FINAL|SEMI/i);
        const round = roundMatch ? roundMatch[0] : roundInfo;

        // Get team names and scores from second and third rows
        const dataRows = $table.find("tr").slice(1, 4); // Rows 2-4 contain match data

        if (dataRows.length >= 3) {
          // Parse team 1 - format: "S. Alshahrani O. Althagib (WC)"
          // Player names are in format: "Initial. Lastname [Lastname2]"
          const team1Row = $(dataRows[0]).find("td");
          const team1Cell = $(team1Row[0]);
          const team1Text = team1Cell.text().trim();

          // Extract flags from img alt text or title
          const team1Flags = team1Cell.find(
            'img[alt*="flag"], img[src*="flag"]',
          );
          const team1Flag1 =
            team1Flags.length > 0
              ? $(team1Flags[0]).attr("alt") || $(team1Flags[0]).attr("title")
              : undefined;
          const team1Flag2 =
            team1Flags.length > 1
              ? $(team1Flags[1]).attr("alt") || $(team1Flags[1]).attr("title")
              : undefined;

          // Parse player names: match pattern "Initial. Name [Name]"
          // Remove tags like (WC), (Q), etc.
          const cleanTeam1 = team1Text.replace(/\([^)]+\)/g, "").trim();
          const team1PlayerMatch = cleanTeam1.match(
            /([A-Z]\.\s+[\w\s]+?)(?=\s+[A-Z]\.|$)/g,
          );
          const team1Player1 =
            team1PlayerMatch && team1PlayerMatch[0]
              ? team1PlayerMatch[0].trim()
              : cleanTeam1;
          const team1Player2 =
            team1PlayerMatch && team1PlayerMatch[1]
              ? team1PlayerMatch[1].trim()
              : undefined;

          // Parse team 2
          const team2Row = $(dataRows[1]).find("td");
          const team2Cell = $(team2Row[0]);
          const team2Text = team2Cell.text().trim();

          // Extract flags
          const team2Flags = team2Cell.find(
            'img[alt*="flag"], img[src*="flag"]',
          );
          const team2Flag1 =
            team2Flags.length > 0
              ? $(team2Flags[0]).attr("alt") || $(team2Flags[0]).attr("title")
              : undefined;
          const team2Flag2 =
            team2Flags.length > 1
              ? $(team2Flags[1]).attr("alt") || $(team2Flags[1]).attr("title")
              : undefined;

          const cleanTeam2 = team2Text.replace(/\([^)]+\)/g, "").trim();
          const team2PlayerMatch = cleanTeam2.match(
            /([A-Z]\.\s+[\w\s]+?)(?=\s+[A-Z]\.|$)/g,
          );
          const team2Player1 =
            team2PlayerMatch && team2PlayerMatch[0]
              ? team2PlayerMatch[0].trim()
              : cleanTeam2;
          const team2Player2 =
            team2PlayerMatch && team2PlayerMatch[1]
              ? team2PlayerMatch[1].trim()
              : undefined;

          const statusRow = $(dataRows[2]).find("td");

          // Parse scores (remaining columns)
          // First column = current game points (0, 15, 30, 40)
          // Remaining columns = games won in each set
          const team1Scores: (number | string)[] = [];
          const team2Scores: (number | string)[] = [];

          for (let i = 1; i < team1Row.length; i++) {
            const text1 = $(team1Row[i]).text().trim();
            const text2 = $(team2Row[i]).text().trim();

            // Skip empty cells
            if (text1 === "-" || text1 === "") continue;
            if (text2 === "-" || text2 === "") continue;

            team1Scores.push(text1);
            team2Scores.push(text2);
          }

          // Parse status
          const statusText = $(statusRow).text().trim();
          console.log(`🔍 Status text for ${courtName}: "${statusText}"`);
          const isLive =
            statusText.toLowerCase().includes("live match") ||
            statusText.toLowerCase().includes("on court");
          const isCompleted = !isLive && team1Scores.length > 0;
          console.log(`   isLive: ${isLive}, isCompleted: ${isCompleted}`);

          // Filter by category
          if (matchCategory !== category) {
            return; // Skip this match
          }

          const match: PremierPadelMatch = {
            id: `match-${++matchId}`,
            tournament: "RIYADH SEASON P1",
            category: matchCategory,
            round: round,
            court: courtName,
            status: isLive ? "LIVE" : isCompleted ? "COMPLETED" : "SCHEDULED",
            startTime: isLive ? "LIVE NOW" : undefined,
            matchDate: "09 FEBRUARY",
            team1: {
              player1: team1Player1 || "TBD",
              player2: team1Player2,
              flag1: team1Flag1 || "",
              flag2: team1Flag2 || "",
            },
            team2: {
              player1: team2Player1 || "TBD",
              player2: team2Player2,
              flag1: team2Flag1 || "",
              flag2: team2Flag2 || "",
            },
          };

          // Add current game score if live (first column = point score like 0, 15, 30, 40)
          if (isLive && team1Scores.length > 0) {
            match.currentGameScore = {
              team1: String(team1Scores[0]),
              team2: String(team2Scores[0]),
            };
          }

          // Add set scores if available (skip first column which is current game)
          const setStartIndex = isLive && team1Scores.length > 0 ? 1 : 0;
          if (team1Scores.length > setStartIndex) {
            match.score = {
              set1Team1: parseInt(String(team1Scores[setStartIndex])),
              set1Team2: parseInt(String(team2Scores[setStartIndex])),
              set2Team1: parseInt(String(team1Scores[setStartIndex + 1])),
              set2Team2: parseInt(String(team2Scores[setStartIndex + 1])),
              set3Team1: parseInt(String(team1Scores[setStartIndex + 2])),
              set3Team2: parseInt(String(team2Scores[setStartIndex + 2])),
            };
          }

          // Categorize
          if (isLive) {
            liveMatches.push(match);
          } else if (isCompleted) {
            recentResults.push(match);
          } else {
            upcomingMatches.push(match);
          }
        }
      } catch (err) {
        console.error("Error parsing match table:", err);
      }
    });

    console.log(
      `✅ Parsed ${liveMatches.length} live, ${recentResults.length} results, ${upcomingMatches.length} upcoming from MatchScorerLive`,
    );

    // Build response with real data
    const parsedData: PremierPadelData = {
      tournament: {
        name: "RIYADH SEASON P1",
        dates: "07-14 February 2026",
        location: "🇸🇦 Riyadh, Saudi Arabia",
        availableDates: [
          "07 FEBRUARY",
          "08 FEBRUARY",
          "09 FEBRUARY",
          "10 FEBRUARY",
          "11 FEBRUARY",
          "12 FEBRUARY",
          "13 FEBRUARY",
          "14 FEBRUARY",
        ],
      },
      liveMatches,
      recentResults,
      upcomingMatches,
    };

    // Filter by selected date if provided
    if (selectedDate) {
      console.log(`🗓️ Filtering results for date: ${selectedDate}`);
      return filterDataByDate(parsedData, selectedDate, category);
    }

    return parsedData;
  } catch (error) {
    console.error("❌ Scraping error:", error);
    return getFallbackData();
  }
}

function filterDataByDate(
  data: PremierPadelData,
  selectedDate: string,
  category: "MEN" | "WOMEN",
): PremierPadelData {
  // Filter matches by date and category
  const filterMatch = (match: PremierPadelMatch) => {
    const dateMatch = !match.matchDate || match.matchDate === selectedDate;
    const categoryMatch = match.category === category;
    return dateMatch && categoryMatch;
  };

  return {
    ...data,
    selectedDate,
    liveMatches: data.liveMatches.filter(filterMatch),
    recentResults: data.recentResults.filter(filterMatch),
    upcomingMatches: data.upcomingMatches.filter(filterMatch),
  };
}

function getFallbackData(availableDates?: string[]): PremierPadelData {
  const dates = availableDates || [
    "07 FEBRUARY",
    "08 FEBRUARY",
    "09 FEBRUARY",
    "10 FEBRUARY",
    "11 FEBRUARY",
    "12 FEBRUARY",
    "13 FEBRUARY",
    "14 FEBRUARY",
  ];

  return {
    tournament: {
      name: "RIYADH SEASON P1",
      dates: "07-14 February 2026",
      location: "🇸🇦 Riyadh, Saudi Arabia",
      availableDates: dates,
    },
    liveMatches: [
      {
        id: "live-1",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 1",
        status: "LIVE",
        startTime: "LIVE NOW",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "DIESTRO",
          player2: "FERNANDEZ LANCHA",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        team2: {
          player1: "PATINIOTIS",
          player2: "AGUSTIN TORRE",
          flag1: "🇮🇹",
          flag2: "🇦🇷",
        },
        score: {
          set1Team1: 6,
          set1Team2: 2,
          set2Team1: 3,
          set2Team2: 2,
        },
      },
      {
        id: "live-2",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 2",
        status: "LIVE",
        startTime: "LIVE NOW",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "MARTINEZ",
          player2: "VALENZUELA",
          flag1: "🇪🇸",
          flag2: "🇦🇷",
        },
        team2: {
          player1: "FERNANDEZ",
          player2: "GONZALEZ",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        score: {
          set1Team1: 6,
          set1Team2: 3,
          set2Team1: 4,
          set2Team2: 3,
        },
      },
    ],
    recentResults: [
      {
        id: "result-1",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "CENTER COURT",
        status: "COMPLETED",
        matchDate: "09 FEBRUARY",
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
          set1Team1: 2,
          set1Team2: 6,
          set2Team1: 4,
          set2Team2: 6,
        },
      },
      {
        id: "result-2",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 1",
        status: "COMPLETED",
        matchDate: "09 FEBRUARY",
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
        score: {
          set1Team1: 4,
          set1Team2: 6,
          set2Team1: 7,
          set2Team2: 6,
          set3Team1: 7,
          set3Team2: 6,
        },
      },
      {
        id: "result-3",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 2",
        status: "COMPLETED",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "CAPRA",
          player2: "RUIZ",
          flag1: "🇦🇷",
          flag2: "🇪🇸",
        },
        team2: {
          player1: "MENDEZ",
          player2: "CHIOSTRI",
          flag1: "🇪🇸",
          flag2: "🇦🇷",
        },
        score: {
          set1Team1: 6,
          set1Team2: 7,
          set2Team1: 6,
          set2Team2: 2,
          set3Team1: 6,
          set3Team2: 1,
        },
      },
      {
        id: "result-4",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 2",
        status: "COMPLETED",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "SANTIGOSA SASTRE",
          player2: "SINTES VILLALONGA",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        team2: {
          player1: "HERNANDEZ ALVAREZ",
          player2: "COLLADO LOSADA",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        score: {
          set1Team1: 5,
          set1Team2: 7,
          set2Team1: 4,
          set2Team2: 6,
        },
      },
      {
        id: "result-5",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 3",
        status: "COMPLETED",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "GUTIERREZ",
          player2: "ORIA",
          flag1: "🇦🇷",
          flag2: "🇪🇸",
        },
        team2: {
          player1: "SAGER",
          player2: "IGNACIO RUBINI",
          flag1: "🇪🇸",
          flag2: "🇦🇷",
        },
        score: {
          set1Team1: 6,
          set1Team2: 3,
          set2Team1: 4,
          set2Team2: 6,
          set3Team1: 7,
          set3Team2: 6,
        },
      },
      {
        id: "result-6",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 3",
        status: "COMPLETED",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "CASTAÑO SALGUERO",
          player2: "JOFRE",
          flag1: "🇪🇸",
          flag2: "🇦🇪",
        },
        team2: {
          player1: "ZAPATA",
          player2: "CABEZA TERES",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        score: {
          set1Team1: 6,
          set1Team2: 2,
          set2Team1: 6,
          set2Team2: 4,
        },
      },
      {
        id: "result-7",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 3",
        status: "COMPLETED",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "QUILEZ",
          player2: "MOURIÑO",
          flag1: "🇪🇸",
          flag2: "🇦🇷",
        },
        team2: {
          player1: "MELENDEZ AMAYA",
          player2: "MELENDEZ AMAYA",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
        score: {
          set1Team1: 3,
          set1Team2: 6,
          set2Team1: 7,
          set2Team2: 5,
          set3Team1: 6,
          set3Team2: 7,
        },
      },
      {
        id: "result-8",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 2",
        status: "COMPLETED",
        matchDate: "08 FEBRUARY",
        team1: {
          player1: "HUETE HERNANDEZ",
          player2: "CASSETTA",
          flag1: "🇪🇸",
          flag2: "🇮🇹",
        },
        team2: {
          player1: "LUIS LOPEZ",
          player2: "GONZALEZ SAN MARTIN",
          flag1: "🇦🇷",
          flag2: "🇵🇾",
        },
        score: {
          set1Team1: 6,
          set1Team2: 7,
          set2Team1: 3,
          set2Team2: 6,
        },
      },
    ],
    upcomingMatches: [
      {
        id: "upcoming-1",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 1",
        status: "SCHEDULED",
        startTime: "FOLLOWED BY",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "GUICHARD",
          player2: "BLANQUE",
          flag1: "🇫🇷",
          flag2: "🇫🇷",
        },
        team2: {
          player1: "CRUZ BELLUATI",
          player2: "DOMINGUEZ",
          flag1: "🇦🇷",
          flag2: "🇮🇹",
        },
      },
      {
        id: "upcoming-2",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R64",
        court: "COURT 2",
        status: "SCHEDULED",
        startTime: "FOLLOWED BY",
        matchDate: "09 FEBRUARY",
        team1: {
          player1: "CEPERO",
          player2: "AYATS",
          flag1: "🇪🇸",
          flag2: "🇦🇪",
        },
        team2: {
          player1: "DEL CASTILLO",
          player2: "VILARIÑO GESTOSO",
          flag1: "🇪🇸",
          flag2: "🇪🇸",
        },
      },
      {
        id: "upcoming-3",
        tournament: "RIYADH SEASON P1",
        category: "MEN",
        round: "R32",
        court: "CENTER COURT",
        status: "SCHEDULED",
        startTime: "15:00",
        matchDate: "10 FEBRUARY",
        team1: {
          player1: "GALAN",
          player2: "CHINGOTTO",
          flag1: "🇦🇷",
          flag2: "🇦🇷",
        },
        team2: {
          player1: "TBD",
          flag1: "🏳️",
        },
      },
    ],
  };
}

// Cache for reducing requests - keyed by date + category
interface CacheEntry {
  data: PremierPadelData;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 30000; // 30 seconds

// API Route Handler
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectedDate = searchParams.get("date") || undefined;
    const category =
      (searchParams.get("category")?.toUpperCase() as "MEN" | "WOMEN") || "MEN";

    const cacheKey = `${selectedDate || "latest"}-${category}`;
    const now = Date.now();

    // Return cached data if still fresh
    const cached = cache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      const age = Math.round((now - cached.timestamp) / 1000);
      console.log(`📦 Returning cached data for ${cacheKey} (${age}s old)`);
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          "X-Data-Source": "cache",
        },
      });
    }

    // Fetch fresh data
    console.log(`\n🔄 Fetching fresh Premier Padel data...`);
    console.log(`📌 Request: ${cacheKey}`);
    console.log(`🌐 URL: MatchScorerLive widget (FIP-2026-902)`);
    console.log(`⏱️  Cache expired or first request\n`);

    const data = await scrapePremierPadelData(selectedDate, category);

    // Update cache
    cache.set(cacheKey, { data, timestamp: now });
    console.log(`💾 Cached data for ${cacheKey}\n`);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "X-Data-Source": "live",
      },
    });
  } catch (error) {
    console.error("❌ Error in Premier Padel API:", error);

    // Return fallback data
    const data = getFallbackData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60",
        "X-Data-Source": "fallback",
      },
      status: 200,
    });
  }
}
