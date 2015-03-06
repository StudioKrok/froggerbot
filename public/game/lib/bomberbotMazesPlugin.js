/**
 *            _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
 * | | | | | |                                     | |
 *   | | | | |                                     | | |
 *     | | | | BOMBERBOTMAZES < <> > PHASER PLUGIN | | | |
 *       | | |                                     | | | | |
 *         | |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _| | | | | |
 *
 *
 * this.characterLocations = {
 *   "key" : {
 *     phaserObj:Phaser.Sprite,
 *     cellWhereStands:Phaser.Sprite,
 *     lastMovementDirection:string
 *   }
 * }
 */

/**
 * @author       Mateo Robayo <mapedorr@gmail.com>
 */

/**
 * @class Phaser.Plugin.BomberbotMazes
 * 
 * @classdesc
 * BomberbotMazes is a maze construction plugin that lets handle events and depth
 * positioning of characters and blocks in a 2.5D dimension with a TOP-DOWN view.
 * 
 * @constructor
 * @param {Phaser.Game} game The current game instance.
 * @param {Object} parent The object that initializes the plugin.
 */
Phaser.Plugin.BomberbotMazes = function (game, parent) {
  Phaser.Plugin.call(this, game, parent);

  this.game = game;
  this.parent = parent;
  this.user = parent;

  //Maze's map
  this.grid = null;
  this.originalGrid = null;

  //Properties
  this.cellsProperties = null;
  this.shadowsProperties = null;

  //Sizes
  this.cellWidth = null;
  this.cellHeight = null;
  this.cellEmptyHeight = 0;
  this.cellTopHeight = null;
  this.cellFrontHeight = null;

  //Arrays
  this.layers = null;
  this.levels = null;
  this.floorArray = null;
  this.fallingCells = null;
  this.shadowsArray = null;

  //Phaser groups
  this.mazeLayersGroup = null;

  //Booleans
  this.withFloorShadows = null;
  this.withShadows = false;

  //Relative to character
  this.characterLocations = null;
  this.characterLocationsRepo = [];

  this.holeBlockKey = null;

};

//Movement constants definition
Phaser.Plugin.BomberbotMazes.MOVEMENT = Phaser.Plugin.BomberbotMazes.MOVEMENT || {};
Phaser.Plugin.BomberbotMazes.MOVEMENT.LEFT = 0;
Phaser.Plugin.BomberbotMazes.MOVEMENT.RIGHT = 1;
Phaser.Plugin.BomberbotMazes.MOVEMENT.UP = 2;
Phaser.Plugin.BomberbotMazes.MOVEMENT.DOWN = 4;

//Definition of constructor
Phaser.Plugin.BomberbotMazes.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.BomberbotMazes.prototype.constructor = Phaser.Plugin.BomberbotMazes;

//++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++
//  SETTERS & GETTERS
//++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++

/**
 * Set the grid for painting the level.
 *
 * @param {array[][]} grid
 */
Phaser.Plugin.BomberbotMazes.prototype.setGrid = function(grid){
  this.grid = this.cloneGrid(grid);
  this.originalGrid = this.cloneGrid(grid);
};

/**
 * Set the map of properties for each cell.
 *
 * @param {array[object]} cellsProperties
 */
Phaser.Plugin.BomberbotMazes.prototype.setCellsProperties = function(cellsProperties){
  this.cellsProperties = cellsProperties;
  //1. Find the key for hole blocks
  if(!this.holeBlockKey){
    for(propertie in this.cellsProperties){
      if(this.cellsProperties[propertie].isHole === true){
        this.holeBlockKey = propertie;
      }
    }
  }
  this.debugGrid(this.grid);
  this.debugGrid(this.originalGrid);
};

/**
 * Set the width of the cells to use in the maze painting.
 *
 * @param {number} width
 */
Phaser.Plugin.BomberbotMazes.prototype.setCellsWidth = function(width){
  this.cellWidth = width;
};

/**
 * Set the height of the cells to use in the maze painting.
 *
 * @param {number} width
 */
Phaser.Plugin.BomberbotMazes.prototype.setCellsHeight = function(height){
  this.cellHeight = height;
};

/**
 * Set the height for the empty space in the cells images.
 *
 * @param {number} width
 */
Phaser.Plugin.BomberbotMazes.prototype.setCellsEmptyHeight = function(cellEmptyHeight){
  this.cellEmptyHeight = cellEmptyHeight;
};

/**
 * Set the height of the top view in the cells images.
 *
 * @param {number} width
 */
Phaser.Plugin.BomberbotMazes.prototype.setCellsTopHeight = function(cellTopHeight){
  this.cellTopHeight = cellTopHeight;
};

/**
 * Set the height of the front view in the cells images.
 *
 * @param {number} width
 */
Phaser.Plugin.BomberbotMazes.prototype.setCellsFrontHeight = function(cellFrontHeight){
  this.cellFrontHeight = cellFrontHeight;
};

