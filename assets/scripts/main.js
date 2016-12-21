(function() {

var GameComponent = {};
GameComponent.controller = function () {
  return {
    game: new Game({
      ai: false,
      grid: new Grid({
        columnCount: 7,
        rowCount: 6
      })
    })
  };
};
GameComponent.view = function (ctrl) {
  return m(GridComponent, ctrl.game);
};

function Game(args) {
  this.grid = args.grid;
  this.players = [
    // Player 1 (a human)
    new Player({color: 'red'}),
    // Player 2 (another human or the AI)
    new Player({color: 'blue'})
  ];
  // The current player is null when a game is not in progress
  this.currentPlayer = null;
  // Whether or not the game is in progress
  this.gameInProgress = false;
  // The chip above the grid that is about to be placed
  this.pendingChip = new Chip({player: new Player({color: 'red'})});
  // The chip that was most recently placed in the board
  this.lastInsertedChip = null;
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

function Chip(args) {
  this.player = args.player;
}

function Player(args) {
  this.color = args.color;
}

var GridComponent = {};
GridComponent.controller = function (game) {
  return {
    // Translate the pending chip to be aligned with whatever the user hovered
    // over (which is guaranteed to be either a chip, placeholder chip, or grid
    // column)
    getPendingChipTranslate: function (game, event) {
      if (game.pendingChip) {
        var pendingChipElem = document.querySelector('.chip.pending');
        var gridElem = event.currentTarget;
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
