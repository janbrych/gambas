import React, { useState, useMemo } from 'react';
import { GAMES, GAME_CATEGORIES } from '../data/games';
import {
  Search, Sparkles, Zap, Trophy, Play, ShieldAlert,
  Grid, Atom, Orbit, Sun, Clock, GitBranch, Brain, Snowflake,
  Moon, Activity, Cpu, RotateCw, Maximize2, Layers, Box, Flame,
  Dna, Star, Compass, Shield, Disc, Radio, SunDim, Share2, Droplet,
  Circle, Lock, Wind
} from 'lucide-react';
import { soundFx } from '../utils/sound';

const ICON_MAP = {
  Grid, Atom, Orbit, Sun, Clock, GitBranch, Brain, Snowflake,
  Zap, Moon, Activity, Cpu, RotateCw, Sparkles, Maximize2, Layers,
  Box, Flame, Dna, Star, Compass, Shield, Disc, Radio, SunDim,
  Share2, Droplet, Circle, Lock, Wind
};

export function Lobby({ onSelectGame }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleGameClick = (game) => {
    soundFx.playClick();
    onSelectGame(game);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-950/80 border border-purple-500/20 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" /> 30 Unprecedented Conceptual Casino Experiences
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Next-Gen Quantum & Physics <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Speculative Gaming
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Step into 30 original games featuring physical simulations, wave harmonics, 4D dimensional shadows, and neural cascade algorithms. Pure luck meets scientific interactive mechanics.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {GAME_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search 30 games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => {
          const IconComponent = ICON_MAP[game.icon] || Sparkles;

          return (
            <div
              key={game.id}
              onClick={() => handleGameClick(game)}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/50 cursor-pointer overflow-hidden"
            >
              {/* Dynamic Gradient Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity rounded-bl-full blur-xl pointer-events-none`} />

              <div>
                {/* Top Row: Icon & RTP Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">RTP</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{game.rtp}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {game.description}
                </p>
              </div>

              {/* Bottom Row: Tags & Action Button */}
              <div className="space-y-4 pt-2 border-t border-slate-800/60">
                <div className="flex flex-wrap gap-1.5">
                  {game.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 font-mono border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">
                    Vol: <strong className="text-purple-400">{game.volatility}</strong>
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 group-hover:bg-purple-500 text-white text-xs font-bold transition shadow-md">
                    <span>PLAY</span>
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">No games matching your search criteria.</p>
        </div>
      )}

    </div>
  );
}
