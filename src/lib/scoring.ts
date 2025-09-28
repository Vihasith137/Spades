import { ScoringSettings, TeamRoundInput } from "./types";

export const DEFAULT_SCORING: ScoringSettings = {
  bagPenaltyAt: 10,
  bagPenalty: -100,
  perBid: 10,
  perBag: 1,
  setPenaltyPerBid: -10,
  nilWin: 100,
  nilLose: -100,
  blindNilWin: 200,
  blindNilLose: -200,
};

export function scoreRound(
  inputs: TeamRoundInput,
  runningTotals: Record<string, number>,
  runningBags: Record<string, number>,
  settings: ScoringSettings = DEFAULT_SCORING
) {
  const totals = { ...runningTotals };
  const bags = { ...runningBags };

  Object.entries(inputs).forEach(([teamId, s]) => {
    const bid = Math.max(0, s.bid|0);
    const tricks = Math.max(0, s.tricks|0);

    // Nil/Blind Nil overrides (no bag accumulation for nil bidder team)
    if (s.blindNil) {
      totals[teamId] = (totals[teamId]||0) + (tricks === 0 ? settings.blindNilWin : settings.blindNilLose);
      return;
    }
    if (s.nil) {
      totals[teamId] = (totals[teamId]||0) + (tricks === 0 ? settings.nilWin : settings.nilLose);
      return;
    }

    if (tricks >= bid) {
      const bagsThis = tricks - bid;
      totals[teamId] = (totals[teamId]||0) + bid * settings.perBid + bagsThis * settings.perBag;
      bags[teamId] = (bags[teamId]||0) + bagsThis;
      if ((bags[teamId]||0) >= settings.bagPenaltyAt) {
        const penalties = Math.floor((bags[teamId]||0) / settings.bagPenaltyAt);
        totals[teamId] += penalties * settings.bagPenalty;
        bags[teamId] = (bags[teamId]||0) % settings.bagPenaltyAt;
      }
    } else {
      totals[teamId] = (totals[teamId]||0) + bid * settings.setPenaltyPerBid; // negative
      // No bags awarded
    }
  });

  return { totals, bags };
}
