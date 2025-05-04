import { isGameOver, playTurn } from '../game-play';
import type { GameState, Player } from '../types';

describe('playTurn', () => {
  it('returns ask_success and transfers cards from target to asking player', () => {
    const playerA: Player = { id: 'A', name: 'Alice', hand: [], books: [] };
    const playerB: Player = {
      id: 'B',
      name: 'Bob',
      hand: [
        { rank: '5', suit: 'hearts' },
        { rank: '5', suit: 'clubs' },
        { rank: 'Q', suit: 'spades' },
      ],
      books: [],
    };

    const game: GameState = {
      players: [playerA, playerB],
      deck: [],
      currentPlayerIndex: 0,
      log: [],
    };

    const result = playTurn(game, {
      fromPlayerId: 'A',
      toPlayerId: 'B',
      rank: '5',
    });

    expect(result.type).toBe('ask_success');
    expect(result.booksCompleted).toEqual([]);
    expect(result.gameOver).toBe(false);

    const updatedAskingPlayer = game.players.find((p) => p.id === 'A')!;
    expect(updatedAskingPlayer.hand.map((c) => c.rank)).toEqual(['5', '5']);
  });

  it('completes a book if the asking player has all 4 cards of a rank after a successful ask', () => {
    const playerA: Player = {
      id: 'A',
      name: 'Alice',
      hand: [
        { rank: '5', suit: 'diamonds' },
        { rank: '5', suit: 'spades' },
      ],
      books: [],
    };
    const playerB: Player = {
      id: 'B',
      name: 'Bob',
      hand: [
        { rank: '5', suit: 'hearts' },
        { rank: '5', suit: 'clubs' },
      ],
      books: [],
    };

    const game: GameState = {
      players: [playerA, playerB],
      deck: [],
      currentPlayerIndex: 0,
      log: [],
    };

    const result = playTurn(game, {
      fromPlayerId: 'A',
      toPlayerId: 'B',
      rank: '5',
    });

    expect(result.type).toBe('ask_success');
    expect(result.booksCompleted).toEqual(['5']);
    expect(game.players.find((p) => p.id === 'A')!.books).toEqual(['5']);
    expect(game.players.find((p) => p.id === 'A')!.hand).toHaveLength(0);
  });
  it('draws from deck and passes turn when rank not found in target hand', () => {
    const playerA: Player = {
      id: 'A',
      name: 'Alice',
      hand: [],
      books: [],
    };
    const playerB: Player = {
      id: 'B',
      name: 'Bob',
      hand: [{ rank: 'Q', suit: 'hearts' }],
      books: [],
    };

    const game: GameState = {
      players: [playerA, playerB],
      deck: [{ rank: '3', suit: 'clubs' }],
      currentPlayerIndex: 0,
      log: [],
    };

    const result = playTurn(game, {
      fromPlayerId: 'A',
      toPlayerId: 'B',
      rank: '5',
    });

    expect(result.type).toBe('ask_fail_fish');

    switch (result.type) {
      case 'ask_fail_fish':
        expect(result.drewCard).toEqual({ rank: '3', suit: 'clubs' });
        expect(game.currentPlayerIndex).toBe(1);
        break;

      case 'ask_success':
        throw new Error('Expected ask_fail_fish, got ask_success');

      default:
        throw new Error('Unexpected result type');
    }
  });

  it('draws from deck and keeps the turn if the drawn card matches the requested rank (lucky fish)', () => {
    const playerA: Player = {
      id: 'A',
      name: 'Alice',
      hand: [],
      books: [],
    };

    const playerB: Player = {
      id: 'B',
      name: 'Bob',
      hand: [{ rank: '9', suit: 'diamonds' }],
      books: [],
    };

    const game: GameState = {
      players: [playerA, playerB],
      deck: [{ rank: '5', suit: 'hearts' }],
      currentPlayerIndex: 0,
      log: [],
    };

    const result = playTurn(game, {
      fromPlayerId: 'A',
      toPlayerId: 'B',
      rank: '5',
    });

    expect(result.type).toBe('ask_fail_fish');

    switch (result.type) {
      case 'ask_fail_fish':
        expect(result.drewCard).toEqual({ rank: '5', suit: 'hearts' });
        expect(game.currentPlayerIndex).toBe(0);
        expect(game.players[0].hand).toContainEqual({ rank: '5', suit: 'hearts' });
        break;

      default:
        throw new Error(`Unexpected result type: ${result.type}`);
    }
  });
});

describe('isGameOver', () => {
  it('returns false if fewer than 13 books are completed', () => {
    const game: GameState = {
      players: [
        { id: 'A', name: 'Alice', hand: [], books: ['2', '3'] },
        { id: 'B', name: 'Bob', hand: [], books: ['7'] },
      ],
      deck: [],
      currentPlayerIndex: 0,
      log: [],
    };

    expect(isGameOver(game)).toBe(false);
  });

  it('returns true if 13 or more books are completed', () => {
    const books = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

    const game: GameState = {
      players: [
        { id: 'A', name: 'Alice', hand: [], books: books.slice(0, 7) },
        { id: 'B', name: 'Bob', hand: [], books: books.slice(7) },
      ],
      deck: [],
      currentPlayerIndex: 0,
      log: [],
    };

    expect(isGameOver(game)).toBe(true);
  });
});
