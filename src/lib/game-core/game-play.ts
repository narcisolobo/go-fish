import { aOrAn, logEvent, rankNames } from './helpers';
import { AskAction, GameState, TurnResult } from './types';
import { hasBook, removeBooksFromHand } from './utils';

/**
 * Handles a turn where one player asks another for a specific rank.
 * This is the 'ask_success' path: target has matching cards.
 */
function playTurn(game: GameState, action: AskAction): TurnResult {
  const { fromPlayerId, toPlayerId, rank } = action;
  const pluralRank = rankNames.plural[rank];

  const fromPlayer = game.players.find((p) => p.id === fromPlayerId);
  const toPlayer = game.players.find((p) => p.id === toPlayerId);

  if (!fromPlayer || !toPlayer) {
    throw new Error('Invalid player ID');
  }

  const matchingCards = toPlayer.hand.filter((card) => card.rank === rank);

  if (matchingCards.length > 0) {
    // Transfer cards
    fromPlayer.hand.push(...matchingCards);
    toPlayer.hand = toPlayer.hand.filter((card) => card.rank !== rank);

    // ✅ Check for books after transfer
    const books = hasBook(fromPlayer.hand);
    fromPlayer.books.push(...books);
    fromPlayer.hand = removeBooksFromHand(fromPlayer.hand, books);

    logEvent(
      game,
      `${fromPlayer.name} asked ${toPlayer.name} for ${pluralRank}. ${toPlayer.name} had ${matchingCards.length}.`
    );

    if (books.length > 0) {
      for (const b of books) {
        const pluralBookRank = rankNames.plural[b];
        logEvent(game, `${fromPlayer.name} completed a book of ${pluralBookRank}!`);
      }
    }

    return {
      type: 'ask_success',
      booksCompleted: books,
      gameOver: false,
    };
  }

  // No cards to take — "Go Fish"
  const drewCard = game.deck.shift() ?? null;

  if (drewCard) {
    fromPlayer.hand.push(drewCard);
  }

  const books = hasBook(fromPlayer.hand);
  fromPlayer.books.push(...books);
  fromPlayer.hand = removeBooksFromHand(fromPlayer.hand, books);

  const drewMatch = drewCard?.rank === rank;

  if (!drewMatch) {
    // Advance turn to next player
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  }

  logEvent(
    game,
    `${fromPlayer.name} asked ${toPlayer.name} for ${pluralRank}. ${toPlayer.name} had none. Go fish!`
  );

  if (drewCard) {
    const singularDrewCard = rankNames.singular[drewCard.rank];
    logEvent(game, `${fromPlayer.name} drew ${aOrAn(drewCard.rank)} ${singularDrewCard}.`);
  }

  if (books.length > 0) {
    for (const b of books) {
      const pluralBookRank = rankNames.plural[b];
      logEvent(game, `${fromPlayer.name} completed a book of ${pluralBookRank}!`);
    }
  }

  return {
    type: 'ask_fail_fish',
    drewCard,
    booksCompleted: books,
    gameOver: false,
  };
}

/**
 * Returns true if all 13 books have been collected.
 */
function isGameOver(game: GameState): boolean {
  const totalBooks = game.players.reduce((sum, player) => sum + player.books.length, 0);
  return totalBooks >= 13;
}

export { isGameOver, playTurn };
