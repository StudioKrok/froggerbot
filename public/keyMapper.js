var COMMANDS = {
  LEFT:1,
  UP:2,
  RIGHT:4,
  DOWN:8,
  SPACE:16,//Mina
  ENTER:32,//Confirmar
  BACKSPACE:64//Borrar el ultimo
}
var keyMapper = (function(){
  var keyMap = 0;
  var keys = {
    '37': COMMANDS.LEFT,
    '38': COMMANDS.UP,
    '39': COMMANDS.RIGHT,
    '40': COMMANDS.DOWN,
    '32': COMMANDS.SPACE,
    '13': COMMANDS.ENTER,
    '8': COMMANDS.BACKSPACE
  }
  var listener = function(){};

  document.addEventListener('keydown', function(e){
    var key = e.keyCode|| e.which;
    if(keys[key]){
      listener(keys[key]);
      e.preventDefault();
    }
  });

  document.addEventListener('keyup',  function(e){
    var key = e.keyCode ? e.keyCode : e.which;
    if(keyMap&keys[key]){
      e.preventDefault();
    }
  });
  return{
    setKeyListener: function(newListener){
      listener = newListener;
    }
  }
})();
