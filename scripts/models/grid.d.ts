import type Grid from './Grid';
import type { ServerChip } from './chip.d';

export interface ServerGrid extends Grid {
  columns: ServerChip[][];
}
