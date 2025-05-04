/**
 * All possible card ranks in a standard 52-card deck.
 * Go Fish uses only the rank for gameplay.
 */
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

/**
 * The four traditional suits of a playing card.
 * Optional for game logic, but required for rendering.
 */
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

/**
 * A single playing card.
 * Suit is required for rendering purposes, though not used in Go Fish gameplay.
 */
type Card = {
  rank: Rank;
  suit: Suit;
};

/**
 * A player in the game.
 */
type Player = {
  id: string;
  name: string;
  hand: Card[];
  books: Rank[];
  isComputer?: boolean;
};

/**
 * A single entry in the game log, useful for UI feeds or debugging.
 */
type GameLogEntry = {
  turn: number;
  text: string;
};

/**
 * The full internal state of a Go Fish game.
 * This is managed by the game engine and may be serialized for saving progress.
 */
type GameState = {
  deck: Card[];
  players: Player[];
  currentPlayerIndex: number;
  log: GameLogEntry[];
};

/**
 * An action where one player asks another for a rank.
 */
type AskAction = {
  fromPlayerId: string;
  toPlayerId: string;
  rank: Rank;
};

/**
 * The result of a player's turn.
 * Encapsulates whether they succeeded, drew a card, completed books, or ended the game.
 */
type TurnResult =
  | {
      type: 'ask_success';
      booksCompleted: Rank[];
      gameOver: boolean;
    }
  | {
      type: 'ask_fail_fish';
      drewCard: Card | null;
      booksCompleted: Rank[];
      gameOver: boolean;
    };

export type { Rank, Suit, Card, Player, GameState, AskAction, TurnResult };
