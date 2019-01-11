(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/gameData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '459b4sEgLhJi4ZgmEsJt1/d', 'gameData', __filename);
// script/game/gameData.js

"use strict";

var gameData = {
    game: null,
    tipNum: 0,
    isSound: true,

    score: 0,
    blockDropSpeed: 4,

    bulletSpeed: 4,
    bulletPower: 6,
    bulletMulti: 1,

    blockPool: null,
    blastPool: null,

    centerLine: 0,
    actorLine: 0,
    endLine: 0,

    cursorXPos: 0,
    jumpMove: 0,
    collideStatus: [0, 0],
    rocketStatus: 0,
    exploreAll: false
};
module.exports = gameData;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=gameData.js.map
        