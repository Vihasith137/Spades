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

