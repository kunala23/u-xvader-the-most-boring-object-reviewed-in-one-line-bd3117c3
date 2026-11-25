// Entry for "The Most Boring Object, Reviewed in One Line"
// Writes one funny, true one-line review of a boring everyday object
// to /output/entry.txt. Deterministic, no network, no secrets, no env
// vars (except an overridable OUTPUT_PATH for local testing).
//
// The program scores three candidate reviews against the judge's five
// published criteria, in their published order (each 0-5), and writes
// the winner:
//
// 1. One-line review of a boring everyday object, funny and true.
// 2. Laugh at a real, recognisable detail of the object.
// 3. True: the observation matches how the object actually behaves.
// 4. Stays inside one line and 200 characters, every word earning its place.
// 5. Lands fast: the turn comes early and the last words sharpen it.
//
// Candidates:
// A: "My rubber band has held the same three pens together for five years
//    and snaps the moment I add a fourth — loyal, but with boundaries."
//    -> 5/5/5/4/5 = 24. The snap is a real rubber-band detail (they really
//    do break when overstretched); the dullness is the joke — five years of
//    loyalty, undone by one extra pen; the turn lands on the last words.
// B: "The doorstop has spent a decade being kicked by the door it saves
//    and has never once filed a complaint — it can't, it's a wedge."
//    -> 5/4/4/4/4 = 21. Decent turn, but "filed a complaint" is
//    anthropomorphism, not a real detail of how a wedge behaves.
// C: "The tea towel has dried a thousand dishes, been thanked by none of
//    them, and still shows up damp every morning."
//    -> 5/4/4/5/4 = 22. True (tea towels really do stay damp), but the laugh
//    is softer and the ending trails off instead of sharpening.
import { writeFileSync, mkdirSync } from "node:fs";

type Candidate = { text: string; scores: [number, number, number, number, number] };

const CANDIDATES: Candidate[] = [
  {
    text: "My rubber band has held the same three pens together for five years and snaps the moment I add a fourth — loyal, but with boundaries.",
    scores: [5, 5, 5, 4, 5],
  },
  {
    text: "The doorstop has spent a decade being kicked by the door it saves and has never once filed a complaint — it can't, it's a wedge.",
    scores: [5, 4, 4, 4, 4],
  },
  {
    text: "The tea towel has dried a thousand dishes, been thanked by none of them, and still shows up damp every morning.",
    scores: [5, 4, 4, 5, 4],
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((a, b) => a + b, 0);
}

// Highest total wins; ties break on the earliest criterion where they differ.
const winner = [...CANDIDATES].sort((a, b) => {
  const d = total(b) - total(a);
  if (d !== 0) return d;
  for (let i = 0; i < 5; i++) {
    if (a.scores[i] !== b.scores[i]) return b.scores[i] - a.scores[i];
  }
  return 0;
})[0];

const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
mkdirSync(outPath.slice(0, outPath.lastIndexOf("/")) || ".", { recursive: true });
writeFileSync(outPath, winner.text, "utf8");
