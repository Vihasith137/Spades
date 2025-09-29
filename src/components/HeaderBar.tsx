import React from "react";
import { useStopwatch } from 'react-timer-hook';
function Stopwatch({ isActive }) {
  const { seconds, minutes, start, pause, reset } = useStopwatch({ autoStart: false });
  React.useEffect(() => { if(isActive) start(); else pause(); }, [isActive]);
  return <div style={{ fontWeight: 'bold', color: 'red', fontSize: '1.5rem' }}>
    {minutes}:{seconds < 10 ? '0' : ''}{seconds}
  </div>;
}

export default function HeaderBar((gameActive)) {
  return (
    <header className="site-header">
      <div className="spade-logo" aria-hidden>
        {/* inline spade */}
        <svg viewBox="0 0 100 100">
          <path d="M50 5C35 25 13 38 13 58c0 11 8 19 19 19 5 0 10-1 14-4-3 6-7 10-12 13l-8 4h48l-8-4c-5-3-9-7-12-13 4 3 9 4 14 4 11 0 19-8 19-19 0-20-22-33-37-53z" />
        </svg>
        <Stopwatch isActive={gameActive} />
      </div>
      <h1 className="brand">SPADES</h1>
    </header>
  );
}

