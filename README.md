# Connect Four

## Implementation

### User interface

The entire app UI is constructed and managed in JavaScript using
[Mithril][mithril]. Chip transitions are handled by CSS to maximize performance
and smoothness. The grid layout is styled with CSS Flexbox to enable the
stacking of grid elements from the bottom up.

[mithril]: http://mithril.js.org/

### AI Player

Like many traditional board game AIs, my Connect Four AI uses the
[minimax][minimax] algorithm. For my particular implementation, I've chosen to
use a maximum search depth of three (meaning the AI examines possibilities up to
three turns into the future). This is combined with [alpha-beta pruning][abp] to
dramatically reduce the number of possibilities evaluated.

My scoring heuristic works by counting connections of chips that intersect with
an empty slot, giving exponentially more weight to larger connections. For
example, every single chip touching an empty slot is worth four points, a
connect-two is worth nine points, a connect-three is worth sixteen points, and
so on. A winning connection of four or more chips is given the maximum/minimum
score.

In the app, the AI player is lovingly referred to as "Mr. AI".

[minimax]: https://en.wikipedia.org/wiki/Minimax
[abp]: https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning

## Run the project locally

### 1. Install global dependencies

The project requires Node (>= 8) and Gulp, so make sure you have both installed.

### 2. Install project dependencies

From the cloned project directory, run:

```bash
npm install
```

### 3. Serve app locally

To serve the app locally, run:

```bash
gulp serve
```

You will then be able to view the app at `http://localhost:8080`. Any app files
will be recompiled automatically when you make changes to them (as long as `gulp serve` is still running).
