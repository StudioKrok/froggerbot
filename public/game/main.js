window.onload = function() {
  var game = null;
  var socket = io();

  //Log in into a game
  socket.on('setSide', function(side){
    console.log('My side is: ', side);
  });

  socket.on('setMap',function(map){
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    game.levelMap = map;
    game.state.add('Game', FroggerBot.Game);
    game.state.start('Game');
  });
}