import React, { useState } from 'react';
import {
  Coins, Volume2, VolumeX, RefreshCw, Trophy,
  BarChart2, Search, Zap, ShieldAlert, Sparkles, Gamepad2, ArrowLeft
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export function Header({ balance, setBalance, soundMuted, setSoundMuted, stats, activeGame, onBackToLobby }) {
  const [isRefilling, setIsRefilling] = useState(false);

  const handleRefill = () => {
    setIsRefilling(true);
    soundFx.playWin();
    setTimeout(() => {
      setBalance(prev => prev + 1000);
      setIsRefilling(false);
    }, 400);
  };

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setSoundMuted(muted);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">

        {/* Logo & Navigation */}
        <div className="flex items-center gap-4">
          {activeGame ? (
            <button
              onClick={onBackToLobby}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              <span>Lobby</span>
            </button>
          ) : null}

          <div
            onClick={onBackToLobby}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent uppercase">
                Aetheria
              </h1>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">Quantum Casino</p>
            </div>
          </div>
        </div>

        {/* User Balance & Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Stats Summary */}
          <div className="hidden md:flex items-center gap-4 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Wins: <strong className="text-amber-400">{stats.wins}</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Played: <strong className="text-cyan-400">{stats.gamesPlayed}</strong></span>
            </div>
          </div>

          {/* Virtual Credit Balance Box */}
          <div className="flex items-center gap-2 bg-slate-950 border border-purple-500/30 rounded-xl px-3 sm:px-4 py-2 shadow-inner">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
              <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none">
                Virtual Balance
              </span>
              <span className="text-base sm:text-lg font-black text-amber-300 font-mono leading-none mt-0.5">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Quick Refill Button */}
            <button
              onClick={handleRefill}
              disabled={isRefilling}
              title="Refill Virtual Credits (+$1,000)"
              className="ml-2 p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white transition border border-purple-500/40 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefilling ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title={soundMuted ? "Unmute Sound FX" : "Mute Sound FX"}
          >
            {soundMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>

      </div>
    </header>
  );
}
