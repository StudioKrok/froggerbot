var Player = function(socket){
  var socket = socket;
  var id = socket.id;
  var side = '';
  var program = [];
  var ready = false;
  var levelMap = [];

  return {
    disconnect: function(){

    },
    setProgram: function(program){
      console.log(program);
      ready = true;
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