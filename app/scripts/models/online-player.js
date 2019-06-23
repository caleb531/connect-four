import AsyncPlayer from './async-player.js';

// An online player whose moves are determined by a remote human user
class OnlinePlayer extends AsyncPlayer {

  constructor({ name, color, game }) {
    super({ name, color });
    // Add a global listener here for all moves we will receive from the
    // opponent (online) player during the course of the game; when we receive a
    // move from the opponent, TinyEmitter will help us resolve the promise
    // created in the last call to getNextMove()
    game.session.on('receive-next-move', (nextMove) => {
      game.emit('online-player:receive-next-move', nextMove);
    });
  }

  // Declare the end of the local (human) player's turn, communicating its move
  // to the opponent (online) player and waiting for the opponent to make the
  // next move
  getNextMove({ game }) {
    return new Promise((resolve) => {
      // Finish the local (human) player's turn by yielding to the opponent
      // (online) player, sending the human player's latest move and waiting to
      // receive the move the online player will make next
      game.session.emit('finish-turn', { column: game.grid.lastPlacedChip.column }, ({ status }) => {
        game.session.status = status;
        // Resolve the promise when the game's TinyEmitter listener receives the
        // move from the opponent, passing it to the local (human) player
        game.once('online-player:receive-next-move', (nextMove) => {
          resolve(nextMove);
        });
      });
    });
  }

}

OnlinePlayer.prototype.type = 'online';
// Do not delay between the time the online player's move is received by the
// client, and when the chip is placed locally
OnlinePlayer.waitDelay = 0;

export default OnlinePlayer;
