import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/tournaments/[id] - Get tournament with all relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: tournamentId } = await params;

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        Team: {
          include: {
            Player: true,
          },
          orderBy: { position: "asc" },
        },
        Player: true,
        Round: {
          include: {
            Game: {
              include: {
                Team_Game_team1IdToTeam: true,
                Team_Game_team2IdToTeam: true,
                Team_Game_winnerIdToTeam: true,
              },
            },
          },
          orderBy: { roundNumber: "asc" },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    // Transform to match frontend expectations
    const transformed: any = {
      ...tournament,
      teams: tournament.Team || [],
      players: tournament.Player || [],
      rounds:
        tournament.Round?.map((r: any) => ({
          ...r,
          games:
            r.Game?.map((g: any) => ({
              ...g,
              team1: g.Team_Game_team1IdToTeam,
              team2: g.Team_Game_team2IdToTeam,
              winner: g.Team_Game_winnerIdToTeam,
            })) || [],
        })) || [],
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournament" },
      { status: 500 },
    );
  }
}
