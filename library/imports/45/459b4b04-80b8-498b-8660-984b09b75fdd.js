"use strict";
cc._RF.push(module, '459b4sEgLhJi4ZgmEsJt1/d', 'gameData');
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