/**
 * Set the image keys for shadows.
 *
 * @param {array} shadowsProperties
 */
Phaser.Plugin.BomberbotMazes.prototype.setShadowsProperties = function(shadowsProperties){
  this.shadowsProperties = shadowsProperties;
};

/**
 * Set the boolean for generating floor shadows.
 *
 * @param {boolean} drawFloorShadows
 */
Phaser.Plugin.BomberbotMazes.prototype.setWithFloorShadows = function(withFloorShadows){
  this.withFloorShadows = withFloorShadows;
};

/**
 * Set the boolean for generating shadows.
 *
 * @param {boolean} setDrawShadows
 */
Phaser.Plugin.BomberbotMazes.prototype.setWithShadows = function(setWithShadows){
  this.withShadows = setWithShadows;
};

/**
 * Get the width of the maze.
 *
 * @param {boolean} drawFloorShadows
 */
Phaser.Plugin.BomberbotMazes.prototype.getMazeWidth = function(){
  if(this.floorShadows){
    return (this.grid[1])[0].length * this.cellWidth;
  }else{
    return (this.grid[0])[0].length * this.cellWidth;
  }
};

/**
 * Get the height of the maze.
 *
 * @param {boolean} drawFloorShadows
 */
Phaser.Plugin.BomberbotMazes.prototype.getMazeHeight = function(){
  return this.grid[0].length * (this.cellFrontHeight + this.cellTopHeight);
};

//++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++
//  METHODS
//++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++

/**
 * Fill the white spaces of the grid (undefined) with the hole key.
 * 
 * @param  {array} grid  The grid to debug.
 */
Phaser.Plugin.BomberbotMazes.prototype.debugGrid = function(grid){
  for(var level=0; level<grid.length; level++){
    var rowsOfLevel = grid[level];
    for(var row=0; row<rowsOfLevel.length; row++){
      var blocksOfRow = rowsOfLevel[row];
      for(var block=0; block < blocksOfRow.length; block++){
        if(!grid[level][row][block]){
          grid[level][row][block] = this.holeBlockKey;
        }
      }
    }
  }
};

/**
 * Create the maze and its shadows.
 *
 * @param {function(err,maze)} callback
 */
Phaser.Plugin.BomberbotMazes.prototype.createMaze = function(callback){
  //Check if the necessary data is defined
  if(!this.grid 
      || !this.cellsProperties
      || !this.cellWidth
      || !this.cellHeight
      || !this.cellFrontHeight){
    return callback({message:'You HAVE to define the attributes: grid, cellsProperties, cellWidth, cellHeight, cellFrontHeight'},null);
  }

  var me = this;

  //Calculate the top view height if necessary
  if(!this.cellTopHeight){
    this.cellTopHeight = this.cellHeight - this.cellEmptyHeight - this.cellFrontHeight;
  }

  //Create the group that will contain the layers of the maze
  this.mazeLayersGroup = this.game.add.group(undefined,'mazeLayers');

  //  --------------------------------------
  //| Create the maze and add it to the game |
  //  --------------------------------------

  //Create the Array for the layers
  this.layers = new Array();

  //Create the Array for the (floor) levels
  this.levels = new Array();

  //Initial position for cells painting
  var cellXPos = 0;
  var cellYPos = 0;

  //The layers are created from back to front (top-down in the grid of the maze)
  this.grid.forEach(function(level, levelIndex){
    //Create the object for the (floor) LEVEL
    var levelObj = {
      id:"level-" + me.levels.length
    };
    levelObj.rows = new Array();

    //Each row represents a layer
    level.forEach(function(layer,layerIndex){

      //Create the object for the LAYER
      layerObj = me.layers[layerIndex];

      if(!layerObj){
        var layerObj = {
          id: 'layer-' + layerIndex + '_' + levelObj.id
        };

        layerObj.phaserGroup = me.game.add.group(me.mazeLayersGroup, layerObj.id);
        layerObj.rows = new Array();
      }

      //Create the object for the ROW
      var rowObj = {
        id: 'layer-' + layerIndex + '_' + levelObj.id + "_row-" + layerIndex
      };
      rowObj.phaserGroup = me.game.add.group(layerObj.phaserGroup, rowObj.id);
      rowObj.cells = new Array();

      layer.forEach(function(col,colIndex){
        var block = new Phaser.Plugin.BomberbotMazes.Block();

        if(!col || (col && !col.isFloor)){
          me.assignProperties(me.cellsProperties[col], block);
        }else{
          cell.isFloor = true;
        }

        block.id = rowObj.id + "_cell-" + rowObj.cells.length;
        block.layer = me.layers.length;
        block.layerRow = layerObj.rows.length;
        block.level = me.levels.length;
        block.row = levelObj.rows.length;
        block.col = rowObj.cells.length;
        block.index = rowObj.phaserGroup.children.length;
        block.type = block.spriteKey || 'hole';

        if(!block.isHole && !block.isFloor){
          var blockYPos = 0;
          if(block.yOffset){
            blockYPos = cellYPos + block.yOffset;
          }else{
            blockYPos = cellYPos;
          }

          block.phaserObj = me.game.add.sprite(cellXPos, blockYPos, block.spriteKey, 0, rowObj.phaserGroup);
          block.phaserObj.name = block.id;

          if(block.initialTint){
            block.phaserObj.tint = block.initialTint;
          }

          if(block.tints){
            block.currentTintId = 0;
          }

          //Configure physics
          me.game.physics.arcade.enable(block.phaserObj,Phaser.Physics.Arcade.Body);
          block.phaserObj.body.setSize(me.cellWidth,me.cellFrontHeight,0,me.cellHeight - me.cellFrontHeight);
          block.phaserObj.body.collideWorldBounds = true;
          block.phaserObj.body.allowGravity = false;
          block.phaserObj.body.moves = false;

          //Configue inputs
          block.phaserObj.inputEnabled = true;
          block.phaserObj.hitArea = new Phaser.Rectangle(0, me.cellEmptyHeight, me.cellWidth,me.cellTopHeight + me.cellFrontHeight);

          // @TODO This event has test purposes only
          block.phaserObj.events.onInputUp.add(function(){
            //DESTROY THE CELL
            // me.destroyCell.apply(me,[block.level, block.row, block.col]);
          });

          //configure animations
          if(block.animations){
            for(animation in block.animations){
              var properties = block.animations[animation];
              block.phaserObj.animations.add(animation, properties.frames, properties.fps, properties.loop);
            }
          }

          if(block.startAnimation){
            block.phaserObj.play(block.startAnimation);
          }

        }else if(block.isHole){
          if(!me.holeBlockKey){
            me.holeBlockKey = col;
          }
          block.phaserObj = {
            x:cellXPos,
            y:cellYPos,
            parent:rowObj.phaserGroup
          };
        }

        cellXPos += me.cellWidth;

        rowObj.cells.push(block);
      });

      layerObj.rows.push(rowObj);
      levelObj.rows.push(rowObj);

      me.layers.push(layerObj);

      cellXPos = 0;
      cellYPos += (me.cellTopHeight);

    });

    me.levels.push(levelObj);

    cellXPos = 0;
    cellYPos = (levelIndex + 1) * me.cellFrontHeight * -1;

  });

  this.mazeLayersGroup.x = this.game.world.width/2 - (this.getMazeWidth() / 2);
  this.mazeLayersGroup.y = this.game.world.height/2 - (this.getMazeHeight() / 2);

  if(this.withShadows === true){
    this.drawShadows();
  }

  callback(null,{message:"Maze created!",maze:this.mazeLayersGroup});
};

