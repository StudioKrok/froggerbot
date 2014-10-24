var canvas = document.getElementById('myCanvas');

var context = canvas.getContext('2d');

context.fillRect(10,10,200,200);

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