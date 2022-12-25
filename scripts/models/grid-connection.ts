// A connection of one or more chips on a grid, including information about
import Chip from './chip';
import { Direction } from './grid-connection';

// neighboring empty slots and such
class GridConnection {

    chips: Chip[];
    emptySlotCount: number;
    static directions: Direction[];

    constructor({ chips = [], emptySlotCount = 0 }: Partial<GridConnection> = { chips: [], emptySlotCount: 0 }) {
      this.chips = [...chips];
      this.emptySlotCount = emptySlotCount;
    }

    get length() {
      return this.chips.length;
    }

    set length(newLength) {
      this.chips.length = newLength;
    }

    addChip(chip: Chip) {
      this.chips.push(chip);
    }

    addConnection(connection: GridConnection) {
      this.chips.push(...connection.chips);
      this.emptySlotCount += connection.emptySlotCount || 0;
    }

    forEach(callback: Parameters<typeof this.chips.forEach>[0]) {
      return this.chips.forEach(callback);
    }

}

// The relative directions to check when checking for connected chip neighbors
GridConnection.directions = [
  { x: 0, y: -1 }, // Bottom-middle
  { x: -1, y: -1 }, // Bottom-left
  { x: -1, y: 0 }, // Left-middle
  { x: -1, y: 1 } // Top-left
];


export default GridConnection;
