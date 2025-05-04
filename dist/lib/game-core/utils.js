"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardSorter = cardSorter;
exports.dealCards = dealCards;
exports.generateDeck = generateDeck;
exports.hasBook = hasBook;
exports.removeBooksFromHand = removeBooksFromHand;
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
/**
 * Deals cards to players according to Go Fish rules.
 * - 7 cards each for 2 players
 * - 5 cards each for 3+ players
 */
function dealCards(deck, players) {
    const handSize = players.length === 2 ? 7 : 5;
    const updatedPlayers = [];
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
function hasBook(hand) {
    const countMap = {};
    for (const card of hand) {
        countMap[card.rank] = (countMap[card.rank] || 0) + 1;
    }
    return Object.entries(countMap)
        .filter(([_, count]) => count === 4)
        .map(([rank]) => rank);
}
/**
 * Returns a copy of the hand with all cards of the given ranks removed.
 */
function removeBooksFromHand(hand, books) {
    const bookSet = new Set(books);
    return hand.filter((card) => !bookSet.has(card.rank));
}
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
