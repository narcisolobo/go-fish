import type { Card, GameState, Rank } from './types';

const rankNames = {
  singular: {
    A: 'Ace',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine',
    10: 'Ten',
    J: 'Jack',
    Q: 'Queen',
    K: 'King',
  },
  plural: {
    A: 'Aces',
    2: 'Twos',
    3: 'Threes',
    4: 'Fours',
    5: 'Fives',
    6: 'Sixes',
    7: 'Sevens',
    8: 'Eights',
    9: 'Nines',
    10: 'Tens',
    J: 'Jacks',
    Q: 'Queens',
    K: 'Kings',
  },
};

const pluralMap: Record<string, string> = {
  Six: 'Sixes',
  Two: 'Twos',
  Three: 'Threes',
  Four: 'Fours',
  Five: 'Fives',
  Seven: 'Sevens',
  Eight: 'Eights',
  Nine: 'Nines',
  Ace: 'Aces',
  Jack: 'Jacks',
  Queen: 'Queens',
  King: 'Kings',
  Ten: 'Tens',
};

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

function aOrAn(word: string): 'a' | 'an' {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

function pluralizeRank(rank: string): string {
  return pluralMap[rank] ?? `${rank}s`;
}

function logEvent(game: GameState, text: string) {
  const lastTurn = game.log.length > 0 ? game.log[game.log.length - 1].turn : 0;

  game.log.push({ turn: lastTurn, text });
}

function startNewTurn(game: GameState) {
  const lastTurn = game.log.length > 0 ? game.log[game.log.length - 1].turn : 0;

  game.log.push({ turn: lastTurn + 1, text: `--- Turn ${lastTurn + 1} ---` });
}

export { aOrAn, assertNever, cardSorter, logEvent, pluralizeRank, rankNames, startNewTurn };
