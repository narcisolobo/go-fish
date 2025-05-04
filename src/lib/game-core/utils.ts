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

export { dealCards, generateDeck, shuffle };
