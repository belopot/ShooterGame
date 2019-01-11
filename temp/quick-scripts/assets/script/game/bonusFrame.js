(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/bonusFrame.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3bb92nEuplMbpWxmmkyGE0s', 'bonusFrame', __filename);
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
        //# sourceMappingURL=bonusFrame.js.map
        