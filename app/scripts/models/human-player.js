import Player from './player';

// A human player that requires user interaction; every human player inherits
// from the base Player model
class HumanPlayer extends Player {
  // Nothing to do here!
}
HumanPlayer.prototype.type = 'human';

export default HumanPlayer;
