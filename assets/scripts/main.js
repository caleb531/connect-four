(function() {

var GameComponent = {};
GameComponent.controller = function () {
  return {
    game: new Game({
      grid: new Grid({
        columnCount: 7,
        rowCount: 6
      })
    })
  };
};
GameComponent.view = function (ctrl) {
  return [
    m(GameControlsComponent, ctrl.game),
    m(GridComponent, ctrl.game)
  ];
};


var GameControlsComponent = {};
GameControlsComponent.controller = function () {
  return {
    startGame: function (game, playerCount) {
      game.startGame({playerCount: playerCount});
    },
    resetGame: function (game) {
      game.resetGame();
    }
  };
};
GameControlsComponent.view = function (ctrl, game) {
  return m('div', {id: 'game-controls'}, [
    game.players.length === 0 ? [
      // Initially ask user to choose number of players to start game
      m('label', 'Start Game:'),
      // m('button', {onclick: _.partial(ctrl.startGame, game, 1)}, '1 Player'),
      m('button', {onclick: _.partial(ctrl.startGame, game, 2)}, '2 Players'),
      m('p', {id: 'game-message'}, 'Choose a number of players to start a game.')
    ] : [
      // If game is in progress, display the number of players are whose turn it
      // is (also provide an option to stop the game)
      m('label', (game.players[1].ai ? 1 : 2) + '-Player Game'),
      m('button', {onclick: _.partial(ctrl.resetGame, game)}, 'End Game'),
      m('p', {id: 'game-message'}, game.currentPlayer.ai ?
        'It\'s the AI\'s turn!'
        : ('It\'s player ' + game.currentPlayer.playerNum + '\'s turn!'))
    ]
  ]);
};


function Game(args) {
  this.grid = args.grid;
  this.players = [];
  // The current player is null when a game is not in progress
  this.currentPlayer = null;
  // Whether or not the game is in progress
  this.gameInProgress = false;
  // The chip above the grid that is about to be placed
  this.pendingChip = null;
  // The index of the last column a chip was inserted into
  this.lastInsertedChipColumn = Math.floor(this.grid.columnCount / 2);
  // Whether or not a chip is in the process of being placed on the grid
  this.pendingChipIsFalling = false;
  // The chip that was most recently placed in the board
  this.lastPlacedChip = null;
  // TODO: remove this when P2 mode testing is finished
  this.startGame({playerCount: 2});
}
Game.prototype.startGame = function (args) {
  if (args.playerCount === 2) {
    // If 2-player game is selected, assume two human players
    this.players.push(new Player({color: 'red', playerNum: 1}));
    this.players.push(new Player({color: 'blue', playerNum: 2}));
  } else {
    // Otherwise, assume one human player and one AI player
    this.players.push(new Player({color: 'red', playerNum: 1}));
    // Set color of AI player to black to distinguish it from a human player
    this.players.push(new Player({color: 'black', playerNum: 2, ai: true}));
  }
  this.gameInProgress = true;
  this.currentPlayer = this.players[0];
  this.startTurn();
};
// Start the turn of the current player
Game.prototype.startTurn = function () {
  this.pendingChip = new Chip({player: this.currentPlayer});
};
// End the turn of the current player and switch to the next player
Game.prototype.endTurn = function () {
  // Switch to next player
  if (this.currentPlayer === this.players[0]) {
    this.currentPlayer = this.players[1];
  } else {
    this.currentPlayer = this.players[0];
  }
  this.startTurn();
};
// Return the index of the next available row for the given column
Game.prototype.getNextAvailableSlot = function (args) {
  var nextRowIndex = this.grid.columns[args.column].length;
  if (nextRowIndex < this.grid.rowCount) {
    return nextRowIndex;
  } else {
    // Return null if thee are no more available slots in this column
    return null;
  }
};
// Insert the current pending chip into the columns array at the given index
Game.prototype.placePendingChip = function (args) {
  this.grid.columns[args.column].push(this.pendingChip);
  this.lastPlacedChip = this.pendingChip;
  this.lastInsertedChipColumn = args.column;
  this.pendingChipIsFalling = false;
  this.pendingChip = null;
};
Game.prototype.resetGame = function (args) {
  this.gameInProgress = false;
  this.players.length = 0;
  this.currentPlayer = null;
  this.pendingChip = null;
  this.pendingChipIsFalling = false;
  this.lastPlacedChip = null;
  this.grid.resetGrid();
};


function Chip(args) {
  this.player = args.player;
}


function Player(args) {
  this.playerNum = args.playerNum;
  this.color = args.color;
  this.ai = !!args.ai;
}


function Grid(args) {
  this.columnCount = args.columnCount;
  this.rowCount = args.rowCount;
  // The columns array where columns containing placed chips are stored
  this.columns = [];
  this.resetGrid();
}
// Reset the grid by removing all placed chips
Grid.prototype.resetGrid = function () {
  this.columns.length = 0;
  for (var c = 0; c < this.columnCount; c += 1) {
    this.columns.push([]);
  }
};


var GridComponent = {};
GridComponent.controller = function () {
  return {
    // Get the CSS translate string for the given coordinate map
    getTranslate: function (coords) {
      return 'translate(' + coords.x + 'px,' + coords.y + 'px)';
    },
    // Set the CSS transform value for the given DOM element
    setTranslate: function (elem, coords) {
      if (coords.x === undefined || coords.y === undefined) {
        var currentTranslate = window.getComputedStyle(elem).transform;
        if (currentTranslate && currentTranslate !== 'none') {
          currentValues = currentTranslate.match(/-?\d+(\.\d+)?/);
          coords.x = coords.x === undefined ? Number(currentValues[0]) : coords.x;
          coords.y = coords.y === undefined ? Number(currentValues[1]) : coords.y;
        }
      }
      this.pendingChipTranslateX = coords.x;
      this.pendingChipTranslateY = coords.y;
    },
    // Get the left offset of the element (including its margin) relative to its
    // nearest non-static parent
    getOuterOffsetLeft: function (elem) {
        var marginLeft = parseInt(window.getComputedStyle(elem)['margin-left']);
        return elem.offsetLeft - marginLeft;
    },
    // Get the top offset of the element (including its margin) relative to its
    // nearest non-static parent
    getOuterOffsetTop: function (elem) {
        var marginTop = parseInt(window.getComputedStyle(elem)['margin-top']);
        return elem.offsetTop - marginTop;
    },
    // Translate the pending chip to be aligned with whatever the user hovered
    // over (which is guaranteed to be either a chip, chip slot, or grid column)
    getPendingChipTranslate: function (ctrl, game, event) {
      if (game.pendingChip && !game.pendingChipIsFalling) {
        var pendingChipElem = event.currentTarget.querySelector('.chip.pending');
        if (pendingChipElem) {
          // Ensure that the left margin of a chip or chip slot is included in
          // the offset measurement
          ctrl.setTranslate(pendingChipElem, {
            x: ctrl.getOuterOffsetLeft(event.target),
            y: 0
          });
        }
      }
    },
    // Get the left/top offset of the chip slot element at the given column/row
    getSlotOffset: function (columnIndex, rowIndex) {
      var slotElem = document.querySelector('.chip-slot[data-column="' + columnIndex + '"][data-row="' + rowIndex + '"]');
      return {
        left: this.getOuterOffsetLeft(slotElem),
        top: this.getOuterOffsetTop(slotElem)
      };
    },
    // Place the current pending chip into the next available slot in the column
    // it is hovering over
    placePendingChip: function (ctrl, game, event) {
      if (game.pendingChip && !game.pendingChipIsFalling) {
          var pendingChipElem = event.currentTarget.querySelector('.chip.pending');
          if (!pendingChipElem) {
            return;
          }
          // Get the column/row index where the pending chip is to be placed
          var columnIndex = Number(event.target.getAttribute('data-column'));
          var rowIndex = game.getNextAvailableSlot({column: columnIndex});
          // Do not allow user to place chip in column that is already full
          if (rowIndex === null) {
            return;
          }
          game.pendingChipIsFalling = true;
          // Translate chip to the visual position on the grid corresponding to
          // the above column and row
          var slotOffset = ctrl.getSlotOffset(columnIndex, rowIndex);
          ctrl.setTranslate(pendingChipElem, {
            x: slotOffset.left,
            y: slotOffset.top
          });
          // Perform insertion on internal game grid once transition has ended
          pendingChipElem.addEventListener('transitionend', function transitionend() {
            pendingChipElem.removeEventListener('transitionend', transitionend);
            game.placePendingChip({column: columnIndex});
            // Ensure pending chip is removed from DOM since it has been placed
            game.endTurn();
          });
      }
    }
  };
};
GridComponent.view = function (ctrl, game) {
  var grid = game.grid;
  return m('div', {
    id: 'grid',
    onmousemove: _.partial(ctrl.getPendingChipTranslate, ctrl, game),
    onclick: _.partial(ctrl.placePendingChip, ctrl, game)
  }, [
    // The chip that is about to be placed on the grid
    game.pendingChip ?
      m('div', {
        class: ['chip', 'pending', game.pendingChip.player.color, game.pendingChipIsFalling ? 'is-falling' : ''].join(' '),
        style: {
          transform: ctrl.getTranslate({
            x: ctrl.pendingChipTranslateX,
            y: ctrl.pendingChipTranslateY
          })
        }
      }) : null,
    // Bottom grid of slots (indicating space chips can occupy)
    m('div', {id: 'chip-slots'}, _.times(grid.columnCount, function (c) {
      return m('div', {class: 'grid-column', 'data-column': c}, _.times(grid.rowCount, function (r) {
        return m('div', {class: 'chip-slot', 'data-column': c, 'data-row': r});
      }));
    })),
    // Top grid of placed chips
    m('div', {id: 'chips'}, _.times(grid.columnCount, function (c) {
      return m('div', {class: 'grid-column', 'data-column': c}, _.map(grid.columns[c], function (chip, r) {
        return m('div', {
          key: 'chip-' + [c, r].join('-'),
          class: ['chip', chip.player.color].join(' '), 'data-column': c, 'data-row': r
        });
      }));
    }))
  ]);
};


m.mount(document.getElementById('game'), GameComponent);

}());