/**
 * Function that clones the received array and returns the clone created.
 *
 * @param {array} arrayToClone
 */
Phaser.Plugin.BomberbotMazes.prototype.cloneGrid = function(arrayToClone){
  var clone = [];

  for(var i=0; i<arrayToClone.length; i++){
    clone.push([]);
    for(var j=0; j<arrayToClone[i].length; j++){
      clone[i].push([]);
      for(var k=0; k<arrayToClone[i][j].length; k++){
        clone[i][j].push(arrayToClone[i][j][k]);

      }
    }
  }

  return clone;
};

/**
 * Function that clones the received object and returns the clone created.
 *
 * @param {object} objToClone
 */
Phaser.Plugin.BomberbotMazes.prototype.cloneObj = function(objToClone){
  var clone = objToClone.constructor();

  for (var attr in objToClone) {
    if (objToClone.hasOwnProperty(attr)){
      clone[attr] = objToClone[attr];
    }
  }

  return clone;
};

/**
 * Function that copy the properties from the source object to the same
 * properties in the target object.
 * 
 * @param  {object} source
 * @param  {object} target
 */
Phaser.Plugin.BomberbotMazes.prototype.assignProperties = function(source, target){
  for(propertie in source) {
    //if (propertie in target){
      target[propertie] = source[propertie];
    //}
  }
};

/**
 * Function that draws shadows based on the created maze.
 * 
 */
Phaser.Plugin.BomberbotMazes.prototype.drawShadows = function(){
  var me = this;

  this.shadowsArray = [];

  if(this.grid.length == 1){
    //The maze has only one level, that means no shadows are generated
    //for the cells in the first level, because there are no cells above them.

    //Verify if the floor shadows have to be drawn
    if(this.floorShadows){
      this.drawFloorShadows();
    }

    return;
  }

  //Go over each cell for determining which needs shadows based on the elements around.
  for(var l=0; l<this.levels.length; l++){
    var levelObj = this.levels[l];

    for(var r=0; r<levelObj.rows.length; r++){
      var rowObj = levelObj.rows[r];

      for(var c=0; c<rowObj.cells.length; c++){
        var cell = rowObj.cells[c];

        //Look the cells arround in the next level for determining which shadows are required.
        if(!cell.isHole && !cell.isItem){
          var shadowsArray = this.getOverNeighboringCells(cell);
          for(var s=0; s<shadowsArray.length ;s++){
            if(shadowsArray[s] === true){
              var shadow = {};
              if(s === shadowsArray.length-1){
                //TOPMOST
                shadow = rowObj.phaserGroup.addAt(this.game.add.image(cell.phaserObj.x,cell.phaserObj.y - me.cellFrontHeight,me.shadowsProperties[s],0),cell.phaserObj.z);
              }else{
                shadow = this.game.add.image(cell.phaserObj.x,cell.phaserObj.y,me.shadowsProperties[s],0,rowObj.phaserGroup);
              }
              this.shadowsArray.push(shadow);
            }
          }
        }
      }
    }
  }

  //Verify if the floor shadows have to be drawn
  if(this.withFloorShadows === true){
    this.drawFloorShadows();
  }
};

