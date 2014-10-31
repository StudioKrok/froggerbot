var Player = function(socket){
  var socket = socket;
  var id = socket.id;
  var side = '';
  var program = [];
  var ready = false;
  var levelMap = [];
  var trans = {
    "4":1,
    "1":4,
    "8":2,
    "2":8,
    "16":16
  };
  var currentPosition = {x:0,y:0};
  var life = 3;
  var currentIndex = 0;

  return {
    disconnect: function(){

    },
    setProgram: function(clientProgram){
      if(side === 'B'){
        clientProgram.forEach(function(element,index){
          clientProgram[index] = trans[element];
        });
      }
      program = clientProgram;
      console.log(program);
      ready = true;
      currentIndex = 0;
    },
    playAgain: function(){

    },
    setSide: function(newSide){
      side = newSide;
      socket.emit('setSide', side);
      console.log('setSide', side);
    },
    setLevelMap: function(myMap){
      levelMap = myMap;
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
    },
    die: function(side){
      program = [];
      ready = false;
      currentPosition.x=3;
      currentPosition.y = side==='A'?7:0;
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
    connectNewPlayer: function(socket){
      var player = new Player(socket);
      players.push(player);
      return player;
    },

    removePlayer: function(player){
      //...
    }
  }
})();