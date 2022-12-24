import Player from './player';

// A local player whose moves are determined by a human user on the same device
class HumanPlayer extends Player {
  type: 'human';
}
HumanPlayer.prototype.type = 'human';

export default HumanPlayer;
