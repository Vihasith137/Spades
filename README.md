# Spades League – Web App

An interactive 13‑round Spades tournament app. Supports 2–5 teams (2 players per team), round‑by‑round scoring, mid‑round leaderboard modal, and final confetti celebration.

## Features
- Email + password sign up (verification required) and Google sign‑in
- Create a new game session, enter 2–5 team names and 2 players per team
- 13 rounds; after each submission a leaderboard modal appears; close it to resume play
- Standard Spades scoring (configurable):
  - If tricks ≥ bid: `10 × bid` plus `+1` per overtrick (bag)
  - If tricks < bid: `−10 × bid`
  - Bags accumulate; every 10 bags: `−100` (configurable)
  - Nil: `+100` on success (0 tricks), `−100` on fail (configurable)
  - Blind Nil: `+200` / `−200` (configurable)
- Persistent sessions in Firestore; real‑time updates
- Final leaderboard shows confetti for the winner

> If your Excel template defines different points (e.g., different bag penalties), adjust `settings` when creating a session in `Setup.tsx` or make a UI for it.

## Quick Start
1. Create a Firebase project (Authentication + Firestore).
2. Enable Email/Password and Google in **Authentication → Sign‑in method**.
3. Copy Web SDK config into `src/firebase.ts`.
4. Deploy Firestore rules from `firebase.rules`.
5. Install and run:
   ```bash
   npm i
   npm run dev
   ```

## Notes
- Leaderboard is shown after each `Submit Round`, and can be opened on demand via button.
- The app enforces a maximum of 5 teams; tweak in `Setup.tsx` to change.
- All game data is stored inside a `sessions/{id}` document: teams, rounds, totals, and bags.
- To import scoring from your sheet, map its columns into the `TeamRoundInput` shape: `{ bid, tricks, nil, blindNil }`.