/**
 * Function that draws shadows for the floor and the topmost tiles.
 *
 */
Phaser.Plugin.BomberbotMazes.prototype.drawFloorShadows = function(){
  var me = this;

  //1. Create the array for the floor cells
  this.createFloorLayer();

  var shadowsGroup = me.game.add.group(undefined,'floorShadows');

  for(var i=0; i<this.floorArray.length; i++){
    for(var j=0; j<this.floorArray[i].length; j++){
      var cell = this.floorArray[i][j];

      //Look the cells arround in the next layer for determining which shadows are required.
      var shadowsArray = this.getOverNeighboringCells(cell);
      for(var s=0; s<shadowsArray.length ;s++){
        if(shadowsArray[s] === true){
          this.game.add.image(cell.phaserObj.x,cell.phaserObj.y,me.shadowsProperties[s],0,shadowsGroup);
        }
      }
    }
  }

  this.mazeLayersGroup.addAt(shadowsGroup,0);

};

/**
 * Function that creates the layer for the floor.
 * 
 */
Phaser.Plugin.BomberbotMazes.prototype.createFloorLayer = function(){
  var me = this;

  var cellXPos = 0 - this.cellWidth;
  var cellYPos = 0 - this.cellFrontHeight;

  this.floorArray = [];
  for(var i=-1; i<=this.grid[0].length; i++){
    var floorRow = [];
    for(var j=-1; j<=this.grid[0][0].length; j++){
      var floorCell = {};
      floorCell.isFloor = true;
      floorCell.level = -1;
      floorCell.layer = -1;
      floorCell.row = i;
      floorCell.col = j;
      floorCell.xPos = cellXPos;
      floorCell.yPos = cellYPos;

      cellXPos += this.cellWidth;

      floorRow.push(floorCell);
    }
    this.floorArray.push(floorRow);

    cellXPos = 0 - this.cellWidth;
    cellYPos += this.cellTopHeight;
  }
};

/**
 * Function that returns an array of the neighbor cells (in the next level) for the received cell.
 *
 * @param {object} cell
 */
Phaser.Plugin.BomberbotMazes.prototype.getOverNeighboringCells = function(cell){
  if(!this.shadowsProperties){
    return;
  }

  var levelToVerify = cell.level + 1;

  var cellsArray = [
    false,false,false,
    false,false,
    false,false,false,
    false,
    false];

  //1. Check if over the cell there is another cell. This will
  //   determine which shadows have to be, or not, calculated
  var cellUnderStackable = false;
  var aboveCell = this.getCell.apply(this,[levelToVerify,cell.row,cell.col]);
  if(aboveCell){
    if(!aboveCell.isHole && !aboveCell.isItem && aboveCell.isStackable){
      cellUnderStackable = true;
    }
  }

  for(var i=0; i<this.shadowsProperties.length ;i++){
    var neighborCell = null;
    switch(i){
      case 0:// NW
        if(!cellUnderStackable){
          neighborCell = this.getCell.apply(this,[levelToVerify,cell.row-1,cell.col-1]);
          if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
            cellsArray[i] = true;
          }
        }
        break;
      case 1://  N
        if(!cellUnderStackable){
          neighborCell = this.getCell.apply(this,[levelToVerify,cell.row-1,cell.col]);
          if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
            cellsArray[i] = true;
          }
        }
        break;
      case 2:// NE
        if(!cellUnderStackable){
          neighborCell = this.getCell.apply(this,[levelToVerify,cell.row-1,cell.col+1]);
          if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
            cellsArray[i] = true;
          }
        }
        break;
      case 3://  W
        if(!cellUnderStackable){
          neighborCell = this.getCell.apply(this,[levelToVerify,cell.row,cell.col-1]);
          if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
            cellsArray[i] = true;
          }
        }
        break;
      case 4://  E
        if(!cellUnderStackable){
          neighborCell = this.getCell.apply(this,[levelToVerify,cell.row,cell.col+1]);
          if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
            cellsArray[i] = true;
          }
        }
        break;
      case 5:// SW
        if(!cellUnderStackable){
          neighborCell = this.getCell.apply(this,[levelToVerify,cell.row+1,cell.col-1]);
          if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
            cellsArray[i] = true;
          }
        }
        break;
      case 6://  S
        if(!cellUnderStackable){
          neighborCell = this.getCell.apply(this,[levelToVerify,cell.row+1,cell.col]);
          if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
            cellsArray[i] = true;
          }
        }
        break;
      case 7:// SE
        if(!cellUnderStackable){
          neighborCell = this.getCell.apply(this,[levelToVerify,cell.row+1,cell.col+1]);
          if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
            cellsArray[i] = true;
          }
        }
        break;
      case 8:// SIDE E
        neighborCell = this.getCell.apply(this,[levelToVerify-1,cell.row+1,cell.col+1]);
        if(neighborCell && neighborCell.isStackable && !neighborCell.isItem){
          cellsArray[i] = true;
        }
        break;
      case 9:// TOPMOST
        if(!cellUnderStackable && !cell.isFloor && !cell.isItem){
          neighborCell = this.getCell.apply(this,[levelToVerify-1,cell.row-1,cell.col]);
          if(!neighborCell || (neighborCell && neighborCell.isHole)){
            cellsArray[i] = true;
          }
        }
        break;
    }
  }

  //Remove overlaping shadows
  //NORTH
  if(cellsArray[1] === true){
    cellsArray[0] = false;
    cellsArray[2] = false;
  }

  //SOUTH
  if(cellsArray[6] === true){
    cellsArray[5] = false;
    cellsArray[7] = false;
  }

  //WEST
  if(cellsArray[3] === true){
    cellsArray[0] = false;
    cellsArray[5] = false;
  }

  //EAST
  if(cellsArray[4] === true){
    cellsArray[2] = false;
    cellsArray[7] = false;
  }

  return cellsArray;
};

