import React, { useState, useEffect, useRef } from 'react';
import { BetControls } from '../BetControls';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

export function EntropyCollapseGame({ balance, setBalance, onUpdateStats }) {
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState(0);
  const [gridNodes, setGridNodes] = useState(Array(16).fill('stable')); // 'stable', 'collapsed', 'survived'
  const [survivingNode, setSurvivingNode] = useState(null);
  const [resultMsg, setResultMsg] = useState(null);

  const canvasRef = useRef(null);

  // Background Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleNodeSelect = (idx) => {
    if (isPlaying) return;
    soundFx.playClick();
    setSelectedNode(idx);
  };

  const handlePlay = () => {
    if (isPlaying || selectedNode === null || betAmount > balance) return;

    setIsPlaying(true);
    setResultMsg(null);
    setSurvivingNode(null);
    setBalance(prev => prev - betAmount);
    setGridNodes(Array(16).fill('stable'));

    const winningIdx = Math.floor(Math.random() * 16);
    const collapseSequence = Array.from({ length: 16 }, (_, i) => i).filter(i => i !== winningIdx);
    // Shuffle sequence
    for (let i = collapseSequence.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [collapseSequence[i], collapseSequence[j]] = [collapseSequence[j], collapseSequence[i]];
    }

    let step = 0;
    const interval = setInterval(() => {
      if (step < collapseSequence.length) {
        const nodeToCollapse = collapseSequence[step];
        soundFx.playPulse(200 + step * 30);
        setGridNodes(prev => {
          const next = [...prev];
          next[nodeToCollapse] = 'collapsed';
          return next;
        });
        step++;
      } else {
        clearInterval(interval);
        setSurvivingNode(winningIdx);
        setGridNodes(prev => {
          const next = [...prev];
          next[winningIdx] = 'survived';
          return next;
        });

        const isWin = selectedNode === winningIdx;
        const multiplier = 14.5;
        const payout = isWin ? betAmount * multiplier : 0;

        if (isWin) {
          soundFx.playWin();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          setBalance(prev => prev + payout);
          setResultMsg({ win: true, amount: payout, mult: multiplier });
        } else {
          soundFx.playLoss();
          setResultMsg({ win: false, amount: 0 });
        }

        onUpdateStats(isWin, payout);
        setIsPlaying(false);
      }
    }, 120);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} width={800} height={400} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-widest bg-purple-950/60 border border-purple-800 px-3 py-1 rounded-full">
            ENTROPY COLLAPSE • 14.5x MULTIPLIER POTENTIAL
          </span>
          <p className="text-xs text-slate-400 max-w-md">
            Select 1 node out of 16 in the quantum grid. As system entropy decays, nodes collapse one by one. Survive to claim the 14.5x jackpot!
          </p>

          {/* 4x4 Grid */}
          <div className="grid grid-cols-4 gap-3 my-4">
            {gridNodes.map((status, idx) => {
              const isSelected = selectedNode === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleNodeSelect(idx)}
                  disabled={isPlaying}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl font-mono text-sm font-bold transition-all relative overflow-hidden border ${
                    status === 'collapsed'
                      ? 'bg-slate-950 border-red-900/40 text-red-950 scale-90 opacity-40'
                      : status === 'survived'
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white border-emerald-300 scale-105 shadow-xl shadow-emerald-500/50 animate-pulse'
                      : isSelected
                      ? 'bg-purple-600 text-white border-purple-300 shadow-lg shadow-purple-600/40 scale-105 ring-2 ring-purple-400'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 border-slate-700'
                  }`}
                >
                  <span className="relative z-10">#{idx + 1}</span>
                  {isSelected && status === 'stable' && (
                    <div className="absolute inset-0 bg-purple-500/20 animate-ping rounded-2xl" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Callout */}
          {resultMsg && (
            <div className={`p-3 rounded-xl font-mono text-sm font-bold border ${
              resultMsg.win
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-red-950/80 border-red-500 text-red-300'
            }`}>
              {resultMsg.win
                ? `🎉 NODE SURVIVED! YOU WON +$${resultMsg.amount.toFixed(2)} (${resultMsg.mult}x)!`
                : `💥 NODE COLLAPSED IN ENTROPY DECAY. TRY AGAIN!`}
            </div>
          )}

        </div>
      </div>

      <BetControls
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        balance={balance}
        onPlay={handlePlay}
        isPlaying={isPlaying}
        playText="START COLLAPSE"
      />
    </div>
  );
}
