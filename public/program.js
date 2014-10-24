var actionsAPI = (function(){
  var LIMIT = 16;
  var program = [];
  var currentIndex = 0;

  return{
    addCommand: function(command){
      if(program.length>LIMIT){
        return;
      }
      program.push(command);
    },
    removeLastCommand: function(){
      if(program.length>0){
        program.pop();
      }
    },
    clear: function(){
      program = [];
    },
    init: function(){
      currentIndex = 0;
    },
    nextCommand: function(){
      if(currentIndex > program.length) return;
      return program[currentIndex++];
    }
  }  
})();
