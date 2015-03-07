window.onload = function() {
  var game = null;
  var socket = io();

  var temp = {};

  socket.on('setMap',function(map){
    if(!game){
      game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
      game.socket = socket;
      game.playerSide = temp.side;
      game.levelMap = map;
      game.state.add('Game', FroggerBot.Game);
      game.state.start('Game');
    }else{
      game.state.getCurrentState().manageMap(map);
    }
  });

  socket.on('setSide', function(side){
    if(game && game.state.getCurrentState().replaceSide){
      game.playerSide = side;
      game.state.getCurrentState().replaceSide(side);
      console.log('My side is: ', side);
    }
      temp.side = side;
  });

  socket.on('setPosition', function(position){
    if(game){
      game.playerPosition = position;
    }
  });

  socket.on('setEnemy', function(enemy){
    if(game && game.state.getCurrentState()){
      game.enemyObj = enemy;
      game.state.getCurrentState().updateEnemy(enemy);
    }
  });
}