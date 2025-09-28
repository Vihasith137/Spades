import React from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Leaderboard from "../components/Leaderboard";
import { scoreRound } from "../lib/scoring";
import { Team } from "../lib/types";

export default function Game() {
  const { sessionId } = useParams();
  const [loaded, setLoaded] = React.useState(false);
  const [roundIndex, setRoundIndex] = React.useState(0);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [totals, setTotals] = React.useState<Record<string, number>>({});
  const [bags, setBags] = React.useState<Record<string, number>>({});
  const [inputs, setInputs] = React.useState<any>({});
  const [showLB, setShowLB] = React.useState(false);
  const [final, setFinal] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    const ref = doc(db, "sessions", sessionId!);
    const unsub = onSnapshot(ref, (snap) => {
      const d = snap.data() as any;
      if (!d) return;
      setTeams(d.teams || []);
      setTotals(d.totals || {});
      setBags(d.bags || {});
      setRoundIndex(d.rounds?.length || 0);
      setLoaded(true);
    });
    return () => unsub();
  }, [sessionId]);

  const setField = (teamId: string, name: string, val: any) => {
    setInputs((prev: any) => ({
      ...prev,
      [teamId]: { ...prev[teamId], [name]: val },
    }));
  };

  const submitRound = async () => {
    const currentRound = Math.min(roundIndex + 1, 13);

    // sum Tricks Won across all teams for validation
    const tricksSum = teams.reduce(
      (sum, t) => sum + Number((inputs[t.id]?.tricks ?? 0) || 0),
      0
    );

    if (tricksSum !== currentRound) {
      setError(
        `Round ${currentRound}: total "Tricks Won" across all teams must equal ${currentRound}, but you entered ${tricksSum}.`
      );
      return;
    }
    setError("");

    const ref = doc(db, "sessions", sessionId!);
    const snap = await getDoc(ref);
    const d = snap.data() as any;

    const roundInputs = inputs;
    const scored = scoreRound(roundInputs, d.totals, d.bags, d.settings);
    const newRounds = [...(d.rounds || []), roundInputs];

    await updateDoc(ref, {
      rounds: newRounds,
      totals: scored.totals,
      bags: scored.bags,
    });

    setInputs({});
    setShowLB(true);
    if (newRounds.length >= 13) setFinal(true);
  };

  const closeLB = () => setShowLB(false);

  const scoresArr = teams.map((t) => ({
    team: t.name,
    score: totals[t.id] || 0,
  }));

  if (!loaded) return <div className="center">Loading game…</div>;

  const currentRound = Math.min(roundIndex + 1, 13);

  return (
    <div className="page">
      <header className="row spread">
        <h2>Round {currentRound} / 13</h2>
        <div className="mini">
          {teams.map((t) => `${t.name}: ${bags[t.id] || 0} bags`).join("  ·  ")}
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="grid">
        {teams.map((t) => (
          <div className="card" key={t.id}>
            <h3>{t.name}</h3>
            <div className="players">
              {t.players[0]} & {t.players[1]}
            </div>
            <div className="row">
              <label>
                Bid
                <input
                  type="number"
                  min={0}
                  max={13}
                  onChange={(e) => setField(t.id, "bid", Number(e.target.value))}
                />
              </label>
              <label>
                Tricks Won
                <input
                  type="number"
                  min={0}
                  max={13}
                  onChange={(e) =>
                    setField(t.id, "tricks", Number(e.target.value))
                  }
                />
              </label>
            </div>
            <div className="row">
              <label className="chk">
                <input
                  type="checkbox"
                  onChange={(e) => setField(t.id, "nil", e.target.checked)}
                />{" "}
                Nil
              </label>
              <label className="chk">
                <input
                  type="checkbox"
                  onChange={(e) => setField(t.id, "blindNil", e.target.checked)}
                />{" "}
                Blind Nil
              </label>
            </div>
            <div className="total">
              Total: <b>{totals[t.id] || 0}</b>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <button onClick={submitRound} disabled={roundIndex >= 13}>
          {roundIndex >= 12 ? "Submit Final Round" : "Submit Round"}
        </button>
        <button className="ghost" onClick={() => setShowLB(true)}>
          Show Leaderboard
        </button>
      </div>

      {showLB && (
        <Leaderboard
          scores={scoresArr}
          final={final || roundIndex >= 13}
          onClose={closeLB}
        />
      )}
    </div>
  );
}
