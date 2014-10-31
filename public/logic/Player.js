var Player = function(isEnemy){
  var currentPosition = {
    x:3,
    y:((isEnemy) ? levelMap.length-1 : 0)
  };
  var goalReached = false;
  var currentProgramStack = [];

  //1=Own A o 2=Enemy B
  var number = ((isEnemy) ? 2 : 1);
  var life;
  var actions = [];

  return{
    getCurrentPosition:function(){
      return currentPosition;
    },
    setCurrentPosition:function(x,y){
      currentPosition.x = x;
      currentPosition.y = y;
    },
    getGoalReached: function () {
      return goalReached;
    },
    setGoalReached: function (reached) {
      goalReached = reached;
    },
    setCurrentProgramStack: function(stack){
      currentProgramStack = stack;
    },
    getCurrentProgramStack: function(){
      return currentProgramStack;
    }
  }
};