/**
 * Get the cell by level, row and col.
 *
 * @param {number} level
 * @param {number} row
 * @param {number} col
 */
Phaser.Plugin.BomberbotMazes.prototype.getCell = function(level, row, col){
  if(level < 0
      || row < 0
      || col < 0
      || level >= this.levels.length
      || row >= this.levels[0].rows.length
      || col >= this.levels[0].rows[0].cells.length){
    return null;
  }

  if(!((this.levels[level]).rows[row])){
    return null;
  }

  return ((this.levels[level]).rows[row]).cells[col];
};

/**
 * Function that updates the shadows for the maze's cells.
 *
 */
Phaser.Plugin.BomberbotMazes.prototype.updateShadows = function(){
  // @TODO 
};

/**
 * Updates the maze for destroying a cell.
 *
 * @param {number} level
 * @param {number} row
 * @param {number} col
 */
Phaser.Plugin.BomberbotMazes.prototype.destroyCell = function(level, row, col){
  //Get the cell to destroy
  var cellToDestroy = this.getCell(level,row,col);

  if(cellToDestroy){
    var cellAbove = this.getCell(level+1,row,col);

    //Update the grid
    if(cellAbove){
      if(!cellAbove.isHole){
        var cellToMove = null;
        var newCell = 0;
        
        for(var l=this.grid.length-1; l >= 0; l--){
          if(cellToMove){
            newCell = cellToMove;
          }
          cellToMove = ((this.grid[l])[row])[col];
          ((this.grid[l])[row])[col] = newCell;
        }
      }else{
        ((this.grid[level])[row])[col] = this.holeBlockKey;
      }
    }else{
      ((this.grid[level])[row])[col] = this.holeBlockKey;
    }

    //Create a hole block for replacing the one that will be destroyed
    var holeBlock = new Phaser.Plugin.BomberbotMazes.Block();
    this.assignProperties(this.cellsProperties[this.holeBlockKey], holeBlock);
    holeBlock.id = cellToDestroy.id;
    holeBlock.layer = cellToDestroy.layer;
    holeBlock.level = cellToDestroy.level;
    holeBlock.row = cellToDestroy.row;
    holeBlock.col = cellToDestroy.col;
    holeBlock.index = cellToDestroy.index;
    holeBlock.type = 'hole';
    holeBlock.isHole = true;
    holeBlock.isStackable = false;
    holeBlock.isWalkable = false;
    holeBlock.phaserObj = {
      x:cellToDestroy.phaserObj.x,
      y:cellToDestroy.phaserObj.y,
      parent:cellToDestroy.phaserObj.parent
    };


    //Remove the cell from the row that contains it
    var rowInLevelsArray = (this.levels[cellToDestroy.level]).rows[cellToDestroy.row];
    rowInLevelsArray.phaserGroup.remove(cellToDestroy.phaserObj);

    //Put a hole where the cell destroyed was
    rowInLevelsArray.cells[cellToDestroy.col] = holeBlock;

    //Update the rows for the cells above the destroyed one
    if(cellAbove && !cellAbove.isHole){
      //The cell has other cell over. Update the information.
      var cellToMove = null;
      var lowerBlock = null;

      for(var lvl=cellToDestroy.level+1; lvl<this.levels.length; lvl++){
        cellToMove = this.getCell(lvl,cellToDestroy.row,cellToDestroy.col);
        if(cellToMove && !cellToMove.isHole){
          //Remove the cell to move from the group that contains it (don't destroy it)
          ((this.levels[cellToMove.level]).rows[cellToMove.row]).phaserGroup.remove(cellToMove.index);

          //Put a hole in the place of the cell to move
          var holeBlock = new Phaser.Plugin.BomberbotMazes.Block();
          this.assignProperties(this.cellsProperties[this.holeBlockKey], holeBlock);
          holeBlock.id = cellToMove.id;
          holeBlock.layer = cellToMove.layer;
          holeBlock.level = cellToMove.level;
          holeBlock.row = cellToMove.row;
          holeBlock.col = cellToMove.col;
          holeBlock.index = cellToMove.index;
          holeBlock.type = 'hole';
          holeBlock.isHole = true;
          holeBlock.isStackable = false;
          holeBlock.isWalkable = false;
          holeBlock.phaserObj = {
            x:cellToMove.phaserObj.x,
            y:cellToMove.phaserObj.y,
            parent:cellToMove.phaserObj.parent
          };

          ((this.levels[cellToMove.level]).rows[cellToMove.row]).cells[cellToMove.col] = holeBlock;

          //Move the cell
          lowerBlock = this.getCell(lvl-1,cellToMove.row,cellToMove.col);

          cellToMove.id = lowerBlock.id;
          cellToMove.level = lowerBlock.level;
          cellToMove.row = lowerBlock.row;
          cellToMove.col = lowerBlock.col;
          cellToMove.index = lowerBlock.index;

          ((this.levels[lvl-1]).rows[cellToMove.row]).cells[cellToMove.col] = cellToMove;

          //Put the phaser object in its new group
          ((this.levels[lvl-1]).rows[cellToMove.row]).phaserGroup.addAt(cellToMove.phaserObj,cellToMove.index);
        }
      }
    }else{
      this.shadowsArray.forEach(function(shadowPhaserObj){
        shadowPhaserObj.destroy(true);
      });
      this.drawShadows();
    }

    //Activate the physics for the cells above the destroyed one
    this.fallingCells = [];
    while(cellAbove){
      if(!cellAbove.isHole){
        this.fallingCells.push(cellAbove);

        cellAbove.phaserObj.body.allowGravity = true;
        cellAbove.phaserObj.body.moves = true;
      }

      cellAbove = this.getCell(cellAbove.level + 1, row, col);
    }

    cellToDestroy = null;
  }
};

