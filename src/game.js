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
    [0,0,0,2,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,4,0,0,0,0],
    [0,0,0,0,4,0,0],
    [0,0,0,4,4,4,0],
    [0,0,4,0,0,4,0],
    [0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0]
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

  function moveUp(player){
    var position = player.getPosition();
    if(--position.y<0){
      position.y=0;
      if(player.getSide()==='A'){
        console.log('Player A wins!');
      }
      return;
    }
    var cellValue = levelMap[position.y][position.x];
    if(cellValue==4){
      console.log('Player can\'t move');
      position.y++;
      return;
    }
  };

  function moveDown(player){
    var position = player.getPosition();
    if(++position.y>=levelMap.length){
      position.y=levelMap.length-1;
      if(player.getSide()==='B'){
        console.log('Player B wins!');
      }
      return;
    }
    var cellValue = levelMap[position.y][position.x];
    if(cellValue==4){
      console.log('Player can\'t move');
      position.y--;
      return;
    }
  };

  function moveLeft(player){
    var position = player.getPosition();
    if(--position.x<0){
      position.x=0;
      return;
    }
    var cellValue = levelMap[position.y][position.x];
    if(cellValue==4){
      console.log('Player can\'t move');
      position.x++;
      return;
    }
  };

  function moveRight(player){
    var position = player.getPosition();
    if(++position.x>=levelMap[0].length){
      position.x=levelMap[0].length-1;
      return;
    }
    var cellValue = levelMap[position.y][position.x];
    if(cellValue==4){
      console.log('Player can\'t move');
      position.x--;
      return;
    }
  };

  var movements = {
    '1': moveLeft,
    '2': moveUp,
    '4': moveRight,
    '8': moveDown
  };

  function nextTurn(){
    console.log('next turn', turn++);
    
    var playerANextMov = playerA.getNextMovement();
    if(playerANextMov){
      var position = playerA.getPosition();
      levelMap[position.y][position.x] = 0;
      movements[playerANextMov](playerA);
      levelMap[position.y][position.x] = '1';
    }

    var playerBNextMov = playerB.getNextMovement();
    if(playerBNextMov){
      var position = playerB.getPosition();
      levelMap[position.y][position.x] = 0;
      movements[playerBNextMov](playerB);
      levelMap[position.y][position.x] = '2';
    }

    playerA.setLevelMap(levelMap);
    playerB.setLevelMap(invertMap(levelMap));
  }

  gameActions = {};
  gameActions[GAME_STATE.CREATED] = function(){
    //I don't know what to do with myself
  };
  gameActions[GAME_STATE.WAITING] = function(){
    if(playerA.isReady() && playerB.isReady()){
      console.log("THE BATTLE STARTS");
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
        player.setPosition(3,7);
        return;
      }
      playerB = player;
      player.setSide('B');
      player.setLevelMap(invertMap(levelMap));
      player.setPosition(3,0);

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