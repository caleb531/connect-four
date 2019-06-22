import AsyncPlayer from './async-player.js';

// An online player whose moves are determined by a remote human user
class OnlinePlayer extends AsyncPlayer {

  constructor({ game }) {
    game.session.on('receive-next-move', ({ column }) => {
      game.emit('online-player:receive-next-move', { column });
    });
  }

  //
  getNextMove({ game }) {
    return new Promise((resolve) => {
      // Finish your turn by yielding to the opponent player, sending the move
      // you just made and waiting to receive the move they will make next
      game.session.emit('finish-turn', { column: game.grid.lastPlacedChip.column }, ({ status }) => {
        game.session.status = status;
        // Resolve the promise when the game's TinyEmitter listener receives the move from the opponent
        game.once('online-player:receive-next-move', () => {
          resolve();
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