/**
 * Function that reloads all the maze to its original state.
 * 
 */
Phaser.Plugin.BomberbotMazes.prototype.reloadMaze = function(callback){
  var me = this;

  //Remove all characters that are over a cell
  for(character in me.characterLocations){
    var containerGroup = (((me.characterLocations[character]).cellWhereStands).phaserObj).parent;
    containerGroup.removeChild( (me.characterLocations[character]).phaserObj );
  }

  me.characterLocationsRepo = [];

  //Remove the shadows
  me.shadowsArray.forEach(function(shadowPhaserObj){
    shadowPhaserObj.destroy(true);
  });
  me.shadowsArray = [];

  //Destroy all the Phaser.Group objects for each row and the Phaser.Sprite object of each cell
  me.levels.forEach(function(level){
    level.rows.forEach(function(row){
      row.cells.forEach(function(cell){
        if(cell.phaserObj && !cell.isHole){

          cell.phaserObj.destroy(true);
        }
      });

      if(row.phaserGroup){
        row.phaserGroup.destroy(false);
      }
    });
  });

  //Destroy the Phaser.Group objects for each layer
  me.layers.forEach(function(layer){
    layer.phaserGroup.destroy(true);
  });
  
  //Destroy the group that contains all the Phaser.Group objects of the maze
  me.mazeLayersGroup.destroy(true);

  //Create the maze
  me.grid = me.cloneGrid(me.originalGrid);

  me.createMaze(callback);
};

/*
-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
Phaser.Plugin.BomberbotMazes.characterLocations related functions
-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
 */

/**
 * Puts the received character in the object of character locations.
 * 
 * @param {object - Phaser.Sprite} character
 */
Phaser.Plugin.BomberbotMazes.prototype.addCharacter = function(character, width, height, key){
  width = width || character.width;
  height = height || character.height;
  key = key || character.key;

  character._width = width;
  character._height = height;
  character.key = key;

  this.characterLocations = this.characterLocations || {};

  this.characterLocations[character.key] = {
    phaserObj: character,
    cellWhereStands: null
  };
};

/**
 * Removes the received character from the object of character locations.
 * 
 * @param  {[type]} character The key of the character
 */
Phaser.Plugin.BomberbotMazes.prototype.removeCharacter = function(character){
  delete this.characterLocations[character.key];
};

/**
 * Get the character position of the character in the maze.
 *
 * @param {string} characterKey
 * @return { object:{number,number,number} }
 */
