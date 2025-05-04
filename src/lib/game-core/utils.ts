import type { Card, Player, Rank, Suit } from './types';

/**
 * All four suits in a standard deck.
 */
const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

/**
 * All ranks used in Go Fish.
 */
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Generates a full, unshuffled 52-card deck.
 */
function generateDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }

  return deck;
}

/**
 * Shuffles a deck of cards using Fisher–Yates algorithm.
 */
function shuffle(deck: Card[]): Card[] {
  const result = [...deck];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Deals cards to players according to Go Fish rules.
 * - 7 cards each for 2 players
 * - 5 cards each for 3+ players
 */
function dealCards(
  deck: Card[],
  players: Player[]
): { updatedPlayers: Player[]; remainingDeck: Card[] } {
  const handSize = players.length === 2 ? 7 : 5;
  const updatedPlayers: Player[] = [];
  const deckCopy = [...deck];

  for (const player of players) {
    const hand = deckCopy.splice(0, handSize);
    updatedPlayers.push({ ...player, hand });
  }

  return {
    updatedPlayers,
    remainingDeck: deckCopy,
  };
}

/**
 * Returns a list of ranks that appear exactly four times in a hand.
 * These are considered "books" in Go Fish.
 */
function hasBook(hand: Card[]): Rank[] {
  const countMap: Record<Rank, number> = {} as Record<Rank, number>;

  for (const card of hand) {
    countMap[card.rank] = (countMap[card.rank] || 0) + 1;
  }

  return Object.entries(countMap)
    .filter(([_, count]) => count === 4)
    .map(([rank]) => rank as Rank);
}

/**
 * Returns a copy of the hand with all cards of the given ranks removed.
 */
function removeBooksFromHand(hand: Card[], books: Rank[]): Card[] {
  const bookSet = new Set(books);
  return hand.filter((card) => !bookSet.has(card.rank));
}

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

function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

export { assertNever, cardSorter, dealCards, generateDeck, hasBook, removeBooksFromHand, shuffle };
