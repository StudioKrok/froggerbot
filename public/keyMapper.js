var KEYS = {
  LEFT:1,
  UP:2,
  RIGHT:4,
  DOWN:8,
  SPACE:16,
  ENTER:32,
  BACKSPACE:64
}
var keyMapper = (function(){
  var keyMap = 0;
  var keys = {
    '37': KEYS.LEFT,
    '38': KEYS.UP,
    '39': KEYS.RIGHT,
    '40': KEYS.DOWN,
    '32': KEYS.SPACE,
    '13': KEYS.ENTER,
    '8': KEYS.BACKSPACE
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
