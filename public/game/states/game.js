var FroggerBot = FroggerBot || {};

FroggerBot.Game = function(game) {

}

FroggerBot.Game.prototype.preload = function() {
  this.load.spritesheet('controls', 'assets/img/controls.png', 50, 50);
  this.load.spritesheet('crud', 'assets/img/crud.png', 50, 50);
  this.load.spritesheet('actions', 'assets/img/actions.png', 50, 50);
}

FroggerBot.Game.prototype.create = function() {

  this.positronic = this.game.plugins.add(new Phaser.Plugin.Positronic(this.game, this));
  this.maze = this.game.plugins.add(new Phaser.Plugin.BomberbotMazes(this.game, this));

  this.positronic.create();
  this.positronic.configure(FroggerBot.Configuration.positronicConfig);

  this.maze.createMaze(function(err, maze) {
    if (err) {
      console.log('err',  err);
      return;
    }

    console.log(maze);
  });

}

FroggerBot.Game.prototype.update = function() {
  
}

FroggerBot.Game.prototype.render = function() {
  
}