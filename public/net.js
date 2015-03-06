var socket = io();

//Log in into a game
socket.on('setSide', function(side){
  console.log('your side is: ', side);
});

socket.on('setMap',function(map){
  levelMap = map;
});

socket.on('onGame',function(gameId){
  console.log('joined to game: ' + gameId);
});

function sendProgram(){
  socket.emit('setProgram',actionsAPI.getProgram());
}