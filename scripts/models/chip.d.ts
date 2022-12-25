import type Chip from './chip';
import type Player from './player';

export type PlacedChip = {
  [key in keyof Chip]: NonNullable<Chip[key]>;
}

// On the server, a chip's associated player is stored as the player color
// rather than a Player object; this is so the chip can be serialized and sent
// to the client
export interface ServerChip extends Chip {
  player: Player['color'];
}
