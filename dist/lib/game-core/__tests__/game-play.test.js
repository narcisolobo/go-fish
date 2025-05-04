"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_play_1 = require("../game-play");
describe('playTurn', () => {
    it('returns ask_success and transfers cards from target to asking player', () => {
        const playerA = { id: 'A', name: 'Alice', hand: [], books: [] };
        const playerB = {
            id: 'B',
            name: 'Bob',
            hand: [
                { rank: '5', suit: 'hearts' },
                { rank: '5', suit: 'clubs' },
                { rank: 'Q', suit: 'spades' },
            ],
            books: [],
        };
        const game = {
            players: [playerA, playerB],
            deck: [],
            currentPlayerIndex: 0,
            log: [],
        };
        const result = (0, game_play_1.playTurn)(game, {
            fromPlayerId: 'A',
            toPlayerId: 'B',
            rank: '5',
        });
        expect(result.type).toBe('ask_success');
        expect(result.booksCompleted).toEqual([]);
        expect(result.gameOver).toBe(false);
        const updatedAskingPlayer = game.players.find((p) => p.id === 'A');
        expect(updatedAskingPlayer.hand.map((c) => c.rank)).toEqual(['5', '5']);
    });
    it('completes a book if the asking player has all 4 cards of a rank after a successful ask', () => {
        const playerA = {
            id: 'A',
            name: 'Alice',
            hand: [
                { rank: '5', suit: 'diamonds' },
                { rank: '5', suit: 'spades' },
            ],
            books: [],
        };
        const playerB = {
            id: 'B',
            name: 'Bob',
            hand: [
                { rank: '5', suit: 'hearts' },
                { rank: '5', suit: 'clubs' },
            ],
            books: [],
        };
        const game = {
            players: [playerA, playerB],
            deck: [],
            currentPlayerIndex: 0,
            log: [],
        };
        const result = (0, game_play_1.playTurn)(game, {
            fromPlayerId: 'A',
            toPlayerId: 'B',
            rank: '5',
        });
        expect(result.type).toBe('ask_success');
        expect(result.booksCompleted).toEqual(['5']);
        expect(game.players.find((p) => p.id === 'A').books).toEqual(['5']);
        expect(game.players.find((p) => p.id === 'A').hand).toHaveLength(0);
    });
    it('draws from deck and passes turn when rank not found in target hand', () => {
        const playerA = {
            id: 'A',
            name: 'Alice',
            hand: [],
            books: [],
        };
        const playerB = {
            id: 'B',
            name: 'Bob',
            hand: [{ rank: 'Q', suit: 'hearts' }],
            books: [],
        };
        const game = {
            players: [playerA, playerB],
            deck: [{ rank: '3', suit: 'clubs' }],
            currentPlayerIndex: 0,
            log: [],
        };
        const result = (0, game_play_1.playTurn)(game, {
            fromPlayerId: 'A',
            toPlayerId: 'B',
            rank: '5',
        });
        expect(result.type).toBe('ask_fail_fish');
        if (result.type === 'ask_fail_fish') {
            expect(result.drewCard).toEqual({ rank: '3', suit: 'clubs' });
            expect(game.currentPlayerIndex).toBe(1); // Turn passed
        }
        else {
            throw new Error('Expected ask_fail_fish, got ask_success');
        }
    });
});
