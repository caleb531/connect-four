import Game from './game';
import Player from './player';
import { AsyncPlayerMove } from './async-player.d';

// A player whose moves are not determined through local user interaction, but
// rather, by a asynchronous getNextMove method that AsyncPlayer subclasses
// define
class AsyncPlayer extends Player {

  type: string;
  waitDelay: number;

  // Wait for a short moment to give the user time to see and process the
  // player's actions; all AsyncPlayer subclasses must define a waitDelay as a
  // static property on the class object
  wait(callback: () => void): void {
    setTimeout(callback, this.waitDelay);
  }

  // Return a promise that resolves with a { column } object containing the
  // integer column in which to place the player's next chip; all AsyncPlayer
  // subclasses must implement this method
  getNextMove({ game }: { game: Game }): Promise<AsyncPlayerMove> {
    throw new Error('This method must be implemented by a subclass of AsyncPlayer; it must return a promise which resolves when the async player\'s next move has finished computing');
  }

}
// Each AsyncPlayer subclass should override this type property with a string
// value unique to that subclass
AsyncPlayer.prototype.type = 'async';

export default AsyncPlayer;
