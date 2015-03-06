window.onload = function() {

  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('Game', FroggerBot.Game);
  game.state.start('Game');
}