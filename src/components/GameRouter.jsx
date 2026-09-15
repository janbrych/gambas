import React from 'react';
import { EntropyCollapseGame } from './games/EntropyCollapseGame';
import { QuantumSpinorGame } from './games/QuantumSpinorGame';
import { GravitySlingshotGame } from './games/GravitySlingshotGame';
import { GenericCasinoGame } from './games/GenericCasinoGame';

export function GameRouter({ game, balance, setBalance, onUpdateStats }) {
  if (!game) return null;

  switch (game.id) {
    case 'entropy-collapse':
      return <EntropyCollapseGame balance={balance} setBalance={setBalance} onUpdateStats={onUpdateStats} />;
    case 'quantum-spinor':
      return <QuantumSpinorGame balance={balance} setBalance={setBalance} onUpdateStats={onUpdateStats} />;
    case 'gravity-slingshot':
      return <GravitySlingshotGame balance={balance} setBalance={setBalance} onUpdateStats={onUpdateStats} />;
    default:
      return <GenericCasinoGame game={game} balance={balance} setBalance={setBalance} onUpdateStats={onUpdateStats} />;
  }
}
