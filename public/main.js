var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var levelMap = [
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,4,0,0,0,0],
  [0,0,0,0,4,0,0],
  [0,0,0,0,0,0,0],
  [0,0,4,0,0,4,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0]
];
var cellWidth = 80;
var cellColors = {
  '0':'white',//Normal cell
  '1':'green',//Player
  '2':'red',//Enemy
  '4':'yellow',//Obstacle
  '8':'magenta',//Player mine
  '16':'pink'//Enemy mine
};
var boardXPosition = (canvas.width / 2) - ((cellWidth * levelMap[0].length) / 2);
var boardYPosition = (canvas.height / 2) - ((cellWidth * levelMap.length) / 2);

var player = (function(){
  var currentPosition = {x:3,y:0};
  var goalReached = false;

  return{
    getCurrentPosition:function(){
      return currentPosition;
    },
    setCurrentPosition:function(x,y){
      currentPosition.x = x;
      currentPosition.y = y;
    },
    getGoalReached: function () {
      return goalReached;
    },
    setGoalReached: function (reached) {
      goalReached = reached;
    }
  }
})();

var enemy = (function(){
  var currentPosition = {x:3,y:levelMap.length-1};
  var goalReached = false;

  return{
    getCurrentPosition:function(){
      return currentPosition;
    },
    setCurrentPosition:function(x,y){
      currentPosition.x = x;
      currentPosition.y = y;
    },
    getGoalReached: function () {
      return goalReached;
    },
    setGoalReached: function (reached) {
      goalReached = reached;
    }
  }
})();

var colors = {
  '1': 'green',//Jugador A
  '2': 'red', //Jugador B
  '4': 'yellow',//Obtacles
  '8': 'black',
  '16': 'magenta',//Minas
  '32': 'white'
};

keyMapper.setKeyListener(function(key){
  console.log(key);
  context.fillStyle = colors[key];
  context.fillRect(14,14,200,200);
});

function draw(currentBoard){
  //Clean the canvas for smooth lines
  context.clearRect(0, 0, canvas.width, canvas.height);

  var cellXPosition = boardXPosition;
  var cellYPosition = boardYPosition;

  //Draw board
  currentBoard.forEach(function(boardRow){
    boardRow.forEach(function(boardCell){

      //Determine what to draw
      if(boardCell & 1 || boardCell & 2){
        if(boardCell & 1){
          //Draw player or enemy over a mine
          //Draw normal cell, obstacle or mine
          context.fillStyle = cellColors[boardCell - 1];
          context.fillRect(cellXPosition,cellYPosition,cellWidth,cellWidth);

          context.fillStyle = cellColors[1];
          context.beginPath();
          context.arc(cellXPosition + (cellWidth/2), cellYPosition + (cellWidth/2), cellWidth / 3 , 0, Math.PI * 2, false);
          context.fill();
          context.stroke();
          context.closePath();
        }

        if(boardCell & 2){
          //Draw player or enemy over a mine
          //Draw normal cell, obstacle or mine
          context.fillStyle = cellColors[boardCell - 2];
          context.fillRect(cellXPosition,cellYPosition,cellWidth,cellWidth);

          context.fillStyle = cellColors[2];
          context.beginPath();
          context.arc(cellXPosition + (cellWidth/2), cellYPosition + (cellWidth/2), cellWidth / 3 , 0, Math.PI * 2, false);
          context.fill();
          context.stroke();
          context.closePath();
        }
      }else{
        //Draw normal cell, obstacle or mine
        context.fillStyle = cellColors[boardCell];
        context.fillRect(cellXPosition,cellYPosition,cellWidth,cellWidth);
      }

      //Draw the borders for the cell
      context.lineWidth = 2;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.strokeStyle = "black";
      context.strokeRect(cellXPosition,cellYPosition,cellWidth,cellWidth);

      cellXPosition = cellXPosition + cellWidth;
    });

    cellXPosition = boardXPosition;
    cellYPosition += cellWidth;

  });
}

function updateBoard(){
  levelMap[player.getCurrentPosition().y][player.getCurrentPosition().x] = 1;
  levelMap[enemy.getCurrentPosition().y][enemy.getCurrentPosition().x] = 2;

  if(player.getCurrentPosition().y == levelMap.length - 1) player.setGoalReached(true);
  if(enemy.getCurrentPosition().y == 0) enemy.setGoalReached(true);

  draw(levelMap);

  //Clean the cells where the player was standed
  levelMap[player.getCurrentPosition().y][player.getCurrentPosition().x] = 0;
  levelMap[enemy.getCurrentPosition().y][enemy.getCurrentPosition().x] = 0;

  //Read the x and y positions of player and enemy to put them in the board
  if(!player.getGoalReached()){
    player.setCurrentPosition(player.getCurrentPosition().x,player.getCurrentPosition().y+1);
  }

  if(!enemy.getGoalReached()){
    enemy.setCurrentPosition(enemy.getCurrentPosition().x,enemy.getCurrentPosition().y-1);
  }
}

updateBoard();
window.setTimeout(renderGame, 2000);
function renderGame() {
  updateBoard();
  window.setTimeout(renderGame, 2000);
}
