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
        isStackable: false
      },
      '0': {
        spriteKey: "block01",
        isBreakable: true,
        triggerUnderItem:  true
      },
      '4': {
        spriteKey: "block02",
        isBreakable: true
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