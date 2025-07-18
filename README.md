# Connect Four

_Copyright 2016-2025 Caleb Evans_  
_Released under the MIT License_

[![tests](https://github.com/caleb531/connect-four/actions/workflows/tests.yml/badge.svg)](https://github.com/caleb531/connect-four/actions/workflows/tests.yml)

<!-- [![Coverage Status](https://coveralls.io/repos/github/caleb531/connect-four/badge.svg?branch=main)](https://coveralls.io/github/caleb531/connect-four?branch=main) -->

This is the slickest Connect Four app around, written using HTML5, JavaScript,
and Mithril (a React-like framework). You can play on your phone or computer,
with a friend or against Mr. A.I.

You can play the app online at:  
https://connectfour.calebevans.me/

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

The project requires Node (>= 18), so make sure you have that installed.

### 2. Install project dependencies

### Install packages

This project uses [pnpm][pnpm] (instead of npm) for package installation and
management. From the cloned project directory, run:

[pnpm]: https://pnpm.io/

```bash
npm install -g pnpm
pnpm install
```

### 3. Serve app locally

To serve the app locally, run:

```bash
pnpm dev
```

You will then be able to view the app at `http://localhost:8080`. Any app files
will be recompiled automatically when you make changes to them (as long as `pnpm dev` is still running).
