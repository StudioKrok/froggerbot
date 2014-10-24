/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Player
Player = function () {
  this.number = 1;//1=A o 2=B
  this.life;
  this.actions = [];
  //this.pos = [0, 3];//@Deprecated Board guarda la pos de los players
  this.move = function (move) {

  };
  return this;

};

Board = function () {
  this.now = [];
  //STATIC
  this.EMPTY = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  this.reset = function () {
    this.now = this.EMPTY;
    this.now[0][3] += 2;
    this.now[7][3] += 1;
  };
  this.getPos = function (player) {
    console.log("Board.getPlayer: " + player);

    var r = iO(player);

    if (r[1] == -1)
      r = iO(player + 2);
    if (r[1] == -1)
      r = iO(player + 4);
    if (r[1] == -1)
      r = iO(player + 8);
    if (r[1] == -1)
      r = iO(player + 16);
    if (r[1] == -1)
      r = iO(player + 32);

    console.log("gpj= " + r[0] + "," + r[1]);
    return r;

    function iO(arg) {
      var r0;
      var r1;
      for (var i = 0; i < now.length; i++) {
        r1 = now[i].indexOf(arg);
        if (r1 != -1) {
          r0 = i;
          i = now.length;
        }
      }
      return [r0, r1];
    }
  }
  
  /*
   * delta es el numero del pj o bomba o estorbo
   */
  this.setPos = function (delta, cNew) {
    var cOld = this.getPos(delta);
    if(cOld[1]!= -1)
      now[cOld[0]][cOld[1]] -= delta;
    now[cNew[0]][cNew[1]] += delta;
  };

  this.debug = function (){
    for (var i = 0; i < now.length; i++) {
      var string="";
      for (var j = 0; j < now[i].length; j++)
        string += now[i][j]+" ";
      console.log("["+ string+"] ");
    };
  };
  return this;
};


Game = function () {
  var b = Board();
  var pA = Player();
  var pB = Player();
//Pone las fichas de los jugadores
  reset(b, pA, pB);

//
  tic = function (m) {
    b.debug();
    action(pA.number, m);
    b.debug();
  }

  action = function (p, mm) {
    console.log(mm);
    var c = b.getPos(p);
    if (mm == 1) c[1]--;
    if (mm == 4) c[1]++;
    if (mm == 2) c[0]--;
    if (mm == 8) c[0]++;
    b.setPos(p, c);
    if (mm == 16) 
     b.setPos(p*8, c);

    console.log("pj= " + c[0] + "," + c[1]);
  }

  reset = function (mb, mpA, mpB) {
    mb.reset();
    mpA.reset();
    mpB.reset();

    mb.debug();
    console.log("Tablero reseteado");
    console.log(b.now);
  };
  return this;
};


//Test

var tmpMoves = [2,16, 1, 4, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2];
var g = Game();
var i = 0;

btic = function (){
  var string = "";
  for (var j = 0; j < tmpMoves.length; j++)
    string += tmpMoves[j] + " ";
  console.log("[" + string + "] ");
  if(i<tmpMoves.length)
    g.tic(tmpMoves[i++]);
};