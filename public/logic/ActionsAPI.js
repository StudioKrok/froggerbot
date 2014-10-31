var actionsAPI = (function(){
  var LIMIT = 16;
  var program = [];
  var symbols = [];
  var currentIndex = 0;

  return{
    addCommand: function(command){
      if(program.length>LIMIT){
        return;
      }
      program.push(command);
      symbols.push(KEY_SYMBOLS[command]);
    },
    removeLastCommand: function(){
      if(program.length>0){
        program.pop();
        symbols.pop();
      }
    },
    clear: function(){
      program = [];
      symbols = [];
    },
    init: function(){
      currentIndex = 0;
    },
    nextCommand: function(){
      if(currentIndex > program.length) return;
      return program[currentIndex++];
    },
    getProgram:function(){
      return program;
    },
    getProgramSymbols:function(){
      return symbols;
    },

  }
})();
