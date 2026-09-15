import React, { useState, useEffect, useRef } from 'react';
import { BetControls } from '../BetControls';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

export function QuantumSpinorGame({ balance, setBalance, onUpdateStats }) {
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState('UP'); // 'UP' (0°), 'DOWN' (180°), 'RIGHT' (90°), 'LEFT' (270°)
  const [angle, setAngle] = useState(0);
  const [resultMsg, setResultMsg] = useState(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = 90;

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Quantum Bloch Sphere Outer Ring
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Equatorial Grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius - 15); ctx.lineTo(cx, cy + radius + 15);
      ctx.moveTo(cx - radius - 15, cy); ctx.lineTo(cx + radius + 15, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spinor Vector Pointer
      const rad = (angle - 90) * (Math.PI / 180);
      const vx = cx + radius * Math.cos(rad);
      const vy = cy + radius * Math.sin(rad);

      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(vx, vy);
      ctx.stroke();

      // Vector Point Glowing Head
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(vx, vy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [angle]);

  const handlePlay = () => {
    if (isPlaying || betAmount > balance) return;

    setIsPlaying(true);
    setResultMsg(null);
    setBalance(prev => prev - betAmount);

    let currentAngle = angle;
    const finalAngle = Math.floor(Math.random() * 360);
    const totalSpin = 360 * 5 + finalAngle;
    let speed = 25;

    const interval = setInterval(() => {
      currentAngle += speed;
      speed = Math.max(2, speed * 0.985);
      setAngle(currentAngle % 360);
      soundFx.playPulse(300 + (currentAngle % 360));

      if (currentAngle >= totalSpin && speed <= 2.5) {
        clearInterval(interval);
        const settledAngle = Math.round(finalAngle);
        setAngle(settledAngle);

        // Determine Quadrant / Direction
        let landedPhase = 'UP';
        if (settledAngle >= 45 && settledAngle < 135) landedPhase = 'RIGHT';
        else if (settledAngle >= 135 && settledAngle < 225) landedPhase = 'DOWN';
        else if (settledAngle >= 225 && settledAngle < 315) landedPhase = 'LEFT';

        const isWin = selectedPhase === landedPhase;
        const multiplier = 3.8;
        const payout = isWin ? betAmount * multiplier : 0;

        if (isWin) {
          soundFx.playWin();
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          setBalance(prev => prev + payout);
          setResultMsg({ win: true, amount: payout, mult: multiplier, landed: landedPhase });
        } else {
          soundFx.playLoss();
          setResultMsg({ win: false, amount: 0, landed: landedPhase });
        }

        onUpdateStats(isWin, payout);
        setIsPlaying(false);
      }
    }, 20);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl text-center space-y-4">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-800 px-3 py-1 rounded-full">
          QUANTUM SPINOR • 3.8x MULTIPLIER POTENTIAL
        </span>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Predict quantum state vector polarization angle collapse (|ψ⟩ superposition state).
        </p>

        {/* Canvas Visualizer */}
        <div className="flex justify-center my-2">
          <canvas ref={canvasRef} width={280} height={280} className="bg-slate-950/80 rounded-full border border-cyan-500/30 shadow-inner" />
        </div>

        {/* Phase Selector */}
        <div className="flex justify-center items-center gap-3">
          {[
            { id: 'UP', label: '|↑⟩ UP (0°)', color: 'border-cyan-500' },
            { id: 'RIGHT', label: '|→⟩ RIGHT (90°)', color: 'border-blue-500' },
            { id: 'DOWN', label: '|↓⟩ DOWN (180°)', color: 'border-indigo-500' },
            { id: 'LEFT', label: '|←⟩ LEFT (270°)', color: 'border-purple-500' },
          ].map(phase => (
            <button
              key={phase.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedPhase(phase.id);
              }}
              disabled={isPlaying}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition border ${
                selectedPhase === phase.id
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border-slate-700'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>

        {/* Result */}
        {resultMsg && (
          <div className={`p-3 rounded-xl font-mono text-sm font-bold border max-w-md mx-auto ${
            resultMsg.win
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-red-950/80 border-red-500 text-red-300'
          }`}>
            {resultMsg.win
              ? `🎉 QUANTUM STATE COLLAPSED TO |${resultMsg.landed}⟩! WON +$${resultMsg.amount.toFixed(2)} (${resultMsg.mult}x)!`
              : `💥 COLLAPSED TO |${resultMsg.landed}⟩. STATE DECOHERENCE. TRY AGAIN!`}
          </div>
        )}
      </div>

      <BetControls
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        balance={balance}
        onPlay={handlePlay}
        isPlaying={isPlaying}
        playText="COLLAPSE SPINOR"
      />
    </div>
  );
}
