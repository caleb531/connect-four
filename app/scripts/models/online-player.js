import AsyncPlayer from './async-player.js';

// An online player whose moves are determined by a remote human user
class OnlinePlayer extends AsyncPlayer {

  constructor({ name, color, game }) {
    super({ name, color });
    // Add a global listener here for all moves we will receive from the
    // opponent (online) player during the course of the game; when we receive a
    // move from the opponent, TinyEmitter will help us resolve the promise
    // created in the last call to getNextMove()
    game.session.on('receive-next-move', ({ column }) => {
      game.emit('online-player:receive-next-move', { column });
    });
    // When the local (human) player has placed a chip, send that move to the
    // server
    game.on('player:place-chip', ({ player, column }) => {
      // Only chip placements by the local (human) player need to be handled
      if (player !== this) {
        game.session.emit('finish-turn', { column });
      }
    });
  }

  // Declare the end of the local (human) player's turn, communicating its move
  // to the opponent (online) player and waiting for the opponent to make the
  // next move
  getNextMove({ game }) {
    return new Promise((resolve) => {
      // Resolve the promise when the game's TinyEmitter listener receives the
      // move from the opponent, passing it to the local (human) player
      game.once('online-player:receive-next-move', ({ column }) => {
        resolve({ column });
      });
    });
  }

}

OnlinePlayer.prototype.type = 'online';
// Do not delay between the time the online player's move is received by the
// client, and when the chip is placed locally
OnlinePlayer.waitDelay = 0;

export default OnlinePlayer;
