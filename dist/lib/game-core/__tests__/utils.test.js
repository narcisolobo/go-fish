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
        const sortedOriginal = [...original].sort(cardSorter);
        const sortedShuffled = [...shuffled].sort(cardSorter);
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
/**
 * Helper function for deterministic sorting of cards.
 */
function cardSorter(a, b) {
    if (a.rank !== b.rank) {
        return rankOrder(a.rank) - rankOrder(b.rank);
    }
    return suitOrder(a.suit) - suitOrder(b.suit);
}
function rankOrder(rank) {
    const order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return order.indexOf(rank);
}
function suitOrder(suit) {
    const order = ['clubs', 'diamonds', 'hearts', 'spades'];
    return order.indexOf(suit);
}
