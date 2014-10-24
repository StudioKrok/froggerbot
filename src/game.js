var GAME_STATE = {
  CREATED: 0,
  WAITING: 1,
  STARTED: 2,
  PLAYING: 3,
  ENDED: 4
};

exports.GAME_STATE = GAME_STATE;

exports.Game = function(){

  var playerA = null;
  var playerB = null;

  var state = GAME_STATE.CREATED;
  var self = this;
  var id = (new Date()).getTime();

  var turn = 0;

  function init(){
    state = GAME_STATE.PLAYING;
    turn = 0;
  }

  function nextTurn(){
    console.log('next turn', turn++);
  }

  gameActions = {};
  gameActions[GAME_STATE.CREATED] = function(){
    // do nothing
  };
  gameActions[GAME_STATE.WAITING] = function(){
    if(playerA.ready && playerB.ready){
      init();
    }
  };
  gameActions[GAME_STATE.PLAYING] = nextTurn;

  return {
    addPlayer: function(player){
      if(state != GAME_STATE.CREATED) return;
  
      player.game = self;
  
      if(!playerA){
        playerA = player;
        player.setSide('A');
        return;
      }
      playerB = player;
      player.setSide('B');
      state = GAME_STATE.WAITING;
    },
    getState: function(){
      return state;
    },
    update: function(){
      gameActions[state]();
    }
  }
};