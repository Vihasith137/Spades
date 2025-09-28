export interface Team { id: string; name: string; players: [string, string]; }
export interface RoundScore { bid: number; tricks: number; nil?: boolean; blindNil?: boolean; }
export interface TeamRoundInput { [teamId: string]: RoundScore; }
export interface Session {
  id: string;
  ownerUid: string;
  createdAt: number;
  teams: Team[];
  rounds: TeamRoundInput[]; // 13 elements
  totals: { [teamId: string]: number };
  bags: { [teamId: string]: number };
  settings: ScoringSettings;
}
export interface ScoringSettings {
  bagPenaltyAt: number; // e.g., 10
  bagPenalty: number;   // e.g., -100
  perBid: number;       // e.g., 10
  perBag: number;       // e.g., 1
  setPenaltyPerBid: number; // e.g., -10
  nilWin: number;       // 100
  nilLose: number;      // -100
  blindNilWin: number;  // 200
  blindNilLose: number; // -200
}
