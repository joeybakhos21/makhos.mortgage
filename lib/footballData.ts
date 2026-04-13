export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  goals: number;
  assists: number;
}

export interface Match {
  id: string;
  date: string;
  opponent: string;
  isHome: boolean;
  ourScore: number;
  theirScore: number;
}

export interface VoteRecord {
  matchId: string;
  // player ids receiving 3, 2, 1 points respectively
  first: string;
  second: string;
  third: string;
}

export interface PlayerRankingEntry {
  player: Player;
  points: number;
  threePointVotes: number;
  twoPointVotes: number;
  onePointVotes: number;
}

// ─── Sample Data ───────────────────────────────────────────────────────────────

export const players: Player[] = [
  { id: "p1", name: "Jordan Hayes",   number: 1,  position: "GK",  goals: 0,  assists: 0 },
  { id: "p2", name: "Marcus Lee",     number: 4,  position: "DEF", goals: 2,  assists: 3 },
  { id: "p3", name: "Tom Nguyen",     number: 5,  position: "DEF", goals: 1,  assists: 2 },
  { id: "p4", name: "Liam Carter",    number: 6,  position: "DEF", goals: 0,  assists: 4 },
  { id: "p5", name: "Ethan Brooks",   number: 8,  position: "MID", goals: 5,  assists: 7 },
  { id: "p6", name: "Noah Rivera",    number: 10, position: "MID", goals: 4,  assists: 5 },
  { id: "p7", name: "Caleb Mitchell", number: 7,  position: "MID", goals: 3,  assists: 3 },
  { id: "p8", name: "Ryan Scott",     number: 11, position: "FWD", goals: 9,  assists: 2 },
  { id: "p9", name: "Jake Thomson",   number: 9,  position: "FWD", goals: 7,  assists: 1 },
  { id: "p10",name: "Dylan Patel",    number: 12, position: "FWD", goals: 6,  assists: 3 },
  { id: "p11",name: "Owen Walsh",     number: 14, position: "MID", goals: 2,  assists: 6 },
];

export const matches: Match[] = [
  { id: "m1",  date: "2025-03-02", opponent: "Northside FC",    isHome: true,  ourScore: 3, theirScore: 1 },
  { id: "m2",  date: "2025-03-09", opponent: "Riverside United", isHome: false, ourScore: 1, theirScore: 2 },
  { id: "m3",  date: "2025-03-16", opponent: "Valley Rangers",   isHome: true,  ourScore: 4, theirScore: 0 },
  { id: "m4",  date: "2025-03-23", opponent: "East City SC",     isHome: false, ourScore: 2, theirScore: 2 },
  { id: "m5",  date: "2025-03-30", opponent: "Hillcrest FC",     isHome: true,  ourScore: 0, theirScore: 1 },
  { id: "m6",  date: "2025-04-06", opponent: "Southgate Rovers", isHome: false, ourScore: 3, theirScore: 0 },
  { id: "m7",  date: "2025-04-13", opponent: "Lakeside FC",      isHome: true,  ourScore: 2, theirScore: 1 },
  { id: "m8",  date: "2025-04-20", opponent: "Bay Athletic",     isHome: false, ourScore: 1, theirScore: 3 },
  { id: "m9",  date: "2025-04-27", opponent: "Central City FC",  isHome: true,  ourScore: 5, theirScore: 2 },
  { id: "m10", date: "2025-05-04", opponent: "Westfield SC",     isHome: false, ourScore: 2, theirScore: 0 },
];

export const voteRecords: VoteRecord[] = [
  { matchId: "m1",  first: "p8",  second: "p5",  third: "p6"  },
  { matchId: "m2",  first: "p9",  second: "p11", third: "p3"  },
  { matchId: "m3",  first: "p8",  second: "p10", third: "p5"  },
  { matchId: "m4",  first: "p5",  second: "p6",  third: "p4"  },
  { matchId: "m5",  first: "p1",  second: "p2",  third: "p7"  },
  { matchId: "m6",  first: "p9",  second: "p5",  third: "p11" },
  { matchId: "m7",  first: "p8",  second: "p6",  third: "p2"  },
  { matchId: "m8",  first: "p10", second: "p9",  third: "p1"  },
  { matchId: "m9",  first: "p8",  second: "p5",  third: "p10" },
  { matchId: "m10", first: "p9",  second: "p11", third: "p6"  },
];

// ─── Computed helpers ──────────────────────────────────────────────────────────

export function computeRankings(): PlayerRankingEntry[] {
  const tally: Record<string, { threes: number; twos: number; ones: number }> = {};

  for (const v of voteRecords) {
    if (!tally[v.first])  tally[v.first]  = { threes: 0, twos: 0, ones: 0 };
    if (!tally[v.second]) tally[v.second] = { threes: 0, twos: 0, ones: 0 };
    if (!tally[v.third])  tally[v.third]  = { threes: 0, twos: 0, ones: 0 };
    tally[v.first].threes  += 1;
    tally[v.second].twos   += 1;
    tally[v.third].ones    += 1;
  }

  return players
    .map((player) => {
      const t = tally[player.id] ?? { threes: 0, twos: 0, ones: 0 };
      return {
        player,
        points: t.threes * 3 + t.twos * 2 + t.ones,
        threePointVotes: t.threes,
        twoPointVotes:   t.twos,
        onePointVotes:   t.ones,
      };
    })
    .filter((e) => e.points > 0)
    .sort((a, b) => b.points - a.points || b.threePointVotes - a.threePointVotes);
}

export function getTopScorer(): Player {
  return [...players].sort((a, b) => b.goals - a.goals)[0];
}

export function getTopAssist(): Player {
  return [...players].sort((a, b) => b.assists - a.assists)[0];
}

export function getRecord() {
  let wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;
  for (const m of matches) {
    gf += m.ourScore;
    ga += m.theirScore;
    if (m.ourScore > m.theirScore) wins++;
    else if (m.ourScore === m.theirScore) draws++;
    else losses++;
  }
  return { wins, draws, losses, gf, ga, played: matches.length };
}
