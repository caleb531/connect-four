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
      m('button', {onclick: _.partial(ctrl.startGame, game, 1)}, '1 Player'),
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
  // The chip that was most recently placed in the board
  this.lastInsertedChip = null;
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
Game.prototype.startTurn = function () {
  this.pendingChip = new Chip({player: this.currentPlayer});
};
Game.prototype.resetGame = function (args) {
  this.gameInProgress = false;
  this.players.length = 0;
  this.currentPlayer = null;
  this.pendingChip = null;
  this.lastInsertedChip = null;
  this.grid.resetGrid();
};

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

function Chip(args) {
  this.player = args.player;
}

function Player(args) {
  this.playerNum = args.playerNum;
  this.color = args.color;
  this.ai = !!args.ai;
}

var GridComponent = {};
GridComponent.controller = function () {
  return {
    // Translate the pending chip to be aligned with whatever the user hovered
    // over (which is guaranteed to be either a chip, placeholder chip, or grid
    // column)
    getPendingChipTranslate: function (game, event) {
      if (game.pendingChip) {
        var pendingChipElem = event.currentTarget.querySelector('.chip.pending');
        // Ensure that the left margin of a chip or placeholder chip is included in the offset measurement
        var marginLeft = parseInt(window.getComputedStyle(event.target)['margin-left']);
        var offsetX = event.target.offsetLeft - marginLeft;
        pendingChipElem.style.transform = 'translate(' + offsetX + 'px,0)';
      }
    }
  };
};
GridComponent.view = function (ctrl, game) {
  var grid = game.grid;
  return m('div', {id: 'grid', onmousemove: _.partial(ctrl.getPendingChipTranslate, game)}, [
    // Area where to-be-placed chips are dropped from
    m('div', {id: 'pending-chip-zone'}, game.pendingChip ?
      m('div', {
        class: ['chip', 'pending', game.pendingChip.player.color].join(' ')
      }) : null),
    // Bottom grid of chip placeholders (indicating space chips can occupy)
    m('div', {id: 'chip-placeholders'}, _.times(grid.columnCount, function (c) {
      return m('div', {class: 'grid-column'}, _.times(grid.rowCount, function (r) {
        return m('div', {class: 'chip-placeholder'});
      }));
    })),
    // Top grid of placed chips
    m('div', {id: 'chips'}, _.times(grid.columnCount, function (c) {
      return m('div', {class: 'grid-column'}, _.map(grid.columns[c], function (chip, r) {
        return m('div', {class: ['chip', chip.player.color].join(' ')});
      }));
    }))
  ]);
};

m.mount(document.getElementById('game'), GameComponent);

}());