Phaser.Plugin.BomberbotMazes.prototype.getCharacterPosition = function(characterKey){
  var character = this.characterLocations[characterKey];

  if(!character || (character && !character.phaserObj)){
    return null;
  }

  var cellWhereStands = character.cellWhereStands;

  return {
    level: cellWhereStands.level,
    row: cellWhereStands.row,
    col: cellWhereStands.col
  };
};

/**
 * Function that returns the last movement direction of the character identified
 * with the received parameter.
 * 
 * @param  {string} characterKey The key of the character to query
 * @return {number}              The last direction of movement value
 */
Phaser.Plugin.BomberbotMazes.prototype.getCharacterLastMovementDirection = function(characterKey){
  var character = this.characterLocations[characterKey];

  if(!character){
    return null;
  }

  return character.lastMovementDirection;
};

/**
 * Method that returns the block object in which the received character stands.
 * 
 * @param  {string} characterKey The key of the character to query
 * @return {Phaser.Plugin.BomberbotMazes.Block}              The block object in which the character stands
 */
Phaser.Plugin.BomberbotMazes.prototype.getCharacterCellWhereStands = function(characterKey){
  var character = this.characterLocations[characterKey];

  if(!character){
    return null;
  }

  return character.cellWhereStands;
};

/**
 * This method get the cell in front of the received character.
 * 
 * @param  {string} characterKey The identifier of the character
 * @param  {number} [direction]  The direction to evaluate
 * @return {Phaser.Plugin.BomberbotMazes.Block}              The block object in front of the character
 */
Phaser.Plugin.BomberbotMazes.prototype.getCellInDirection = function(characterKey, /*optional*/ direction){
  var character = this.characterLocations[characterKey];

  if(!character){
    return null;
  }

  var targetDirection = character.lastMovementDirection;
  if(direction >= 0){
    targetDirection = direction;
  }

  var characterCellPos = {
    level: character.cellWhereStands.level,
    row: character.cellWhereStands.row,
    col: character.cellWhereStands.col
  };

  switch(direction){
    case Phaser.Plugin.BomberbotMazes.MOVEMENT.LEFT:
      characterCellPos.col -= 1;
      break;
    case Phaser.Plugin.BomberbotMazes.MOVEMENT.RIGHT:
      characterCellPos.col += 1;
      break;
    case Phaser.Plugin.BomberbotMazes.MOVEMENT.UP:
      characterCellPos.row -= 1;
      break;
    case Phaser.Plugin.BomberbotMazes.MOVEMENT.DOWN:
      characterCellPos.row += 1;
      break;
  }

  var cellInFront = this.getCell(characterCellPos.level + 1, characterCellPos.row, characterCellPos.col);

  if(cellInFront && cellInFront.isHole){
    cellInFront = this.getCell(characterCellPos.level, characterCellPos.row, characterCellPos.col);
  }

  if(!cellInFront){
    return {isMazeLimit: true};
  }else{
    return cellInFront;
  }

};

/**
 * Puts the character (stored in this.characterLocations) in the 
 * specified cell. This will ensure the correct depth painting.
 *
 * @param {object:{level:number,row:number,col:number}} targetCellPosition
 * @param {string} characterKey
 */
Phaser.Plugin.BomberbotMazes.prototype.updateCharacterStandCell = function(newCellPosition, characterKey){
  var targetCell = this.getCell(newCellPosition.level, newCellPosition.row, newCellPosition.col);
  var character = this.characterLocations[characterKey];

  if(character.cellWhereStands 
      && character.cellWhereStands.phaserObj && character.cellWhereStands.phaserObj.parent
      && character.cellWhereStands.phaserObj.parent.name !== targetCell.phaserObj.parent.name){
    //The character changes its row or level position, so its group have to change
    character.cellWhereStands.phaserObj.parent.removeChild(character.phaserObj);
  }

  //Put the character in the corresponding group
  targetCell.phaserObj.parent.add(character.phaserObj,targetCell.phaserObj.z);

  //Update the object with the cells where characters stands
  character.cellWhereStands = targetCell;
};

/**
 * Store the character and the cell which will move for a future Phaser.Group update.
 *
 * @param {object:{level:number,row:number,col:number}} newCellPosition
 * @param {string} characterKey
 */
Phaser.Plugin.BomberbotMazes.prototype.stashCharacterStandCell = function(newCellPosition, characterKey){
  this.characterLocationsRepo = this.characterLocationsRepo || [];
  this.characterLocationsRepo[characterKey] = newCellPosition;
};

/**
 * Function that calculates the X and Y position that the character received
 * has to have for stand in the cell received.
 *
 * @param {object:{level:number,row:number,col:number}} targetCellPosition
 * @param {string} characterKey
 * @return { object:{x:number,y:number} }
 */
