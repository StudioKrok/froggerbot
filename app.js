var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = require('./src/players');
var game = require('./src/game');
var games = require('./src/games');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  console.log("esa cosa");
  res.sendFile('./game/index.html');
});


io.on('connection', function(socket){
  var player = players.connectNewPlayer(games, socket);

  games.joinPlayer(player);

  socket.on('disconnect', player.disconnect);
  socket.on('setProgram', player.setProgram);
  socket.on('playAgain', player.playAgain);

})

http.listen(3000, function(){
  console.log('listening on *:3000');
});