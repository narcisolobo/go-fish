import { dealCards, generateDeck, shuffle } from '../utils';
import type { Card, Player } from '../types';

describe('generateDeck', () => {
  it('creates a full deck of 52 unique cards', () => {
    const deck = generateDeck();
    expect(deck).toHaveLength(52);

    const uniqueCards = new Set(deck.map((card) => `${card.rank}-${card.suit}`));
    expect(uniqueCards.size).toBe(52);
  });
});

describe('shuffle', () => {
  it('returns a deck of the same length with the same cards', () => {
    const original = generateDeck();
    const shuffled = shuffle(original);

    expect(shuffled).toHaveLength(52);

    const sortedOriginal = [...original].sort(cardSorter);
    const sortedShuffled = [...shuffled].sort(cardSorter);

    expect(sortedShuffled).toEqual(sortedOriginal);
  });

  it('likely changes card order', () => {
    const deck = generateDeck();
    const shuffled = shuffle(deck);
    // Not guaranteed, but likely different
    const isSameOrder = deck.every((card, i) => card === shuffled[i]);
    expect(isSameOrder).toBe(false);
  });
});

describe('dealCards', () => {
  it('deals 7 cards to each player when there are 2 players', () => {
    const deck: Card[] = generateDeck();
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

/**
 * Helper function for deterministic sorting of cards.
 */
function cardSorter(a: Card, b: Card): number {
  if (a.rank !== b.rank) {
    return rankOrder(a.rank) - rankOrder(b.rank);
  }
  return suitOrder(a.suit) - suitOrder(b.suit);
}

function rankOrder(rank: string): number {
  const order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  return order.indexOf(rank);
}

function suitOrder(suit: string): number {
  const order = ['clubs', 'diamonds', 'hearts', 'spades'];
  return order.indexOf(suit);
}
