import React, { useState, useEffect, useRef } from 'react';
import { BetControls } from '../BetControls';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

export function GravitySlingshotGame({ balance, setBalance, onUpdateStats }) {
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [angle, setAngle] = useState(45); // Launch angle in deg
  const [resultMsg, setResultMsg] = useState(null);

  const canvasRef = useRef(null);

  const handlePlay = () => {
    if (isPlaying || betAmount > balance) return;

    setIsPlaying(true);
    setResultMsg(null);
    setBalance(prev => prev - betAmount);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Simulation params
    const blackHole = { x: width / 2, y: height / 2 + 20, mass: 2500 };
    let probe = {
      x: 30,
      y: height - 50,
      vx: Math.cos(angle * Math.PI / 180) * 8,
      vy: -Math.sin(angle * Math.PI / 180) * 8
    };

    let trail = [];
    let escaped = false;
    let suckedIn = false;
    let frame = 0;

    const anim = setInterval(() => {
      frame++;
      // Gravity physics step
      const dx = blackHole.x - probe.x;
      const dy = blackHole.y - probe.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist < 22) {
        suckedIn = true;
      } else {
        const force = blackHole.mass / distSq;
        const ax = force * (dx / dist);
        const ay = force * (dy / dist);

        probe.vx += ax;
        probe.vy += ay;
        probe.x += probe.vx;
        probe.y += probe.vy;

        trail.push({ x: probe.x, y: probe.y });
        soundFx.playPulse(200 + (10000 / dist));
      }

      if (probe.x > width + 20 || probe.x < -20 || probe.y < -20) {
        escaped = true;
      }

      // Render frame
      ctx.clearRect(0, 0, width, height);

      // Black Hole Event Horizon
      ctx.fillStyle = '#000000';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(blackHole.x, blackHole.y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Accretion Disk Ring
      ctx.strokeStyle = '#amber-500';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(blackHole.x, blackHole.y, 35, 0, Math.PI * 2);
      ctx.stroke();

      // Probe Trail
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      trail.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Probe Position
      if (!suckedIn) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(probe.x, probe.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (escaped || suckedIn || frame > 300) {
        clearInterval(anim);

        if (escaped) {
          // Calculate escape vector multiplier based on max gravity acceleration proximity
          const maxProx = Math.min(...trail.map(p => Math.hypot(p.x - blackHole.x, p.y - blackHole.y)));
          const rawMult = Math.max(1.2, (150 / maxProx) * 1.8);
          const multiplier = Math.min(18.5, Number(rawMult.toFixed(2)));
          const payout = betAmount * multiplier;

          soundFx.playWin();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          setBalance(prev => prev + payout);
          setResultMsg({ win: true, amount: payout, mult: multiplier });
          onUpdateStats(true, payout);
        } else {
          soundFx.playLoss();
          setResultMsg({ win: false, amount: 0 });
          onUpdateStats(false, 0);
        }

        setIsPlaying(false);
      }

    }, 30);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl text-center space-y-4">
        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
          GRAVITY SLINGSHOT • UP TO 18.5x ESCAPE MULTIPLIER
        </span>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Adjust probe launch vector. Slingshot close to the event horizon to multiply escape energy velocity without getting sucked into the singularity!
        </p>

        {/* Canvas Visualizer */}
        <div className="flex justify-center my-2">
          <canvas ref={canvasRef} width={500} height={280} className="bg-slate-950 rounded-2xl border border-amber-500/30 shadow-inner w-full max-w-lg" />
        </div>

        {/* Angle Slider */}
        <div className="flex flex-col items-center gap-2 max-w-xs mx-auto">
          <label className="text-xs font-mono text-slate-300">LAUNCH ANGLE: <strong className="text-amber-400">{angle}°</strong></label>
          <input
            type="range"
            min="10"
            max="80"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Result */}
        {resultMsg && (
          <div className={`p-3 rounded-xl font-mono text-sm font-bold border max-w-md mx-auto ${
            resultMsg.win
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-red-950/80 border-red-500 text-red-300'
          }`}>
            {resultMsg.win
              ? `🚀 GRAVITATIONAL ESCAPE SUCCESSFUL! WON +$${resultMsg.amount.toFixed(2)} (${resultMsg.mult}x)!`
              : `💥 PROBE BREACHED EVENT HORIZON AND CRASHED INTO SINGULARITY!`}
          </div>
        )}
      </div>

      <BetControls
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        balance={balance}
        onPlay={handlePlay}
        isPlaying={isPlaying}
        playText="LAUNCH PROBE"
      />
    </div>
  );
}
