import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import type { CreateTournamentInput } from "@/types/tournament";
import { generateRoundRobinSchedule } from "@/lib/round-robin";

// Utility function to shuffle array (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// GET /api/tournaments - List all tournaments for authenticated user
export async function GET(request: NextRequest) {
  try {
    // TEMP: Desativar autenticação para testes
    const session = { user: { email: "test@test.com", name: "Test User" } };
    // const session = await getServerSession();

    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Get or create user from database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // Create user if doesn't exist (for JWT auth)
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
        },
      });
    }

    const tournaments = await prisma.tournament.findMany({
      where: { createdBy: user.id },
      include: {
        Team: {
          include: {
            Player: true,
          },
        },
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
      orderBy: { date: "desc" },
    });

    // Transform to match frontend expectations
    const transformedTournaments = tournaments.map((t: any) => ({
      ...t,
      teams: t.Team || [],
      players: t.Team?.flatMap((team: any) => team.Player || []) || [],
      rounds:
        t.Round?.map((r: any) => ({
          ...r,
          games:
            r.Game?.map((g: any) => ({
              ...g,
              team1: g.Team_Game_team1IdToTeam,
              team2: g.Team_Game_team2IdToTeam,
              winner: g.Team_Game_winnerIdToTeam,
            })) || [],
        })) || [],
      matches:
        t.Round?.flatMap(
          (r: any) =>
            r.Game?.map((g: any) => ({
              ...g,
              team1: g.Team_Game_team1IdToTeam,
              team2: g.Team_Game_team2IdToTeam,
              winner: g.Team_Game_winnerIdToTeam,
            })) || [],
        ) || [],
    }));

    return NextResponse.json(transformedTournaments);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 },
    );
  }
}

// POST /api/tournaments - Create new tournament with round-robin schedule
export async function POST(request: NextRequest) {
  try {
    // TEMP: Desativar autenticação para testes
    const session = { user: { email: "test@test.com", name: "Test User" } };
    // const session = await getServerSession();

    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Get or create user from database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // Create user if doesn't exist (for JWT auth)
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
        },
      });
    }

    const body: CreateTournamentInput = await request.json();

    console.log("📝 Creating tournament with data:", {
      name: body.name,
      date: body.date,
      courtsAvailable: body.courtsAvailable,
      playerNames: body.playerNames?.length || 0,
      teams: body.teams?.length || 0,
    });

    // Validate input - must have either playerNames or teams
    if (!body.playerNames && !body.teams) {
      return NextResponse.json(
        { error: "Must provide either playerNames or teams" },
        { status: 400 },
      );
    }

    // Validate minimum requirements
    if (body.playerNames && body.playerNames.length < 4) {
      return NextResponse.json(
        { error: "Minimum 4 players required for auto-pairing" },
        { status: 400 },
      );
    }

    if (body.teams && body.teams.length < 2) {
      return NextResponse.json(
        { error: "Minimum 2 teams required" },
        { status: 400 },
      );
    }

    // Validate even number of players for auto-pairing
    if (body.playerNames && body.playerNames.length % 2 !== 0) {
      return NextResponse.json(
        { error: "Must have even number of players for auto-pairing" },
        { status: 400 },
      );
    }

    const userId = user.id;

    // Create tournament with teams and schedule in a transaction
    const tournament = await prisma.$transaction(async (tx) => {
      // 1. Create tournament (DRAFT status)
      const newTournament = await tx.tournament.create({
        data: {
          name: body.name,
          date: new Date(body.date),
          courtsAvailable: body.courtsAvailable,
          numberOfGames: body.numberOfGames,
          gameDuration: 20, // Fixed at 20 minutes
          createdBy: userId,
          status: "DRAFT",
        },
      });

      let teams: Array<{
        id: string;
        player1Name: string;
        player2Name: string;
      }> = [];

      // 2. Handle auto-pairing mode
      if (body.playerNames && body.playerNames.length > 0) {
        // Create individual players
        const shuffledPlayers = shuffle(body.playerNames);
        const players = await Promise.all(
          shuffledPlayers.map((name) =>
            tx.player.create({
              data: {
                name,
                tournamentId: newTournament.id,
              },
            }),
          ),
        );

        // Auto-pair players into teams
        for (let i = 0; i < players.length; i += 2) {
          const player1 = players[i];
          const player2 = players[i + 1];

          const team = await tx.team.create({
            data: {
              tournamentId: newTournament.id,
              player1Name: player1.name,
              player2Name: player2.name,
              teamName: `${player1.name} & ${player2.name}`,
              position: i / 2,
            },
          });

          // Link players to team
          await tx.player.updateMany({
            where: {
              id: { in: [player1.id, player2.id] },
            },
            data: {
              teamId: team.id,
            },
          });

          teams.push({
            id: team.id,
            player1Name: player1.name,
            player2Name: player2.name,
          });
        }
      }
      // 3. Handle manual pairing mode
      else if (body.teams && body.teams.length > 0) {
        const shuffledTeams = shuffle(body.teams);

        teams = await Promise.all(
          shuffledTeams.map(async (teamData, index) => {
            // Create team
            const team = await tx.team.create({
              data: {
                tournamentId: newTournament.id,
                player1Name: teamData.player1Name,
                player2Name: teamData.player2Name,
                teamName:
                  teamData.teamName ||
                  `${teamData.player1Name} & ${teamData.player2Name}`,
                position: index,
              },
            });

            // Create players for this team
            await tx.player.createMany({
              data: [
                {
                  name: teamData.player1Name,
                  tournamentId: newTournament.id,
                  teamId: team.id,
                },
                {
                  name: teamData.player2Name,
                  tournamentId: newTournament.id,
                  teamId: team.id,
                },
              ],
            });

            return {
              id: team.id,
              player1Name: teamData.player1Name,
              player2Name: teamData.player2Name,
            };
          }),
        );
      }

      // 4. Generate round-robin schedule
      const teamIds = teams.map((t) => t.id);
      const schedule = generateRoundRobinSchedule(
        teamIds,
        body.courtsAvailable,
        body.numberOfGames, // Pass the number of games limit
      );

      console.log(
        `🎯 Generated ${schedule.length} rounds with ${schedule.reduce((acc, r) => acc + r.pairings.length, 0)} games (max: ${body.numberOfGames || "unlimited"})`,
      );

      // 5. Create rounds and games
      for (const roundSchedule of schedule) {
        // Create round
        const round = await tx.round.create({
          data: {
            tournamentId: newTournament.id,
            roundNumber: roundSchedule.roundNumber,
            status: "PENDING",
          },
        });

        // Create games for this round
        await tx.game.createMany({
          data: roundSchedule.pairings.map((pairing) => ({
            roundId: round.id,
            tournamentId: newTournament.id,
            team1Id: pairing.team1Id,
            team2Id: pairing.team2Id,
            court: pairing.court,
            status: "PENDING",
          })),
        });
      }

      // 6. Update tournament status to ACTIVE
      await tx.tournament.update({
        where: { id: newTournament.id },
        data: { status: "ACTIVE" },
      });

      // 7. Return tournament with full relations
      return tx.tournament.findUnique({
        where: { id: newTournament.id },
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
    });

    console.log("✅ Tournament created successfully:", tournament?.id);

    // Transform to match frontend expectations
    const transformed = {
      ...tournament,
      teams: tournament?.Team || [],
      players: tournament?.Player || [],
      rounds:
        tournament?.Round?.map((r: any) => ({
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

    return NextResponse.json(transformed, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating tournament:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to create tournament",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