Phaser.Plugin.BomberbotMazes.prototype.calculateNewCharacterPosition = function(targetCellPosition, characterKey){
  var character = this.characterLocations[characterKey];

  if(!character || (character && !character.phaserObj)){
    return;
  }

  var targetCell = this.getCell(targetCellPosition.level, targetCellPosition.row, targetCellPosition.col);

  //1. Get the center point of the top face for the target cell
  var topFaceCenterPoint = {
    x: targetCell.phaserObj.x,
    y: targetCell.phaserObj.y + this.cellEmptyHeight + (this.cellTopHeight / 2) + 10
  };

  //2. Return the point calculated
  return {
    x: topFaceCenterPoint.x + (this.cellWidth / 2 - character.phaserObj._width / 2),
    y: topFaceCenterPoint.y - character.phaserObj._height
  };
};

/**
 * Puts the character (stored in this.characterLocations) in the 
 * specified cell. This will ensure the correct depth painting.
 *
 * @param {number} level
 * @param {number} row
 * @param {number} col
 * @param {string} characterKey
 */
Phaser.Plugin.BomberbotMazes.prototype.placeCharacterInCell = function(level,row,col,characterKey){
  var targetCellPos = {
    level: level,
    row: row,
    col: col
  };

  //Calculate the new position for the character
  var newPosition = this.calculateNewCharacterPosition(targetCellPos,characterKey);

  if(newPosition){
    var character = this.characterLocations[characterKey];

    //Update the character position
    character.phaserObj.x = newPosition.x;
    character.phaserObj.y = newPosition.y;

    //Update the characterLocations object
    this.updateCharacterStandCell(targetCellPos,characterKey);
  }

};

/*
-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
Phaser.State functions
-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
 */

/**
 * Phaser.State.update
 *
 */
Phaser.Plugin.BomberbotMazes.prototype.update = function(){
  var me = this;

  if(this.fallingCells){
    this.fallingCells.forEach(function(cellObj){
      var inferiorLevel = cellObj.level - 1;

      while( inferiorLevel >= 0 ){
        me.game.physics.arcade.overlap(cellObj.phaserObj,
            (me.levels[inferiorLevel]).rows[cellObj.row].phaserGroup,
            function(fallingObj,collidedObj){

          fallingObj.y = collidedObj.y - me.cellFrontHeight;
          fallingObj.body.allowGravity = false;
          fallingObj.body.moves = false;

          this.fallingCells.shift();

          if(!this.fallingCells || (this.fallingCells && this.fallingCells.length == 0)){
            this.shadowsArray.forEach(function(shadowPhaserObj){
              shadowPhaserObj.destroy(true);
            });
            this.drawShadows();
          }
        },null,me);

        inferiorLevel--;
      }

    });

  }

};


/**
 *            _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
 * | | | | | |                                     | |
 *   | | | | |                                     | | |
 *     | | | | BOMBERBOTMAZES < <> > PHASER PLUGIN | | | |
 *       | | |                                     | | | | |
 *         | |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _| | | | | |
 * 
 */

/**
 * @author       Mateo Robayo <mapedorr@gmail.com>
 */

 /**
 * @class Phaser.Plugin.BomberbotMazes.Block
 * 
 * @classdesc
 * BomberbotMazes.Block creates a block for the maze. Each clock can trigger events, animate, be detroyed.
 * 
 * @constructor
 * @param {Phaser.Game} game The current game instance.
 * @param {Object} parent The object that initializes the plugin.
 */

Phaser.Plugin.BomberbotMazes.Block = function(){
  //An unique identifier for the block
  this.id = "";

  //The type for the block
  this.type = null;

  //The layer to which the block belongs (this layers increases from TOP to BOTTOM in the maze's rows)
  this.layer = -1;
  this.layerRow = -1;

  //The position of the block in the maze
  this.level = -1;
  this.row = -1;
  this.col = -1;

  //The Phaser.Sprite.key that has the sprite for the block painting
  this.spriteKey = "";

  //The Phaser.Sprite object added to the world during the maze creation
  this.phaserObj = null;

  //Properties that determines the behaviour of the block with respect to other blocks in the maze, the characters in the game or other objects
  this.isHole = false;
  this.isWalkable = true;
  this.isStackable = true;
  this.isItem = false;
  this.isSlippery = false;
  this.isBreakable = false;
  this.triggerUnderItem = false;

  //Object with extra properties specific to the context in which the BomberbotMazes plugin is used
  this.extraProperties = null;
};

//..........................................
//  EVENTS
//..........................................

Phaser.Plugin.BomberbotMazes.Block.prototype.onClick = function(){};
Phaser.Plugin.BomberbotMazes.Block.prototype.onStand = function(map, characterAbove){};
Phaser.Plugin.BomberbotMazes.Block.prototype.onLeave = function(map, character){};
Phaser.Plugin.BomberbotMazes.Block.prototype.onFussion = function(map, character){};
Phaser.Plugin.BomberbotMazes.Block.prototype.onActivate = function(map, activator){};
Phaser.Plugin.BomberbotMazes.Block.prototype.onDeactivate = function(map, activator){};