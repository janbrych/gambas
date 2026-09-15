import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Lobby } from './components/Lobby';
import { GameRouter } from './components/GameRouter';

export function App() {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('aetheria_balance');
    return saved ? parseFloat(saved) : 1000.00;
  });

  const [soundMuted, setSoundMuted] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('aetheria_stats');
    return saved ? JSON.parse(saved) : { wins: 0, gamesPlayed: 0, totalWon: 0 };
  });

  useEffect(() => {
    localStorage.setItem('aetheria_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('aetheria_stats', JSON.stringify(stats));
  }, [stats]);

  const handleUpdateStats = (isWin, payout) => {
    setStats(prev => ({
      wins: isWin ? prev.wins + 1 : prev.wins,
      gamesPlayed: prev.gamesPlayed + 1,
      totalWon: prev.totalWon + (isWin ? payout : 0)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Header
        balance={balance}
        setBalance={setBalance}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        stats={stats}
        activeGame={activeGame}
        onBackToLobby={() => setActiveGame(null)}
      />

      <main className="flex-1">
        {activeGame ? (
          <div className="py-6">
            <GameRouter
              game={activeGame}
              balance={balance}
              setBalance={setBalance}
              onUpdateStats={handleUpdateStats}
            />
          </div>
        ) : (
          <Lobby onSelectGame={(game) => setActiveGame(game)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© Aetheria Quantum Casino • Speculative Virtual Play</span>
          <span>30 Original Conceptual Casino Experiences</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
