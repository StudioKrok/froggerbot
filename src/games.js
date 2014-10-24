// manage the different games that can be played
// join the players in the next available game
// create a new game if is neccesary
var game = require('./game');

module.exports = (function(){
  var games = [];
  var availableGame = null;

  var update = function(){
    for (var i = games.length - 1; i >= 0; i--) {
      games[i].update();
    };
    setTimeout(function(){
      update();
    }, 1000);
  };
  update();

  return {
    joinPlayer: function(player){
      if(!availableGame){
        availableGame = new game.Game();
        games.push(availableGame);
      }
      availableGame.addPlayer(player);
      if(availableGame.getState() != game.GAME_STATE.CREATED){
        availableGame = null;
      }
    }
  }
})();