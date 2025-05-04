"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe('generateDeck', () => {
    it('creates a full deck of 52 unique cards', () => {
        const deck = (0, utils_1.generateDeck)();
        expect(deck).toHaveLength(52);
        const uniqueCards = new Set(deck.map((card) => `${card.rank}-${card.suit}`));
        expect(uniqueCards.size).toBe(52);
    });
});
describe('shuffle', () => {
    it('returns a deck of the same length with the same cards', () => {
        const original = (0, utils_1.generateDeck)();
        const shuffled = (0, utils_1.shuffle)(original);
        expect(shuffled).toHaveLength(52);
        const sortedOriginal = [...original].sort(utils_1.cardSorter);
        const sortedShuffled = [...shuffled].sort(utils_1.cardSorter);
        expect(sortedShuffled).toEqual(sortedOriginal);
    });
    it('likely changes card order', () => {
        const deck = (0, utils_1.generateDeck)();
        const shuffled = (0, utils_1.shuffle)(deck);
        // Not guaranteed, but likely different
        const isSameOrder = deck.every((card, i) => card === shuffled[i]);
        expect(isSameOrder).toBe(false);
    });
});
describe('dealCards', () => {
    it('deals 7 cards to each player when there are 2 players', () => {
        const deck = (0, utils_1.generateDeck)();
        const players = [
            { id: '1', name: 'Alice', hand: [], books: [] },
            { id: '2', name: 'Bob', hand: [], books: [] },
        ];
        const { updatedPlayers, remainingDeck } = (0, utils_1.dealCards)(deck, players);
        expect(updatedPlayers[0].hand).toHaveLength(7);
        expect(updatedPlayers[1].hand).toHaveLength(7);
        expect(remainingDeck.length).toBe(deck.length - 14);
    });
    it('deals 5 cards to each player when there are 3 or more players', () => {
        const deck = (0, utils_1.generateDeck)();
        const players = [
            { id: '1', name: 'A', hand: [], books: [] },
            { id: '2', name: 'B', hand: [], books: [] },
            { id: '3', name: 'C', hand: [], books: [] },
        ];
        const { updatedPlayers, remainingDeck } = (0, utils_1.dealCards)(deck, players);
        for (const player of updatedPlayers) {
            expect(player.hand).toHaveLength(5);
        }
        expect(remainingDeck.length).toBe(deck.length - 15);
    });
});
describe('hasBook', () => {
    it('returns a list of ranks that appear exactly 4 times', () => {
        const hand = [
            { rank: '4', suit: 'hearts' },
            { rank: '4', suit: 'diamonds' },
            { rank: '4', suit: 'clubs' },
            { rank: '4', suit: 'spades' },
            { rank: 'A', suit: 'hearts' },
        ];
        expect((0, utils_1.hasBook)(hand)).toEqual(['4']);
    });
    it('returns multiple ranks if multiple books are present', () => {
        const hand = [
            { rank: '9', suit: 'hearts' },
            { rank: '9', suit: 'clubs' },
            { rank: '9', suit: 'spades' },
            { rank: '9', suit: 'diamonds' },
            { rank: 'K', suit: 'clubs' },
            { rank: 'K', suit: 'hearts' },
            { rank: 'K', suit: 'diamonds' },
            { rank: 'K', suit: 'spades' },
        ];
        expect((0, utils_1.hasBook)(hand).sort()).toEqual(['9', 'K'].sort());
    });
    it('returns an empty array if no books are found', () => {
        const hand = [
            { rank: 'Q', suit: 'hearts' },
            { rank: '5', suit: 'clubs' },
            { rank: '2', suit: 'spades' },
            { rank: '7', suit: 'diamonds' },
        ];
        expect((0, utils_1.hasBook)(hand)).toEqual([]);
    });
});
