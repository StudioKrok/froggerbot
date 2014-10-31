var socket = io();

//Log in into a game
socket.on('setSide', function(side){
  console.log('your side is: ', side);
});

socket.on('setMap',function(map){
  levelMap = map;

  console.log(levelMap);
});

function sendProgram(){
  socket.emit('setProgram',actionsAPI.getProgram());
}
socket.emit('setProgram', 'program');