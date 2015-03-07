var FroggerBot = FroggerBot || {};

function _createLevel(width, height){
  var level = [];
  for (var i = 0; i < height; i++) {
    level.push([]);
    for (var j = 0; j < width; j++) {
      level[i].push('.');
    };
  };
  return level;
};

function mapToMaze(map){
  var mazeWidth = map[0].length;
  var mazeHeight = map.length;
  maze = [];

  //Read the map
  for(var i=0; i<map.length; i++){
    for(var j=0; j<map[i].length; j++){
      if(map[i][j] >= 0 && map[i][j] <= 2){
        if(maze.length === 0){
          maze.push(_createLevel(mazeWidth, mazeHeight));
        }

        maze[0][i][j] = '' + 0;
      }else if(map[i][j] > 2){
        if(maze.length === 0){
          maze.push(_createLevel(mazeWidth, mazeHeight));
        }

        maze[0][i][j] = '' + 0;

        if(maze.length === 1){
          maze.push(_createLevel(mazeWidth, mazeHeight));
        }

        maze[1][i][j] = '' + map[i][j];
      }
    }
  }
  return maze;
};




FroggerBot.Game = function(game) {
  this.enemyOnBoard = false;
  this.socket = game.socket;
  this.firstMap = game.levelMap;
};

FroggerBot.Game.prototype.init = function(){
  this.input.maxPointers = 1;
  this.stage.disableVisibilityChange = true;
};

FroggerBot.Game.prototype.preload = function() {
  this.load.spritesheet('controls', 'assets/img/controls.png', 50, 50);
  this.load.spritesheet('crud', 'assets/img/crud.png', 50, 50);
  this.load.spritesheet('actions', 'assets/img/actions.png', 50, 50);

  //Load Blocks
  this.load.image('block01', 'assets/img/block01.png');
  this.load.image('block02', 'assets/img/block02.png');

  //Load Shadows
  this.load.image('sh_nw', 'assets/img/sh_nw.png');
  this.load.image('sh_n', 'assets/img/sh_n.png');
  this.load.image('sh_ne', 'assets/img/sh_ne.png');
  this.load.image('sh_w', 'assets/img/sh_w.png');
  this.load.image('sh_e', 'assets/img/sh_e.png');
  this.load.image('sh_sw', 'assets/img/sh_sw.png');
  this.load.image('sh_s', 'assets/img/sh_s.png');
  this.load.image('sh_se', 'assets/img/sh_se.png');
  this.load.image('sh_side_e', 'assets/img/sh_side_e.png');

  //Load the sprites for the players
  this.load.spritesheet('bomberbotA', 'assets/img/bomberbotA.png', 125, 200);
  this.load.spritesheet('bomberbotB', 'assets/img/bomberbotB.png', 125, 200);
};

FroggerBot.Game.prototype.create = function() {
  var me = this;

  //Add the players
  console.log('my side is', this.game.playerSide);
  this.player = this.game.add.sprite(0, 0, 'bomberbot' + this.game.playerSide, 5);
  this.player.scale.set(0.55, 0.55);

  //Add and configure the Positronic plugin
  this.positronic = this.game.plugins.add(new Phaser.Plugin.Positronic(this.game, this));
  this.positronic.create();
  this.positronic.configure(FroggerBot.Configuration.positronicConfig);
  this.positronic.start = function(){
    console.log('do nothing', me.socket);
    me.socket.emit('setProgram', me.positronic.mainProgramGroup.getProgram().split(','));
  };
  this.calculateCenterSpace();

  //Add and configure the Maze2.5D plugin
  this.maze = this.game.plugins.add(new Phaser.Plugin.BomberbotMazes(this.game, this));
  this.configureMazePlugin();
  this.maze.createMaze(function(err, maze) {
    if (err) {
      console.log('err',  err);
      return;
    }

    me.maze.addCharacter(me.player);
    me.maze.placeCharacterInCell(0, me.game.playerPosition.y, me.game.playerPosition.x, me.player.key);

    me.placeMaze();
  });

};

