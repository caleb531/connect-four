## About

This is a Connect Four implementation written in Mithril. It features several different modes:

1. A two-player mode where two human players can play against each other on the same device
2. A one-player mode where a human player can play against an AI component; the AI player is impleemtned using Minimax with alpha-beta pruning
3. An online multiplayer mode where two players can play against each other over the internet; this works by one player iniiating an online game and sharing a generated link with the other player, who can then join the game using that link

## Checks

After making code changes, run:

- `pnpm format`
- `pnpm lint`
- `pnpm test`

All variables, functions, and other definitions should be accompanied by thoughtful code comments.
