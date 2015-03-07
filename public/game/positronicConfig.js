var FroggerBot = FroggerBot || {};
FroggerBot.Configuration = {}

FroggerBot.Configuration.player = {
  left: function() {
    return '';
  },

  right: function() {
    return '';
  },

  up: function() {
    return '';
  },

  down: function() {
    return '';
  },

  bomb: function() {
    return '';
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
    "deleteLast":{
      identifier:"deleteLast",
      executerAction:"console.log();",
      commandBtn: {
        key: 'actions',
        frame: 10,
        extraProperties: {
          lockDrag: true,
          preventCopy: true,
          onClick: function(){
            this.editor.removeLastCommandOnActivePanel();
          }
        }
      }
    },
    "hammer":{
      identifier:"16",
      executerAction:"player.bomb();",
      commandBtn: {
        key: 'actions',
        frame: 9
      }
    },
    "main":{
      identifier:"M"
    },
    "close":{
      identifier:"}"
    }
  }
}