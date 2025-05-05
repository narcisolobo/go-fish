import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { generateDeck, shuffle, dealCards } from '../lib/game-core/utils';
import { isGameOver, playTurn } from '../lib/game-core/game-play';
import type { GameState, Player, Rank } from '../lib/game-core/types';
import { rankNames } from '../lib/game-core/helpers';

const rl = readline.createInterface({ input, output });

const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

async function main() {
  const deck = shuffle(generateDeck());

  const players: Player[] = [
    { id: 'user', name: 'You', hand: [], books: [] },
    { id: 'computer', name: 'Computer', hand: [], books: [] },
  ];

  const { updatedPlayers, remainingDeck } = dealCards(deck, players);

  const game: GameState = {
    players: updatedPlayers,
    deck: remainingDeck,
    currentPlayerIndex: 0,
    log: [],
  };

  while (!isGameOver(game)) {
    const currentPlayer = game.players[game.currentPlayerIndex];

    console.log('\n--- Game State ---');
    console.log(
      `Books - You: ${game.players[0].books.length}, Computer: ${game.players[1].books.length}`
    );
    console.log('Last action:', game.log.at(-1)?.text ?? '(none)');
    console.log('--------------');

    if (currentPlayer.id === 'user') {
      console.log(`\nYour hand: ${game.players[0].hand.map((c) => c.rank).join(', ')}`);

      const rankInput = await rl.question('Ask for which rank? (A, 2-10, J, Q, K): ');
      const rank = rankInput.toUpperCase() as Rank;

      if (!RANKS.includes(rank)) {
        console.log('Invalid rank. Try again.');
        continue;
      }

      const result = playTurn(game, {
        fromPlayerId: 'user',
        toPlayerId: 'computer',
        rank,
      });

      console.log(`\nResult: ${result.type}`);
    } else {
      // Manual Computer logic (random or hardcoded for now)
      const hand = game.players[1].hand;
      const randomRank = hand[Math.floor(Math.random() * hand.length)]?.rank ?? 'A';

      const rankName = rankNames.plural[randomRank];
      console.log(`\nComputer asks for ${rankName}.`);

      const result = playTurn(game, {
        fromPlayerId: 'computer',
        toPlayerId: 'user',
        rank: randomRank,
      });

      console.log(`Result: ${result.type}`);
    }
  }

  console.log('\n🎉 Game over!');
  console.log(`You: ${game.players[0].books.length} books`);
  console.log(`Computer: ${game.players[1].books.length} books`);

  if (game.players[0].books.length > game.players[1].books.length) {
    console.log('You win! 🏆');
  } else if (game.players[0].books.length < game.players[1].books.length) {
    console.log('Computer wins! 🤖');
  } else {
    console.log("It's a tie!");
  }

  rl.close();
}

main();
