import React from "react";
import confetti from "./confetti";

export default function Leaderboard({
  scores,
  onClose,
  final = false,
}:{
  scores: { team: string; score: number; }[];
  onClose: ()=>void;
  final?: boolean;
}){
  React.useEffect(()=>{
    if(final) {
      confetti();
    }
  },[final]);

  return (
    <div className="modal">
      <div className="modal-body">
        <h3>{final ? "Final Leaderboard" : "Round Leaderboard"}</h3>
        <ul className="lb">
          {scores.sort((a,b)=> b.score - a.score).map((s,i)=> (
            <li key={s.team}><span>{i+1}.</span> <strong>{s.team}</strong> <em>{s.score}</em></li>
          ))}
        </ul>
        <button onClick={onClose}>{final ? "Finish" : "Continue"}</button>
      </div>
    </div>
  );
}
