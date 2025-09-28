import React from "react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Team } from "../lib/types";

function mkTeam(i: number): Team {
  const n = i + 1;
  return { id: `t${n}`, name: `Team ${n}`, players: ["", ""] };
}

export default function Setup() {
  const [teamCount, setTeamCount] = React.useState(2);
  const [teams, setTeams] = React.useState<Team[]>([
    { id: "t1", name: "Team 1", players: ["Player 1", "Player 2"] },
    { id: "t2", name: "Team 2", players: ["Player 3", "Player 4"] },
  ]);
  const nav = useNavigate();
  const { user } = useAuth();

  // 🔧 Keep teams array length in sync with teamCount
  React.useEffect(() => {
    setTeams((prev) => {
      const next = [...prev];
      // grow
      while (next.length < teamCount) {
        next.push(mkTeam(next.length));
      }
      // shrink
      return next.slice(0, teamCount);
    });
  }, [teamCount]);

  // 🔧 Safe updater that creates a default team if missing
  const updateTeam = (idx: number, field: "name" | 0 | 1, value: string) => {
    setTeams((prev) => {
      const arr = [...prev];
      if (!arr[idx]) arr[idx] = mkTeam(idx);

      if (field === "name") {
        arr[idx] = { ...arr[idx], name: value };
      } else {
        const players: [string, string] = [...arr[idx].players] as any;
        players[field as 0 | 1] = value;
        arr[idx] = { ...arr[idx], players };
      }
      return arr;
    });
  };

  const start = async () => {
    const finalTeams = teams.slice(0, teamCount);
    const sessionRef = await addDoc(collection(db, "sessions"), {
      ownerUid: user!.uid,
      createdAt: serverTimestamp(),
    });
    const id = sessionRef.id;
    await setDoc(
      doc(db, "sessions", id),
      {
        id,
        ownerUid: user!.uid,
        createdAt: Date.now(),
        teams: finalTeams,
        rounds: [],
        totals: Object.fromEntries(finalTeams.map((t) => [t.id, 0])),
        bags: Object.fromEntries(finalTeams.map((t) => [t.id, 0])),
        settings: {
          bagPenaltyAt: 10,
          bagPenalty: -100,
          perBid: 10,
          perBag: 1,
          setPenaltyPerBid: -10,
          nilWin: 100,
          nilLose: -100,
          blindNilWin: 200,
          blindNilLose: -200,
        },
      },
      { merge: true }
    );
    nav(`/game/${id}`);
  };

  return (
    <div className="page">
      <h2>New Game Setup</h2>
      <label>
        Number of teams (2–5)
        <input
          type="number"
          min={2}
          max={5}
          value={teamCount}
          onChange={(e) => setTeamCount(Math.max(2, Math.min(5, Number(e.target.value))))}
        />
      </label>

      {teams.slice(0, teamCount).map((t, i) => (
        <div className="card" key={t.id}>
          <label>
            Team {i + 1} name
            <input value={t.name} onChange={(e) => updateTeam(i, "name", e.target.value)} />
          </label>
          <div className="row">
            <label>
              Player A
              <input
                value={t.players[0]}
                onChange={(e) => updateTeam(i, 0, e.target.value)}
              />
            </label>
            <label>
              Player B
              <input
                value={t.players[1]}
                onChange={(e) => updateTeam(i, 1, e.target.value)}
              />
            </label>
          </div>
        </div>
      ))}

      <button onClick={start}>Start 13-Round Game</button>
    </div>
  );
}
