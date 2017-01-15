# Connect Four

*Copyright 2017, Caleb Evans*  
*Released under the MIT License*

[![Build Status](https://travis-ci.org/caleb531/connect-four.svg?branch=master)](https://travis-ci.org/caleb531/connect-four)

This is the slickest Connect Four app around, written using HTML5, JavaScript,
and Mithril. You can play on your phone or computer, with a friend or against
the AI. Just be sure to enjoy and have fun. :)

You can play the app online at:  
https://projects.calebevans.me/connect-four/

## Implementation

### User interface

The entire app is constructed using Mithril for managing the UI
(views/controllers), with vanilla JavaScript constructors/inheritance for data
management (models). All transitions are handled with pure CSS.

### AI Player

Like any traditional board game AI, my Connect Four AI uses the Minimax
algorithm (max. depth of 3), combined with alpha-beta pruning (to reduce the
number of permutations searched by a considerable factor).

For my scoring heuristic, I opted to count the number of incomplete
connect-fours (*i.e.* three chips and an empty slot, aligned and in any order),
along with giving connect-fours the maximum/minimum score, of course. If the
scoring algorithm determines that no particular column yields an advantage or
disadvantage (according to my heuristic, of course), then the AI will default to
the center column (which tends to benefit the AI anyway).

In the app, the AI player is lovingly referred to as "Mr. AI".

## Run the project locally

### 1. Install global dependencies

The project requires Node.js and Brunch, so make sure you have both.

```bash
brew install node
```

```bash
npm install -g brunch
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
