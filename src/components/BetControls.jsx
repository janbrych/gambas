import React from 'react';
import { Coins, Zap, RefreshCw } from 'lucide-react';
import { soundFx } from '../utils/sound';

export function BetControls({ betAmount, setBetAmount, balance, onPlay, isPlaying, playText = 'SPIN / PLAY', disabled = false }) {
  const handleBetChange = (amount) => {
    soundFx.playClick();
    const cleanAmount = Math.max(1, Math.min(balance, Math.floor(amount)));
    setBetAmount(cleanAmount);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      {/* Bet Amount Controls */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-1">BET:</span>
        <div className="relative flex-1 sm:w-40">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => handleBetChange(Number(e.target.value))}
            disabled={isPlaying || disabled}
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-7 pr-3 py-2 text-sm font-mono text-amber-300 outline-none transition"
          />
        </div>

        {/* Quick Bet Modifiers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleBetChange(10)}
            disabled={isPlaying || disabled}
            className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition"
          >
            $10
          </button>
          <button
            onClick={() => handleBetChange(betAmount / 2)}
            disabled={isPlaying || disabled}
            className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition"
          >
            ½
          </button>
          <button
            onClick={() => handleBetChange(betAmount * 2)}
            disabled={isPlaying || disabled}
            className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition"
          >
            2×
          </button>
          <button
            onClick={() => handleBetChange(balance)}
            disabled={isPlaying || disabled}
            className="px-2.5 py-2 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 text-xs font-mono border border-purple-800 transition"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Main Play / Action Button */}
      <button
        onClick={onPlay}
        disabled={isPlaying || disabled || betAmount > balance || betAmount <= 0}
        className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 ${
          isPlaying
            ? 'bg-purple-900 text-purple-300 cursor-not-allowed'
            : betAmount > balance || betAmount <= 0 || disabled
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-600/30 hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isPlaying ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>PROCESSING...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 fill-current" />
            <span>{playText}</span>
          </>
        )}
      </button>
    </div>
  );
}
