"use strict";
cc._RF.push(module, '3bb92nEuplMbpWxmmkyGE0s', 'bonusFrame');
// script/game/bonusFrame.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.node.scale = 1;
        this.runScale();
    },
    runScale: function runScale() {

        var seq = cc.sequence(cc.scaleTo(0.5, 1.5), cc.scaleTo(0.5, 1));
        this.node.runAction(cc.repeatForever(seq));
    }
});

cc._RF.pop();