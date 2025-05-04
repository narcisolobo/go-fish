import type { Card, Player } from './types';

export function dealCards(
  deck: Card[],
  players: Player[]
): { updatedPlayers: Player[]; remainingDeck: Card[] } {
  // stub
  return { updatedPlayers: players, remainingDeck: deck };
}
