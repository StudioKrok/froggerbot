var canvas = document.getElementById('myCanvas');

var context = canvas.getContext('2d');

context.fillRect(10,10,200,200);

var colors = {
  '0': 'white',//Nada
  '1': 'green',//Jugador A
  '2': 'red', //Jugador B
  '4': 'yellow',//Obtacles
  '8': 'magenta',//Minas A
  '16': 'pink',//Minas B
};

keyMapper.setKeyListener(function(key){
  console.log(key);
  context.fillStyle = colors[key];
  context.fillRect(14,14,200,200);
});