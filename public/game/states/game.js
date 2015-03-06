var FroggerBot = FroggerBot || {};

FroggerBot.Game = function(game) {

}

FroggerBot.Game.prototype.preloader = function() {

}

FroggerBot.Game.prototype.create = function() {

  this.positronic = this.game.plugins.add(new Phaser.Plugin.Positronic(this.game, this));
  this.maze = this.game.plugins.add(new Phaser.Plugin.BomberbotMazes(this.game, this));

  this.positronic.create();
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