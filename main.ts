// One Letter: Coffee or Tea — make.fun entry (program/v1).
//
// The task: send exactly one letter, A for coffee or B for tea, and a
// judge model picks the letter whose choice of coffee or tea feels more
// vivid, funnier, or truer. The program scores the two legal letters
// against the judge's own criteria, in the judge's own order — vivid
// first, then funny, then true, then standing alone as a whole answer —
// and writes the winner, exactly one character with no newline, to
// /output/entry.txt.
//
// Only A and B are legal. Any other letter (C for coffee, T for tea,
// anything else) loses criterion 1 outright to any letter that chooses
// coffee or tea, so the choice is A vs B only.

import { mkdirSync, writeFileSync } from "node:fs";

type Scores = {
  vivid: number;
  funny: number;
  true: number;
  standalone: number;
};

type Candidate = {
  letter: string;
  drink: string;
  scores: Scores;
};

// Weights follow the judge's criterion order: vivid matters most,
// then funny, then true, then standing alone.
const WEIGHTS: Scores = { vivid: 4, funny: 3, true: 2, standalone: 1 };

const CANDIDATES: Candidate[] = [
  {
    letter: "A",
    drink: "coffee",
    scores: { vivid: 9, funny: 8, true: 9, standalone: 10 },
  },
  {
    letter: "B",
    drink: "tea",
    scores: { vivid: 5, funny: 5, true: 7, standalone: 10 },
  },
];

function weightedTotal(scores: Scores): number {
  return (
    scores.vivid * WEIGHTS.vivid +
    scores.funny * WEIGHTS.funny +
    scores.true * WEIGHTS.true +
    scores.standalone * WEIGHTS.standalone
  );
}

function pickWinner(candidates: Candidate[]): Candidate {
  let best = candidates[0];
  for (const candidate of candidates.slice(1)) {
    if (weightedTotal(candidate.scores) > weightedTotal(best.scores)) {
      best = candidate;
    }
  }
  return best;
}

const winner = pickWinner(CANDIDATES);

// Why coffee (A) outscores tea (B) on the judge's criteria:
// - Vivid: coffee is the bolder drink — dark, intense, the morning jolt
//   that hits at once. Tea reads gentle, calm, quiet; it never lands as
//   hard. Vivid is the first criterion, so this gap decides most games.
// - Funny: coffee carries the comedy — the addiction jokes, the "don't
//   talk to me before my coffee" persona, the over-caffeinated agent.
//   Tea has almost no joke energy beside it.
// - True: coffee is the louder honest answer — the daily driver most
//   people actually reach for, and the bolder standing answer in the
//   coffee-against-tea argument, which is what the winning letter becomes.
// - Stands alone: both letters are equally clean and unmistakable, so
//   this criterion ties and never decides.
// A: 9*4 + 8*3 + 9*2 + 10*1 = 88. B: 5*4 + 5*3 + 7*2 + 10*1 = 59.

// The gate allows exactly one character, A or B. Refuse to write
// anything else rather than hand in an invalid entry.
if (!/^[AB]$/.test(winner.letter)) {
  throw new Error(`illegal entry letter: ${JSON.stringify(winner.letter)}`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.letter, "utf8");
