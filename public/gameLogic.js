/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Player
Player = function () {
  this.life;
  this.actions = [];
  this.pos = [0, 3];
  

};

Board = function () {
  this.now = [
    [32, 32, 32, 32, 32, 32, 32],
    [32, 32, 32, 32, 32, 32, 32],
    [32, 32, 32, 32, 32, 32, 32],
    [32, 32, 32, 32, 32, 32, 32],
    [32, 32, 32, 32, 32, 32, 32],
    [32, 32, 32, 32, 32, 32, 32],
    [32, 32, 32, 32, 32, 32, 32],
    [32, 32, 32, 32, 32, 32, 32],
  ];
  //STATIC
  this.EMPTY = [
    [8, 32, 8, 32, 8, 32, 8],
    [32, 8, 32, 8, 32, 8, 32],
    [8, 32, 8, 32, 8, 32, 8],
    [32, 8, 32, 8, 32, 8, 32],
    [8, 32, 8, 32, 8, 32, 8],
    [32, 8, 32, 8, 32, 8, 32],
    [8, 32, 8, 32, 8, 32, 8],
    [32, 8, 32, 8, 32, 8, 32],
  ];

  this.reset = function () {
    this.now = this.EMPTY;
    this.now[0][3] += 1;
    this.now[7][3] += 2;
  }
  return this;
};