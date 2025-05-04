"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeck = generateDeck;
exports.shuffle = shuffle;
/**
 * All four suits in a standard deck.
 */
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
/**
 * All ranks used in Go Fish.
 */
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
/**
 * Generates a full, unshuffled 52-card deck.
 */
function generateDeck() {
    const deck = [];
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
function shuffle(deck) {
    const result = [...deck];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
