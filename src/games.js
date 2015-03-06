// manage the different games that can be played
// join the players in the next available game
// create a new game if is neccesary
var game = require('./game');
var UUID = require('simple-uuid');

module.exports = (function(){
  var games = {};
  var gameIds = [];
  var availableGame = null;
  var availableGameId;

  var update = function(){
    for (var i = gameIds.length - 1; i >= 0; i--) {
      games[gameIds[i]].update();
    };
    setTimeout(function(){
      update();
    }, 500);
  };

  update();

  var removeGame = function(gameId){
    var index = gameIds.indexOf(gameId);
    gameIds.splice(index, 1);
    if(availableGameId === gameId){
      availableGame = undefined;
      availableGameId = undefined;
    }
    delete gameIds[gameId];
  }

  var joinPlayer = function(player){
    if(!availableGame){
      availableGameId = UUID();
      availableGame = new game.Game(availableGameId);
      games[availableGameId] = availableGame;
      gameIds.push(availableGameId);
    }
    if(availableGame.addPlayer(player)){
      console.log('adding player to game', availableGameId);
      player.setGameId(availableGameId);
    }

    if(availableGame.getState() != game.GAME_STATE.CREATED){
      availableGame = null;
      availableGameId = undefined;
    }
  };

  var playerDisconnected = function(gameId, playerId){
    var playerA = games[gameId].removePlayer(playerId);
    
    // player removed and no more players in game, delete game
    if(!playerA){
      removeGame(gameId);
      return;
    }
    
    // available game is the game player leave, 
    if(availableGameId === gameId){
      return;
    }
    
    // there's no an available game, set this game the available one 
    if(!availableGame){
      availableGame = games[gameId];
      availableGameId = gameId;
      return;
    }

    //there's an available game
    removeGame(gameId);
    joinPlayer(playerA);
  }

  return {
    joinPlayer: joinPlayer,
    playerDisconnected: playerDisconnected
  }
})();