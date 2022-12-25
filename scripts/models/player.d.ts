export interface ServerPlayer extends Player {
  id: string;
}

export interface Reaction {
  timer?: ReturnType<typeof setTimeout>;
  symbol: string;
}
