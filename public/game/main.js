window.onload = function() {
  var game = null;
  var socket = io();

  socket.on('setEnemySide', function(side){
    game.playerSide = side;
    console.log('My enemy side is: ', side);
  });

  socket.on('setSide', function(side){
    game.playerSide = side;
    console.log('My side is: ', side);
  });

  socket.on('setPosition', function(position){
    game.playerPosition = position;
  });

  socket.on('setMap',function(map){
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    game.levelMap = map;
    game.state.add('Game', FroggerBot.Game);
    game.state.start('Game');
  });

  socket.on('setEnemy', function(enemy){
    game.enemyObj = enemy;
  });
}