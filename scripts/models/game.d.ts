import type Game from './game';
import type Player from './player';

export interface ServerGame extends Game {
  grid: ServerGrid;
  currentPlayer: Player['color'] | null;
  requestingPlayer: Player['color'] | null;
  pendingChipColumn: number;
}
