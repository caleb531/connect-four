import AsyncPlayer from './async-player';
import Game from './game';
import { AsyncPlayerMove } from './async-player.d';

// An online player whose moves are determined by a remote human user
class OnlinePlayer extends AsyncPlayer {

  // Declare the end of the local (human) player's turn, communicating its move
  // to the opponent (online) player and waiting for the opponent to make the
  // next move
  getNextMove({ game }: { game: Game }): Promise<AsyncPlayerMove> {
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
OnlinePlayer.prototype.waitDelay = 0;

export default OnlinePlayer;
