# Connect Four

*Copyright 2016-2017, Caleb Evans*  
*Released under the MIT License*

[![Build Status](https://travis-ci.org/caleb531/connect-four.svg?branch=master)](https://travis-ci.org/caleb531/connect-four)
[![Coverage Status](https://coveralls.io/repos/github/caleb531/connect-four/badge.svg?branch=master)](https://coveralls.io/github/caleb531/connect-four?branch=master)

This is the slickest Connect Four app around, written using HTML5, JavaScript,
and Mithril. You can play on your phone or computer, with a friend or against
the AI. Just be sure to enjoy and have fun. :)

You can play the app online at:  
https://projects.calebevans.me/connect-four/

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

The project requires Node.js and Brunch, so make sure you have both.

```bash
brew install node
```

```bash
npm install -g brunch
```

Optionally, you can install librsvg if you want to build the application icons:

```bash
brew install librsvg
```

### 2. Install project dependencies

From the cloned project directory, run:

```bash
npm install
```

### 3. Serve app locally

To serve the app locally, run:

```bash
brunch watch --server
```

When run, the app will be accessible at `http://localhost:3333`.
