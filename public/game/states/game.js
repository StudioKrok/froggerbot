var FroggerBot = FroggerBot || {};

FroggerBot.Game = function(game) {

};

FroggerBot.Game.prototype.preload = function() {
  this.load.spritesheet('controls', 'assets/img/controls.png', 50, 50);
  this.load.spritesheet('crud', 'assets/img/crud.png', 50, 50);
  this.load.spritesheet('actions', 'assets/img/actions.png', 50, 50);

  this.load.image('block01', 'assets/img/block01.png');
  this.load.image('block02', 'assets/img/block02.png');
  this.load.image('block03', 'assets/img/block03.png');
  this.load.image('block04', 'assets/img/block04.png');
  this.load.image('block05', 'assets/img/block05.png');
  this.load.image('block06', 'assets/img/block06.png');
  this.load.image('block07', 'assets/img/block07.png');
};

FroggerBot.Game.prototype.create = function() {

  this.positronic = this.game.plugins.add(new Phaser.Plugin.Positronic(this.game, this));
  this.maze = this.game.plugins.add(new Phaser.Plugin.BomberbotMazes(this.game, this));

  this.positronic.create();
  this.positronic.configure(FroggerBot.Configuration.positronicConfig);


  this.configureMazePlugin();
  this.maze.createMaze(function(err, maze) {
    if (err) {
      console.log('err',  err);
      return;
    }

    console.log(maze);
  });

};

FroggerBot.Game.prototype.update = function() {
  
};

FroggerBot.Game.prototype.render = function() {
  
};

FroggerBot.Game.prototype.configureMazePlugin = function(){
  this.maze.setGrid(this.game.levelMap);

  this.maze.setCellsProperties(config.cellTypes);

  this.maze.setShadowsProperties(config.shadows);

  this.maze.setCellsWidth(config.cell.width - 1);
  this.maze.setCellsHeight(config.cell.height - 1);
  this.maze.setCellsFrontHeight(config.cell.frontHeight);
  this.maze.setCellsEmptyHeight(config.cell.emptyHeight);

  this.maze.setWithShadows(config.normalShadows);
  this.maze.setWithFloorShadows(config.floorShadows);

};

