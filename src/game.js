var GAME_STATE = {
  CREATED: 'c',
  WAITING: 'w',
  STARTED: 's',
  PLAYING: 'p',
  ENDED: 'e'
};

exports.GAME_STATE = GAME_STATE;

exports.Game = function(uid){

  var id = uid;
  //Load the map for the game. This can be used for load random maps
  var levelMap = [
    [0,0,0,2,0,0,0],
    [0,0,0,0,0,0,0],
    [0,4,4,0,0,0,4],
    [0,0,4,0,4,0,0],
    [4,0,0,0,4,4,0],
    [0,0,0,0,0,4,0],
    [0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0]
  ];

  var maze = null;

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

  function putMine(player){
    var position = player.getPosition();
    if(player.getSide() === 'A'){
      levelMap[position.y][position.x] += 8;
      return;
    }
    levelMap[position.y][position.x] += 16;
  };

  function validateMineCollision(player){
    var position = player.getPosition();
    var cell = levelMap[position.y][position.x];
    if(player.getSide()==='A' && (cell&16)==16){
      levelMap[position.y][position.x]=0;
      levelMap[7][3]=1;
      player.die();
      state = GAME_STATE.WAITING;
      return true;
    }
    if(player.getSide()==='B' && (cell&8)==8){
      levelMap[position.y][position.x]=0;
      levelMap[0][3]=2;
      player.die();
      state = GAME_STATE.WAITING;
      return true;
    }
    
    return false;
  };

  var movements = {
    '1': moveLeft,
    '2': moveUp,
    '4': moveRight,
    '8': moveDown,
    '16':putMine
  };

  function reset(){
    levelMap = [
    [0,0,0,2,0,0,0],
    [0,0,0,0,0,0,0],
    [0,4,4,0,0,0,4],
    [0,0,4,0,4,0,0],
    [4,0,0,0,4,4,0],
    [0,0,0,0,0,4,0],
    [0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0]
    ];
    console.log('reset');
  };
  function nextTurn(){
//    console.log('next turn', turn++);

    if(validateMineCollision(playerA)||validateMineCollision(playerB)){
      playerA.setLevelMap(levelMap);
      playerB.setLevelMap(invertMap(levelMap));
      return;
    }
    
    var playerANextMov = playerA.getNextMovement();
    if(playerANextMov){
      var position = playerA.getPosition();
      levelMap[position.y][position.x] -= 1;
      movements[playerANextMov](playerA);
      levelMap[position.y][position.x] += 1;
    }

    var playerBNextMov = playerB.getNextMovement();
    if(playerBNextMov){
      var position = playerB.getPosition();
      levelMap[position.y][position.x] -= 2;
      movements[playerBNextMov](playerB);
      levelMap[position.y][position.x] += 2;
    }
    playerA.setLevelMap(levelMap);
    playerB.setLevelMap(invertMap(levelMap));
  }

  var gameActions = {};
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
      if(state != GAME_STATE.CREATED) return false;
  
      player.game = self;
  
      if(!playerA){
        playerA = player;
        player.setSide('A');
        player.setLevelMap(levelMap);
        player.setPosition(3,7);
        return true;
      }

      playerB = player;
      player.setSide('B');
      player.setLevelMap(invertMap(levelMap));
      //log(invertMap(levelMap));
      player.setPosition(3,0);

      playerA.setEnemyPositionAndSide(3, 0, 'B');
      playerB.setEnemyPositionAndSide(3, 7, 'A');

      state = GAME_STATE.WAITING;
      return true;
    },
    removePlayer: function(playerId){
      if(playerA.getId() === playerId){
        console.log('player <A> fue el que se fue');
        playerA = playerB;
      }else if(!!playerB && playerB.getId() !== playerId){
        console.log('player a ni b fue el que se fue');
        return;
      }
      console.log('player >B< fue el que se fue');
      playerB = undefined;
      reset();
      if(playerA){
        playerA.setSide('A');
        playerA.setLevelMap(levelMap);
        playerA.setPosition(3,7);
      }
      state = GAME_STATE.CREATED;
      return playerA;
    },
    getState: function(){
      return state;
    },
    update: function(){
      //console.log(id, state, playerA.getId(), playerB&&playerB.getId());
      gameActions[state]();
    },
    getId: function(){
      return id;
    }
  }
};