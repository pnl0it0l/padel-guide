import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { UpdateGameInput } from "@/types/tournament";

// POST /api/tournaments/[id]/games - Update game result
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body: UpdateGameInput = await request.json();
    const { id: tournamentId } = await params;

    console.log("🎮 Updating game:", {
      tournamentId,
      gameId: body.gameId,
      team1Points: body.team1Points,
      team2Points: body.team2Points,
    });

    // Validate input
    if (
      !body.gameId ||
      body.team1Points === undefined ||
      body.team2Points === undefined
    ) {
      return NextResponse.json(
        { error: "gameId, team1Points, and team2Points are required" },
        { status: 400 },
      );
    }

    // Validate points are non-negative
    if (body.team1Points < 0 || body.team2Points < 0) {
      return NextResponse.json(
        { error: "Points cannot be negative" },
        { status: 400 },
      );
    }

    // Update game in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find the game
      const game = await tx.game.findUnique({
        where: { id: body.gameId },
        include: {
          Round: true,
        },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      if (game.tournamentId !== tournamentId) {
        throw new Error("Game does not belong to this tournament");
      }

      // 2. Determine winner based on points
      let winnerId: string | null = null;
      if (body.team1Points > body.team2Points) {
        winnerId = game.team1Id;
      } else if (body.team2Points > body.team1Points) {
        winnerId = game.team2Id;
      }
      // If equal, winnerId stays null (draw)

      // 3. Update game with results
      const updatedGame = await tx.game.update({
        where: { id: body.gameId },
        data: {
          team1Points: body.team1Points,
          team2Points: body.team2Points,
          winnerId,
          status: "COMPLETED",
          endTime: new Date(),
        },
        include: {
          Team_Game_team1IdToTeam: true,
          Team_Game_team2IdToTeam: true,
          Team_Game_winnerIdToTeam: true,
          Round: true,
        },
      });

      // 4. Check if all games in this round are complete
      const roundGames = await tx.game.findMany({
        where: { roundId: game.roundId },
      });

      const allGamesComplete = roundGames.every(
        (g) => g.status === "COMPLETED",
      );

      // 5. If all games complete, update round status
      if (allGamesComplete) {
        await tx.round.update({
          where: { id: game.roundId },
          data: {
            status: "COMPLETED",
            endTime: new Date(),
          },
        });

        console.log(`✅ Round ${game.Round.roundNumber} completed`);
      }

      return updatedGame;
    });

    console.log("✅ Game updated successfully:", result.id);

    // Transform to match frontend expectations
    const transformed = {
      ...result,
      team1: result.Team_Game_team1IdToTeam,
      team2: result.Team_Game_team2IdToTeam,
      winner: result.Team_Game_winnerIdToTeam,
      round: result.Round,
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("❌ Error updating game:", error);
    return NextResponse.json(
      {
        error: "Failed to update game",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
