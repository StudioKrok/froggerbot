var Player = function(gameManager, socket){
  var socket = socket;
  var id = socket.id;
  var side = '';
  var program = [];
  var ready = false;
  var levelMap = [];
  var gameId = ''; 
  var trans = {
    "4": 1,
    "1": 4,
    "8": 2,
    "2": 8,
    "16": 16
  };
  var currentPosition = {x:0,y:0};
  var life = 3;
  var currentIndex = 0;

  return {
    disconnect: function(){
      console.log('player ', id, ' disconnected.');
      console.log('game ', gameId, ' disconnected.');
      gameManager.playerDisconnected(gameId, this.id);
    },
    setProgram: function(clientProgram){
      if(side === 'B'){
        clientProgram.forEach(function(element,index){
          clientProgram[index] = trans[element];
        });
      }
      program = clientProgram;
      console.log(program);
      console.log('gameid', gameId);
      ready = true;
      currentIndex = 0;
    },
    playAgain: function(){
      console.log('player ', id, ' wants to play again.');

    },
    setSide: function(newSide){
      side = newSide;
      socket.emit('setSide', side);
      console.log('setSide', side);
    },
    setLevelMap: function(myMap){
      levelMap = myMap;
      //console.log(levelMap.toString());
      socket.emit('setMap', levelMap);
    },
    isReady: function(){
      return ready;
    },
    getNextMovement: function(){
      if(currentIndex > program.length) return;
      return program[currentIndex++];
    },
    getPosition: function(){
      return currentPosition;
    },
    getSide: function(){
      return side;
    },
    setPosition: function(x,y){
      currentPosition.x = x;
      currentPosition.y = y;
      socket.emit('setPosition', currentPosition);
    },
    setEnemyPositionAndSide: function(x, y, side){
      var enemyPositionAndSide = {
        x: x,
        y: y,
        side: side
      };

      socket.emit('setEnemy', enemyPositionAndSide);
    },
    die: function(side){
      program = [];
      ready = false;
      currentPosition.x=3;
      currentPosition.y = side==='A'?7:0;
    },
    setGameId: function(gameUid){
      gameId = gameUid;
      socket.emit('onGame', gameId);
    },
    getId: function(){
      return id;
    }
  }
};

module.exports = (function(){
  var players = [];

  function addPlayer(player){
    players.push(player);
    console.log(player.id);
  };

  return {
    connectNewPlayer: function(games, socket){
      var player = new Player(games, socket);
      players.push(player);
      return player;
    },

    removePlayer: function(player){
      //...
    }
  }
})();