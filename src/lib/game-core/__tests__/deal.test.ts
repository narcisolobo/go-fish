import { dealCards } from '../deal';
import { generateDeck } from '../utils';
import type { Player, Card } from '../types';

describe('dealCards', () => {
  it('deals 7 cards to each player when there are 2 players', () => {
    const deck: Card[] = generateDeck(); // or stub deck manually
    const players: Player[] = [
      { id: '1', name: 'Alice', hand: [], books: [] },
      { id: '2', name: 'Bob', hand: [], books: [] },
    ];

    const { updatedPlayers, remainingDeck } = dealCards(deck, players);

    expect(updatedPlayers[0].hand).toHaveLength(7);
    expect(updatedPlayers[1].hand).toHaveLength(7);
    expect(remainingDeck.length).toBe(deck.length - 14);
  });

  it('deals 5 cards to each player when there are 3 or more players', () => {
    const deck: Card[] = generateDeck();
    const players: Player[] = [
      { id: '1', name: 'A', hand: [], books: [] },
      { id: '2', name: 'B', hand: [], books: [] },
      { id: '3', name: 'C', hand: [], books: [] },
    ];

    const { updatedPlayers, remainingDeck } = dealCards(deck, players);

    for (const player of updatedPlayers) {
      expect(player.hand).toHaveLength(5);
    }
    expect(remainingDeck.length).toBe(deck.length - 15);
  });
});
