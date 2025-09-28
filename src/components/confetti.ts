// Tiny confetti using canvas
export default function confetti(durationMs: number = 2500){
  const c = document.createElement("canvas");
  c.style.position = "fixed";
  c.style.inset = "0";
  c.style.pointerEvents = "none";
  c.width = innerWidth; c.height = innerHeight;
  document.body.appendChild(c);
  const ctx = c.getContext("2d")!;
  const N = 220, parts = Array.from({length:N},(_,i)=>({
    x: Math.random()*c.width,
    y: -20 - Math.random()*c.height,
    r: 2+Math.random()*4,
    vy: 2+Math.random()*3,
    vx: -1+Math.random()*2,
    rot: Math.random()*Math.PI,
    vr: -0.1+Math.random()*0.2
  }));
  let stopAt = performance.now()+durationMs;
  const tick = () =>{
    ctx.clearRect(0,0,c.width,c.height);
    parts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
      ctx.save();
      ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.fillRect(-p.r,-p.r,p.r*2,p.r*2);
      ctx.restore();
      if(p.y>c.height+10) { p.y=-20; }
    });
    if(performance.now()<stopAt) requestAnimationFrame(tick); else c.remove();
  };
  tick();
}
