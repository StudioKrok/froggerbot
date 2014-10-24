var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var levelMap = [
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0],
  [0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0],
  [0,0,1,0,0,1,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0]
];
var cellWidth = 80;
var cellColors = ['white','yellow','red'];
var boardXPosition = (canvas.width / 2) - ((cellWidth * levelMap[0].length) / 2);
var boardYPosition = (canvas.height / 2) - ((cellWidth * levelMap.length) / 2);

var player = (function(){
  var initialPosition = {
    x : boardXPosition + ((cellWidth * levelMap[0].length) / 2),
    y : boardYPosition - cellWidth / 2
  };

  var currentPosition = {
    x : initialPosition.x,
    y : initialPosition.y
  };

  return{
    getCurrentPosition:function(){
      return currentPosition;
    },
    setCurrentPosition:function(x,y){
      currentPosition.x = x;
      currentPosition.y = y;
    }
  }
})();

var colors = {
  '1': 'green',
  '2': 'red',
  '4': 'yellow',
  '8': 'black',
  '16': 'magenta',
  '32': 'white'
};

keyMapper.setKeyListener(function(key){
  console.log(key);
  context.fillStyle = colors[key];
  context.fillRect(14,14,200,200);
});

function draw(){
  //Clean the canvas for smooth lines
  context.clearRect(0, 0, canvas.width, canvas.height);

  var cellXPosition = boardXPosition;
  var cellYPosition = boardYPosition;

  //Draw board
  levelMap.forEach(function(boardRow){
    boardRow.forEach(function(boardCell){
      context.fillStyle = cellColors[boardCell];
      context.fillRect(cellXPosition,cellYPosition,cellWidth,cellWidth);

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

  //Draw player
  if(player) drawPlayer(player.getCurrentPosition().x,player.getCurrentPosition().y);

  //Determine if the player has reached the other side


}

function drawPlayer(x,y){
  context.lineWidth = 2;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = 'gray';
  context.fillStyle = 'blue';

  context.beginPath();
  context.arc(x, y, cellWidth / 3 , 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.closePath();
}

draw();
window.setTimeout(renderGame, 3000);
function renderGame() {
  draw();
  window.setTimeout(renderGame, 3000);
}