FroggerBot.Game.prototype.update = function() {
  if(!this.enemyOnBoard && this.game.enemyObj){
    this.enemyOnBoard = true;
    this.enemy = this.game.add.sprite(0, 0, 'bomberbot' + this.game.enemyObj.side, 5);
    this.enemy.scale.set(0.55, 0.55);
    this.maze.addCharacter(this.enemy);
    this.maze.placeCharacterInCell(0, this.game.enemyObj.y, this.game.enemyObj.x, this.enemy.key);
  }

};

FroggerBot.Game.prototype.render = function() {
  
};

FroggerBot.Game.prototype.configureMazePlugin = function(){
  //console.log(this.game.levelMap.toString());
  this.maze.setGrid(mapToMaze(this.game.levelMap));

  this.maze.setCellsProperties(config.cellTypes);

  this.maze.setShadowsProperties(config.shadows);

  this.maze.setCellsWidth(config.cell.width - 1);
  this.maze.setCellsHeight(config.cell.height - 1);
  this.maze.setCellsFrontHeight(config.cell.frontHeight);
  this.maze.setCellsEmptyHeight(config.cell.emptyHeight);

  this.maze.setWithShadows(config.normalShadows);
  this.maze.setWithFloorShadows(config.floorShadows);

};

FroggerBot.Game.prototype.calculateCenterSpace = function(){
  //1. Calculate the amount of space ocuppied by the Positronic plugin
  this.positronicSpace = this.positronic.editorGroup.x + this.positronic.editorGroup.width + 10;
  //[TEMPORAL] Define the space that other graphic element could occupy
  var otherElementSpace = 180;
  //2. Calculate the amount of the space where the maze will be placed
  this.centerSpace = Math.abs(this.game.width - this.positronicSpace - otherElementSpace);
};

FroggerBot.Game.prototype.placeMaze = function(){
  var me = this;

  //Scale the maze
  me.scaleFactor = (me.game.height - 50) / 910;
  me.maze.mazeLayersGroup.scale.set(me.scaleFactor, me.scaleFactor);

  //Place the maze
  me.maze.mazeLayersGroup.x = Math.abs( (this.centerSpace / 2) - (me.maze.mazeLayersGroup.width / 2) ) + this.positronicSpace;
  me.maze.mazeLayersGroup.y = me.positronic.editorGroup.y + 20;
};

FroggerBot.Game.prototype.replaceSide = function(side){
  //this.player = this.game.add.sprite(0, 0, 'bomberbot' + side, 5);
};

FroggerBot.Game.prototype.updateEnemy = function(enemy){
  //this.enemy = this.game.add.sprite(0, 0, 'bomberbot' + enemy.side, 5);
};

FroggerBot.Game.prototype.manageMap = function(map){
  //we need to analyze the map
  //2 0 true
  for (var j = 0; j < this.firstMap.length; j++) {
    var row = this.firstMap[j];
    for (var i = 0; i < row.length; i++) {
      if(this.firstMap[j][i]!==map[j][i]){
        console.log(map[j][i], this.firstMap[j][i], this.firstMap[j][i]!==map[j][i])
        //something happens!
        if(map[j][i]==0){
          //TODO
          console.log('clean cell');
        }
        if(map[j][i]&1 && !(this.firstMap[j][i]&1)){
          //TODO
          console.log('move player 1');
        }
        if(map[j][i]&2 && !(this.firstMap[j][i]&2)){
          //TODO
          console.log('move player 2');
        }
        if(map[j][i]&4 && !(this.firstMap[j][i]&4)){
          //TODO
          console.log('block appears?');
          //this.maze.putCell
        }
        if(map[j][i]&8 && !(this.firstMap[j][i]&8)){
          //TODO
          console.log('mine 1 appears');
        }
        if(map[j][i]&16 && !(this.firstMap[j][i]&16)){
          //TODO
          console.log('mine 2 appears');
        }
      }
    }
  }
  this.firstMap = map;
};
