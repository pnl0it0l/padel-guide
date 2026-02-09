import { NextResponse } from "next/server";

export interface FPPTournament {
  date: string;
  endDate?: string;
  points: string;
  category: string;
  name: string;
  levels: string;
  location: string;
  participants?: number;
  url?: string;
}

// Helper function to convert tournament name to URL slug
function nameToSlug(name: string): string {
  return name
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/é|ê|è/gi, "e")
    .replace(/á|à|ã|â/gi, "a")
    .replace(/í|ì/gi, "i")
    .replace(/ó|ò|õ|ô/gi, "o")
    .replace(/ú|ù/gi, "u")
    .replace(/ç/gi, "c");
}

// Helper function to parse date and check if it's in the future
function isFutureTournament(dateStr: string): boolean {
  try {
    const months: Record<string, number> = {
      Jan: 0,
      Fev: 1,
      Feb: 1,
      Mar: 2,
      Abr: 3,
      Apr: 3,
      Mai: 4,
      May: 4,
      Jun: 5,
      Jul: 6,
      Ago: 7,
      Aug: 7,
      Set: 8,
      Sep: 8,
      Out: 9,
      Oct: 9,
      Nov: 10,
      Dez: 11,
      Dec: 11,
    };

    const parts = dateStr.trim().split(/\s+/);
    if (parts.length < 2) return true; // If can't parse, show it

    const day = parseInt(parts[0]);
    const monthStr = parts[1];
    const month = months[monthStr];

    if (isNaN(day) || month === undefined) return true;

    const tournamentDate = new Date(2026, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tournamentDate >= today;
  } catch {
    return true; // If error parsing, show it
  }
}

export async function GET() {
  try {
    // Manual tournament data (updatemanually from FPP calendar)
    // Source: https://tour.tiesports.com/fpp/calendar_(tournaments)
    const allTournaments: FPPTournament[] = [
      {
        date: "20 Fev",
        points: "2.000",
        category: "ABS",
        name: "V Open Smartpath",
        levels: "Masculinos 1-6, Femininos 1-6",
        location: "Padel Factory",
        url: "https://fpp.tiepadel.com/Tournaments/VOpenSmartpath/VOpenSmartpath",
      },
      {
        date: "20 Fev",
        points: "5.000",
        category: "JUV",
        name: "I Open Jovem By Carcavelos Ténis E Padel",
        levels: "Masculinos/Femininos SUB12-18",
        location: "Carcavelos Ténis e Padel",
        url: "https://fpp.tiepadel.com/Tournaments/IOpenJovemByCarcavelosTenisEPadel/IOpenJovemByCarcavelosTenisEPadel",
      },
      {
        date: "20 Fev",
        points: "10.000",
        category: "VET",
        name: "The Gentlemen's & Ladies Crew By Claranet",
        levels: "Masculinos/Femininos +35 a +60",
        location: "Claranet",
        url: "https://fpp.tiepadel.com/Tournaments/TheGentlemensLadiesCrewByClaranet/TheGentlemensLadiesCrewByClaranet",
      },
      {
        date: "26 Fev",
        points: "2.000",
        category: "ABS",
        name: "Minho Padel Open",
        levels: "Masculinos 2-5, Femininos 2-5, Mistos 3-4",
        location: "Top-padel Guimarães",
        url: "https://fpp.tiepadel.com/Tournaments/MinhoPadelOpen/MinhoPadelOpen",
      },
      {
        date: "1 Mar",
        points: "5.000",
        category: "ABS",
        name: "Torneio Internacional de Padel",
        levels: "Masculinos 1-4, Femininos 1-4",
        location: "Lisboa",
        url: "https://tour.tiesports.com/fpp/calendar_(tournaments)",
      },
      {
        date: "15 Mar",
        points: "10.000",
        category: "ABS",
        name: "Open de Portugal",
        levels: "Vários níveis",
        location: "Porto",
        url: "https://tour.tiesports.com/fpp/calendar_(tournaments)",
      },
    ];

    // Filter only future tournaments
    const futureTournaments = allTournaments.filter((t) =>
      isFutureTournament(t.date),
    );

    // Return up to 6 future tournaments
    const tournaments = futureTournaments.slice(0, 6);

    return NextResponse.json({
      tournaments,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching FPP tournaments:", error);

    // Return fallback data if fetch fails
    return NextResponse.json(
      {
        tournaments: [
          {
            date: "20 Fev",
            points: "2.000",
            category: "ABS",
            name: "V Open Smartpath",
            levels: "Masculinos 1-6, Femininos 1-6",
            location: "Padel Factory",
            url: "https://fpp.tiepadel.com/Tournaments/VOpenSmartpath/VOpenSmartpath",
          },
          {
            date: "26 Fev",
            points: "2.000",
            category: "ABS",
            name: "Minho Padel Open",
            levels: "Masculinos 2-5, Femininos 2-5",
            location: "Top-padel Guimarães",
            url: "https://fpp.tiepadel.com/Tournaments/MinhoPadelOpen/MinhoPadelOpen",
          },
          {
            date: "1 Mar",
            points: "5.000",
            category: "ABS",
            name: "Torneio de Padel",
            levels: "Vários níveis",
            location: "Lisboa",
            url: "https://tour.tiesports.com/fpp/calendar_(tournaments)",
          },
        ],
        lastUpdated: new Date().toISOString(),
        fallback: true,
      },
      { status: 200 },
    );
  }
}
