import Player from './player.js';

// A local player whose moves are determined by a human user on the same device
class HumanPlayer extends Player {
  // Nothing to do here!
}
HumanPlayer.prototype.type = 'human';

export default HumanPlayer;
