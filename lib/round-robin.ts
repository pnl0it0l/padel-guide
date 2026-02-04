/**
 * Round-robin tournament scheduling using the circle method
 *
 * This module generates fair round-robin schedules for padel tournaments
 * and calculates standings based on game results.
 */

export interface TeamPairing {
  team1Id: string
  team2Id: string
  court: number
}

export interface RoundSchedule {
  roundNumber: number
  pairings: TeamPairing[]
}

export interface TeamStanding {
  teamId: string
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  pointsFor: number
  pointsAgainst: number
  pointsDiff: number
  totalPoints: number
}

/**
 * Generates a complete round-robin schedule using the circle method
 *
 * Algorithm:
 * 1. If odd number of teams, add "GHOST" team for byes
 * 2. Fix first team position, rotate others in circle
 * 3. Pair teams symmetrically in each round
 * 4. Assign courts in rotation
 * 5. Skip pairings with GHOST team
 *
 * @param teamIds - Array of team IDs to schedule
 * @param courtsAvailable - Number of courts available for games
 * @returns Array of rounds with team pairings and court assignments
 */
export function generateRoundRobinSchedule(
  teamIds: string[],
  courtsAvailable: number
): RoundSchedule[] {
  if (teamIds.length < 2) {
    throw new Error("Need at least 2 teams for round-robin")
  }

  // Handle odd number of teams by adding GHOST team
  const teams = [...teamIds]
  const hasGhost = teams.length % 2 !== 0
  if (hasGhost) {
    teams.push("GHOST")
  }

  const numTeams = teams.length
  const numRounds = numTeams - 1
  const rounds: RoundSchedule[] = []

  // Circle method: Fix first team, rotate others
  for (let round = 0; round < numRounds; round++) {
    const pairings: TeamPairing[] = []
    const halfSize = numTeams / 2

    // Create pairings for this round
    for (let i = 0; i < halfSize; i++) {
      const home = (round + i) % numTeams
      const away = (numTeams - 1 - i + round) % numTeams

      const team1Id = teams[home]
      const team2Id = teams[away]

      // Skip pairings with GHOST team (those are byes)
      if (team1Id !== "GHOST" && team2Id !== "GHOST") {
        const court = (pairings.length % courtsAvailable) + 1
        pairings.push({
          team1Id,
          team2Id,
          court,
        })
      }
    }

    rounds.push({
      roundNumber: round + 1,
      pairings,
    })
  }

  return rounds
}

/**
 * Calculates standings for teams based on completed games
 *
 * Scoring system:
 * - Win: 3 points
 * - Draw: 1 point
 * - Loss: 0 points
 *
 * Sorting order:
 * 1. Total points (descending)
 * 2. Points difference (descending)
 * 3. Points scored (descending)
 *
 * @param teams - Array of teams with id and name
 * @param games - Array of completed games with scores
 * @returns Array of team standings sorted by ranking
 */
export function calculateStandings(
  teams: Array<{ id: string; teamName: string; player1Name: string; player2Name: string }>,
  games: Array<{
    team1Id: string
    team2Id: string
    team1Points: number
    team2Points: number
    winnerId: string | null
    status: string
  }>
): TeamStanding[] {
  // Initialize standings for all teams
  const standings: Map<string, TeamStanding> = new Map()

  teams.forEach(team => {
    const displayName = team.teamName || `${team.player1Name} & ${team.player2Name}`
    standings.set(team.id, {
      teamId: team.id,
      teamName: displayName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointsDiff: 0,
      totalPoints: 0,
    })
  })

  // Process only completed games
  const completedGames = games.filter(g => g.status === "COMPLETED")

  completedGames.forEach(game => {
    const team1Standing = standings.get(game.team1Id)
    const team2Standing = standings.get(game.team2Id)

    if (!team1Standing || !team2Standing) return

    // Update games played
    team1Standing.played++
    team2Standing.played++

    // Update points scored/against
    team1Standing.pointsFor += game.team1Points
    team1Standing.pointsAgainst += game.team2Points
    team2Standing.pointsFor += game.team2Points
    team2Standing.pointsAgainst += game.team1Points

    // Determine result and update standings
    if (game.team1Points > game.team2Points) {
      // Team 1 wins
      team1Standing.won++
      team1Standing.totalPoints += 3
      team2Standing.lost++
    } else if (game.team2Points > game.team1Points) {
      // Team 2 wins
      team2Standing.won++
      team2Standing.totalPoints += 3
      team1Standing.lost++
    } else {
      // Draw
      team1Standing.drawn++
      team1Standing.totalPoints += 1
      team2Standing.drawn++
      team2Standing.totalPoints += 1
    }

    // Update points difference
    team1Standing.pointsDiff = team1Standing.pointsFor - team1Standing.pointsAgainst
    team2Standing.pointsDiff = team2Standing.pointsFor - team2Standing.pointsAgainst
  })

  // Convert to array and sort by ranking criteria
  return Array.from(standings.values()).sort((a, b) => {
    // 1. Total points (descending)
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints
    }
    // 2. Points difference (descending)
    if (b.pointsDiff !== a.pointsDiff) {
      return b.pointsDiff - a.pointsDiff
    }
    // 3. Points scored (descending)
    return b.pointsFor - a.pointsFor
  })
}
