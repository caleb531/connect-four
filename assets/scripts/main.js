(function() {

var GameComponent = {};
GameComponent.controller = function () {
    return {
        game: new Game({
            ai: false,
            grid: new Grid({
                columnCount: 7,
                rowCount: 6,
                chipSize: 50,
                chipMargin: 6
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
}

function Grid(args) {
  this.columnCount = args.columnCount;
  this.rowCount = args.rowCount;
  this.chipSize = args.chipSize;
  this.chipMargin = args.chipMargin;
  // The columns array where columns containing placed chips are stored
  this.columns = [];
  this.resetGrid();
}
// Reset the grid by removing all placed chips
Grid.prototype.resetGrid = function () {
  this.columns.length = 0;
  var p1 = new Player({color: 'red'});
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
GridComponent.controller = function () {
  return {
    getGridStyle: function (grid) {
      var gridWidth = grid.columnCount * (grid.chipSize + (grid.chipMargin * 2));
      var gridHeight = grid.rowCount * (grid.chipSize + (grid.chipMargin * 2));
      return {
        width: gridWidth + 'px',
        height: gridHeight + 'px'
      };
    },
    getChipStyle: function (c, r, grid) {
      var chipX = c * (grid.chipSize + (grid.chipMargin * 2)) + grid.chipMargin;
      var chipY = (grid.rowCount - r - 1) * (grid.chipSize + (grid.chipMargin * 2)) + grid.chipMargin;
      return {
        width: grid.chipSize + 'px',
        height: grid.chipSize + 'px',
        transform: 'translate(' + chipX + 'px,' + chipY + 'px)'
      };
    }
  };
};
GridComponent.view = function (ctrl, game) {
  var grid = game.grid;
  return m('div', {id: 'grid', style: ctrl.getGridStyle(grid)}, [
    // Bottom grid of chip placeholders (indicating space chips can occupy)
    _.times(grid.columnCount, function (c) {
      return _.times(grid.rowCount, function (r) {
        return m('div', {
          class: 'chip-placeholder',
          style: ctrl.getChipStyle(c, r, grid)
        });
      });
    }),
    // Top grid of placed chips
    _.times(grid.columnCount, function (c) {
      return _.map(grid.columns[c], function (chip, r) {
        return m('div', {
          class: ['chip', chip.player.color].join(' '),
          style: ctrl.getChipStyle(c, r, grid)
        });
      });
    })
  ]);
};

m.mount(document.getElementById('game'), GameComponent);

}());
