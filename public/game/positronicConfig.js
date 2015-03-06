var FroggerBot = FroggerBot || {};
FroggerBot.Configuration = {}

FroggerBot.Configuration.player = {
  left: function() {

  },

  right: function() {

  },

  up: function() {

  },

  down: function() {

  },

  bomb: function() {

  }
}

FroggerBot.Configuration.positronicConfig =  {
  executerName: 'player',
  executer: FroggerBot.Configuration.player,
  executerObjName: 'player',
  identifiers: {
    "left":{
      identifier:"1",
      executerAction:"player.left();",
      commandBtn: {
        key: 'actions',
        frame: 0
      }
    },
    "up":{
      identifier:"2",
      executerAction:"player.up();",
      commandBtn: {
        key: 'actions',
        frame: 1
      }
    },
    "right":{
      identifier:"4",
      executerAction:"player.right();",
      commandBtn: {
        key: 'actions',
        frame: 2
      }
    },
    "down":{
      identifier:"8",
      executerAction:"player.down();",
      commandBtn: {
        key: 'actions',
        frame: 3
      }
    },
    "hammer":{
      identifier:"16",
      executerAction:"player.useHammer();",
      commandBtn: {
        key: 'actions',
        frame: 9
      }
    }, 
  }
}