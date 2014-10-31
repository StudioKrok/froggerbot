var GAME_STATE = {
  CREATED: 0,
  WAITING: 1,
  STARTED: 2,
  PLAYING: 3,
  ENDED: 4
};

exports.GAME_STATE = GAME_STATE;

exports.Game = function(){

  //Load the map for the game. This can be used for load random maps
  var levelMap = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,4,0,0,0,0],
    [0,0,0,0,4,0,0],
    [0,0,0,4,4,4,0],
    [0,0,4,0,0,4,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];
  function invertMap(map){
    var cols = map[0].length-1;
    var rows = map.length-1;
    var newMap = [];

    for (var i = 0; i <= rows; i++) {
      newMap.push([]);
      for (var j = 0; j <= cols; j++) {
        newMap[i].push(map[rows-i][cols-j]);
      };
    };

    return newMap;
  }

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
    //I don't know what to do with myself
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
        player.setLevelMap(levelMap);
        return;
      }
      playerB = player;
      player.setSide('B');
      player.setLevelMap(invertMap(levelMap));
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