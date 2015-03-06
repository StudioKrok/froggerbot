var FroggerBot = FroggerBot || {};

var config = (function(){
  return {
    cell: {
      width: 80,
      height: 136,
      frontHeight: 31,
      emptyHeight: 40
    },

    cellTypes: {
      '.': {
        isHole: true,
        isWalkable: false,
        isStackable: false,
        onStand: FroggerBot.fall
      },
      '0': {
        spriteKey: "block01",
        isBreakable: true,
        triggerUnderItem:  true,
        onStand: FroggerBot.stack
      },
      '1': {
        spriteKey: "block02",
        isBreakable: true
      },
      '2': {
        spriteKey: "block03"
      },
      'c': {
        spriteKey: "block06"
      },
      'a': {
        spriteKey: "block04"
      },
      'b': {
        spriteKey: "block05",
        isSlippery: true,
        onStand: FroggerBot.slide,
        onLeave: FroggerBot.slideLeaves
      },
      '3': {
        spriteKey: "crystal",
        isBreakable: true,
        isItem: true,
        onDestroy: FroggerBot.destroy,
        animations: {
          idle: {
            frames: [0,1,2,3,4,3,2,1],
            fps: 8,
            loop: true
          }
        },
        startAnimation: 'idle',
        yOffset: 40
      },
      '4': {
        spriteKey: "star",
        isStackable: false,
        isItem: true,
        onFussion: FroggerBot.vanish,
        animations: {
          idle: {
            frames: [0,1,2,3,4,5,6,7],
            fps: 6,
            loop: true
          }
        },
        startAnimation: 'idle',
        yOffset: 45
      },
      'p': {
        spriteKey: "block07",
        type:"prism",
        initialTint:0xC8C8C8,
        tints:[
          0x00AAFF,
          0xCCC614,
          0xFF0055
        ],
        onActivate: FroggerBot.activatePrism,
        onDeactivate: FroggerBot.deactivatePrism
      },
      'd': {
        spriteKey: "door",
        type:"door",
        animations: {
          close: {
            frames: [0],
            fps: 1,
            loop: false
          },
          open: {
            frames: [1],
            fps: 1,
            loop: false
          }
        },
        startAnimation: 'close',
        onActivate: FroggerBot.activateCoffer,
        onDeactivate: FroggerBot.deactivateCoffer
      }
    },
    
    shadows: [
      'sh_nw','sh_n','sh_ne',
      'sh_w','sh_e',
      'sh_sw','sh_s','sh_se',
      'sh_side_e',
      'sh_s'
    ],
    normalShadows: true,
    floorShadows: false
  }
})();