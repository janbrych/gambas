import React, { useState } from 'react';
import { BetControls } from '../BetControls';
import { soundFx } from '../../utils/sound';
import confetti from 'canvas-confetti';

export function GenericCasinoGame({ game, balance, setBalance, onUpdateStats }) {
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [outcome, setOutcome] = useState(null);

  const options = [
    { id: 0, label: 'ALPHA STAGE', mult: 2.1 },
    { id: 1, label: 'BETA RESONANCE', mult: 4.5 },
    { id: 2, label: 'GAMMA MATRIX', mult: 8.8 },
  ];

  const handlePlay = () => {
    if (isPlaying || betAmount > balance) return;

    setIsPlaying(true);
    setOutcome(null);
    setBalance(prev => prev - betAmount);

    let pulseCount = 0;
    const interval = setInterval(() => {
      pulseCount++;
      soundFx.playPulse(300 + pulseCount * 50);

      if (pulseCount >= 10) {
        clearInterval(interval);

        const winProbability = selectedOption === 0 ? 0.46 : selectedOption === 1 ? 0.22 : 0.11;
        const isWin = Math.random() < winProbability;
        const targetOption = options[selectedOption];
        const payout = isWin ? betAmount * targetOption.mult : 0;

        if (isWin) {
          soundFx.playWin();
          confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
          setBalance(prev => prev + payout);
          setOutcome({ win: true, amount: payout, mult: targetOption.mult });
        } else {
          soundFx.playLoss();
          setOutcome({ win: false, amount: 0 });
        }

        onUpdateStats(isWin, payout);
        setIsPlaying(false);
      }
    }, 120);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl text-center space-y-4">

        <span className="text-xs font-mono text-purple-400 uppercase tracking-widest bg-purple-950/60 border border-purple-800 px-3 py-1 rounded-full">
          {game.title} • RTP {game.rtp}
        </span>

        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          {game.description}
        </p>

        {/* Dynamic Simulation Graphic */}
        <div className="my-6 p-8 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-cyan-900/10 pointer-events-none" />

          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-white shadow-2xl mb-4 ${
            isPlaying ? 'animate-bounce shadow-purple-500/50' : 'animate-pulse'
          }`}>
            <span className="font-mono text-2xl font-black">{isPlaying ? '...' : 'AQ'}</span>
          </div>

          <div className="font-mono text-xs text-slate-400 tracking-wider">
            SYSTEM STATUS: <span className={isPlaying ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
              {isPlaying ? "SIMULATING QUANTUM VECTORS..." : "READY FOR INPUT"}
            </span>
          </div>
        </div>

        {/* Target Multiplier Option Selector */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedOption(opt.id);
              }}
              disabled={isPlaying}
              className={`p-3 rounded-xl border flex flex-col items-center transition ${
                selectedOption === opt.id
                  ? 'bg-purple-600 text-white border-purple-300 shadow-lg shadow-purple-600/30 ring-2 ring-purple-400 scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-300">{opt.label}</span>
              <span className="text-base font-black font-mono text-amber-300 mt-1">{opt.mult}x</span>
            </button>
          ))}
        </div>

        {/* Outcome Display */}
        {outcome && (
          <div className={`p-3 rounded-xl font-mono text-sm font-bold border max-w-md mx-auto ${
            outcome.win
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-red-950/80 border-red-500 text-red-300'
          }`}>
            {outcome.win
              ? `🎉 TARGET EQUILIBRIUM ACHIEVED! WON +$${outcome.amount.toFixed(2)} (${outcome.mult}x)!`
              : `💥 HARMONIC DISRUPTION. SYSTEM RESET. TRY AGAIN!`}
          </div>
        )}

      </div>

      <BetControls
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        balance={balance}
        onPlay={handlePlay}
        isPlaying={isPlaying}
        playText="EXECUTE SEQUENCE"
      />
    </div>
  );
}
